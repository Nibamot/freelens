/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { guessUserTimezone } from "@nibamot/utilities";
import { getInjectable } from "@ogre-tools/injectable";

const currentTimezoneInjectable = getInjectable({
  id: "current-timezone",
  instantiate: () => guessUserTimezone(),
  causesSideEffects: true,
});

export default currentTimezoneInjectable;
