/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "@freelensapp/kube-object";

import type { NamespaceScopedMetadata } from "@freelensapp/kube-object";

export interface NetworkAttachmentDefinitionSpec {
  config?: string;
}

export class NetworkAttachmentDefinition extends KubeObject<
  NamespaceScopedMetadata,
  void,
  NetworkAttachmentDefinitionSpec
> {
  static readonly kind = "NetworkAttachmentDefinition";

  static readonly namespaced = true;

  static readonly apiBase = "/apis/k8s.cni.cncf.io/v1/network-attachment-definitions";

  getConfigType(): string {
    if (!this.spec.config) {
      return "";
    }

    try {
      const parsed = JSON.parse(this.spec.config) as { type?: string; plugins?: { type?: string }[] };

      return parsed.type ?? parsed.plugins?.[0]?.type ?? "";
    } catch {
      return "";
    }
  }
}
