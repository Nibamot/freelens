import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";

export const randomFeature = getFeature({
  id: "random-feature",

  register: (di) => {
    registerInjectables(di);
  },
});
