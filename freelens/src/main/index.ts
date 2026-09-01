import { applicationFeature, startApplicationInjectionToken } from "@nibamot/application";
import { applicationFeatureForElectronMain } from "@nibamot/application-for-electron-main";
import { commonExtensionApi as Common, mainExtensionApi as Main, registerLensCore } from "@nibamot/core/main";
import { registerFeature } from "@nibamot/feature-core";
import { kubeApiSpecificsFeature } from "@nibamot/kube-api-specifics";
import { loggerFeature } from "@nibamot/logger";
import { messagingFeatureForMain } from "@nibamot/messaging-for-main";
import { prometheusFeature } from "@nibamot/prometheus";
import { randomFeature } from "@nibamot/random";
import { createContainer } from "@ogre-tools/injectable";
import { registerMobX } from "@ogre-tools/injectable-extension-for-mobx";
import { runInAction } from "mobx";
import { registerInjectables as registerCommonInjectables } from "../common/register-injectables";
import { registerInjectables as registerMainInjectables } from "./register-injectables";

const environment = "main";

const di = createContainer(environment);

// @ogre-tools 23 prevents side-effect injectables by default; the production
// container must opt back in to allow them.
di.permitSideEffects();

registerMobX(di);

runInAction(() => {
  registerLensCore(di, environment);

  registerFeature(
    di,
    loggerFeature,
    prometheusFeature,
    applicationFeature,
    applicationFeatureForElectronMain,
    messagingFeatureForMain,
    randomFeature,
    kubeApiSpecificsFeature,
  );

  registerMainInjectables(di);
  registerCommonInjectables(di);
});

const startApplication = di.inject(startApplicationInjectionToken);

startApplication().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {
  Mobx,
  Pty,
} from "@nibamot/core/main";

// Phase 4 (D5): expose the extension API through a runtime global so the
// published `@nibamot/extensions` shim can re-export it in each process.
// Main gets `{ Common, Main }`; the renderer gets `{ Common, Renderer }`.
// The global's ambient type lives in `../freelens-extension-api.ts`.
globalThis.FreelensExtensionApi = { Common, Main };

export const LensExtensions = {
  Main,
  Common,
};
