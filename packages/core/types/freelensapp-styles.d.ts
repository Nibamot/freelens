/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// The @nibamot/*/styles entries resolve to .scss sources and are imported
// only for their side effects; Vite handles them at build time. TypeScript 7
// checks side-effect imports (TS2882), so each specifier needs an ambient
// declaration. Wildcard module patterns allow a single asterisk, which
// "@nibamot/*/styles" would exceed, so the specifiers are enumerated.
declare module "@nibamot/animate/styles";
declare module "@nibamot/button/styles";
declare module "@nibamot/core/styles";
declare module "@nibamot/error-boundary/styles";
declare module "@nibamot/icon/styles";
declare module "@nibamot/notifications/styles";
declare module "@nibamot/resizing-anchor/styles";
declare module "@nibamot/spinner/styles";
declare module "@nibamot/tooltip/styles";
