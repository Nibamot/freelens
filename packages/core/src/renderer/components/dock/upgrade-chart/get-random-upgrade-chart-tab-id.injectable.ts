/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getRandomIdInjectionToken } from "@nibamot/random";
import { getInjectable } from "@ogre-tools/injectable";

import type { GetRandomId } from "@nibamot/random";

const getRandomUpgradeChartTabIdInjectable = getInjectable({
  id: "get-random-upgrade-chart-tab-id",
  instantiate: (di): GetRandomId => di.inject(getRandomIdInjectionToken),
});

export default getRandomUpgradeChartTabIdInjectable;
