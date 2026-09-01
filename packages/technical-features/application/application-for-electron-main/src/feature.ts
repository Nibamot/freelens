import { applicationFeature } from "@nibamot/application";
import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const applicationFeatureForElectronMain = getFeature({
  id: "application-for-electron-main",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [applicationFeature],
});
