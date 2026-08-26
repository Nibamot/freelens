/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import networkAttachmentDefinitionsRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/network-attachment-definitions/network-attachment-definitions-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../routes/route-specific-component-injection-token";
import { NetworkAttachmentDefinitions } from "./network-attachment-definitions";

const networkAttachmentDefinitionsRouteComponentInjectable = getInjectable({
  id: "network-attachment-definitions-route-component",

  instantiate: (di) => ({
    route: di.inject(networkAttachmentDefinitionsRouteInjectable),
    Component: NetworkAttachmentDefinitions,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default networkAttachmentDefinitionsRouteComponentInjectable;
