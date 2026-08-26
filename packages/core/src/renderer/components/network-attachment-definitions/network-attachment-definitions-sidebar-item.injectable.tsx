/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { sidebarItemInjectionToken } from "@freelensapp/cluster-sidebar";
import { Icon } from "@freelensapp/icon";
import { getInjectable } from "@ogre-tools/injectable";
import { SidebarMenuItem, sidebarMenuItemIds } from "../../../common/sidebar-menu-items-starting-order";
import navigateToNetworkAttachmentDefinitionsInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/network-attachment-definitions/navigate-to-network-attachment-definitions.injectable";
import networkAttachmentDefinitionsRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/network-attachment-definitions/network-attachment-definitions-route.injectable";
import { getClusterPageMenuOrderInjectable } from "../../../features/user-preferences/common/cluster-page-menu-order.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const id = SidebarMenuItem.NetworkAttachmentDefinitions;

const networkAttachmentDefinitionsSidebarItemInjectable = getInjectable({
  id: id,

  instantiate: (di) => {
    const route = di.inject(networkAttachmentDefinitionsRouteInjectable);
    const getClusterPageMenuOrder = di.inject(getClusterPageMenuOrderInjectable);

    return {
      parentId: null,
      title: "Network Attachment Definitions",
      getIcon: () => <Icon material="device_hub" />,
      onClick: di.inject(navigateToNetworkAttachmentDefinitionsInjectable),
      isActive: di.inject(routeIsActiveInjectable, route),
      isVisible: route.isEnabled,
      orderNumber: getClusterPageMenuOrder(id, sidebarMenuItemIds[id]),
    };
  },

  injectionToken: sidebarItemInjectionToken,
});

export default networkAttachmentDefinitionsSidebarItemInjectable;
