/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { withInjectables } from "@ogre-tools/injectable-react";
import { kebabCase } from "es-toolkit";
import { observer } from "mobx-react";
import React from "react";
import { KubeObjectAge } from "../kube-object/age";
import { KubeObjectConditionsList } from "../kube-object-conditions";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { NamespaceSelectBadge } from "../namespaces/namespace-select-badge";
import { WithTooltip } from "../with-tooltip";
import callSessionControlFunctionStoreInjectable from "./store.injectable";

import type { CallSessionControlFunctionStore } from "./store";

enum columnId {
  name = "name",
  namespace = "namespace",
  apiVersion = "apiVersion",
  replicas = "replicas",
  status = "status",
  message = "message",
  age = "age",
}

interface Dependencies {
  callSessionControlFunctionStore: CallSessionControlFunctionStore;
}

@observer
class NonInjectedCallSessionControlFunctions extends React.Component<Dependencies> {
  render() {
    return (
      <SiblingsInTabLayout>
        <KubeObjectListLayout
          isConfigurable
          tableId="call_session_control_functions"
          className="CallSessionControlFunctions"
          store={this.props.callSessionControlFunctionStore}
          sortingCallbacks={{
            [columnId.name]: (cscf) => cscf.getName(),
            [columnId.namespace]: (cscf) => cscf.getNs(),
            [columnId.apiVersion]: (cscf) => cscf.apiVersion,
            [columnId.replicas]: (cscf) => cscf.getReplicas(),
            [columnId.status]: (cscf) => cscf.getStatus(),
            [columnId.message]: (cscf) => cscf.getConditionsText(),
            [columnId.age]: (cscf) => -cscf.getCreationTimestamp(),
          }}
          searchFilters={[
            (cscf) => cscf.getSearchFields(),
            (cscf) => cscf.getStatus(),
            (cscf) => cscf.getConditionsText(false),
          ]}
          renderHeaderTitle="Call Session Control Functions"
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
            { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
            {
              title: "API Version",
              className: "apiVersion",
              sortBy: columnId.apiVersion,
              id: columnId.apiVersion,
            },
            { title: "Replicas", className: "replicas", sortBy: columnId.replicas, id: columnId.replicas },
            { title: "Status", className: "status", sortBy: columnId.status, id: columnId.status },
            { title: "Message", className: "message", sortBy: columnId.message, id: columnId.message },
            { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
          ]}
          renderTableContents={(cscf) => [
            <WithTooltip>{cscf.getName()}</WithTooltip>,
            <NamespaceSelectBadge key="namespace" namespace={cscf.getNs()} />,
            <WithTooltip key="apiVersion">{cscf.apiVersion}</WithTooltip>,
            `${cscf.getReadyReplicas()}/${cscf.getReplicas()}`,
            <span key="status" className={kebabCase(cscf.getStatus())}>
              {cscf.getStatus()}
            </span>,
            <KubeObjectConditionsList key="message" object={cscf} />,
            <KubeObjectAge key="age" object={cscf} />,
          ]}
        />
      </SiblingsInTabLayout>
    );
  }
}

export const CallSessionControlFunctions = withInjectables<Dependencies>(NonInjectedCallSessionControlFunctions, {
  getProps: (di, props) => ({
    ...props,
    callSessionControlFunctionStore: di.inject(callSessionControlFunctionStoreInjectable),
  }),
});
