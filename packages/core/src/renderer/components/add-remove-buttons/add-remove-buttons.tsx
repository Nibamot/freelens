/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./add-remove-buttons.scss";

import { Button } from "@nibamot/button";
import { Icon } from "@nibamot/icon";
import { cssNames } from "@nibamot/utilities";
import React from "react";

import type { StrictReactNode } from "@nibamot/utilities";

export interface AddRemoveButtonsProps extends React.HTMLAttributes<any> {
  onAdd?: () => void;
  onRemove?: () => void;
  addTooltip?: StrictReactNode;
  removeTooltip?: StrictReactNode;
  /**
   * Additional buttons rendered alongside add/remove, for list-specific bulk
   * actions that don't fit the add/remove vocabulary (e.g. connect/disconnect).
   */
  extraButtons?: StrictReactNode[];
}

export class AddRemoveButtons extends React.PureComponent<AddRemoveButtonsProps> {
  renderButtons() {
    const { onRemove, onAdd, addTooltip, removeTooltip } = this.props;

    return [
      {
        onClick: onRemove,
        className: "remove-button",
        icon: "remove",
        tooltip: removeTooltip,
      },
      {
        onClick: onAdd,
        className: "add-button",
        icon: "add",
        tooltip: addTooltip,
      },
    ]
      .filter((button) => button.onClick)
      .map(({ icon, ...props }) => (
        <Button key={icon} big round primary {...props}>
          <Icon material={icon} />
        </Button>
      ));
  }

  render() {
    return (
      <div className={cssNames("AddRemoveButtons flex gap-2", this.props.className)}>
        {this.props.extraButtons}
        {this.renderButtons()}
      </div>
    );
  }
}
