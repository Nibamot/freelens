/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import assert from "node:assert";
import {
  kubeApiInjectionToken,
  maybeKubeApiInjectable,
  storesAndApisCanBeCreatedInjectionToken,
} from "@freelensapp/kube-api-specifics";
import {
  logDebugInjectionToken,
  logErrorInjectionToken,
  logInfoInjectionToken,
  logWarningInjectionToken,
} from "@freelensapp/logger";
import { getInjectable } from "@ogre-tools/injectable";
import { NetworkAttachmentDefinitionApi } from "./network-attachment-definition.api";

const networkAttachmentDefinitionApiInjectable = getInjectable({
  id: "network-attachment-definition-api",

  instantiate: (di) => {
    assert(
      di.inject(storesAndApisCanBeCreatedInjectionToken),
      "networkAttachmentDefinitionApi is only available in certain environments",
    );

    return new NetworkAttachmentDefinitionApi({
      logDebug: di.inject(logDebugInjectionToken),
      logError: di.inject(logErrorInjectionToken),
      logInfo: di.inject(logInfoInjectionToken),
      logWarn: di.inject(logWarningInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },

  injectionToken: kubeApiInjectionToken,
});

export default networkAttachmentDefinitionApiInjectable;
