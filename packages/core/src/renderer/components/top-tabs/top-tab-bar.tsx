/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import { Fragment, useEffect } from "react";
import { Tabs } from "../tabs";
import topTabsStoreInjectable from "./store.injectable";
import { TopTab } from "./top-tab";
import styles from "./top-tab-bar.module.scss";

import type { TopTab as TopTabModel, TopTabsStore } from "./store";

interface Dependencies {
  topTabsStore: TopTabsStore;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

const NonInjectedTopTabBar = observer(({ topTabsStore }: Dependencies) => {
  const { tabs, activeTab } = topTabsStore;

  useEffect(() => {
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.code !== "KeyW" || !(evt.ctrlKey || evt.metaKey) || evt.shiftKey) {
        return;
      }

      const { activeTabId } = topTabsStore;

      if (!activeTabId || isEditableTarget(evt.target)) {
        return;
      }

      evt.preventDefault();
      topTabsStore.closeTab(activeTabId);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [topTabsStore]);

  if (tabs.length === 0) {
    return null;
  }

  const onChangeTab = (tab: TopTabModel) => topTabsStore.activateTab(tab.id);

  return (
    <div className={styles.topTabBar} role="tablist">
      <Tabs scrollable value={activeTab} onChange={onChangeTab} className={styles.tabs}>
        {tabs.map((tab) => (
          <Fragment key={tab.id}>
            <TopTab value={tab} />
          </Fragment>
        ))}
      </Tabs>
    </div>
  );
});

export const TopTabBar = withInjectables<Dependencies>(NonInjectedTopTabBar, {
  getProps: (di) => ({
    topTabsStore: di.inject(topTabsStoreInjectable),
  }),
});
