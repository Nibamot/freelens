/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeApi } from "@nibamot/kube-api";
import { NetworkAttachmentDefinition } from "./network-attachment-definition";

import type { DerivedKubeApiOptions, KubeApiDependencies } from "@nibamot/kube-api";

export class NetworkAttachmentDefinitionApi extends KubeApi<NetworkAttachmentDefinition> {
  constructor(deps: KubeApiDependencies, opts: DerivedKubeApiOptions = {}) {
    super(deps, {
      objectConstructor: NetworkAttachmentDefinition,
      ...opts,
    });
  }
}
