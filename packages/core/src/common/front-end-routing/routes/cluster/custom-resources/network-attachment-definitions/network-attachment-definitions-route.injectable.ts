/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { shouldShowResourceInjectionToken } from "../../../../../../features/cluster/showing-kube-resources/common/allowed-resources-injection-token";
import { frontEndRouteInjectionToken } from "../../../../front-end-route-injection-token";

const networkAttachmentDefinitionsRouteInjectable = getInjectable({
  id: "network-attachment-definitions-route",

  instantiate: (di) => ({
    path: "/crd/network-attachment-definitions",
    clusterFrame: true,
    isEnabled: di.inject(shouldShowResourceInjectionToken, {
      apiName: "network-attachment-definitions",
      group: "k8s.cni.cncf.io",
    }),
  }),

  injectionToken: frontEndRouteInjectionToken,
});

export default networkAttachmentDefinitionsRouteInjectable;
