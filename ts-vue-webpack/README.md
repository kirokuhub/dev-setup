# 初始化项目
## 初始化package.json
```typescript
npm init -y
```
## 安装Webpack
```typescript
pnpm i -D webpack webpack-cli webpack-dev-server
```
## 创建 HTML 文件
### 安装插件
```typescript
pnpm i -D html-webpack-plugin
```
### 新建 Public 文件夹 以及初始化
```typescript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0" />
    <link rel="icon" href="./favicon.ico" type="image/png" />
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>

<body>
    <div id="app"></div>
</body>

</html>
```
## 新建 src 和 config 文件夹, 配置开发服务器和配置HtmlWebpackPlugin插件
```typescript
console.log("Hello, World!");
```
```typescript
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "../src/main.js"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "./js/[name].[chunkhash].js"
    },
    devServer: {
        hot: true,
        open: false,
        port: 8080,
        host: "localhost",
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: "./public/index.html",
          filename: "index.html",
          title:'JS-Vue-Webpack Template',
          inject: "body"
        })
      ]
};
```
## 在 package.json 的 script 中添加命令
```typescript
{
  ...
  "scripts": {
    "dev": "webpack server --config ./config/webpack.config.js  --progress --color"
  },
  ...
}

```
### 执行 script 命令
```typescript
pnpm dev
```

---

# 分环境打包配置
## 先安装 cross-env，dotenv 和 webpack-merge
```typescript
pnpm i -D cross-env dotenv webpack-merge
```
## 根目录创建.env等文件
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1691915172286-aff27b66-6cb2-4106-b10b-4b979e58b281.png#averageHue=%2329292c&clientId=u01e7a84c-7c66-4&from=paste&height=208&id=u0a1b08be&originHeight=122&originWidth=224&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4746&status=done&style=none&taskId=ud4deb357-8e2b-48fa-a9df-fb48ae8611f&title=&width=381)
```typescript
VUE_APP_TITLE = "TS-Vue-Webpack"
```
```typescript
NODE_ENV = 'development'
```
```typescript
NODE_ENV = 'production'
```
```typescript
NODE_ENV = 'testing'
```
## 区分开发环境和生产环境的webpack配置，将需要区分环境的变量导入项目中
```typescript
const path = require("path");
const webpack = require("webpack");
const envMode = process.env.envMode;

require("dotenv").config({ path: `./env/.env` });
require("dotenv").config({ path: `./env/.env.${envMode}` });

const prefixRE = /^VUE_APP_/;
let env = {};
for (const key in process.env) {
    if (key == "NODE_ENV" || key == "BASE_URL" || prefixRE.test(key)) {
        env[key] = JSON.stringify(process.env[key]);
    }
}

module.exports = {
    entry: path.resolve(__dirname, "../src/main.js"),
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                ...env
            },
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false
        }),
    ]
};
```
```typescript
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const envMode = process.env.envMode;

module.exports = merge(baseConfig, {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "./js/[name].[chunkhash].js"
    },
    devServer: {
        hot: true,
        open: false,
        port: 8080,
        host: "localhost",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            title: 'TS-Vue-Webpack ' + envMode + " Template",
            inject: "body"
        }),
    ]
});
```
```typescript
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const envMode = process.env.envMode;

module.exports = merge(baseConfig, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "./js/[name].[chunkhash].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            title: 'TS-Vue-Webpack ' + envMode + " Template",
            inject: "body"
        }),
    ]
});
```
## 修改package.json的scipt
```json
{
  ...
  "scripts": {
    "dev": "cross-env envMode=dev webpack serve --config ./config/webpack.dev.js  --color ",
    "testing": "cross-env envMode=testing webpack --config ./config/webpack.prod.js  --color",
    "build": "cross-env envMode=prod webpack --config ./config/webpack.prod.js  --color"
  },
  ...
}

```


---

# 配置Babel
## 安装Babel依赖
```javascript
pnpm i -D babel-loader @babel/core @babel/preset-env @babel/preset-typescript @babel/runtime @babel/runtime-corejs3 @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
```

> @babel-runtime 和 @babel/plugin-transform-runtime 的区别：[https://segmentfault.com/q/1010000012041869](https://segmentfault.com/q/1010000012041869)

> @babel-runtime-corejs3的作用[ 一文搞懂 core-js@3、@babel/polyfill、@babel/runtime、@babel/runtime-corejs3 的作用与区别 ]：  [https://juejin.cn/post/7062621128229355528](https://juejin.cn/post/7062621128229355528)

## 创建 .babelrc 文件
```javascript
touch .babelrc
```
```javascript
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": "> 1%, last 2 versions, not ie <= 8",
        "useBuiltIns": "usage",
        "corejs": "3"
      }
    ],
    [
      "@babel/preset-typescript",
      {
        "isTSX": true,
        "allowNamespaces": true,
        "allExtensions": true
      }
    ]
  ],
    "plugins": [["@babel/plugin-transform-runtime", { "corejs": 3 }]]
}
```

## 修改 webpack.base.js 文件
config 文件夹 中创建 utils.js 文件
```javascript
const path = require("path");

module.exports = {
	resolveApp: (p) => path.resolve(__dirname, "../" + p),
};
```
```javascript
...

const { resolveApp } = require('./utils');

...

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                include: resolveApp('src'),
            },
        ]
    },
    ...
};
```

---

# 引入Vue框架
## 一、安装识别解析 vue 文件的依赖
```shell
pnpm i -D vue-loader @vue/compiler-sfc

pnpm i -S vue
```
## 二、创建 vue 文件，并且在入口文件创建 vue 实例
入口文件 main.ts
```typescript
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
app.mount("#app");
```
```vue
<script setup lang='ts'>
</script>

<template>
  <div class="app-page">
    App vue
  </div>
</template>
```
## 三、配置 webpack 可以识别 vue 文件
同样是通用配置，在 `webpack.base.js` 中配置：
```javascript
...

const { VueLoaderPlugin } = require('vue-loader/dist/index');

...

module.exports = {
  
  ...
    
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      
      ...
      
    ]
  },
  plugins: [
      
    ...
    
    new VueLoaderPlugin()
  ]
};
```
## 四、创建 shims-vue.d.ts
```javascript
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const vueComponent: DefineComponent<{}, {}, any>;
    export default vueComponent;
}
```
## 五、浏览器查看阶段性成果
```javascript
pnpm run dev
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692266078524-618d49d3-a48b-47ab-9fc5-c261e973a95b.png#averageHue=%23777675&clientId=ube55ce09-b0c3-4&from=paste&height=134&id=u233758d1&originHeight=134&originWidth=242&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5813&status=done&style=none&taskId=uc5622fb8-dd61-4b61-9975-a4dbf7699d4&title=&width=242)

---

# 处理样式文件[less]
## 一、安装依赖
```javascript
pnpm i -D css-loader less less-loader style-loader mini-css-extract-plugin
```
## 二、配置webpack
还是在通用文件中进行配置：
```javascript
...

module: {
    rules: [
        ...
        {
            test: /\.css$/,
            use: [
                "style-loader", "css-loader"],
        },
        {
            test: /\.less$/,
            use: [
                "style-loader", "css-loader", "less-loader"],
        },
        ...
    ],
},

...
```

```javascript
...

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

...

module: {
    rules: [
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
    ],
},



plugins: [
    ...
  
    new MiniCssExtractPlugin({
        filename: "assets/styles/[contenthash].css"
    })
],

...
```

## 三、使用 postcss 插件给 CSS 添加兼容性前缀
```powershell
pnpm i -D postcss-loader autoprefixer
```

### 添加 postcss-loader
```powershell
...

  module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                  ...
                  "postcss-loader"
              ],
          },
          {
              test: /\.less$/,
              use: [
                  ... 
                  "postcss-loader", 
                  ...
              ],
          },
      ],
  },
```
```powershell
...

module: {
    rules: [
        {
            test: /\.css$/,
            use: [
              ...
              "postcss-loader"
            ],
        },
        {
            test: /\.less$/,
            use: [
              ...
              "postcss-loader", 
              ...
            ],
        },
    ],
}

...
```
### 新建 postcss.config.js
```powershell
module.exports = () => {
  return {
    plugins: {
      autoprefixer: {}
    }
  };
};
```
### 新建 .browserslistrc
```powershell
> 0.1%
last 2 versions
```

---

# 处理图片文件
## 在 modele.rules 中进行配置
```javascript
...

module.exports = {
  ...
  module: {
    rules: [
      ...
      
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        }
      }
      
      ...
    ]
  },
  ...
};
```

## 新建 assets 文件夹，引入随机两图片文件
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692362922508-4e192486-9fb8-45cc-8ec9-98ea1a6cf769.png#averageHue=%23212b33&clientId=u0ffb7701-00b1-4&from=paste&height=375&id=u58ae27fc&originHeight=161&originWidth=190&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6493&status=done&style=none&taskId=ua988e457-4b82-4613-b42b-7eb45c29cc8&title=&width=442)
## App.vue 中引入图片文件
```vue
<script setup lang='ts'>
</script>

<template>
  <div class="app-wrapper">
    ...
    <img src="./assets/avatar.jpg" style="width: 100px;"/>
    <img src="./assets/star.jpg" style="width: 100px;"/>
  </div>
</template>

<style lang="less" scoped>
  .app-wrapper {
    display: flex;

    .text {
      color: #ff0000;
    }
  }
</style>
```

## 预览代码运行
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692601254061-9683864c-bc18-4ba0-b92a-89e456e913bd.png#averageHue=%23e2ca8e&clientId=u97cc35e0-2b24-4&from=paste&height=289&id=u3d4f135c&originHeight=289&originWidth=458&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23369&status=done&style=none&taskId=uae3421b5-8b82-4b54-9d52-97ea8a968a8&title=&width=458)

---

# 配置 alias 路径别名
## 修改 webpack.base.js 文件
```javascript
...

module.exports = {
  ...
  module: {
    ...
  },
  plugins: [
    ...
  ],

  resolve: {
    alias: {
      "@": resolveApp("src"),
      "@images": resolveApp("src/assets/images"),
    }
  },
  ...
};
```
## 修改 App.vue 中的图片引用
```vue
<script setup lang='ts'>
</script>

<template>
  <div class="app-wrapper">
    <span class="text">App vue</span>
    <img src="@images/avatar.jpg" style="width: 100px;"/>
    <img src="@images/star.jpg" style="width: 100px;"/>
  </div>
</template>

<style lang="less" scoped>
  ...
</style>
```

---

# 添加 TypeScript 支持
## 安装依赖
```javascript
pnpm i -D @babel/preset-typescript ts-loader typescript fork-ts-checker-webpack-plugin
```

## 配置文件修改 以及 tsconfig.json 添加
修改 webpack.dev.js
```javascript
...

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const {resolveApp} = require("./utils");


module.exports = merge(baseConfig, {
    ...
      
    module: {
        rules: [
            ...
          
            {
                test: /\.(t|j)sx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true,
                        }
                    }
                ],
                include: resolveApp('src'),
            },
        ],
    },
  
    ...
      
    plugins: [
        ...
      
        new ForkTsCheckerWebpackPlugin()
    ],
});

```

在上面的配置中，我们关闭了类型检测，即 `transpileOnly: true` ，以减少编译时间，我们可以将类型检测的职责交给另一个插件来帮助我们完成，这个插件会开启另一个线程来帮助我们进行类型检测。

修改 webpack.prod.js
```javascript
...

const {resolveApp} = require("./utils");

module.exports = merge(baseConfig, {
    ...
      
    module: {
        rules: [
            ...
          
            {
                test: /\.(t|j)sx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                ['@babel/preset-typescript', {
                                    allExtensions: true
                                }]
                            ]
                        }
                    }
                ],
                include: resolveApp('src'),
            },
        ],
    },
    plugins: [
        ...
    ],
});

```

添加 tsconfig.json 文件
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noEmit": true,
    "experimentalDecorators": true,

    "baseUrl": ".",
    "paths": {
        "@/*": ["./src/*"],
    }
  },
  "include": [
    "src"
  ],
  "exclude": ["node_modules", "__test__"]
}
```

## 修改 App.vue 且使用浏览器预览
```vue
<script setup lang='ts'>
  import {ref} from "vue";

  interface IPerson {
    name: string;
    age: number;
  }

  const name: string = "Jalever";
  const age: number = 27;

  const person = ref<IPerson>({
    name,
    age,
  });
</script>

<template>
  <div class="app-wrapper">
    <span class="text">App vue - {{person.age}}</span>
    <img src="@images/avatar.jpg" style="width: 100px;"/>
    <img src="@images/star.jpg" style="width: 100px;"/>
  </div>
</template>
<style lang="less" scoped>
  .app-wrapper {
    display: flex;
  }
</style>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692367849911-df96df64-e6b8-4ea2-89ce-28b9cdee4e2f.png#averageHue=%239c9996&clientId=u0ffb7701-00b1-4&from=paste&height=469&id=u718765ef&originHeight=217&originWidth=333&originalType=binary&ratio=2&rotation=0&showTitle=false&size=43711&status=done&style=none&taskId=ub682d045-0957-4b03-8ccb-2a03c674849&title=&width=719.5)

---

# 打包时清除上次构建 dist 目录
```javascript
...

module.exports = merge(baseConfig, {
  ...
    
  output: {
    ...
    clean: true,
  },
  module: {
    ...
  },
  plugins: [
    ...
  ],
});

```

---

# 配置引入字体文件
## 修改配置文件
```javascript
...

module.exports = {
    ...
    module: {
        rules: [
            ...
          
            {
                test: /\.(eot|svg|ttf|woff|woff2|)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash:8].[name][ext]'
                }
            },
        ]
    },
    plugins: [
        ...
    ],
    resolve: {
        ...
    },
    optimization: {
        ...
    }
};
```
## 创建 fonts.css 文件，并在 main.ts 中引入
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692434005939-65a6057a-912f-42e4-b1c3-df34e9e7bf7d.png#averageHue=%2327292b&clientId=ubcd1b2a5-c630-4&from=paste&height=154&id=u00be4fc3&originHeight=308&originWidth=558&originalType=binary&ratio=2&rotation=0&showTitle=false&size=108785&status=done&style=none&taskId=u23f79db7-9085-4b2a-8c82-55ca5b72bdd&title=&width=279)

main.ts 中引入
```javascript
...

import '@/assets/fonts/font.css';

...
```
## 使用字体
```javascript
<script setup lang='ts'>

...
  
</script>

<template>
  <div class="app-wrapper">
    <span class="text">App vue - {{person.age}}</span>
    ...
  </div>
</template>
<style lang="less" scoped>
.app-wrapper {
  display: flex;
  
  .text {
    font-family: "SourceHanSansCN-Medium";
  }
}
</style>
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692434141604-b1015f73-adea-48a2-8257-c1dea8639eac.png#averageHue=%23acabaa&clientId=ubcd1b2a5-c630-4&from=paste&height=213&id=uefa25aff&originHeight=301&originWidth=1462&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80411&status=done&style=none&taskId=u0a43c48f-fcf8-48c9-ba80-eeb02ffde96&title=&width=1036)

---

# 引入 Vue-Router
> mkdir ./src/views ./src/views/index ./src/views/index/index ./src/views/mine ./src/views/mine/index && touch ./src/views/index/main.vue ./src/views/index/index/index.vue ./src/views/mine/main.vue ./src/views/mine/index/index.vue

## 修改视图文件夹 views
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692439368447-e35a30ac-9fe9-4eb5-bfea-eb126f70be0a.png#averageHue=%2327272a&clientId=ubcd1b2a5-c630-4&from=paste&height=342&id=u21213344&originHeight=199&originWidth=296&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7557&status=done&style=none&taskId=u2c6ac9d2-918f-4def-a869-fa655b6ddb8&title=&width=509)
### views/index/main.vue
```javascript
<template>
  <div class="index-main-wrapper">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>
  
<style lang="less" scoped>
.index-main-wrapper {
  min-height: 100vh;
}
</style>
  
```
### views/index/index/index.vue
```javascript
<template>
    <div class="index-wrapper">
        <div class="title">index页面</div>
        <button class="button" @click="goToHome">前往Mine页面</button>
    </div>
</template>
<script setup lang="ts">
import { useRouter, Router } from "vue-router";

const router: Router = useRouter();
function goToHome(): void {
    router.push("/mine");
}
</script>
<style lang="less" scoped>
.index-wrapper {
    .title {
        color: #00ffff;
    }

    .button {
        padding: 10px;
    }
}
</style>
```
### views/mine/main.vue
```javascript
<template>
    <div class="mine-main-wrapper">
      <router-view />
    </div>
  </template>
  
  <style lang="less" scoped>
  .mine-main-wrapper {
    min-height: 100vh;
  }
  </style>
  
```
### views/mine/index/index.vue
```javascript
<template>
    <div class="mine-wrapper">
        <div class="title">Mine页面</div>
        <button class="button" @click="goToHome">前往index首页</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter, Router } from "vue-router";
const router: Router = useRouter();
function goToHome() {
    router.push("/");
}
</script>

<style lang="less" scoped>
.mine-wrapper {
    .title {
        color: #ff0000;
    }

    .button {
        padding: 10px;
    }
}
</style>

```
## 创建 typings 文件夹
> mkdir ./src/typings && touch ./src/typings/shims-vue.d.ts

![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692439613464-65c66a8a-95a1-4b2c-a78c-f59249f15b20.png#averageHue=%23173245&clientId=ubcd1b2a5-c630-4&from=paste&height=122&id=u84b020bf&originHeight=45&originWidth=280&originalType=binary&ratio=2&rotation=0&showTitle=false&size=2660&status=done&style=none&taskId=u5fa3760d-ecc0-4f33-bd85-24e1956a34c&title=&width=762)
```javascript
import VueRouter from 'vue-router';
import { Route } from 'vue-router';
import { Store } from 'vuex';
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $store: Store<any>;
  }
}
```
## 修改 shims-vue.d.ts 文件
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692439675404-31950cac-1e25-4ff9-a0fe-e54fd0fee08a.png#averageHue=%230a3858&clientId=ubcd1b2a5-c630-4&from=paste&height=359&id=u728692a8&originHeight=182&originWidth=303&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7325&status=done&style=none&taskId=u81eac83f-5e83-4c92-a920-906054501ea&title=&width=598.5)
```javascript
declare module '*.vue' {
    import { defineComponent } from 'vue';

    const component: ReturnType<typeof defineComponent>;
    export default component;
}
```
## 创建路由文件夹 router
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692438888557-6e772b6b-ed4b-40b9-a695-8c4d4ccba6f1.png#averageHue=%23222a31&clientId=ubcd1b2a5-c630-4&from=paste&height=366&id=ue61cf9b7&originHeight=179&originWidth=294&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7634&status=done&style=none&taskId=uc6bb46e6-d7c8-4d0b-a357-23f060f7c67&title=&width=601)
### 创建 router/helpers/guard.ts
```javascript

import { Router } from "vue-router"

const guard = (router: Router): void => {
    router.beforeEach((to, from, next) => {
        next();
    });
};

export default guard;

```
### 创建 router/helpers/index.ts
```javascript
import guard from './guard';

export default {
  guard,
};
```
### 创建 router/modules/index.ts
```javascript
export default {
  path: '/',
  component: () => import('@/views/index/main.vue'),
  redirect: '/index',
  meta: {
    keepAlive: false,
  },
  children: [
    {
      path: '/index',
      name: '/index',
      component: () => import('@/views/index/index/index.vue'),
      meta: {
        keepAlive: false,
      },
    },
  ],
};
  
```
> 这部分会遇到 `Cannot find module ‘@/xx/xxx‘`，`找不到*.vue` 等错误，解决方法是 修改配置文件，可参考文章 [终极解决TS 或者 Vetur 报错，Cannot find module ‘@/xx/xxx‘，找不到*.vue 等编译问题([https://blog.51cto.com/marsxh/4842853](https://blog.51cto.com/marsxh/4842853))]

> 另外 Typescript 的版本要从 修改为VSCode的工作空间

### 创建 router/modules/mine.ts
```javascript
export default {
  path: "/mine",
  name: "mine",
  component: () => import("@/views/mine/main.vue"),
  redirect: '/mine/index',
  meta: {
    keepAlive: false
  },
  children: [
    {
      path: '/mine/index',
      name: '/mine/index',
      component: () => import('@/views/mine/index/index.vue'),
      meta: {
        keepAlive: false,
      },
    },
  ],
}
```
### 创建 router/index.ts
```javascript
import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
  } from 'vue-router';
  
  import index from './modules/index';
  import mine from './modules/mine';
  import routerHelpers from './helpers';
  
  const mode = process.env.VUE_APP_ROUTER_MODE; // hash; history;
  const history = mode === 'hash' ? createWebHashHistory() : createWebHistory();
  const routes = [index, mine];
  const config = { history, routes };
  const router = createRouter(config);
  routerHelpers.guard(router);
  
  export default router;
```
## 安装 @types/node
解决可能出现的报错：`cannot find name 'process'`
```javascript
pnpm i -D @types/node
```
## 修改 tsconfig.json
```javascript
{
    ...
  
    "include": [
      "src/**/*.ts", 
      "src/**/*.d.ts", 
      "src/**/*.tsx", 
      "src/**/*.vue"
    ],
    ...
  }
```
## 修改 App.vue 文件
```vue
<script setup lang='ts'>
</script>

<template>
  <div class="app-wrapper">
    <router-view v-if="!$route.meta.keepAlive" class="router" />
    <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }" class="router">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="less" scoped></style>
```
> 这一步 中 $router 可能会报错，解决方案为上文提及的：通过 shims-vue.d.ts 来解决
> 或者
> 通过选择 TypeScript 的版本来消除问题[ Win：Control + Shift + P ]
> ![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692602705400-2ebacd60-70c0-4616-aa5a-36e2314052c1.png#averageHue=%230a466e&clientId=u97cc35e0-2b24-4&from=paste&height=157&id=u060f513b&originHeight=157&originWidth=616&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10939&status=done&style=none&taskId=u455659b1-8c93-4567-94b8-dfaabe8697a&title=&width=616)

## 修改 main.ts 文件
```javascript
import { createApp } from "vue";
import App from "./App.vue";
import '@/assets/fonts/font.css';
import router from '@/router/index';

const app = createApp(App);

app.use(router);
app.mount("#app");
```
> `@/router/index` 可能会遇到问题如：`Module not found: Error: Can't resolve 'core-js/modules/es.promise.js' in ...` ，此时通过 `pnpm i -D core-js `安装依赖来解决问题

## 浏览器运行以及 nginx 部署
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692439276667-72c24b13-5a6a-4c63-9bc8-1f5fb193046f.png#averageHue=%238b8a89&clientId=ubcd1b2a5-c630-4&from=paste&height=237&id=u4228abb5&originHeight=160&originWidth=311&originalType=binary&ratio=2&rotation=0&showTitle=false&size=9723&status=done&style=none&taskId=u4cce420c-adc6-40fc-afc6-77905c3cf8b&title=&width=460.5)![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692439291340-af5723a4-f3bb-4749-9b75-9597fd01a3a2.png#averageHue=%23949291&clientId=ubcd1b2a5-c630-4&from=paste&height=233&id=uf7a86cfb&originHeight=176&originWidth=367&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11035&status=done&style=none&taskId=u826b5e4f-f9f3-4213-ae7e-7abf06169a1&title=&width=485.5)

### 支持 history 模式
#### webpack-dev-server 支持 history 模式
```json
...

module.exports = merge(baseConfig, {
    mode: "development",
    output: {
        ...
    },
    devServer: {
        ...
    		historyApiFallback: {
    			index: "/index.html",
    		},
    },
    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
    ]
});
```
#### nginx 支持 history模式
```javascript
worker_processes 1;


events {
    worker_connections 1024;
}

http {
    ...

    server {
        ...

        location / {
            ...
            try_files $uri $uri/ /index.html;
        }

        ...
    }
}

```
## 修改 webpack 配置文件
```javascript
...

module.exports = {
    ...
    
    module: {
        rules: [
            ...
        ]
    },
    plugins: [
       ...
    ],
    resolve: {
        ...
        extensions: [".ts", ".tsx", ".js", ".vue"]
    
    },
    ...
};
```

```javascript
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const { resolveApp } = require("./utils");

module.exports = merge(baseConfig, {
    mode: "development",
    output: {
        ...

        publicPath: '/',
    },
    module: {
        rules: [
           ...

        ],
    },
    devServer: {
        ...

        historyApiFallback: {
            index: '/index.html',
        },
    },
    plugins: [
        ...

    ],
});

```

```javascript
...

module.exports = merge(baseConfig, {
    mode: "production",
    output: {
       	...
        publicPath: '/',
    },
    module: {
        rules: [
            
         	...
        ],
    },
    plugins: [
        ...
    ],
});

```

---

# 引入 Pinia
## 安装依赖
```vue
pnpm i -S pinia
```
## 创建常量文件夹 constants
> mkdir ./src/constants ./src/constants/modules && touch ./src/constants/index.ts ./src/constants/modules/pinia.ts

![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692445884215-49cccb14-e209-48e8-89c4-2507c8c44418.png#averageHue=%231f2e39&clientId=ud8066676-107d-4&from=paste&height=153&id=u1d4a6d0f&originHeight=99&originWidth=300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4706&status=done&style=none&taskId=uc5510d9a-b895-4988-bfc5-d22386cc46c&title=&width=463)
### constants/modules/pinia.ts
```typescript
export const GLOBAL_STORAGE_NAME = "GLOBAL_STORAGE_NAME"

export const STORE_NAME_COMMON = "common"
```
### constants/index.ts
```typescript
import * as PINIA from "./modules/pinia"

export default {
  PINIA,
}
```
## 创建全局状态文件夹 store
> mkdir ./src/store ./src/store/modules && touch ./src/store/index.ts ./src/store/modules/common.ts

![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692446046828-ec2cdbd1-a36f-4943-9b71-aaa577a8ec73.png#averageHue=%23292a2d&clientId=ud8066676-107d-4&from=paste&height=178&id=u91f39337&originHeight=89&originWidth=296&originalType=binary&ratio=2&rotation=0&showTitle=false&size=4010&status=done&style=none&taskId=u7d7c0d88-4d7f-4480-b1b0-3b998726385&title=&width=593)
### store/modules/common.ts
```typescript
import { ref } from "vue";
import { defineStore } from "pinia";
import FINAL from "@/constants";

const storeId: string = FINAL.PINIA.STORE_NAME_COMMON;

export interface IStoreSetup {
    getToken: () => string;
    setToken: (string) => void;
};

const storeSetup = ():IStoreSetup => {
  const token = ref<string>("");

  const getToken = (): string => {
    return token.value;
  };

  const setToken = (value: string) => {
    token.value = value;
  };

  return {
    getToken,
    setToken,
  };
};

export default defineStore<string, IStoreSetup>(storeId, storeSetup);

```
### store/index.ts
```typescript
import { createPinia, Pinia } from 'pinia'

import useCommonStore from './modules/common'

export * from "./modules/common"

const core: Pinia = createPinia();

export default {
  core, 
  useCommonStore,
};
```
## 注册 pinia
```typescript
...

import store from './store/index';
...

const { core: pinia } = store;

...

app.use(pinia);

...
```
## 页面使用全局状态 pinia 以及 浏览器预览
### views/index/index/index.vue
```typescript
<template>
    <div class="index-wrapper">
       	...

        <div style="padding: 10px;border: 1px solid #FF0000">
            <button @click="assign">对commonStore赋值</button>
        		<div>{{ token }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useRouter, Router } from "vue-router";
import store from '@/store';
import { IStoreSetup } from '@/store';

const { useCommonStore } = store;
const commonStore: IStoreSetup = useCommonStore();

...

const token = computed<string>(() => commonStore.getToken());

...

function assign() {
    const timestamp = new Date().getTime();
    const val = `value from index pageview: ${timestamp}`;
    commonStore.setToken(val);
}
</script>
<style lang="less" scoped>
  
...
  
</style>
```
### views/mine/index/index.vue
```typescript
<template>
    <div class="mine-wrapper">
        ...

        <div style="padding: 10px;border: 1px solid #FF0000">
            <div>Received Value: </div>
            <div>{{ token }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter, Router } from "vue-router";
import store from '@/store';
import { IStoreSetup } from '@/store';

const { useCommonStore } = store;
const commonStore: IStoreSetup = useCommonStore();

...

const token = computed(() => commonStore.getToken());

...
</script>

<style lang="less" scoped>
  
...
  
</style>

```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692446411934-b89889c8-7b12-4f2a-8f75-912cb49a1ac2.png#averageHue=%23bfbcbc&clientId=ud8066676-107d-4&from=paste&height=243&id=HDA0W&originHeight=277&originWidth=648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20450&status=done&style=none&taskId=u68ed6d44-cbce-4fff-ac1a-14d3ebc288b&title=&width=569)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692446444516-80ff6032-2829-4c57-b8cb-6e70039156c3.png#averageHue=%23fcf7f7&clientId=ud8066676-107d-4&from=paste&height=137&id=ue121f4f6&originHeight=154&originWidth=654&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8642&status=done&style=none&taskId=u2a67466f-5e0e-4546-a5fa-b789c3e9a97&title=&width=580)

---

# 引入 Vant
## 安装依赖
```typescript
pnpm i -S vant
```
```typescript
pnpm i -D unplugin-vue-components
```

## 修改 webpack 配置文件
```typescript
...

const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

...

module.exports = {
    ...

    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
      
        ComponentsPlugin({
            resolvers: [VantResolver()],
        }),
    ],
    resolve: {
       	...
        extensions: [
          ...
          
          ".mjs"
        ]
    },
    optimization: {
        ...
    }
};
```
## 页面中使用 vant 组件
```typescript
<template>
    <div class="index-wrapper">
        ...
        
        <div style="padding: 10px;border: 1px solid #FF0000">
            <van-button type="primary" class="button" @click="goToHome">前往Mine页面</van-button>
      
            <van-button @click="invokeToast">showToast</van-button>
        </div>

        ...
        </div>
    </div>
</template>
<script setup lang="ts">
  
...

// import { Button } from 'vant';
import { showToast } from 'vant';

import 'vant/es/toast/style';
import 'vant/es/button/style';

...

</script>
<style lang="less" scoped>

...

  
function invokeToast() {
    showToast('Some messages');
}
  
</style>
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692449484704-ca2cda34-c4d8-4573-863a-3a96036397ee.png#averageHue=%23e1dfdf&clientId=ud8066676-107d-4&from=paste&height=920&id=u498472b0&originHeight=613&originWidth=681&originalType=binary&ratio=2&rotation=0&showTitle=false&size=27878&status=done&style=none&taskId=uabf19400-d5be-4e5e-84f7-6a767256c8a&title=&width=1022.5)

---

# 移动端适配
## 安装依赖
```powershell
pnpm i -D postcss-px-to-viewport
```
## 修改 postcss.config.js 文件
```powershell
module.exports = () => {
    return {
      plugins: {
        ...
        
        "postcss-px-to-viewport": {
          unitToConvert: "px", 
          viewportWidth: 375, 
          unitPrecision: 5,
          propList: ["*"], 
          viewportUnit: "vw", 
          fontViewportUnit: "vw",
          selectorBlackList: [".ignore", ".hairlines", ".ig-"], 
          minPixelValue: 1,
          mediaQuery: false, 
          replace: true, 
          include: undefined, 
          landscape: false, 
          landscapeUnit: "vw", 
          landscapeWidth: 568,
        }
      }
    };
  };
```
## 页面中应用 以及 浏览器预览
```vue
<template>
  <div class="index-wrapper">
    ...

    <div style="padding: 10px;border: 1px solid #FF0000">
      <div class="square">Square</div>
    </div>

    ...
  </div>
</template>
<script setup lang="ts">
  
...
  
</script>
<style lang="less" scoped>
  
	...
  
  .square {
    width: 200px;
    height: 200px;
    background-color: #00FF00;
  }
</style>
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692450205002-baf48501-f9e5-40f9-be89-42e0e7bf4340.png#averageHue=%23f7cb9c&clientId=ud8066676-107d-4&from=paste&height=862&id=ll031&originHeight=965&originWidth=526&originalType=binary&ratio=2&rotation=0&showTitle=false&size=47540&status=done&style=none&taskId=u89b1700f-d081-4b48-9b44-8d668e4c547&title=&width=470)![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692450243017-e7801a57-ff16-467e-9804-e0697274d748.png#averageHue=%238ae078&clientId=ud8066676-107d-4&from=paste&height=751&id=ufcd232f5&originHeight=897&originWidth=625&originalType=binary&ratio=2&rotation=0&showTitle=false&size=51448&status=done&style=none&taskId=u3c5d129c-5f69-4ffa-82c9-c403d3a9882&title=&width=523.5)

---

# 引入 axios
## 安装依赖
```typescript
pnpm i -S axios
```
## 创建 api 文件夹
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692518934974-29fe956d-ea55-4092-adf1-5d6cb4611ec3.png#averageHue=%23222a31&clientId=u9aba11b2-84db-4&from=paste&height=308&id=ube6599ef&originHeight=181&originWidth=209&originalType=binary&ratio=2&rotation=0&showTitle=false&size=7445&status=done&style=none&taskId=u9bc9bd3e-d936-4f3b-82ed-1cfd27ad473&title=&width=355.5)
### 创建 request 文件夹 和 封装 axios 请求
```typescript
import axios, { AxiosRequestHeaders } from 'axios';

interface CustomAxiosRequestHeaders extends AxiosRequestHeaders {
    token: string;
}

const EXPIRED_TOKEN_CODE = 2;
const PAGE_RELOAD_TIMEOUT = 3 * 1000;
const TIMEOUT = 30 * 1000;
const TOKEN_TYPE: string[] = ['tokenType_1', 'tokenType_2'];

const getTokenType = (options): string => {
    const { token = '' } = options;
    if (token === TOKEN_TYPE[1]) return '';
    return '';
};

function main(options) {
    const headers = { 'Content-Type': 'application/json' } as CustomAxiosRequestHeaders;

    if (options.token) headers.token = getTokenType(options);
    if (options.contentType) headers['content-type'] = options.contentType;

    if (options.contentType) options.data = options.params;
    if (options.noParams) delete options.params;

    return new Promise((resolve, reject) => {
        const args = {
            headers,
            timeout: TIMEOUT * 1,
        };

        const instance = axios.create(args);

        instance.interceptors.request.use((config) => config, (error) => Promise.reject(error));

        instance.interceptors.response.use((response) => {
            if (response?.data?.code * 1 === EXPIRED_TOKEN_CODE * 1) {
                setTimeout(() => {
                    window.location.reload();
                }, PAGE_RELOAD_TIMEOUT);
            }

            return response;
        }, (error) => Promise.reject(error));

        instance(options)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export default main;

```
### 创建 helpers 文件夹
```typescript
function getUrl(path: string = "", middle: string = "", prefix: string = ""): string {
    return `${prefix}${middle}${path}`;
}

export default getUrl;

```
### 创建业务请求文件夹 modules 和创建 common 模块
```typescript
import getUrl from "../helpers/getUrl"
import request from "../request/index"

export const queryTime = (params = {}) => {
    const path = 'http://worldtimeapi.org/api/timezone/Asia/Hong_Kong';
    const url = getUrl(path);
    const args = { url, params };
    return request(args);
};

export const del = () => {};
```
### 统一输出 api 业务接口
```typescript
import * as common from "./modules/common";

export default {
  common,
};
```
### 视图文件调用和浏览器预览
```vue
<template>
  <div class="index-wrapper">
    ...

    <div style="margin-top: 10px;padding: 10px;border: 1px solid #FF0000">
      <van-button type="primary" @click="retrieve">request</van-button>
    </div>

    ...
  </div>
</template>
<script setup lang="ts">
  ...
  
  import api from '@/api/index';
  
  ...

  async function retrieve() {
    const val = await api.common.queryTime();
    console.log('val');
    console.log(val);
    console.log('\n');
  }
</script>
<style lang="less" scoped>
	
  ...
  
</style>
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692519361843-8158499d-9625-4a56-8783-3a4bacfd47a5.png#averageHue=%23f0cb94&clientId=u9aba11b2-84db-4&from=paste&height=560&id=u8abe6be2&originHeight=507&originWidth=931&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71888&status=done&style=none&taskId=u10079077-3fe9-4a95-9ade-0c424cbbd09&title=&width=1027.5)

---





# 引入 ESLint 和 Prettier 格式化代码
## 安装 eslint 保证一致性
```powershell
pnpm i -D eslint
```
## 初始化 eslint 配置项
使用指令 `npx eslint --init` 进行配置项初始化，生成 `.eslintrc.{ json/js }` 文件
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692606158453-75411b4c-de17-44c2-8cf2-228d426bc6dd.png#averageHue=%231c1c1c&clientId=u97cc35e0-2b24-4&from=paste&height=182&id=u84b30477&originHeight=182&originWidth=514&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14535&status=done&style=none&taskId=ubbd9ed03-7c0a-4735-9660-c0d19ae5eec&title=&width=514)
```json
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
        "no-undef":"off"
  }
}
```
## package.json 添加命令以及指令执行
```json
{
  ...
  
  "scripts": {
    ...
    
    "lint": "eslint --ext .ts,.vue --fix --quiet ./"
  },
  
  ...
}

```

然后执行指令 `pnpm lint`
## 安装 prettier 格式化代码
```json
pnpm i -D prettier eslint-config-prettier eslint-plugin-prettier
```
> 安装 eslint-config-prettier (覆盖 eslint 本身规则)和 eslint-plugin-prettier ( Prettier 来接管 eslint --fix 即修复代码的能力)

## 配置 .eslint.{json, js} 文件
```json
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
## 执行 lint 命令查看效果
```json
pnpm lint
```

---

# 引入 Commitizen、Husky 和 Standard-Version 规范提交
> 局部安装：pnpm i -D commitizen / 全局安装：pnpm i -g commitizen
> => commitizen init cz-conventional-changelog --save --save-exact
> ![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692150442009-2193797b-b26a-404e-a2d1-d3fc7c0d77e6.png#averageHue=%230c0906&clientId=u227d8a5f-49b9-4&from=paste&height=80&id=uaa67dd2e&originHeight=119&originWidth=768&originalType=binary&ratio=2&rotation=0&showTitle=false&size=20914&status=done&style=none&taskId=uff9f31b9-33ce-40e7-bee5-578de6c8c3f&title=&width=516)
> => 当adapter之前安装时：commitizen init cz-conventional-changelog --save --save-exact --force
> => pnpm 版本：commitizen init cz-conventional-changelog --save --save-exact --force --pnpm
> 的
> 本地安装 commitizen 却需要 初始化 的时候，可以在 package.json 插入命令：
> npm pkg set scripts.init-cz="commitizen init cz-conventional-changelog --save --save-exact --force --pnpm"
> pnpm run init-cz


## Commitizen校验
### 添加 commitlint
```cpp
pnpm i -D @commitlint/cli @commitlint/config-conventional
```
新建文件 commitlint.config.js
```cpp
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```
### Husky 钩子触发校验机制
#### 自动初始化 husky
> 记得 初始化 git 本地仓库

```cpp
pnpm dlx husky-init && pnpm install

pnpm dlx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
将 `.husky/pre-commit` 中 `npm run test` 修改成 `npm run lint`
#### 手动初始化husky
安装husky
```cpp
pnpm i -D husky
```
首先在 `package.json` 中添加
> 也可以同等命令操作：npm pkg set scripts.prepare="husky install"

```cpp
"scripts": {
	...
	"prepare": "husky install"
}
```
执行指令
```cpp
pnpm run prepare
```
会生成如下文件结构：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692093799245-5924f98c-cc95-447b-a396-e1a089fef136.png#averageHue=%231f2c36&clientId=u08575f46-9169-4&from=paste&height=200&id=u52aa5ac9&originHeight=116&originWidth=206&originalType=binary&ratio=2&rotation=0&showTitle=false&size=5164&status=done&style=none&taskId=ua502bed8-f2e8-4927-8997-a510f1100e5&title=&width=356)
## Commitizen 日志
```cpp
pnpm i -D conventional-changelog-cli
```

在 package.json 中添加 changelog 命令
```cpp
"scripts": {
    ...
	"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
}
```
## cz
`package.json` 文件中添加 `cz` 命令，执行 `commitizen` 代码提交规范
```cpp
npm pkg set scripts.cz="cz"
```
## Changelong
```cpp
pnpm i -D standard-version
```

```cpp
npm pkg set scripts.release="standard-version"
```

创建 `.versionrc` 文件	
```cpp
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
## 创建 .gitignore 文件
```cpp
node_modules
dist
```


















---

# 复制指定文件到 dist 文件夹下
## 安装 copy-webpack-plugin
```vue
pnpm i -D copy-webpack-plugin
```
## webpack 引入插件
```typescript
...

const copyWebpackPlugin = require("copy-webpack-plugin");

...

module.exports = {

  ...

  module: {
    rules: [
      
      ...
    ]
  },
  plugins: [
    
    ...
    new copyWebpackPlugin({
      patterns: [
        {
          from: resolveApp("public"),
          to: resolveApp("dist"),
          globOptions: {
            dot: true,
            gitignore: false,
            ignore: [
              "**/index.html"
            ]
          }
        }
      ]
    })
  ],
  ...
    };
```
## public 创建测试文件并打包验证
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692521551983-a5f40c77-e33a-4350-b252-9ff69cd71587.png#averageHue=%231e2e3b&clientId=u9aba11b2-84db-4&from=paste&height=176&id=u1bd370e0&originHeight=90&originWidth=211&originalType=binary&ratio=2&rotation=0&showTitle=false&size=3982&status=done&style=none&taskId=uab72be05-ef84-457d-9a8c-6367d2dbc0f&title=&width=411.5)				
```typescript
# test copy-webpack-plugin
```

然后通过命令 `pnpm run build`，打包项目，查看 `dist` 文件夹
![image.png](https://cdn.nlark.com/yuque/0/2023/png/288560/1692521658860-988c101f-06f4-4c2a-a499-82ed31a4cba5.png#averageHue=%23202b33&clientId=u9aba11b2-84db-4&from=paste&height=285&id=u065436b2&originHeight=139&originWidth=208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=5096&status=done&style=none&taskId=u73a2f74e-134a-4dcf-ba1f-f4ebf010c28&title=&width=426)

---

# 配置压缩
## HTML 压缩
主要是通过 `html-wepback-plugin` 插件配置来进行优化：
```typescript
...

const HtmlWebpackPlugin = require("html-webpack-plugin");

...

module.exports = merge(baseConfig, {
    ...
    output: {
        ...
    },
    module: {
        rules: [
            ...
        ],
    },
    devServer: {
        ...
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            title: process.env.VUE_APP_TITLE + " " + process.env.NODE_ENV,
            inject: "body",
        }),
        ...
    ],
});

```

```typescript
...

const HtmlWebpackPlugin = require("html-webpack-plugin");

...

module.exports = merge(baseConfig, {
    mode: "production",
    output: {
        ...
    },
    module: {
        rules: [
            ...
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            title: process.env.VUE_APP_TITLE + " " + process.env.NODE_ENV,
            inject: "body",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        ...
    ],
});

```
## CSS 压缩
### 安装插件：
```typescript
pnpm i -D css-minimizer-webpack-plugin
```

### webpack 文件中进行配置
```typescript
...

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

...

module.exports = {
    ...

    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
    ],
    resolve: {
       ...

    },
    optimization: {
        ...
      
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    }
};
```
## JS 压缩
### 安装依赖
```typescript
pnpm i -D terser-webpack-plugin
```

### 配置 webpack 文件
```typescript
...

const TerserWebpackPlugin = require('terser-webpack-plugin');

...

const getTerserPluginArgs = function () {
    if (process.env.NODE_ENV === "production") {
        return {
            parallel: true,
            extractComments: false,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        };
    }
    
    return {
        parallel: true
    };
};

module.exports = {
    ...

    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
    ],
    resolve: {
       ...
    },
    optimization: {
        ...
      
        minimizer: [
            ...
          
            new TerserWebpackPlugin(getTerserPluginArgs()),
        ],
    }
};
```

---

# 打包友好提示
## 安装依赖
```typescript
pnpm i -D friendly-errors-webpack-plugin
```
## stats presets 设置 'errors-only'
```typescript

...

module.exports = {
    ...

    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
    ],
    stats: "errors-only",
    resolve: {
        ...
    },
    optimization: {
        ...
    }
};
```
## webpack 文件配置插件
```typescript
...

var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

...

module.exports = {
    ...

    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        ...
      
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
              messages: [`😊 The Chunks have been built!!!`]
            },
            clearConsole: true
          })
    ],
      
    ...
      
    resolve: {
        ...
    },
    optimization: {
        ...
    }
};
```

---

# 分析打包文件大小
## 安装依赖
```powershell
pnpm i -D webpack-bundle-analyzer
```
## webpack 配置文件修改
```powershell
...

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

...

module.exports = {

    ...
    
    module: {
        rules: [
            ...
        ]
    },
    plugins: [
        
        ...
        
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.analyMode == "true" ? "server" : "disabled",
            generateStatsFile: false,
            statsOptions: { source: false }
        })
    ],
    ...
};
```

## 修改 package.json 文件
```powershell
{
    "scripts": {
    	...
     
     "analyzer": "cross-env envMode=prod analyMode=true webpack --config ./config/webpack.prod.js  --color --progress"
     ...
  },
}

```

---





