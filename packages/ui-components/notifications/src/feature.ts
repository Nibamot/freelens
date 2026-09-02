import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const notificationsFeature = getFeature({
  id: "notifications-feature",

  register: (di) => {
    registerInjectables(di);
  },
});
