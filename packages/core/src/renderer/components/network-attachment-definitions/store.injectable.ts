/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import assert from "node:assert";
import { storesAndApisCanBeCreatedInjectionToken } from "@freelensapp/kube-api-specifics";
import { loggerInjectionToken } from "@freelensapp/logger";
import { getInjectable } from "@ogre-tools/injectable";
import { kubeObjectStoreInjectionToken } from "../../../common/k8s-api/api-manager/kube-object-store-token";
import clusterFrameContextForNamespacedResourcesInjectable from "../../cluster-frame-context/for-namespaced-resources.injectable";
import networkAttachmentDefinitionApiInjectable from "./api.injectable";
import { NetworkAttachmentDefinitionStore } from "./store";

const networkAttachmentDefinitionStoreInjectable = getInjectable({
  id: "network-attachment-definition-store",
  instantiate: (di) => {
    assert(
      di.inject(storesAndApisCanBeCreatedInjectionToken),
      "networkAttachmentDefinitionStore is only available in certain environments",
    );

    const api = di.inject(networkAttachmentDefinitionApiInjectable);

    return new NetworkAttachmentDefinitionStore(
      {
        context: di.inject(clusterFrameContextForNamespacedResourcesInjectable),
        logger: di.inject(loggerInjectionToken),
      },
      api,
    );
  },
  injectionToken: kubeObjectStoreInjectionToken,
});

export default networkAttachmentDefinitionStoreInjectable;
