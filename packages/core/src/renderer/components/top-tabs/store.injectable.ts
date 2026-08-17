/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { navigateToUrlInjectionToken } from "../../../common/front-end-routing/navigate-to-url-injection-token";
import currentPageTitleInjectable from "../../routes/current-page-title.injectable";
import currentPathInjectable from "../../routes/current-path.injectable";
import topTabsStorageInjectable from "./storage.injectable";
import { TopTabsStore } from "./store";

const topTabsStoreInjectable = getInjectable({
  id: "top-tabs-store",

  instantiate: (di) =>
    new TopTabsStore({
      storage: di.inject(topTabsStorageInjectable),
      currentPath: di.inject(currentPathInjectable),
      currentPageTitle: di.inject(currentPageTitleInjectable),
      navigateToPath: (path) => di.inject(navigateToUrlInjectionToken)(path),
    }),
});

export default topTabsStoreInjectable;
