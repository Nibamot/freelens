/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getGlobalOverride } from "@nibamot/test-utils";
import { noop } from "@nibamot/utilities";
import createIpcFileLoggerTransportInjectable from "./create-ipc-file-transport.injectable";

import type { transports } from "winston";

export default getGlobalOverride(
  createIpcFileLoggerTransportInjectable,
  () => () =>
    ({
      log: noop,
      close: noop,
    }) as typeof transports.File,
);
