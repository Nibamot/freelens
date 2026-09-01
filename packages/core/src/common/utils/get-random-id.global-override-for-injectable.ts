/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getRandomIdInjectionToken } from "@nibamot/random";
import { getGlobalOverride } from "@nibamot/test-utils";

export default getGlobalOverride(getRandomIdInjectionToken, () => () => "some-irrelevant-random-id");
