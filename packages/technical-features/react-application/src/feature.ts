import { applicationFeature } from "@nibamot/application";
import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const reactApplicationFeature = getFeature({
  id: "react-application",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [applicationFeature],
});
