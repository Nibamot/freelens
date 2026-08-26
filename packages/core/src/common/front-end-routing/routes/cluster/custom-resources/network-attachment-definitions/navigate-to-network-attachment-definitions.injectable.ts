/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { navigateToRouteInjectionToken } from "../../../../navigate-to-route-injection-token";
import networkAttachmentDefinitionsRouteInjectable from "./network-attachment-definitions-route.injectable";

const navigateToNetworkAttachmentDefinitionsInjectable = getInjectable({
  id: "navigate-to-network-attachment-definitions",

  instantiate: (di) => {
    const navigateToRoute = di.inject(navigateToRouteInjectionToken);
    const route = di.inject(networkAttachmentDefinitionsRouteInjectable);

    return () => navigateToRoute(route);
  },
});

export default navigateToNetworkAttachmentDefinitionsInjectable;
