import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const routingFeature = getFeature({
  id: "routing",

  register: (di) => {
    registerInjectables(di);
  },
});
