/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getRandomIdInjectionToken } from "@nibamot/random";
import { getInjectable } from "@ogre-tools/injectable";

import type { GetRandomId } from "@nibamot/random";

const getRandomInstallChartTabIdInjectable = getInjectable({
  id: "get-random-install-chart-tab-id",
  instantiate: (di): GetRandomId => di.inject(getRandomIdInjectionToken),
});

export default getRandomInstallChartTabIdInjectable;
