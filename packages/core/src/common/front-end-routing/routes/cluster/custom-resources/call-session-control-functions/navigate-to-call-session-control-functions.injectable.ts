/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { navigateToRouteInjectionToken } from "../../../../navigate-to-route-injection-token";
import callSessionControlFunctionsRouteInjectable from "./call-session-control-functions-route.injectable";

const navigateToCallSessionControlFunctionsInjectable = getInjectable({
  id: "navigate-to-call-session-control-functions",

  instantiate: (di) => {
    const navigateToRoute = di.inject(navigateToRouteInjectionToken);
    const route = di.inject(callSessionControlFunctionsRouteInjectable);

    return () => navigateToRoute(route);
  },
});

export default navigateToCallSessionControlFunctionsInjectable;
