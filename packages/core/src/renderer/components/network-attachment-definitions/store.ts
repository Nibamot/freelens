/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";

import type { NetworkAttachmentDefinition } from "./network-attachment-definition";
import type { NetworkAttachmentDefinitionApi } from "./network-attachment-definition.api";

export class NetworkAttachmentDefinitionStore extends KubeObjectStore<
  NetworkAttachmentDefinition,
  NetworkAttachmentDefinitionApi
> {}
