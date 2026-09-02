import { getFeature } from "@nibamot/feature-core";
import { reactApplicationFeature } from "@nibamot/react-application";
import { registerInjectables } from "./register-injectables";
export const keyboardShortcutsFeature = getFeature({
  id: "keyboard-shortcuts",

  register: (di) => {
    registerInjectables(di);
  },

  dependencies: [reactApplicationFeature],
});
