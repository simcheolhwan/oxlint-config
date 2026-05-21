# @simcheolhwan/oxlint-config

oxlint config for [vite-plus](https://viteplus.dev/).

## Install

```bash
pnpm i -D @simcheolhwan/oxlint-config
```

To use TanStack Router/Query rules, install the corresponding plugins:

```bash
pnpm i -D @tanstack/eslint-plugin-router @tanstack/eslint-plugin-query
```

The `tsconfig.json` example below extends `@tsconfig/vite-react`:

```bash
pnpm i -D @tsconfig/vite-react
```

## Usage

### tsconfig.json

```json
{
  "extends": "@tsconfig/vite-react/tsconfig.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "types": ["vite-plus/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### vite.config.ts

```ts
import { lintConfig } from "@simcheolhwan/oxlint-config"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite-plus"

export default defineConfig({
  plugins: [tanstackRouter({ quoteStyle: "double" }), react()],
  resolve: { alias: { "@": new URL("src", import.meta.url).pathname } },
  server: { port: 5173, strictPort: true },
  fmt: { semi: false, sortImports: true, ignorePatterns: ["**/routeTree.gen.ts"] },
  lint: {
    ...lintConfig,
    ignorePatterns: ["**/routeTree.gen.ts"],
    jsPlugins: ["@tanstack/eslint-plugin-router", "@tanstack/eslint-plugin-query"],
    rules: {
      ...lintConfig.rules,
      "@tanstack/router/create-route-property-order": "error",
      "@tanstack/router/route-param-names": "error",
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/infinite-query-property-order": "error",
      "@tanstack/query/mutation-property-order": "error",
      "@tanstack/query/no-rest-destructuring": "error",
      "@tanstack/query/no-unstable-deps": "error",
      "@tanstack/query/no-void-query-fn": "error",
      "@tanstack/query/prefer-query-options": "error",
      "@tanstack/query/stable-query-client": "error",
    },
  },
  staged: { "*": "vp check --fix" },
})
```
