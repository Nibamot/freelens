/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { Icon } from "@freelensapp/icon";
import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import { useState } from "react";
import catalogEntityRegistryInjectable from "../../../api/catalog/entity/registry.injectable";
import { SearchInput } from "../../input/search-input";
import { Menu, MenuItem } from "../../menu";
import styles from "./cluster-search.module.scss";

import type { CatalogEntityRegistry } from "../../../api/catalog/entity/registry";
import type { CatalogEntity } from "../../../api/catalog-entity";

interface Dependencies {
  entityRegistry: CatalogEntityRegistry;
}

const clusterSearchId = "status-bar-cluster-search";

const NonInjectedClusterSearch = observer(({ entityRegistry }: Dependencies) => {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = () => setOpened((prev) => !prev);
  const onMenuOpen = () => {
    setSearch("");
    toggle();
  };

  const clusters = entityRegistry.filteredItems.filter((entity) => entity.kind === "KubernetesCluster");
  const query = search.trim().toLowerCase();
  const matches = query ? clusters.filter((cluster) => cluster.getName().toLowerCase().includes(query)) : clusters;

  const activate = (cluster: CatalogEntity) => {
    setOpened(false);
    entityRegistry.onRun(cluster);
  };

  return (
    <div id={clusterSearchId} className={styles.ClusterSearch} data-testid="status-bar-cluster-search">
      <Icon material="search" small />
      <span className={styles.label}>Search clusters</span>
      <Menu
        usePortal
        htmlFor={clusterSearchId}
        isOpen={opened}
        open={onMenuOpen}
        close={toggle}
        closeOnClickItem={false}
        position={{ top: true, left: true }}
        className={styles.menu}
      >
        <div className={styles.searchBox}>
          <SearchInput
            bindGlobalFocusHotkey={false}
            placeholder="Search clusters..."
            autoComplete="off"
            value={search}
            onChange={(value) => setSearch(value)}
            onKeyDown={(evt) => {
              if (evt.key === "Enter" && matches[0]) {
                activate(matches[0]);
              }
            }}
          />
        </div>
        {matches.length === 0 ? (
          <MenuItem disabled>No clusters found</MenuItem>
        ) : (
          matches.map((cluster) => (
            <MenuItem key={cluster.getId()} onClick={() => activate(cluster)}>
              {cluster.getName()}
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
});

export const ClusterSearch = withInjectables<Dependencies>(NonInjectedClusterSearch, {
  getProps: (di) => ({
    entityRegistry: di.inject(catalogEntityRegistryInjectable),
  }),
});
