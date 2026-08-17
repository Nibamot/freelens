/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { sidebarItemsInjectable } from "@freelensapp/cluster-sidebar";
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import catalogEntitiesInjectable from "../api/catalog/entity/entities.injectable";
import getEntityByIdInjectable from "../api/catalog/entity/get-by-id.injectable";
import currentPathInjectable from "./current-path.injectable";

import type { SidebarItemDeclaration } from "@freelensapp/cluster-sidebar";

function findActiveLeaf(items: SidebarItemDeclaration[]): SidebarItemDeclaration | undefined {
  for (const item of items) {
    if (item.children.length > 0) {
      const activeChild = findActiveLeaf(item.children);

      if (activeChild) {
        return activeChild;
      }
    } else if (item.isActive.get()) {
      return item;
    }
  }

  return undefined;
}

function titleFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";

  const title = lastSegment.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return title || "Overview";
}

const currentPageTitleInjectable = getInjectable({
  id: "current-page-title",

  instantiate: (di) => {
    const sidebarItems = di.inject(sidebarItemsInjectable);
    const currentPath = di.inject(currentPathInjectable);
    const catalogEntities = di.inject(catalogEntitiesInjectable);
    const getEntityById = di.inject(getEntityByIdInjectable);

    return computed(() => {
      const activeItem = findActiveLeaf(sidebarItems.get());

      if (activeItem && typeof activeItem.title === "string") {
        return activeItem.title;
      }

      catalogEntities.get(); // establish mobx dependency on the catalog entity registry

      const path = currentPath.get();
      const segments = path.split("/").filter(Boolean);

      for (let i = segments.length - 1; i >= 0; i--) {
        const entity = getEntityById(segments[i]);

        if (entity) {
          return entity.getName();
        }
      }

      return titleFromPath(path);
    });
  },
});

export default currentPageTitleInjectable;
