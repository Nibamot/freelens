/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import callSessionControlFunctionsRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/call-session-control-functions/call-session-control-functions-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../routes/route-specific-component-injection-token";
import { CallSessionControlFunctions } from "./call-session-control-functions";

const callSessionControlFunctionsRouteComponentInjectable = getInjectable({
  id: "call-session-control-functions-route-component",

  instantiate: (di) => ({
    route: di.inject(callSessionControlFunctionsRouteInjectable),
    Component: CallSessionControlFunctions,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default callSessionControlFunctionsRouteComponentInjectable;
