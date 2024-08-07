> System Configuration

```sh
- node: v20.5.0
- pnpm: v9.5.0
- tsc: v4.6.4
```

> Overview

```
- vue3(pinia; vue-router)
- typescript: v5.5.4
```

# 项目初始化

```sh
pnpm create vite ts-vue-vite-template --template vue
```

> `--template vue` 帮助我们做了一下事情：

安装 `@vitejs/plugin-vue` 进行 Vue SFC 文件的支持：

```sh
pnpm add @vitejs/plugin-vue
```

同时，修改 `vite.config.js` 文件：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    ...
  ],
})
```

# JS 转译

## `build.target` -> 解决打包后的 `ES` 版本问题

```ts
import { defineConfig } from 'vite'
...
export default defineConfig({
  ...,
  build: {
    target: 'es2015'
  }
})
```

## `@vitejs/plugin-legacy` + `terser` -> 解决浏览器不支持 `ESM` 特性的问题

```sh
pnpm add -D @vitejs/plugin-legacy terser
```

安装上述依赖之后，`vite.config.js` 的配置如下：

```js
import { defineConfig } from 'vite'
...
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    ...,
    legacy()
  ],
  ...
})
```

# TypeScript 支持

`Vite` 支持 `TypeScript` 的转译，但是不支持 `TypeScript` 的类型检查，对此，`Vite` 文档中提供了方案进行解决：

> pnpm add typescript@5.5.4 -D

## 1. 生产环境下

在 `package.json` 文件中 build 字段添加 `tsc --noEmit` 语句：

```json
{
  ...,
  "scripts": {
    ...,
    "build": "tsc --noEmit && vite build"
  },
  ...,
}
```

## 2. 开发环境下

### 2.1 通过命令安装 `TypeScript`, 并生成 `TS` 配置文件

```sh
pnpm add typescript -D
```

通过命令生成 `TS` 的配置文件:

```sh
tsc --init
```

初始化且修改后的 `tsconfig.json`:

```ts
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 2.2 通过插件 `vite-plugin-checker` 进行 TypeScript 的类型检查：

#### 2.2.1 安装 `vite-plugin-checker` 插件

```sh
pnpm add vite-plugin-checker -D
```

#### 2.2.2. 让 `vite-plugin-checker` 插件进行 TS 文件和 Vue 文件的类型检查

```sh
...
import { checker } from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    ...,
    checker({
      typescript: true,
      vueTsc: true,
    })
  ],
  ...,
})
```

### 2.3 如果遇到 TS 识别不了 Vue 文件的情况

创建文件 `shims-vue.d.ts`：

```ts
declare module '*.vue' {
    import { defineComponent } from "vue";
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}
```

### 2.4 `index.html` 文件中修改 `/src/main.js` 至 `/src/main.ts`

```html
<!doctype html>
<html lang="en">
  ...
  <body>
    ...
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

# 处理样式文件

## 安装 CSS 前处理器 - Less

```sh
pnpm add less -D
```

## 安装 CSS 后处理器 - PostCSS

安装 `postcss-preset-env` 插件依赖进行浏览器的兼容性处理：

```sh
pnpm add postcss-preset-env -D
```

之后，在 `vite.config.js` 中修改配置：

```js
...
import postcssPresetEnv from "postcss-preset-env"

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
      ],
    }
  },
  ...
})
```

# 处理图片文件

`Vite` 自动解析图片等资源。另外，因为本项目使用了 `TypeScript` ，所以导入 `.png` 等文件时，`TS` 可能无法解析，这时候需要在声明文件中进行模块声明，例如本项目中的 `shims-vue.d.ts` 文件：

```ts
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
```

# 配置 alias 路径别名

在 `vite.config.js` 文件中进行路径别名的配置：

```js
import path from 'path'
...

export default defineConfig({
  ...
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  ...
})

```

与之相对应的，我们也需要 `tsconfig.json` 中进行路径别名的配置：

```json
{
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  ...
}
```

# 引入 Vue-Router

安装 `vue-router` 插件依赖：

```sh
pnpm add -D vue-router@4
```

在 `src` 文件夹中创建对应的子文件夹：`layout`, `pages`, `router`,，分别用于放置项目结构，页面，路由等逻辑。

首先，我们先在 `src` 文件夹下创建 `layout` 子文件夹，在 `layout` 文件夹中创建 `index.vue`：

```vue
<script setup lang="ts"></script>
<template>
  <div class="layout">
    <div class="layout-header"></div>
    <div class="layout-content">
      <router-view />
    </div>
    <div class="layout-bottom"></div>
  </div>
</template>

<style lang="less" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &-header {
    width: 100%;
    height: 100px;
    background-color: blue;
  }
  &-content {
    width: 100%;
    flex-grow: 1;
    background-color: red;
  }
  &-bottom {
    width: 100%;
    height: 100px;
    background-color: yellow;
  }
}
</style>
```

之后，在 `src` 文件夹中创建 `pages` 文件夹，用于放置项目页面，创建完 `pages` 文件夹之后，我们再创建 `home` 和 `login` 两个子文件，分别在对应的文件夹中再创建 `index.vue`。

```vue
// src/pages/home/index.vue

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const navToLogin = () => {
  router.push({ path: "/login", query: {} });
};
</script>
<template>
  <div class="home">
    <p>homepage</p>
    <button @click="navToLogin">navToLogin</button>
  </div>
</template>

<style lang="less" scoped>
.home {
  width: 100%;
}
</style>
```

```vue
// src/pages/login/index.vue

<script setup lang="ts"></script>
<template>
  <div class="login">loginpage</div>
</template>

<style lang="less" scoped>
.login {
    width: 100%;
}
</style>
```

我们在 `src` 文件夹中创建 `router` 用于放置项目路由逻辑的模块。首先我们在 `router` 文件夹中创建一个 `index.ts` 文件，用于放置项目的整体逻辑，再创建一个 `modules` 文件夹，用于表示各个模块的路由逻辑编写，例如我们拟定本项目有一个主页模块，名为 `home`，那么我们就在 `modules` 文件夹中创建一个名为 `home` 的文件夹，用于放置主页模块。

```ts
// src/router/index.ts

import { createRouter, createWebHashHistory } from "vue-router";
const files = import.meta.glob("./modules/**/*.ts", { eager: true });
const modules = Object.values(files)
  .map((item: any) => item.default)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layout/index.vue"),
      children: modules,
      redirect: "/home",
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/pages/login/index.vue"),
        meta: {
            title: "login page"
        },
    },
  ],
});

export default router;
```

```ts
// src/router/modules/home.ts

const router = [
    {
        path: "/home",
        name: "home",
        component: () => import("@/pages/home/index.vue"),
        meta: {
            title: "home page"
        },
    },
];

export default router;
```

最后，我们将我们编写的 `router` 进行使用，将在 `main.ts` 中进行使用：

```ts
// src/main.ts

import { createApp } from 'vue'
import router from "@/router/index";
...

const app = createApp(App)
app.use(router)
...

```

## 可能会遇到的报错与解决方案

### 1. Property 'glob' does not exist on type 'ImportMeta'.ts

```ts
{
  "compilerOptions": {
    ...
    "types": [
      "vite/client"
    ]
  },
  ...
}
```

### 2. Cannot find module '@/router/index' or its corresponding type declarations.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    ...
  },
  ...
}
```

# 引入 Pinia

首先，我们状态 `Vue3` 项目官方推荐的状态数据管理器 - `Pinia`：

```sh
pnpm add pinia
```

在 `src` 文件夹下创建 `store` 子文件夹，用于放置项目的状态数据，同时，在 `store` 文件夹中，创建 `index.ts` 文件和 `modules` 文件夹，`modules` 文件夹用于放置不同模块的状态数据，例如本次项目中，我们将创建一个 `counter` 的全局状态数据模块：

```ts
// src/store/modules/counter.ts

import { ref, reactive, computed, } from 'vue'
import { defineStore } from 'pinia'

const storeId = 'counter'
const storeSetup = () => {
  const count = ref<number>(0);
  const modifyCount = (newCount: number = 0) => {
    count.value = newCount;
  };
  return {
    count,
    modifyCount,
  }
}

const useCounterStore = defineStore(storeId, storeSetup);
export default useCounterStore
```

```ts
// src/store/index.ts

import { createPinia } from 'pinia'
import useCounterStore from './modules/counter'

const core = createPinia();

export default {
  core,
  useCounterStore,
};
```

然后，我们将在项目中使用它：

```ts
// src/main.ts

...

import pinia from '@/store/index'

...

const { core: store } = pinia;

...
app.use(store);
...

```

最后我们将在需要使用 `counter` 数据的业务页面中进行使用：

```vue
// src/pages/home/index.vue

<script setup lang="ts">
...
import store from "@/store";
const { useCounterStore } = store;
const counterStore = useCounterStore();
...
const handleCount = (newVal: number = 0) => {
  counterStore.modifyCount(counterStore.count + newVal);
};
</script>
<template>
  <div class="home">
    ...
    <p>counter: {{ counterStore.count }}</p>
    <div class="button-group">
      <button @click="handleCount(1)">Add</button>
      <button @click="handleCount(-1)">Minus</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home {
  width: 100%;
  .button-group {
    display: flex;
    justify-content: center;
    & > button:nth-of-type(2) {
      margin-left: 10px;
    }
  }
}
</style>

```

# 引入 Vant

首先，我们安装本项目所使用的 `UI` 库 - `Vant`：

```sh
pnpm add vant
```

然后我们使用 `unplugin-vue-components` 进行 `Vant` 库的按需导入：

```sh
pnpm add unplugin-vue-components -D
```

```js
...
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  ...
  plugins: [
    ...
    Components({
      resolvers: [
        VantResolver()
      ]
    })
  ],
  ...
})
```

最后，我们在我们所需要的业务页面中进行 `Vant` 库的使用：

```vue
...

<template>
  <div class="home">
    ...
    <div class="button-group">
      <van-button type="primary" @click="handleCount(1)">Add</van-button>
      <van-button type="primary" @click="handleCount(-1)">Minus</van-button>
    </div>
  </div>
</template>

...

```

# 移动端适配

安装依赖包 `postcss-px-to-viewport-8-plugin`

```sh
pnpm add postcss-px-to-viewport-8-plugin -D
```

在 `vite.config.js` 中进行插件配置：

```js
...
import postcssPxToViewport8Plugin from 'postcss-px-to-viewport-8-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        ...
        postcssPxToViewport8Plugin({
          unitToConvert: 'px',
          viewportWidth: 375,
          unitPrecision: 5,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines', '.ig-'],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          include: undefined,
          exclude: [/node_modules/],
          landscape: false,
          landscapeUnit: 'vw',
          landscapeWidth: 568
        })
      ]
    }
  },
  ...
})

```

## 行内样式进行适配

首先，我们现在 `src` 文件夹中创建一个 `plugins` 文件夹，用于放置自定义编写的插件，这里，我们创建一个 `postcss-style-px-to-viewport-plugin` 的插件文件，内容如下：

```ts

interface IdefaultsProp {
    unitToConvert: string;
    viewportWidth: number;
    unitPrecision: number;
    viewportUnit: string;
    fontViewportUnit: string;
    minPixelValue: number;
}

const defaultsProp: IdefaultsProp = {
    unitToConvert: "px",
    viewportWidth: 375,
    unitPrecision: 5,
    viewportUnit: "vw",
    fontViewportUnit: "vw",
    minPixelValue: 1,
};

function toFixed(number: number, precision: number) {
    const multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
    return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function createPxReplace(
    viewportSize: number,
    minPixelValue: number,
    unitPrecision: number,
    viewportUnit: any
) {
    return function ($0: any, $1: any) {
        if (!$1) return;
        const pixels = parseFloat($1);
        if (pixels <= minPixelValue) return;
        return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit;
    };
}
const templateReg: RegExp = /([\s\S]+)/gi;
const pxGlobalReg: RegExp = /(\d+)px/gi;

function postcssStylePxToViewportPlugin(customOptions: IdefaultsProp = defaultsProp) {
    return {
        name: "postcss-style-px-to-viewport-plugin",
        transform(code: any, id: any) {
            customOptions = Object.assign(defaultsProp, customOptions);
            if (/.vue$/.test(id)) {
                let _source = "";
                if (templateReg.test(code)) {
                    _source = code.match(templateReg)[0];
                }
                if (pxGlobalReg.test(_source)) {
                    const $_source = _source.replace(
                        pxGlobalReg,
                        createPxReplace(
                            customOptions.viewportWidth,
                            customOptions.minPixelValue,
                            customOptions.unitPrecision,
                            customOptions.viewportUnit
                        )
                    );

                    code = code.replace(_source, $_source);
                }
            }
            return { code };
        },
    };
}
export default postcssStylePxToViewportPlugin;
```

随后，我们在 `vite.config.js` 中进行引入且使用：

```js
...
import vue from '@vitejs/plugin-vue'
...
import postcssStylePxToViewportPlugin from './src/plugins/postcss-style-px-to-viewport-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        ...
      ]
    }
  },
  plugins: [
    postcssStylePxToViewportPlugin({
      unitToConvert: 'px',
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      minPixelValue: 1
    }),
    vue(),
    ...
  ],
  ...
})

```

---

# 环境变量配置

我们在 `src` 文件夹中创建 `env` 子文件夹，用于放置 `env` 相关环境变量，在 `env` 文件夹中，我们将创建 `.env`，`.env.development`，`.env.testing`，`.env.production` 三个不同环境下的文件，不同的文件夹中，我们写入同一变量的不同值，举个例子，我们将创建一个 `VITE_ENV_TEXT_MODE`，用于标识当前的 `env` 环境名称：

```sh
// .env

VITE_ENV_TEXT=ENV
VITE_APP_VERSION=$npm_package_version
```

```sh
// .env.development

VITE_ENV_TEXT_MODE=DEV
```

```sh
// .env.testing

VITE_ENV_TEXT_MODE=TEST
```

```sh
// .env.production

VITE_ENV_TEXT_MODE=PROD
```

在对应的业务页面中，我们将于下列方式进行使用：

```vue
<script setup lang="ts">
onMounted(() => {
  console.log(`import.meta.env.VITE_ENV_TEXT_MODE: `, import.meta.env.VITE_ENV_TEXT_MODE);
  console.log(`import.meta.env.VITE_APP_VERSION: `, import.meta.env.VITE_APP_VERSION);
})
</script>
```

# 引入 axios

我们将安装依赖包 `axios` 进行本项目的异步请求，首先，通过下列进行 `axios` 的安装：

```sh
pnpm add axios -D
```

然后我们在 `src` 文件夹中创建 `services` 子文件夹，用于放置异步请求的功能模块。在 `services` 文件夹中，我们将创建 `index.ts` 和 `request.ts` 两个文件，前者用于不同业务功能的统一导出，后者用于二次封装 `axios` 的请求：

```ts
// src/services/request.ts

import axios from 'axios';
import type { AxiosRequestConfig } from "axios"

const TIMEOUT = 30 * 1000;

export default function request(options: AxiosRequestConfig) {
    const headers = {
        'Content-Type': 'application/json',
    };
    return new Promise((resolve, reject) => {
        const args = {
            headers,
            timeout: TIMEOUT * 1,
        };
        const instance = axios.create(args);
        instance.interceptors.request.use((config) => config, (error) => Promise.reject(error));
        instance.interceptors.response.use((response) => {
            return response;
        }, (error) => Promise.reject(error));
        instance(options)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
```

```ts
// src/services/index.ts

import request from "./request"

export const queryToken = async () => {
    const url = "https://xxx"
    const response = await request({
        url,
    });
    return response;
}
```

随后，我们可以在对应的业务页面中进行使用：

```vue
<script setup lang="ts">
...

import { queryToken } from "@/services/index";

...

onMounted(async () => {

  ...

  const response = await queryToken();
  console.log(`response: `, response);
});
</script>

...

```

# 引入 ESLint 和 Prettier 格式化代码

## ESLint 代码质量

```sh
pnpm add eslint@8.47.0 eslint-config-prettier@9.0.0 eslint-plugin-prettier@5.0.0 eslint-plugin-vue@9.17.0 @typescript-eslint/eslint-plugin@6.4.0 @typescript-eslint/parser@6.4.0 -D
```

- eslint@8.47.0
- eslint-plugin-vue@9.17.0
- @typescript-eslint/eslint-plugin@6.4.0
- @typescript-eslint/parser@6.4.0

```sh
touch .eslintrc.json
```

修改 `.eslintrc.json` 文件：

```json
// .eslintrc.json

{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential"
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off"
    }
}
```

## prettier

```sh
pnpm add -D prettier@3.0.2 eslint-config-prettier@9.0.0 eslint-plugin-prettier@5.0.0
```

- prettier@3.0.2
- eslint-config-prettier@9.0.0
- eslint-plugin-prettier@5.0.0

再次修改 `.eslintrc.json` 文件：

```json
// .eslintrc.json

{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "prettier",
        "plugin:prettier/recommended"
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    "rules": {
        "prettier/prettier": ["error", { "cr": "off" }],
        "@typescript-eslint/no-explicit-any": "off",
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-undef":"off"
    }
}
```

# 引入 Commitizen、Husky 和 Standard-Version 规范提交

## 添加 commitlint

```sh
pnpm i -D @commitlint/cli @commitlint/config-conventional
```

新建文件 `commitlint.config.js`

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

## Husky 钩子触发校验机制

### 自动初始化 husky

> 记得 初始化 `git` 本地仓库

```sh
pnpm dlx husky-init && pnpm install

pnpm dlx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

将 `.husky/pre-commit` 中 `npm run test` 修改成 `npm run lint`

### 手动初始化 husky

安装 `husky`:

```sh
pnpm i -D husky
```

首先在 package.json 中添加

> 也可以同等命令操作：npm pkg set scripts.prepare="husky install"

```json
"scripts": {
	...
	"prepare": "husky install"
}
```

执行指令:

```sh
pnpm run prepare
```

## Commitizen 日志

```sh
pnpm i -D conventional-changelog-cli
```

在 `package.json` 中添加 `changelog` 命令:

```json
"scripts": {
    ...
	"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
}
```

## cz

`package.json` 文件中添加 `cz` 命令，执行 `commitizen` 代码提交规范

```sh
npm pkg set scripts.cz="cz"
```

## Changelong

```sh
pnpm i -D standard-version
```

```sh
npm pkg set scripts.release="standard-version"
```

创建 `.versionrc` 文件:

```json
{
  "types": [
    { "type": "feat", "section": "✨ Features | 新功能"
    },
    { "type": "fix", "section": "🐛 Bug Fixes | Bug 修复"
    },
    { "type": "init", "section": "🎉 Init | 初始化"
    },
    { "type": "docs", "section": "✏️ Documentation | 文档"
    },
    { "type": "style", "section": "💄 Styles | 风格"
    },
    { "type": "refactor", "section": "♻️ Code Refactoring | 代码重构"
    },
    { "type": "perf", "section": "⚡ Performance Improvements | 性能优化"
    },
    { "type": "test", "section": "✅ Tests | 测试"
    },
    { "type": "revert", "section": "⏪ Revert | 回退", "hidden": true
    },
    { "type": "build", "section": "📦‍ Build System | 打包构建"
    },
    { "type": "chore", "section": "🚀 Chore | 构建/工程依赖/工具"
    },
    { "type": "ci", "section": "👷 Continuous Integration | CI 配置"
    }
  ]
}
```
