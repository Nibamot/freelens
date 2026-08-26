/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "@freelensapp/kube-object";

import type { KubeObjectStatus, NamespaceScopedMetadata } from "@freelensapp/kube-object";

export interface CallSessionControlFunctionSpec {
  replicas?: number;
  image?: string;
}

export interface CallSessionControlFunctionStatus extends KubeObjectStatus {
  currentState?: string;
  replicas?: number;
  readyPods?: number;
  readyServices?: number;
  selector?: string;
}

export class CallSessionControlFunction extends KubeObject<
  NamespaceScopedMetadata,
  CallSessionControlFunctionStatus,
  CallSessionControlFunctionSpec
> {
  static readonly kind = "CallSessionControlFunction";

  static readonly namespaced = true;

  static readonly apiBase = "/apis/ims.ngvoice.com/v1/callsessioncontrolfunctions";

  getReplicas(): number {
    return this.status?.replicas ?? this.spec.replicas ?? 0;
  }

  getReadyReplicas(): number {
    return this.status?.readyPods ?? 0;
  }

  getStatus(): string {
    return this.status?.currentState ?? "";
  }

  getConditions(activeOnly = false) {
    const { conditions = [] } = this.status ?? {};

    if (activeOnly) {
      return conditions.filter((condition) => condition.status === "True");
    }

    return conditions;
  }

  getConditionsText(activeOnly = true): string {
    return this.getConditions(activeOnly)
      .map(({ type }) => type)
      .join(" ");
  }
}
