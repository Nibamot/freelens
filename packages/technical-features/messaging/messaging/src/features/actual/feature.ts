import { applicationFeature } from "@nibamot/application";
import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const messagingFeature = getFeature({
  id: "messaging",

  dependencies: [applicationFeature],

  register: (di) => {
    registerInjectables(di);
  },
});
