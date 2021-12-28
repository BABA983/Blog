## Remix

### 什么是 Remix

[Remix](https://remix.run/) 是一个可以让你专注于用户界面并且重新学习 Web 基础知识来为用户提供快速流畅的用户体验的全栈 Web 框架。

它是由 React Router 的团队研发的一个基于 React 的框架，相对于其他的框架，这个框架的一个特点就是专注于 “嵌套路由” 这个概念，允许组件直接与其他页面相连接，简化代码的编写。

下面我们通过 Remix 官方文档的教程来搭建一个 Jokes 应用，来了解 Remix 所具有的特性。

### 前置知识

- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) ，这个教程的代码会是基于 TypeScript 来编写的，如果你没了解过 TypeScript 可以去官方的使用手册进行学习，当然你也可以用 JavaScript 来编写。
- [React](https://beta.reactjs.org/) ，Remix 是一款基于 React 的全栈框架，你可能需要了解一部分基础的 React 知识，刚好在最近 React 官方更新了新的文档，相对于以前的基于 class 的写法，新的文档将以 hooks 来做教程。

### 开发环境

- `Node >= 14`
- `npm >= 7`

```zsh
# 你可以检查你的 node 环境是多少，我用的是 16.13.1
node -v
# v16.13.1
npm -v
# 8.1.2
# 可以使用 nvm / window-nvm 来安装 对应的 node 版本
nvm install v16.13.1
# 或者直接安装 stable 版本
nvm install stable
# 然后使用新安装的 node 版本
nvm use v16.13.1
# nvm use stable
```

### 创建 Remix 项目

1、打开你的终端运行下面这行命令

```zsh
npx create-remix@latest
```

> 执行之后可能会问你是否想安装 `create-remix` 来执行这个命令。按 Y 确认，它只会暂时安装来执行 setup 脚本

当安装完成之后，它会问你一些问题

```
R E M I X

💿 Welcome to Remix! Let's get you set up with a new project.

? Where would you like to create your app? remix-jokes
? Where do you want to deploy? Choose Remix if you're unsure, it's easy to change deployment targets. Remix
 App Server
? TypeScript or JavaScript? TypeScript
? Do you want me to run `npm install`? Yes
```

这里面选择的 Remix App Server 选项，是一个基于 [Express](https://expressjs.com/) 的 [Node.js](https://nodejs.org/en/) 服务器。

当 `npm install` 完成的时候，我们 `cd remix-jokes` 进入到目录然后通过宇宙第一 IDE--VSCode 来打开这个目录 `code .`

### 目录结构

```
remix-jokes
├── README.md
├── app
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   ├── routes
│   │   ├── demos
│   │   │   ├── about
│   │   │   │   ├── index.tsx
│   │   │   │   └── whoa.tsx
│   │   │   ├── about.tsx
│   │   │   ├── actions.tsx
│   │   │   ├── correct.tsx
│   │   │   ├── params
│   │   │   │   ├── $id.tsx
│   │   │   │   └── index.tsx
│   │   │   └── params.tsx
│   │   └── index.tsx
│   └── styles
│       ├── dark.css
│       ├── demos
│       │   └── about.css
│       └── global.css
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── remix.config.js
├── remix.env.d.ts
└── tsconfig.json
```

- `app/` 这里存放的是你的 Remix 应用的代码，就像 `vue-cli` / `create-react-app` 生成项目里面的 `src/`
- `app/entry.client.tsx` 当应用在浏览器加载完成的时候会运行这个文件里面的 JavaScript 代码，Remix 用这份文件来 [hydrate](https://reactjs.org/docs/react-dom.html#hydrate) React 组件。hydrate 是什么意思？简单来说就是服务端渲染的时候，服务端返回字符串，浏览器根据这些字符串进行 React 组件的创建，完成初始化的工作，这个过程叫“注水”。
- `app/entry.server.tsx` 当一个请求发送到服务器的时候，这个文件里面的 JavaScript 代码会第一时间运行。Remix 会帮你加载所有必要的数据，而我们将会负责将响应的数据发送回浏览器。
- `app/root.tsx` 这份文件是应用的根组件，就像 Vue 的 `App.vue` ，网页的 `html` 标签将会在这里渲染。
- `app/routes/` 这个路径下面将会存放所有和路由相关的模块文件，Remix 会根据这个目录下面的文件名字来创建对应的 URL 路由。
- `public/` 这里和平常一样存放你项目里的静态资源，例如图片，字体等等。
- `remix.config.js` Remix 应用对应的配置写在这个文件里面。

让我们尝试打包一下文件

```
npm run build
```

在打包完成之后，当前目录下面会出现下面几个文件夹

- `.cache/` 这个文件夹里面的内容是 Remix 内部使用的东西
- `build/` 是服务端的代码
- `public/build/` 是客户端的代码

把这几个路径加入到 .gitignore 文件里面

```
/.cache
/build
/public/build
```

想要运行打包后的应用执行

```
npm start
```

打开链接后会看到下面的网页界面

![remix-starter](https://gitee.com/SKADaddy/pic/raw/master/remix-starter.png)

如果你想看看这个 Remix Starter 里面的内容可以点一下对应的链接，但是这些内容在接下来的教程都会讲到。

<kbd>Ctrl</kbd> + <kbd>C</kbd> 停掉服务，然后删除下面的文件夹

- `app/routes`
- `app/styles`

然后把 `app/root.tsx` 的代码替换掉 [Jokes App](https://remix.run/docs/en/v1/tutorials/jokes#outline) 这个里面的代码，代码我就不复制了，有需要的读者可以复制粘贴到自己的项目。

关键的代码是这部分 `{process.env.NODE_ENV === "development" ? <LiveReload /> : null}` 这个 `<LiveReload/>` 组件。这个组件会建立一个 WebSocket 来热更新并且自动刷新浏览器。

现在你的 `app/` 目录下面的结构是这样的

```
app
├── entry.client.tsx
├── entry.server.tsx
└── root.tsx
```

然后运行 `npm run dev` 这样可以看到整个页面已经跟之前的 Remix Starter 不一样了。

### 路由

Remix 的路由有两种方法可以定义

- 通过 [remix.config.js](https://remix.run/docs/en/v1.0.6/api/conventions#remixconfigjs) 来创建路由

- 另一种 Remix 里更通用的方法是通过在 `routes/` 文件夹来创建路由

#### remix.config.js

```javascript
module.exports = {
  appDirectory: "app", // 对应 app 文件夹，你也可以改成 src
  browserBuildDirectory: "public/build", // 打包后客户端代码存放的路径
  devServerPort: 8002,
  publicPath: "/build/", // 静态资源存放路径
  serverBuildDirectory: "build", // 打包后服务端代码存放的路径
  routes(defineRoutes) {
    return defineRoute(route => {
      // 第一个参数是要匹配的 React Router 路径
      // 第二个参数是路由要处理的对应文件
      route("/somewhere/cool/*", "catchall.tsx");

      // 如果你要嵌套路由，就在第三个参数传入一个可选的回调方法
      route("some/:path", "some/route/file.js", () => {
      // - 路径是相对于父路径
      // - 文件名仍然相对于 app 路径而不是父路径
      route("relative/path", "some/other/file")
    });
    });
  }
  // 下面这个是我写的 demo 例子
  async routes(defineRoutes) {
    return defineRoutes((route) => {
      route("test/:path", "routes/test/index.tsx", () => {
        route("relative/child1", "routes/test/child.tsx");
        route("relative/child2", "routes/test/child2.tsx");
      });
    });
  },
};
```

在 `routes/` 下面创建 test 文件夹

```
test
├── index.tsx
├── child.tsx
└── child2.tsx
```

```tsx
// index.tsx
import { Outlet } from "remix";

export default function TestIndexRoute() {
  return (
    <div>
      Test remix.config.js define nested routes <br />
      <Outlet />
    </div>
  );
}

// child.tsx
export default function ChildRoute() {
  return <div>Child1</div>;
}

// child2.tsx
export default function ChildRoute() {
  return <div>Child2</div>;
}
```

`http://localhost:3000/test/` 加上任意路径都会匹配到 `test/index.tsx` 这个文件

`http://localhost:3000/test/1234/relative/chlid1` 会匹配到 `test/child.tsx` 这个文件

![image-20211213173334623](https://gitee.com/SKADaddy/pic/raw/master/image-20211213173334623.png)

另一种是官方教程演示的基于文件的路由

把文件放到 `app/routes/` 文件夹里面，这些文件被称为“路由模块”并且应该遵循 Remix 的 [文件路由命名规范](https://remix.run/docs/en/v1.0.6/api/conventions#route-filenames)

#### 路由文件命名

- **`app/root.tsx`** 根路由

- **`app/routes/*.{js,ts,jsx,tsx,md,mdx}`** : 任何在这个文件夹里面的文件都会变成应用的路由，Remix 天然支持这些后缀名的文件

- **`app/routes/{folder}/*.tsx`** : 在文件夹里面的文件会创建嵌套路由

- **`app/routes/{folder}` 和 `app/routes/{folder}.tsx`的联动** : 当在 `app/routes/` 文件夹里面有一个文件的名称和文件夹的名称相同的时候，这个文件就会作为一个 `layout` 服务于文件夹里面的文件路由。在 `{folder}.tsx` 里面渲染一个 `<Outlet />` ，那么子路由就会渲染替换 `<Outlet />`组件渲染出来。往后看会有演示

- **在文件名里加 `.`** : 在文件名里面加一个 `.` 会创建一个嵌套路由的路径，但是它的 `layout` 渲染不会渲染在 `{folder.tsx}` 的 `<Outlet />` 上面。例如 [官方教程](https://remix.run/docs/en/v1/tutorials/jokes#routes) 的 `jokes.funny.tsx` 会创建一个 `/jokes/funny` 的 URL 路径，它属于 `/jokes` 的子路由。

- **`index.tsx`** : 当父路径完全匹配的时候就会默认展示。

- **`$param`** : $ 表示 URL 的动态部分，Remix 会帮我们解析并传递到 `loader` 函数和路由当中。例如 `app/routes/users/$userId.tsx` 当匹配到浏览器的路径为 `/users/1234` 的时候，`export const loader: LoaderFunction = async ({ params }) => {}` 中的 `params.userId === '1234'`

- **`app/routes/files/$.tsx`** : 会捕获所有 `files/*` 的路径，我们写个简单的例子解释一下

  ```tsx
  // routes/test.tsx
  export default function TestRoute() {
    return <div>test</div>;
  }
  // routes/test.$.tsx
  import { LoaderFunction } from "remix";

  export const loader: LoaderFunction = async ({ params }) => {
    console.log(params);
    return null;
  };
  export default function Test$Route() {
    return <div>catch rest route</div>;
  }
  // 上面的 remix.config.js 里面的 route('test/:path') 需要修改，不然会匹配到所有路径
  async routes(defineRoutes) {
      return defineRoutes((route) => {
        // route("test/:path", "routes/test/index.tsx", () => {
        route("test/haha", "routes/test/index.tsx", () => {
          route("relative/child1", "routes/test/child.tsx");
          route("relative/child2", "routes/test/child2.tsx");
        });
      });
    },
  // test/haha 跳转到 routes/test/index.tsx
  // test/haha1 跳转到 routes/test.$.tsx Loader 函数获取参数 params === { '*': 'haha1' }
  // test/haha1/123 跳转到 routes/test.$.tsx params === { '*': 'haha1/123' }
  // test/haha1/123?id=aab 跳转到 routes/test.$.tsx params === { '*': 'haha1/123' }
  ```

- **`app/routes/__some-layout/some-path.tsx`** : 文件夹名称如果带有 `__` 的前缀会创建一个 “Layout Route” ，这个 Layout Route 是 “假” 的，当你的 URL 是 `/some-layout` 或 `/__some-layout` 的时候是不会匹配上的，如果你的路径是 `/some-path` 的时候会匹配上，并且会以 `some-latout` 为父路由展示在它的 `<Outlet />` 上面。

```
├── app
│   ├── routes
│   │   ├── __layout
│   │   │   ├── lmao.tsx
│   │   ├──__layout.tsx
```

```tsx
// __layout.tsx
import { Outlet } from "remix";

export default function LayoutRoute() {
  return (
    <div>
      __Layout <br />
      <Outlet />
    </div>
  );
}
// lmao.tsx
export default function LmaoRoute() {
  return <div>LMAO</div>;
}
// localhost:3000/__layout 将会是 404
```

![image-20211215100235886](https://gitee.com/SKADaddy/pic/raw/master/image-20211215100235886.png)

### 样式

通常为了让我们的网页变得更漂亮，我们需要写一些 css 来美化我们的网站。我们添加类似 `<link rel="stylesheet" href="/path-to-file.css" />` 的标签来加载我们的 css 文件，Remix 也是用同样的方法来加载 css 文件。但是 Remix 更强大的是，把嵌套路由的功能也支持 css 这意味着只有在当前子路由激活的时候才会加载对应的 css，当用户离开当前页面或者说跳转到不同的路由的时候，`<link>` 标签将会被移除。

我们可以在对应的路由文件里面导出 [links](https://remix.run/docs/en/v1.0.6/api/conventions#links) 函数，复制粘贴 [官网的代码](https://remix.run/docs/en/v1/tutorials/jokes#styling)

```tsx
import type { LinksFunction } from "remix";
import stylesUrl from "../styles/index.css";

// 关键的代码是这部分，把 links export 出去
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
```

但是现在你访问 <http://localhost:3000> 你会发现样式并没有生效。因为 `root.tsx` 是渲染所有东西的根结点，包含 `<html>` `</html>` 之间，以为着加载 css 文件的 `<link>` 标签需要我们自己添加上去，而这个 Remix 已经帮我们封装好了，`<Links>` 组件，Remix 会帮我们自动把当前路由激活的时候加载对应的 css 文件。引入 `Links` 组件并且把它放到 `<head>` 标签里面就可以看到样式生效了。

![The jokes page with no background gradient](https://gitee.com/SKADaddy/pic/raw/master/jokes-no-styles.png)

当你切换到其他路径的时候，你会发现之前 index 页面的 css 样式已经消失了，如果你按 <kbd>F12</kbd> 打开控制台的 element tab，你会发现 `<head>` 标签里面的 `<link>` 标签已经被移除了。

> 这意味着你在写 css 的时候你不需要担心 css 冲突的问题，这也意味着你的 css 可以长期缓存并且天然的代码分离的

官网的代码里面比较神奇的是 `global-large.css` 和 `global-medium.css` ，点进去你们会发现文件里面并没有用到媒体查询的相关语法，那么它是怎么知道在什么时候应用对应的 css 文件呢？

```tsx
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};
```

其实很多人应该没有在 `<link>` 标签使用过媒体查询，[mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 可以查阅到相关的属性。

`LinksFunction` 支持两种类型 `HtmlLinkDescriptor | PageLinkDescriptor`

`HtmlLinkDescriptor` 就是一种对象形式的 `<link>` 标签，具体属性可以参考上面的 mdn 链接

`PageLinkDescriptor` 这种类型的 LinksFunction 可以让你在用户可能访问某个路径的时候，注意是**可能**，提前加载相应的 JavaScript 模块，loader 数据还有样式到浏览器的缓存里面。

### 数据库

真正的开发一个项目的时候，我们一般都需要存储数据，在官网的教程中，我们会用我们自己的 [SQLite](https://sqlite.org/index.html) 数据库而不是一些第三方提供的持久化解决方案。

#### 设置 Prisma

如果你用的是 VSCode，那么你可以在插件市场搜索 prisma 来安装他们的插件，这样等会写 prisma 相关语法的时候会有相应提示，非常的方便。Prisma 是一款对象关系映射数据库（Object Relational Mapping），对于不是很熟悉数据库的同学比较友好。

现在我们需要安装两个包，这样就可以继续我们的教程了

```
npm install --save-dev prisma
npm install @prisma/client
```

然后初始化

```
npx prisma init --datasource-provider sqlite
```

接着终端会打印下面的文本，我们就初始化成功了

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore. Don't forget to exclude .env to not commit any secret.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

复制粘贴教程的代码后运行

```
npx prisma db push
```

我们的数据库文件就会被创建出来 `prisma/dev.db` ，重要的是他会帮我们生成好对应的 TypeScript 类型，这样我们开发期间调用 prisma 的 API 的时候就会有对应的代码提示。

把 `prisma/dev.db` 和上面终端打印说的 `.env` 加进 `.gitignore` 文件里面 。

> 如果数据库裂了或者烂了可以直接删掉 dev.db 然后运行 `npx prisma db push`

然后我们需要添加一些到数据库里面，创建一个 `prisma/seed.ts` 文件

```ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getJokes().map((joke) => {
      return db.joke.create({ data: joke });
    })
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}
```

安装 `esbuilder-register`

```
npm install --save-dev esbuild-register
```

然后运行 `seed.ts`

```
node --require esbuild-register prisma/seed.ts
```

现在我们的数据库里面就会有上面文件写的数据了，运行下面的命令就可以看到对应的表和数据

```
npx prisma studio
```

但是如果你重置数据库之后就会没有数据，又要重新跑一遍上面的命令，你可以在 `package.json` 里面添加命令，这样你就不用每次都执行一次了。

```json
// ...
  "prisma": {
    "seed": "node --require esbuild-register prisma/seed.ts"
  },
  "scripts": {
// ...

```

#### 连接数据库

如果你按照上面的步骤来链接数据库

```ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
```

这样确实可以连接到数据库，但是在我们开发期间，`@remix-run/serve` 会帮我们重新打包，这样的话每次我们的代码更新，就会和数据库新建一个链接，最终 Prisma 会发出警告 Warning: 10 Prisma Clients are already running.为了解决这个问题我们新建一个文件名为 `app/utils/db.server.ts`

```ts
import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}

export { db };
```

这里面有一个 Remix 定下的规范，就是带有 `.server` 的文件最终是不会被打包进客户端的代码。

#### 在 loader 中读取数据库的数据

在 Remix 中，每个路由模块都可以通过导出一个 [loader](https://remix.run/docs/en/v1.0.6/api/conventions#loader) 函数来获取数据，loader 函数会在服务端被调用。

##### params

路由的参数会传递到 loader 函数当中

```ts
// if the user visits /invoices/123
export let loader: LoaderFunction = ({ params }) => {
  params.invoiceId; // "123"
};
```

##### request

这个参数是带有请求信息的 [Fetch Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 实例，可以参考 mdn 文档的属性介绍。一般这个参数是用来读取 headers 里面的内容或者当前 URL 路径

```ts
export let loader: LoaderFunction = ({ request }) => {
  // read a cookie
  let cookie = request.headers.get("Cookie");

  // parse the search params
  let url = new URL(request.url);
  let search = url.searchParams.get("search");
};
```

##### context

这个 context 属性你可以在服务端适配器的 `getLoadContext()` 函数里面获取到，可以填补适配器的 Request/Response API 之间的空白（一个类似后门的属性，一般来说不需要用到）

```js
const { createRequestHandler } = require("@remix-run/express");

app.all(
  "*",
  createRequestHandler({
    getLoadContext(req, res) {
      // this becomes the loader context
      return { expressUser: req.user };
    },
  })
);
```

然后你可以在 loader 中获取到

```typescript
export let loader: LoaderFunction = ({ context }) => {
  let { expressUser } = context;
  // ...
};
```

在官网获取 jokes 的例子中，首先先导出一个 loader 函数，然后从数据库中获取数据，并把它以一个对象返回出去，在路由中通过 `useLoaderData()` 来获取数据最终渲染到页面上。

### 数据提交

官网的例子中使用了一个原生的 HTML form 表单，相信现在很多人都是使用 Vue 或者 React 作为前端框架来进行开发，有着众多的开源 UI 库以及 axios 这种封装好的请求库，很少人会再用到 form 表单这种比较原始的数据提交方式。但是在 Remix 中，我们不需要安装一些漂亮的 UI 库以及 axios ，我们只需要导出一个 `action` 函数。

像上面提及的 `loader` 一样，action 是在服务端调用的一个方法，一般用来处理浏览器传递过来的数据或者做一些其他操作。只要不是 GET 请求，这个 action 函数都会被调用，调用时间早于 loader。

action 的 API 和 loader 差不多，不同的地方是他们调用的时机不太一样。

```tsx
import type { ActionFunction } from "remix";
import { redirect } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof name !== "string" || typeof content !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = { name, content };

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
```

像 `form.get("name")` 这种代码大家可能比较陌生，这些都是原生的 Web API，这就是 Remix 这个框架的优点之一，随着逐渐学习，你将会更加了解 Web 相关的东西，而不是新学一个框架，那我这个框架的许多东西都只能局限于这一套生态里面了，学习成本也没有那么的大。

> 这里面的 `redirect` 函数是 Remix 提供的一个简易工具用来创建一个有正确的返回码和请求状态的 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) ，并将它重定向给用户

action 的返回值和 loader 一样，可以接受一个可以序列化的对象或者一个 Response，像下面的校验表单就把表单校验的错误在组件中通过 `useActionData` 函数来获取并渲染到 React 组件上。

```tsx
import type { ActionFunction } from "remix";
import { useActionData, redirect, json } from "remix";
import { db } from "~/utils/db.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 2) {
    return `That joke's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 权限

官网的例子是使用 `bcrypt` 来进行加密的 `npm i bcrypt` 因为是 TypeScript 开发的所以还要安装 `npm install --save-dev @types/bcrypt`

#### 登录表单

```tsx
import type { LinksFunction } from "remix";
import { Link, useSearchParams } from "remix";
import stylesUrl from "../styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Login() {
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked
              />{" "}
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" name="username" />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input id="password-input" name="password" type="password" />
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

在实际的业务场景中，会有一些功能是需要用户登录之后才能使用的，当用户想要使用这部分功能的时候，我们就会让用户跳转到登录页，用户登录后需要跳转到之前的页面，而不是首页。在官网的例子中通过 `useSearchParams` 来获取 URL 上的 `redirectTo` 参数并将它放到 `<form>` 标签里面的一个 `hidden` 的 `input` 标签。这样在 `action` 函数里面通过 `form.get("redirectTo")` 获取到需要重定向的路径。

```
// example http://localhost:3000/login?redirectTo=%2Fjokes%2Fnew
console.log(useSearchParams())
[
  URLSearchParams { 'redirectTo' => '/jokes/new' },
  [Function (anonymous)]
]
```

我们使用 kody 这个账号登录后终端会打印下面这些信息，这就意味着我们的登录成功了。

```
user: {
    id: '161cc267-da50-459b-b6dd-3bfd68820dbc',
    createdAt: '2021-12-05T04:13:26.242Z',
    updatedAt: '2021-12-05T04:13:26.242Z',
    username: 'kody',
    passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'
  }
```

官网使用了 Remix 自带的 `createCookieSessionStorage` 来存储，具体使用可以参考[文档](https://remix.run/docs/en/v1.0.6/api/remix#sessions)

需要在 `.env` 文件里面添加 `SESSION_SECRET="my_secret"` 值可以随意

登录之后通过 `redirect` 函数跳转并且在函数的第二个参数里设置 Cookie

```tsx
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
```

这样后面的每个请求我们都会带上 `RJ_session`。

#### 登出逻辑

有登录那么肯定有退出登录，登出需要清楚 session ，用的 [`destroySession`](https://remix.run/docs/en/v1.0.6/api/remix#using-sessions) 这个方法，具体代码可以看 [官网的代码](https://remix.run/docs/en/v1/tutorials/jokes#build-logout-action)

如果是在 action 里面退出登录 Remix 会调用 loader ，但如果是一个链接的话，就不会触发 loader 函数。

### 错误处理

#### 预期外的错误

在项目真正上生产后，总是难免会出现一些问题，这些问题可能是我们无法意料到的，例如网络问题啊，服务器挂了啊，同时用了 `// @ts-ignore` 忽略 TypeScript 的预警。

而错误处理，正是 Remix 的一大亮点之一。和 React 的 [Error Boundary 功能](https://reactjs.org/docs/error-boundaries.html#gatsby-focus-wrapper) 类似，Remix 可以让我们导出一个 Error Boundary 组件，在这个组件里面可以处理 loader 和 action 的数据。

如果你直接在 root.tsx 导出 Error Boundary 组件的话，你会发现样式都没了，为什么会这样呢？如果你点开 network 选项，你会发现请求发回的页面是下面这样的

```html
<!DOCTYPE html>
<div class="error-container">
  <h1>Oops! Something went wrong</h1>
  <p>lol is not defined</p>
</div>
```

这是因为 root.tsx 需要自己渲染 `html` 标签还有对应的 `<link>` 标签，所以我们需要将原本的代码抽离出一个组件

把 Error Boundary 组件作为子组件这样样式就会生效了。

下面的代码就是返回的 HTML，可以看到 `<head>` , `<link>` 和开发环境中支持热更新建立的 websocket

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Remix: So great, it&#x27;s funny!</title>
    <link rel="stylesheet" href="/build/_assets/global-3NTXPLP2.css" />
    <link
      rel="stylesheet"
      href="/build/_assets/global-medium-DRHJR3JT.css"
      media="print, (min-width: 640px)"
    />
    <link
      rel="stylesheet"
      href="/build/_assets/global-large-NKTQAWDZ.css"
      media="screen and (min-width: 1024px)"
    />
    <link rel="stylesheet" href="/build/_assets/jokes-MGLBGUHK.css" />
  </head>
  <body>
    <div class="error-container">
      <h1>Oops! Something went wrong</h1>
      <p>lol is not defined</p>
    </div>
    <script>
      let ws = new WebSocket("ws://localhost:8002/socket");
      ws.onmessage = (message) => {
        let event = JSON.parse(message.data);
        if (event.type === "LOG") {
          console.log(event.message);
        }
        if (event.type === "RELOAD") {
          console.log("💿 Reloading window ...");
          window.location.reload();
        }
      };
      ws.onerror = (error) => {
        console.log("Remix dev asset server web socket error:");
        console.error(error);
      };
    </script>
  </body>
</html>
```

![image-20211216173406714](https://gitee.com/SKADaddy/pic/raw/master/image-20211216173406714.png)

通常来说遇到一些奇奇怪怪的错误网页可能就崩了，或者整个页面展示出对应的错误，Remix 厉害的一点就在于这里，因为是嵌套路由的关系，只是 $jokeId.tsx 无法使用，它的父级页面仍然可以点击跳转到对应的 joke。这样用户体验会更好，不用刷新或者回退页面了。

##### useMatches

在 Error Boundary 组件中还可以使用 `useMatches` 来获取匹配的路由和数据，在 $jokeId.tsx 的 loader 中 throw 一个错误

```tsx
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  throw new Error("whoops");
  console.log(params); // <-- {jokeId: "123"}
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  // if (!joke) throw new Error("Joke not found");
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };
  return data;
};

// 在 ErrorBoundary 中使用 useMatches
export function ErrorBoundary({ error }: { error: Error }) {
  const params = useParams();
  console.log(useMatches());
  // throw ahha;
  return (
    <div className="error-container">{`Something went wrong when loading ${params.jokeId}!!!`}</div>
  );
}
```

打印出来的结果如下

```ts
[
  {
    pathname: "/",
    params: { jokeId: "88f54075-151a-48ed-9bb2-3b1615f5e53d" },
    data: null,
    handle: undefined,
  },
  {
    pathname: "/jokes",
    params: { jokeId: "88f54075-151a-48ed-9bb2-3b1615f5e53d" },
    data: { jokes: [Array], user: null },
    handle: undefined,
  },
  {
    pathname: "/jokes/88f54075-151a-48ed-9bb2-3b1615f5e53d",
    params: { jokeId: "88f54075-151a-48ed-9bb2-3b1615f5e53d" },
    data: null,
    handle: undefined,
  },
];
```

#### 处理意料之内的错误

有一些错误是我们知道可能会发生的错误，像 >400 && < 500 是客户端错误，>500 是服务端错误。

对于客户端的错误，Remix 提供了一个类似于 Error Boundary 的东西，叫 [`Catch Boundaries`](https://remix.run/docs/en/v1.0.6/api/conventions#catchboundary) 。和 loader、action 用法差不多，通过 `useCatch` 获取抛出的 Response 对象，然后根据 Response 进行相关处理。

```tsx
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};
// ...

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}
```

![image-20211217095424643](https://gitee.com/SKADaddy/pic/raw/master/image-20211217095424643.png)

有新增那么就有删除，但是在 `<form>` 表单中只有 GET 和 POST，不支持 DELETE ，为了可以让表单在没有 JavaScript 的情况下也能正常使用，官网举了个例子

```html
<form method="post">
  <input type="hidden" name="_method" value="delete" />
  <button type="submit">Delete</button>
</form>
```

这样就可以在 action 里面通过 `request.formData().get('_method')` 知道这个请求事 DELETE 请求

### SEO

现在流行的框架打包出来的应用都是单页应用，众所周知单页应用对于 SEO 不太友好。Remix 为我们提供了一个 [MetaFunction](https://remix.run/docs/en/v1.0.6/api/conventions#meta) ，我们导出一个 meta 函数，就可以在里面读取到 loader 的数据再动态赋值给 `<meta>` 标签。我们还要像上面加载 CSS 样式一样，从 remix 里面引入 `<Meta />` 组件放到 `<head>` 标签里面。

```tsx
import type { LinksFunction, MetaFunction } from "remix";
import { Links, LiveReload, Outlet, useCatch, Meta } from "remix";

import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};

export const meta: MetaFunction = () => {
  const description = `Learn Remix and laugh at the same time!`;
  return {
    description,
    keywords: "Remix,jokes",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Jokes",
    "twitter:description": description,
  };
};

function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
```

### 资源路由

有时候我们想让我们的路由渲染的内容不单单是 HTML 文本，像 pdf、rss 订阅之类的。我们需要把文件名中的 `.` 加上中括号，官网的 rss 例子就是 `jokes[.]rss.tsx`

```tsx
import type { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";

function escapeCdata(s: string) {
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const loader: LoaderFunction = async ({ request }) => {
  const jokes = await db.joke.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { jokester: { select: { username: true } } },
  });

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;

  const rssString = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>Some funny jokes</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes
          .map((joke) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(joke.name)}]]></title>
              <description><![CDATA[A funny joke called ${escapeHtml(
                joke.name
              )}]]></description>
              <author><![CDATA[${escapeCdata(
                joke.jokester.username
              )}]]></author>
              <pubDate>${joke.createdAt.toUTCString()}</pubDate>
              <link>${jokesUrl}/${joke.id}</link>
              <guid>${jokesUrl}/${joke.id}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString)),
    },
  });
};
```

这里可能会报错，我们需要把 `tsconfig.json` 的 `compilerOptions` 的 `"lib": ["DOM", "DOM.Iterable", "ES2019"],` 改成这个 `"lib": ["DOM", "DOM.Iterable", "ES2021"],`

![image-20211217114052585](https://gitee.com/SKADaddy/pic/raw/master/image-20211217114052585.png)

### JavaScript

在之前的开发中，细心的同学可能已经发现了，当我们的页面刷新加载的时候，我们的应用是不会加载 js 文件的，

![image-20211217114323527](https://gitee.com/SKADaddy/pic/raw/master/image-20211217114323527.png)

可以看到这里只加载了我的谷歌插件的 js 文件，没有和 Remix 相关的 js 文件。这也是 Remix 的一大亮点之一！！！可能有人会说，现在都什么年代了，加载一下 JavaScript 又不会怎么样。这也能算优点？但是毕竟每个人的情况不一样，网速有快有慢，慢的可能需要等待你的应用加载完 JavaScript 才能使用相应的功能，但是如果用户无需加载 JS 文件就能够使用正常的功能，那么对于用户的体验来说是一种很大的提升。

但是这也是有缺点的，当我们点击左边的 joke 获取对应的数据时，你会发现我们的网页是会刷新的，虽然热更新的速度非常快，但它还是刷新页面了。

除了上面这点，有些情况还是需要 JS 文件才能运行的，例如一些 UI 展示还是需要 JS 来判断什么时候展示什么样的 UI。

让 Remix 加载 JS 文件我们可以从 remix 包里面引入 `<Scripts />` 组件

```tsx
import { Links, LiveReload, Outlet, useCatch, Meta, Scripts } from "remix";

// ...

function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
```

现在我们就可以看到加载了的 JS 文件，而且点击 joke 获取笑话的时候页面也不会刷新了

![image-20211217115621197](https://gitee.com/SKADaddy/pic/raw/master/image-20211217115621197.png)

而且你现在 `ErrorBoundary` 组件用 `console.error` 打印错误的时候，它不仅仅会在服务端打印出，在浏览器也可以打印出错误的信息。

![Browser console showing the log of a server-side error](https://gitee.com/SKADaddy/pic/raw/master/server-side-error-in-browser.png)

### Form

HTML 的原生标签 `<form>` 在提交后会刷新页面，所以 Remix 为我们提供了加强版的 [`<Form />`](https://remix.run/docs/en/v1.0.6/api/remix#form) 组件，在 JavaScript 没有加载完成的时候，它是原生的 `<form>` 标签，当 JS 加载完成之后，它就变成增强版，会发送 `fetch` 请求，默认 `preventDefault` 这样就不会发请求刷新页面了。

### Prefetch

如果一个用户的鼠标移动到一个链接上面，则表明这个用户可能想跳转到那个页面，所以我们可以 prefetch 对应的页面，这样用户点击跳转的时候会觉得很快。在 Remix 要实现这个功能很简单只需要在 `<Link />` 组件上加一个属性 `prefetch`

从 Remix 的 TypeScript 文件中可以看到这个属性有三个值可以填

![image-20211217154146528](https://gitee.com/SKADaddy/pic/raw/master/image-20211217154146528.png)

当你的鼠标移上去的时候你会发现 network 里面成功 prefetch 对应的 JS 文件

![image-20211217153534969](https://gitee.com/SKADaddy/pic/raw/master/image-20211217153534969.png)

### UI 交互优化

官网的例子中还讲述了如何通过 `useTransition` 来优化用户点击提交数据后 UI 界面的互动展示，[详情](https://remix.run/docs/en/v1/tutorials/jokes#optimistic-ui) 可以直接点进去看，这里就不展开描述了。

### 部署

官网教程是用的 [fly.io](https://fly.io/) 来部署这个项目的，感兴趣的朋友可以注册个账号试一试

### 总结

Remix 作为一款全栈框架有着以下几个优点

- 天然的嵌套路由优势
- 各种错误的边界处理
- 靠近原生 WEB ，不需要投入过多的学习成本，当然还是要学习 React 的基础知识的
- SEO 友好
- 自动拆分代码，无需繁琐的配置

Remix 毕竟才刚出 1.0 版本没多久，生态、教程之类的资源还比较少，但是相信在 Remix 在关闭收费订阅模式作为开源项目能够拿到 300 万美元的投资，不少人对这个框架还是对有信心的，毕竟服务端渲染的 SEO 问题，很多人都会搭配 Next 或 Nuxt 来进行开发。Remix 作为全栈框架也可以提供服务端渲染，并且是一体的，相信在未来会有更多人选择 Remix 框架。

从前端到全栈，我想这是很多人都有想过的问题，要做到全栈，很多时候就意味着需要重新学习一门语言，这成为了很多人的拦路虎。

Remix 解决了语言的问题，将会是许多前端开发人员迈向全栈的一种尝试，相信前端的未来发展绝不仅于此。
