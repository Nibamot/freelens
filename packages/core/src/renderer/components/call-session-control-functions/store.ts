/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";

import type { CallSessionControlFunction } from "./call-session-control-function";
import type { CallSessionControlFunctionApi } from "./call-session-control-function.api";

export class CallSessionControlFunctionStore extends KubeObjectStore<
  CallSessionControlFunction,
  CallSessionControlFunctionApi
> {}
