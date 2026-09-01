# @nibamot/keyboard-shortcuts

This Feature enables keyboard shortcuts in Lens

## Usage

```sh
npm install @nibamot/keyboard-shortcuts
```

```typescript
import { keyboardShortcutsFeature } from "@nibamot/keyboard-shortcuts";
import { registerFeature } from "@nibamot/feature-core";
import { createContainer } from "@ogre-tools/injectable";

const di = createContainer("some-container");

registerFeature(di, keyboardShortcutsFeature);
```

## Extendability
