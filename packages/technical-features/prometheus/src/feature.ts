import { applicationFeature } from "@nibamot/application";
import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const prometheusFeature = getFeature({
  id: "prometheus",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [applicationFeature],
});
