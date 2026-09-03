/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { action } from "mobx";
import { getExcludedKubeconfigClusterKey } from "./preferences-helpers";
import userPreferencesStateInjectable from "./state.injectable";

export type ExcludeKubeconfigCluster = (kubeconfigPath: string, contextName: string) => void;

const excludeKubeconfigClusterInjectable = getInjectable({
  id: "exclude-kubeconfig-cluster",
  instantiate: (di): ExcludeKubeconfigCluster => {
    const state = di.inject(userPreferencesStateInjectable);

    return action((kubeconfigPath, contextName) => {
      state.excludedKubeconfigClusters.add(getExcludedKubeconfigClusterKey(kubeconfigPath, contextName));
    });
  },
});

export default excludeKubeconfigClusterInjectable;
