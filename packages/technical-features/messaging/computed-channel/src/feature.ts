import { getFeature } from "@nibamot/feature-core";
import { messagingFeature } from "@nibamot/messaging";
import { registerInjectables } from "./register-injectables";
export const computedChannelFeature = getFeature({
  id: "computed-channel",

  dependencies: [messagingFeature],

  register: (di) => {
    registerInjectables(di);
  },
});
