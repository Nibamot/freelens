/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { animateFeature, requestAnimationFrameInjectable } from "@nibamot/animate";
import { clusterSidebarFeature } from "@nibamot/cluster-sidebar";
import { registerFeature } from "@nibamot/feature-core";
import { kubeApiSpecificsFeature } from "@nibamot/kube-api-specifics";
import { loggerFeature } from "@nibamot/logger";
import { messagingFeature, testUtils as messagingTestUtils } from "@nibamot/messaging";
import { notificationsFeature } from "@nibamot/notifications";
import { randomFeature } from "@nibamot/random";
import { routingFeature } from "@nibamot/routing";
import { createContainer, isInjectable } from "@ogre-tools/injectable";
import { registerMobX } from "@ogre-tools/injectable-extension-for-mobx";
import { chunk, noop } from "es-toolkit";
import { runInAction } from "mobx";
import dependencyInjectionContainerInjectable from "../common/dependency-injection/dependency-injection-container.injectable";
import { setDiForExtensionApi } from "../extensions/extension-api-di";
import { getOverrideFsWithFakes } from "../test-utils/override-fs-with-fakes";
import hostedClusterIdInjectable from "./cluster-frame-context/hosted-cluster-id.injectable";
import terminalSpawningPoolInjectable from "./components/dock/terminal/terminal-spawning-pool.injectable";
import startTopbarStateSyncInjectable from "./components/layout/top-bar/start-state-sync.injectable";
import legacyOnChannelListenInjectable from "./ipc/legacy-channel-listen.injectable";
import watchHistoryStateInjectable from "./remote-helpers/watch-history-state.injectable";

import type { GlobalOverride } from "@nibamot/test-utils";

// The injectable files must be loaded through Vite's transform pipeline
// (import.meta.glob), not native require(path): the source-only workspace
// packages they import use extensionless specifiers that only Vite resolves.
const injectableModules = import.meta.glob<object>(
  [
    "../common/**/*.injectable.{ts,tsx}",
    "../extensions/**/*.injectable.{ts,tsx}",
    "./**/*.injectable.{ts,tsx}",
    "../test-env/**/*.injectable.{ts,tsx}",
    "../features/**/renderer/**/*.injectable.{ts,tsx}",
    "../features/**/common/**/*.injectable.{ts,tsx}",
  ],
  { eager: true },
);

const globalOverrideModules = import.meta.glob<{ default: GlobalOverride<unknown, unknown, unknown> }>(
  [
    "../common/**/*.global-override-for-injectable.{ts,tsx}",
    "../extensions/**/*.global-override-for-injectable.{ts,tsx}",
    "./**/*.global-override-for-injectable.{ts,tsx}",
    "../test-env/**/*.global-override-for-injectable.{ts,tsx}",
    "../features/**/renderer/**/*.global-override-for-injectable.{ts,tsx}",
    "../features/**/common/**/*.global-override-for-injectable.{ts,tsx}",
  ],
  { eager: true },
);

export const getDiForUnitTesting = () => {
  const environment = "renderer";
  const di = createContainer(environment);

  registerMobX(di);
  setDiForExtensionApi(di, environment);

  runInAction(() => {
    registerFeature(
      di,
      messagingFeature,
      messagingTestUtils.messagingFeatureForUnitTesting,
      routingFeature,
      loggerFeature,
      animateFeature,
      clusterSidebarFeature,
      randomFeature,
      kubeApiSpecificsFeature,
      notificationsFeature,
    );
  });

  runInAction(() => {
    const injectables = Object.values(injectableModules).flatMap(Object.values).filter(isInjectable);

    for (const block of chunk(injectables, 100)) {
      di.register(...block);
    }
  });

  di.override(dependencyInjectionContainerInjectable, () => di);

  for (const globalOverride of Object.values(globalOverrideModules).map((module) => module.default)) {
    di.override(globalOverride.injectable, globalOverride.overridingInstantiate);
  }

  [startTopbarStateSyncInjectable].forEach((injectable) => {
    di.override(injectable, () => ({
      id: injectable.id,
      run: () => {},
    }));
  });

  di.override(terminalSpawningPoolInjectable, () => document.createElement("div"));
  di.override(hostedClusterIdInjectable, () => undefined);

  di.override(legacyOnChannelListenInjectable, () => () => noop);

  di.override(requestAnimationFrameInjectable, () => (callback) => callback());
  di.override(watchHistoryStateInjectable, () => () => () => {});

  getOverrideFsWithFakes()(di);

  return di;
};
