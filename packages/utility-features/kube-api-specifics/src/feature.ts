import { getFeature } from "@nibamot/feature-core";
import { registerInjectables } from "./register-injectables";
export const kubeApiSpecificsFeature = getFeature({
  id: "kube-api-specifics",
  register: (di) => {
    registerInjectables(di);
  },
});
