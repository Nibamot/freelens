/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import React from "react";
import { KubeObjectAge } from "../kube-object/age";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { NamespaceSelectBadge } from "../namespaces/namespace-select-badge";
import { WithTooltip } from "../with-tooltip";
import networkAttachmentDefinitionStoreInjectable from "./store.injectable";

import type { NetworkAttachmentDefinitionStore } from "./store";

enum columnId {
  name = "name",
  namespace = "namespace",
  type = "type",
  age = "age",
}

interface Dependencies {
  networkAttachmentDefinitionStore: NetworkAttachmentDefinitionStore;
}

@observer
class NonInjectedNetworkAttachmentDefinitions extends React.Component<Dependencies> {
  render() {
    return (
      <SiblingsInTabLayout>
        <KubeObjectListLayout
          isConfigurable
          tableId="network_attachment_definitions"
          className="NetworkAttachmentDefinitions"
          store={this.props.networkAttachmentDefinitionStore}
          sortingCallbacks={{
            [columnId.name]: (nad) => nad.getName(),
            [columnId.namespace]: (nad) => nad.getNs(),
            [columnId.age]: (nad) => -nad.getCreationTimestamp(),
          }}
          searchFilters={[(nad) => nad.getSearchFields()]}
          renderHeaderTitle="Network Attachment Definitions"
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
            { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
            { title: "Type", className: "type", id: columnId.type },
            { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
          ]}
          renderTableContents={(nad) => [
            <WithTooltip>{nad.getName()}</WithTooltip>,
            <NamespaceSelectBadge key="namespace" namespace={nad.getNs()} />,
            <WithTooltip key="type">{nad.getConfigType()}</WithTooltip>,
            <KubeObjectAge key="age" object={nad} />,
          ]}
        />
      </SiblingsInTabLayout>
    );
  }
}

export const NetworkAttachmentDefinitions = withInjectables<Dependencies>(NonInjectedNetworkAttachmentDefinitions, {
  getProps: (di, props) => ({
    ...props,
    networkAttachmentDefinitionStore: di.inject(networkAttachmentDefinitionStoreInjectable),
  }),
});
