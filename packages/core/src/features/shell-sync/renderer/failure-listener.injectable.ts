/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getMessageChannelListenerInjectable } from "@nibamot/messaging";
import { showErrorNotificationInjectable } from "@nibamot/notifications";
import { shellSyncFailedChannel } from "../common/failure-channel";

const shellSyncFailureListenerInjectable = getMessageChannelListenerInjectable({
  id: "notification",
  channel: shellSyncFailedChannel,
  getHandler: (di) => {
    const showErrorNotification = di.inject(showErrorNotificationInjectable);

    return (errorMessage) => showErrorNotification(`Failed to sync shell environment: ${errorMessage}`);
  },
});

export default shellSyncFailureListenerInjectable;
