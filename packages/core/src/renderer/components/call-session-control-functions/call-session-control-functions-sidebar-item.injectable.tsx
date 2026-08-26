/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { sidebarItemInjectionToken } from "@freelensapp/cluster-sidebar";
import { Icon } from "@freelensapp/icon";
import { getInjectable } from "@ogre-tools/injectable";
import callSessionControlFunctionsRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/call-session-control-functions/call-session-control-functions-route.injectable";
import navigateToCallSessionControlFunctionsInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/call-session-control-functions/navigate-to-call-session-control-functions.injectable";
import { SidebarMenuItem, sidebarMenuItemIds } from "../../../common/sidebar-menu-items-starting-order";
import { getClusterPageMenuOrderInjectable } from "../../../features/user-preferences/common/cluster-page-menu-order.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const id = SidebarMenuItem.CallSessionControlFunctions;

const callSessionControlFunctionsSidebarItemInjectable = getInjectable({
  id: id,

  instantiate: (di) => {
    const route = di.inject(callSessionControlFunctionsRouteInjectable);
    const getClusterPageMenuOrder = di.inject(getClusterPageMenuOrderInjectable);

    return {
      parentId: null,
      title: "Call Session Control Functions",
      getIcon: () => <Icon material="call_split" />,
      onClick: di.inject(navigateToCallSessionControlFunctionsInjectable),
      isActive: di.inject(routeIsActiveInjectable, route),
      isVisible: route.isEnabled,
      orderNumber: getClusterPageMenuOrder(id, sidebarMenuItemIds[id]),
    };
  },

  injectionToken: sidebarItemInjectionToken,
});

export default callSessionControlFunctionsSidebarItemInjectable;
