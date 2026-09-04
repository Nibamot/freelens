/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { debounce } from "es-toolkit/compat";
import broadcastMessageInjectable from "../../common/ipc/broadcast-message.injectable";
import { catalogItemsChannel } from "../../common/ipc/catalog";

import type { DebouncedFunc } from "es-toolkit/compat";

import type { CatalogEntity } from "../../common/catalog";

const catalogSyncBroadcasterInjectable = getInjectable({
  id: "catalog-sync-broadcaster",
  instantiate: (di): DebouncedFunc<(items: CatalogEntity[]) => void> => {
    const broadcastMessage = di.inject(broadcastMessageInjectable);
    const debounceOptions: { leading: boolean; trailing: boolean } = {
      leading: true,
      trailing: true,
    };

    return debounce(
      (items: CatalogEntity[]) => {
        broadcastMessage(catalogItemsChannel, items);
      },
      100,
      debounceOptions,
    );
  },
});

export default catalogSyncBroadcasterInjectable;
