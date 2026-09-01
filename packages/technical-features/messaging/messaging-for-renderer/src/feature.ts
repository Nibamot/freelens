import { getFeature } from "@nibamot/feature-core";
import { messagingFeature } from "@nibamot/messaging";
import { registerInjectables } from "./register-injectables";
export const messagingFeatureForRenderer = getFeature({
  id: "messaging-for-renderer",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [messagingFeature],
});
