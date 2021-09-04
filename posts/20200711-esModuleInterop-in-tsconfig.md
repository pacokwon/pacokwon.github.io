---
title: 'Understanding the esModuleInterop option in tsconfig.json'
tags:
  - typescript
  - quicknote
---

Why is it that different patterns of imports are shown across typescript examples?

```typescript
import * as React from 'react';
import React from 'react';
```

Let us look at how the two examples are compiled to javascript code using `tsc`.

First, intialize a project with the following commands:

```bash
mkdir esminterop-example && cd esminterop-example   # create project directory
yarn init -y                                        # initialize npm project
yarn add react                                      # add react package (opt.)
yarn add -D typescript @types/node @types/react     # add typescript compiler and type definitions (req.)
touch star.ts plain.ts
```

Fill in the files `star.ts` and `plain.ts` with the following code:

`star.ts`

```typescript
import * as React from 'react';
console.log(React);
```

`plain.ts`

```typescript
import React from 'react';
console.log(React);
```

First, let's compile `star.ts` with `tsc` and see the output.

```bash
npx tsc star.ts
```

`star.js`

```javascript
'use strict';
exports.__esModule = true;
var React = require('react');
console.log(React);
```

All good. Now try to compile `plain.ts`, and an error will occur.

```bash
npx tsc plain.ts

plain.ts:1:8 - error TS1259: Module '"/Users/pacokwon/workspace/esminterop-example/node_modules/@types/react/index"' can only be default-imported using the 'esModuleInterop' flag

1 import React from 'react';
         ~~~~~

  node_modules/@types/react/index.d.ts:65:1
    65 export = React;
       ~~~~~~~~~~~~~~~
    This module is declared with using 'export =', and can only be used with a default import when using the 'esModuleInterop' flag.


Found 1 error.
```

The problem occurs because while `react` does not have a default export, our typescript file is attempting to default import it. One way of solving this issue might be to use the wildcard(asterisk) import above. Another way is to use the `--esModuleInterop` flag. Now let's see how the latter way works, by using that flag in our compiler.

```bash
npx tsc --esModuleInterop plain.ts
```

There are no errors, which is a good thing. The compiled file looks like this:

```javascript
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require('react'));
console.log(react_1['default']);
```

One can find out that a wrapper to the require is added. The wrapper provides additional logic, that allows flexible resolution between es6 modules and commonjs modules. It can also be observed that a "default" export or import is, from a commonjs module point of view, the value that corresponds to the key `"default"` in the `module.exports` object.

AFAIK, javascript packages are usually shipped with the original source code transpiled into using commonjs modules, so the `esModuleInterop` flag is a flag that I commonly use in my `tsconfig.json`.
