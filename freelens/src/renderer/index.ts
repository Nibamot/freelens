import "@nibamot/core/styles";
import "@nibamot/button/styles";
import "@nibamot/error-boundary/styles";
import "@nibamot/tooltip/styles";
import "@nibamot/resizing-anchor/styles";
import "@nibamot/icon/styles";
import "@nibamot/animate/styles";
import "@nibamot/notifications/styles";
import "@nibamot/spinner/styles";

import { animateFeature } from "@nibamot/animate";
import { applicationFeature, startApplicationInjectionToken } from "@nibamot/application";
import { clusterSidebarFeature } from "@nibamot/cluster-sidebar";
import {
  commonExtensionApi as Common,
  metricsFeature,
  rendererExtensionApi as Renderer,
  registerLensCore,
} from "@nibamot/core/renderer";
import { registerFeature } from "@nibamot/feature-core";
import { keyboardShortcutsFeature } from "@nibamot/keyboard-shortcuts";
import { kubeApiSpecificsFeature } from "@nibamot/kube-api-specifics";
import { loggerFeature } from "@nibamot/logger";
import { messagingFeatureForRenderer } from "@nibamot/messaging-for-renderer";
import { notificationsFeature } from "@nibamot/notifications";
import { randomFeature } from "@nibamot/random";
import { reactApplicationFeature } from "@nibamot/react-application";
import { routingFeature } from "@nibamot/routing";
import { createContainer } from "@ogre-tools/injectable";
import { registerMobX } from "@ogre-tools/injectable-extension-for-mobx";
import { runInAction } from "mobx";
import { registerInjectables as registerCommonInjectables } from "../common/register-injectables";
import { registerInjectables as registerRendererInjectables } from "./register-injectables";

const environment = "renderer";

const di = createContainer(environment);

// @ogre-tools 23 prevents side-effect injectables by default; the production
// container must opt back in to allow them.
di.permitSideEffects();

runInAction(() => {
  registerMobX(di);
  registerLensCore(di, environment);

  registerFeature(di, loggerFeature);

  registerFeature(
    di,
    applicationFeature,
    messagingFeatureForRenderer,
    keyboardShortcutsFeature,
    reactApplicationFeature,
    routingFeature,
    metricsFeature,
    animateFeature,
    clusterSidebarFeature,
    randomFeature,
    kubeApiSpecificsFeature,
    notificationsFeature,
  );

  registerRendererInjectables(di);
  registerCommonInjectables(di);
});

const startApplication = di.inject(startApplicationInjectionToken);

startApplication();

export { Mobx, MobxReact, React, ReactDOM, ReactJsxRuntime } from "@nibamot/core/renderer";

// Phase 4 (D5): expose the extension API through a runtime global so the
// published `@nibamot/extensions` shim can re-export it in each process.
// The renderer gets `{ Common, Renderer }`; main gets `{ Common, Main }`.
// The global's ambient type lives in `../freelens-extension-api.ts`.
globalThis.FreelensExtensionApi = { Common, Renderer };

export const LensExtensions = {
  Renderer,
  Common,
};
