/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { statusBarItemInjectionToken } from "../status-bar-item-injection-token";
import { ClusterSearch } from "./cluster-search";

const clusterSearchStatusBarItemInjectable = getInjectable({
  id: "cluster-search-status-bar-item",

  instantiate: () => ({
    component: ClusterSearch,
    position: "left" as const,
    visible: computed(() => true),
  }),

  injectionToken: statusBarItemInjectionToken,
});

export default clusterSearchStatusBarItemInjectable;
