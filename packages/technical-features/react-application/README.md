# @nibamot/react-application

## Usage

```sh
npm install @nibamot/react-application
```

```typescript
import { reactApplicationFeature } from "@nibamot/react-application";
import { registerFeature } from "@nibamot/feature-core";
import { createContainer } from "@ogre-tools/injectable";

const di = createContainer("some-container");

registerFeature(di, reactApplicationRootFeature);
```

## Extendability
