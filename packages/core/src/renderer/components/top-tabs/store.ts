/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import autoBind from "auto-bind";
import { action, comparer, computed, makeObservable, reaction } from "mobx";

import type { IComputedValue } from "mobx";

import type { StorageLayer } from "../../utils/storage-helper";

export type TopTabId = string;

export interface TopTab {
  id: TopTabId;
  path: string;
  title: string;
}

export interface TopTabsStorageState {
  tabs: TopTab[];
  activeTabId?: TopTabId;
}

interface Dependencies {
  readonly storage: StorageLayer<TopTabsStorageState>;
  readonly currentPath: IComputedValue<string>;
  readonly currentPageTitle: IComputedValue<string>;
  readonly navigateToPath: (path: string) => void;
}

export class TopTabsStore {
  constructor(private readonly dependencies: Dependencies) {
    makeObservable(this);
    autoBind(this);

    // keep a tab in sync with whatever page is currently shown, creating one
    // for the current page if none exists yet
    reaction(
      () => [this.dependencies.currentPath.get(), this.dependencies.currentPageTitle.get()] as const,
      ([path, title]) => this.upsertTab(path, title),
      {
        fireImmediately: true,
        // the tracked expression returns a fresh array on every recompute, so without a
        // structural comparer this reaction refires (and resurrects a just-closed tab) whenever
        // currentPath/currentPageTitle merely recompute with the same values (e.g. unrelated
        // catalog updates), not only when they actually change
        equals: comparer.structural,
      },
    );
  }

  @computed
  get tabs(): TopTab[] {
    return this.dependencies.storage.get().tabs;
  }

  set tabs(tabs: TopTab[]) {
    this.dependencies.storage.merge({ tabs });
  }

  @computed
  get activeTabId(): TopTabId | undefined {
    return this.dependencies.storage.get().activeTabId;
  }

  set activeTabId(activeTabId: TopTabId | undefined) {
    this.dependencies.storage.merge({ activeTabId });
  }

  @computed
  get activeTab(): TopTab | undefined {
    return this.tabs.find((tab) => tab.id === this.activeTabId);
  }

  getTabByPath(path: string) {
    return this.tabs.find((tab) => tab.path === path);
  }

  getTabIndex(id: TopTabId) {
    return this.tabs.findIndex((tab) => tab.id === id);
  }

  @action
  private upsertTab(path: string, title: string) {
    const existing = this.getTabByPath(path);

    if (existing) {
      if (existing.title !== title) {
        this.tabs = this.tabs.map((tab) => (tab.id === existing.id ? { ...tab, title } : tab));
      }

      this.activeTabId = existing.id;

      return;
    }

    const tab: TopTab = { id: path, path, title };

    this.tabs = [...this.tabs, tab];
    this.activeTabId = tab.id;
  }

  @action
  activateTab(id: TopTabId) {
    const tab = this.tabs.find((tab) => tab.id === id);

    if (!tab) {
      return;
    }

    this.activeTabId = tab.id;
    this.dependencies.navigateToPath(tab.path);
  }

  @action
  closeTab(id: TopTabId) {
    const index = this.getTabIndex(id);

    if (index === -1) {
      return;
    }

    const wasActive = this.activeTabId === id;

    this.tabs = this.tabs.filter((tab) => tab.id !== id);

    if (!wasActive) {
      return;
    }

    const nextTab = this.tabs[index] ?? this.tabs[index - 1];

    if (nextTab) {
      this.activateTab(nextTab.id);
    } else {
      this.activeTabId = undefined;
    }
  }

  @action
  closeOtherTabs(id: TopTabId) {
    const tab = this.tabs.find((tab) => tab.id === id);

    if (!tab) {
      return;
    }

    this.tabs = [tab];
    this.activeTabId = tab.id;
  }

  @action
  closeAllTabs() {
    this.tabs = [];
    this.activeTabId = undefined;
  }

  @action
  closeTabsToTheRight(id: TopTabId) {
    const index = this.getTabIndex(id);

    if (index === -1) {
      return;
    }

    this.tabs = this.tabs.slice(0, index + 1);

    if (!this.tabs.some((tab) => tab.id === this.activeTabId)) {
      this.activeTabId = id;
    }
  }
}
