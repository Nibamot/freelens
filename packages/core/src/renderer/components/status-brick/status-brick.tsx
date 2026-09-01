/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./status-brick.scss";

import { withTooltip } from "@nibamot/tooltip";
import { cssNames } from "@nibamot/utilities";
import React from "react";

import type { StrictReactNode } from "@nibamot/utilities";

export interface StatusBrickProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: StrictReactNode;
}

export const StatusBrick = withTooltip(({ className, ...elemProps }: StatusBrickProps) => (
  <div className={cssNames("StatusBrick", className)} {...elemProps} />
));
