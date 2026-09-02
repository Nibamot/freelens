import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const animateFeature = getFeature({
  id: "animate-feature",

  register: (di) => {
    registerInjectables(di);
  },
});
