import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const applicationFeature = getFeature({
  id: "application",

  register: (di) => {
    registerInjectables(di);
  },
});
