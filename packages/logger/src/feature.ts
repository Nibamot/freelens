import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const loggerFeature = getFeature({
  id: "logger-feature",

  register: (di) => {
    registerInjectables(di);
  },
});
