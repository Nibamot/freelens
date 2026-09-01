import { getFeature } from "@nibamot/feature-core";
import { messagingFeature } from "@nibamot/messaging";
import { registerInjectables } from "./register-injectables";
export const messagingFeatureForMain = getFeature({
  id: "messaging-for-main",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [messagingFeature],
});
