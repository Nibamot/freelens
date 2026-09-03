/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { disposer } from "@nibamot/utilities";
import { getInjectable } from "@ogre-tools/injectable";
import { action, computed, observable, reaction } from "mobx";
import catalogCategoryRegistryInjectable from "../../../common/catalog/category-registry.injectable";
import { isKubernetesCluster, LensKubernetesClusterStatus } from "../../../common/catalog-entities/kubernetes-cluster";
import excludeKubeconfigClusterInjectable from "../../../features/user-preferences/common/exclude-kubeconfig-cluster.injectable";
import catalogEntityRegistryInjectable from "../../api/catalog/entity/registry.injectable";

import type { Disposer } from "@nibamot/utilities";

import type { IComputedValue, IObservableValue } from "mobx";

import type { CatalogCategory } from "../../../common/catalog";
import type { CatalogEntity } from "../../api/catalog-entity";
import type { ItemListStore } from "../item-object-list";

export type CatalogEntityStore = ItemListStore<CatalogEntity, false> & {
  readonly entities: IComputedValue<CatalogEntity[]>;
  readonly activeCategory: IObservableValue<CatalogCategory | undefined>;
  watch(): Disposer;
  onRun(entity: CatalogEntity): void;
};

const catalogEntityStoreInjectable = getInjectable({
  id: "catalog-entity-store",

  instantiate: (di): CatalogEntityStore => {
    const catalogEntityRegistry = di.inject(catalogEntityRegistryInjectable);
    const catalogCategoryRegistry = di.inject(catalogCategoryRegistryInjectable);
    const excludeKubeconfigCluster = di.inject(excludeKubeconfigClusterInjectable);

    const activeCategory = observable.box<CatalogCategory>();
    const checkboxSelectedIds = observable.set<string>();
    const entities = computed(() => {
      const category = activeCategory.get();

      return category
        ? catalogEntityRegistry.getItemsForCategory(category, { filtered: true })
        : catalogEntityRegistry.filteredItems;
    });
    const loadAll = () => {
      const category = activeCategory.get();

      if (category) {
        category.emit("load");
      } else {
        for (const category of catalogCategoryRegistry.items) {
          category.emit("load");
        }
      }
    };
    const isChecked = (item: CatalogEntity) => checkboxSelectedIds.has(item.getId());

    return {
      entities,
      activeCategory,
      watch: () =>
        disposer(
          reaction(() => entities.get(), loadAll),
          reaction(() => activeCategory.get(), loadAll, { delay: 100 }),
          // Selecting a different category tab shouldn't carry over checkbox
          // selections from the previous one.
          reaction(
            () => activeCategory.get(),
            () => checkboxSelectedIds.clear(),
          ),
        ),
      onRun: (entity) => catalogEntityRegistry.onRun(entity),
      failedLoading: false,
      getTotalCount: () => entities.get().length,
      isLoaded: true,
      isSelected: isChecked,
      isSelectedAll: (items) => items.length > 0 && items.every(isChecked),
      pickOnlySelected: (items) => items.filter(isChecked),
      get selectedItems() {
        return entities.get().filter(isChecked);
      },
      toggleSelection: action((item) => {
        if (isChecked(item)) {
          checkboxSelectedIds.delete(item.getId());
        } else {
          checkboxSelectedIds.add(item.getId());
        }
      }),
      toggleSelectionAll: action((items) => {
        if (items.length > 0 && items.every(isChecked)) {
          items.forEach((item) => checkboxSelectedIds.delete(item.getId()));
        } else {
          items.forEach((item) => checkboxSelectedIds.add(item.getId()));
        }
      }),
      removeItems: async (selectedItems) => {
        for (const entity of selectedItems) {
          if (!isKubernetesCluster(entity)) {
            continue;
          }

          if (entity.status.phase !== LensKubernetesClusterStatus.DISCONNECTED) {
            await entity.disconnect();
          }

          excludeKubeconfigCluster(entity.spec.kubeconfigPath, entity.spec.kubeconfigContext);
        }

        action(() => {
          selectedItems.forEach((item) => checkboxSelectedIds.delete(item.getId()));
        })();
      },
    };
  },
});

export default catalogEntityStoreInjectable;
