/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";

import type { MutatingWebhookConfigurationApi } from "@nibamot/kube-api";
import type { MutatingWebhookConfiguration } from "@nibamot/kube-object";

export class MutatingWebhookConfigurationStore extends KubeObjectStore<
  MutatingWebhookConfiguration,
  MutatingWebhookConfigurationApi
> {}
