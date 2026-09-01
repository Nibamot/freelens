/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { createMemoryHistory, historyInjectionToken } from "@nibamot/routing";
import { getGlobalOverride } from "@nibamot/test-utils";

export default getGlobalOverride(historyInjectionToken, () => createMemoryHistory());
