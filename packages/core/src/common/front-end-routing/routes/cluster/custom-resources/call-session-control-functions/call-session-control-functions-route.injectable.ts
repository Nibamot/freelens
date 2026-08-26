/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { shouldShowResourceInjectionToken } from "../../../../../../features/cluster/showing-kube-resources/common/allowed-resources-injection-token";
import { frontEndRouteInjectionToken } from "../../../../front-end-route-injection-token";

const callSessionControlFunctionsRouteInjectable = getInjectable({
  id: "call-session-control-functions-route",

  instantiate: (di) => ({
    path: "/crd/call-session-control-functions",
    clusterFrame: true,
    isEnabled: di.inject(shouldShowResourceInjectionToken, {
      apiName: "callsessioncontrolfunctions",
      group: "ims.ngvoice.com",
    }),
  }),

  injectionToken: frontEndRouteInjectionToken,
});

export default callSessionControlFunctionsRouteInjectable;
