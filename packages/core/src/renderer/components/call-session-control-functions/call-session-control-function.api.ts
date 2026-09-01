/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeApi } from "@nibamot/kube-api";
import { CallSessionControlFunction } from "./call-session-control-function";

import type { DerivedKubeApiOptions, KubeApiDependencies } from "@nibamot/kube-api";

export class CallSessionControlFunctionApi extends KubeApi<CallSessionControlFunction> {
  constructor(deps: KubeApiDependencies, opts: DerivedKubeApiOptions = {}) {
    super(deps, {
      objectConstructor: CallSessionControlFunction,
      checkPreferredVersion: true,
      fallbackApiBases: ["/apis/ims.ngvoice.com/v1beta1/callsessioncontrolfunctions"],
      ...opts,
    });
  }
}
