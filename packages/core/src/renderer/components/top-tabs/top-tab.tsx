/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { Icon } from "@nibamot/icon";
import { Tooltip, TooltipPosition } from "@nibamot/tooltip";
import { cssNames, isMiddleClick, prevDefault } from "@nibamot/utilities";
import { withInjectables } from "@ogre-tools/injectable-react";
import autoBindReact from "auto-bind/react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Menu, MenuItem } from "../menu";
import { Tab } from "../tabs";
import topTabsStoreInjectable from "./store.injectable";
import styles from "./top-tab.module.scss";

import type { TabProps } from "../tabs";
import type { TopTab as TopTabModel, TopTabsStore } from "./store";

export interface TopTabProps extends TabProps<TopTabModel> {}

interface Dependencies {
  topTabsStore: TopTabsStore;
}

@observer
class NonInjectedTopTab extends React.Component<TopTabProps & Dependencies> {
  private readonly menuVisible = observable.box(false);

  constructor(props: TopTabProps & Dependencies) {
    super(props);
    autoBindReact(this);
  }

  close(id: string) {
    this.props.topTabsStore.closeTab(id);
  }

  renderMenu(tabId: string) {
    const { closeTab, closeOtherTabs, closeAllTabs, closeTabsToTheRight, tabs, getTabIndex } = this.props.topTabsStore;
    const closeOtherDisabled = tabs.length === 1;
    const closeRightDisabled = getTabIndex(tabId) === tabs.length - 1;

    return (
      <Menu
        usePortal
        htmlFor={`top-tab-${tabId}`}
        isOpen={this.menuVisible.get()}
        open={() => this.menuVisible.set(true)}
        close={() => this.menuVisible.set(false)}
        toggleEvent="contextmenu"
      >
        <MenuItem onClick={() => closeTab(tabId)}>Close</MenuItem>
        <MenuItem onClick={() => closeOtherTabs(tabId)} disabled={closeOtherDisabled}>
          Close other tabs
        </MenuItem>
        <MenuItem onClick={() => closeTabsToTheRight(tabId)} disabled={closeRightDisabled}>
          Close tabs to the right
        </MenuItem>
        <MenuItem onClick={() => closeAllTabs()}>Close all tabs</MenuItem>
      </Menu>
    );
  }

  render() {
    const { className, topTabsStore, ...tabProps } = this.props;

    if (!tabProps.value) {
      return null;
    }

    const { title, id } = tabProps.value;
    const close = prevDefault(() => this.close(id));

    return (
      <>
        <Tab
          {...tabProps}
          id={`top-tab-${id}`}
          className={cssNames(styles.topTab, className)}
          onContextMenu={() => this.menuVisible.set(true)}
          label={
            <div className="flex items-center" onAuxClick={isMiddleClick(close)}>
              <span className={styles.title}>{title}</span>
              <div className={styles.close}>
                <Icon
                  small
                  material="close"
                  tooltip="Close tab"
                  onClick={close}
                  data-testid={`top-tab-close-for-${id}`}
                />
              </div>
              <Tooltip
                targetId={`top-tab-${id}`}
                preferredPositions={[TooltipPosition.BOTTOM, TooltipPosition.BOTTOM_LEFT]}
                style={{ transitionDelay: "700ms" }}
              >
                {title}
              </Tooltip>
            </div>
          }
          data-testid={`top-tab-for-${id}`}
        />
        {this.renderMenu(id)}
      </>
    );
  }
}

export const TopTab = withInjectables<Dependencies, TopTabProps>(NonInjectedTopTab, {
  getProps: (di, props) => ({
    topTabsStore: di.inject(topTabsStoreInjectable),
    ...props,
  }),
});
