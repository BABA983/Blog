# 在 Vue2 项目中使用@vue/composition-api

## 为什么要使用 composition-api

可能很多人会问，为什么一定要在`vue2`上使用`composition-api`呢？直接把项目升级到`vue3`不就好了吗？

1. 生态问题，许多开源的库目前正在逐步升级到 vue3
2. 项目如果非常庞大那么做起`vue2` -> `vue3`的迁移还是非常麻烦的。
3. 在`vue2`使用`composition-api`不会影响到现有的功能，并且在未来如果要升级到`vue3`那么只需要把引入的包从`@vue/composition-api`改为`vue`就可以了

## 安装@vue/composition-api

[@vue/composition-api](https://github.com/vuejs/composition-api)

```sh
npm install @vue/composition-api
# or
yarn add @vue/composition-api
```

光下载完可不行，我们还需要把他当作插件一样来注册他`Vue.use()`

```js
import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
```

然后在`.vue`组件里面引入，就可以使用部分`vue3`的功能啦

```js
// use the APIs import { ref, reactive } from '@vue/composition-api' // 💡 When
you migrate to Vue 3, just replacing `@vue/composition-api` to `vue` and your
code should just work. import { ref, reactive } from 'vue'
```

## TypeScript 支持

可能有的同学会问，我现在用的`Vue2`项目引入了`vue-property-decorator`和`vue-class-component`来支持`Typescript`的写法，如果我改为`composition-api`的写法那我岂不是又只能写`Javascript`了？之前辛辛苦苦学的`TypeScript`岂不是白学了。

放心朋友，虽然`Vue 2.6`以前的版本`Vue`是用的`flow`来进行类型检查，但是在`Vue3`以及`Vue conf`上所说的在 Q3 发布的`Vue2.7`都是使用的`TypeScript`来进行类型检查，所有`composition-api`也是支持`TypeScript`的

但是需要`TypeScript`的版本`>3.5.1`

```js
import { defineComponent } from '@vue/composition-api' //
只需要把代码写在defineComponent里面，ts的静态检查就会工作 export default
defineComponent({ // type inference enabled props:{} setup(props,ctx){} data(){}
created(){}
mounted(){} })
```

## 浏览器支持

与`Vue3`一样，`composition-api`支持所有现代浏览器以及 IE11+，如果需要支持低版本的 IE 你应该安装`WeakMap`的 polyfill 例如`core-js`

## composition-api VS options api

​ 像下面的代码就是`Vue2`的 options api,当我们的代码到达一定量的时候这种结构就会很难以维护，这时候就有人会说，我们可以使用`mixin`把公共逻辑抽取出来。

```ts
<scirpt>
 export default {
    components:{}
    mixins:[xxxMixin]
    props:{}
    data(){
      return{
        // some reactive data
      }
    },
    created(){
    this.getList()
   },
    methods:{
    getList(){}
   }
}
</scirpt>
```

​ 但我想很多人都会遇到过这种问题：在`<template>`或者`methods`选项中找某个方法或者变量的时候找遍整个`.vue`文件都找不到，直到看到`script`标签里面看到个`mixins`选项才恍然大悟，哦，原来是混入进来的，然后如果`mixins`里面有多个`mixin`又要去每个文件里面去找到对应的变量

​ 除了上面的这种情况，如果我们需要往这个`.vue`文件添加新的功能，那么我们很大概率需要进行以下几个步骤

​ 1⃣️ 在`data`选项中定义对应的变量，这样才可以使这个变量变为响应式的

​ 2⃣️ 在`methods`选项中新增对应的函数方法

​ 或者我们也可以把新功能抽成`mixin`但是这样我们可能会遇到之前所说的问题，当然这些问题我们也可以通过一些方法避免，例如定义的变量前缀带一个`Mixin_`例如`Mixin_xxx`这样在用这个变量的时候我们就会知道，哦，这是个`mixin`，而不是找遍所有文件之后才发现他是个`mixin`

​ 下面我就用一张经典老图来展示出`composition-api`他的优势

![img](https://gitee.com/SKADaddy/pic/raw/master/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

可能有人看到这张图的时候会很困惑，就会说”诶小伙子，我看你这两个对比下来，代码量也没多大变化啊还是这么长啊看着“。

但是实际上我们可以根据颜色把右边的代码看成这样

```javascript
setup(props,ctx){
  // 相对于mixin是不是更加的清晰
  const { username,login } = useLogin()
  const { pageNum, total, pageSize, getList } = usePagination()
  const { xxx, XXX } = useXxx()
}
```

为什么可以看成这样呢？

这时候就需要先引入`ref`以及`reactive`这两个概念了

### ref、reactive

在 options api 中如果我们要让变量是 reactive 的，我们需要把变量都定义在`data()`中，但是在`setup()`中我们可以使用`ref`或者`reactive`在`setup`这个函数体的任意地方使得该变量转换成 reactive 的变量

```js
setup(){
  // 我们可以先在这里定义一个变量
  const dataList = ref([])
  dataList.value = getList()
  // 假设我们的代码很长，然后如果有某些条件，我们可以紧接着再定义一个变量，而不需要再回到data()里面重新定义一个新变量使得这个变量reactive
  const message = ref('')
  message.value = getMessage()

  // 当然，如果你习惯了options api或者说，你们公司自己的规范就是希望变量都定义在同一个区域内。那么你也可以这么写
  const data = reactive({
    dataList:[],
    message:''
  })
  data.dataList = getList()
  data.message = getMessage()
}
```

细心的朋友可能已经发现，`ref`和`reactive`我们对他们俩进行数据操作的时候表现的有那么点不同，为什么`ref`定义的就需要用`.value`才能去进行访问呢？这个时候就需要看到[官方文档](https://v3.vuejs.org/guide/composition-api-introduction.html#reactive-variables-with-ref)中对于`ref`以及`reactive`的介绍了

在`Vue3`中你可以通过`ref`函数将任意的变量变成 reactive 的，就像在`Vue2`的`data()`中定义一样

```js
import { ref } from "vue";

const counter = ref(0);
```

`ref`接受一个参数，并且返回一个对象，这个对象包裹着一个名为`value`的属性，这样我们就可以通过这个`value`来访问这个属性或者更改它了

```js
import { ref } from "vue";

const counter = ref(0);

console.log(counter); // { value: 0 }
console.log(counter.value); // 0

counter.value++;
console.log(counter.value); // 1
```

那么为什么这个`ref`要做的这么复杂呢，还要把数据包一层？下面这张官网的经典动态图，生动的解释了为神魔要这么做

![Pass by reference vs pass by value](https://gitee.com/SKADaddy/pic/raw/master/pass-by-reference-vs-pass-by-value-animation-20210525102353835.gif)

这是为了在`JavaScript`中保持数据不同类型的行为一致性。因为在`JavaScript`中，基础类型像`Number`、`String`是通过值传递的，而不是引用传递。

在我们对这个变量进行一层包装后把它变为一个对象，那么我们就可以在整个 App 里面安全的传递它而不用担心在传递的过程中，在某些地方丢失它的响应性了。

换句话说，`ref`对于我们的变量所做的，就是创建了一个响应式的引用，在使用`composition-api`的过程中，这个`引用`的概念将会经常出现。

这时候回到我们上面的代码，

```js
// index.js
export default defineComponent({
  setup(props, ctx) {
    // 相对于mixin是不是更加的清晰
    const { username, login } = useLogin();
    const { pageNum, total, pageSize, getList } = usePagination();
    const { xxx, XXX } = useXxx();
  },
});
```

当我们把公共代码抽离出来，再运用这些`'mixin'`的时候，相对于`mixin`是不是更加的清晰

```js
// usePagination.js
export default function usePagination() {
  const pageNum = ref(1);
  const pageSize = ref(10);
  const total = ref(0);

  const getList = () => {
    // some logic...
  };

  return {
    pageNum,
    pageSize,
    total,
    getList,
  };
}
```

这里我们就是靠的`ref`创建的`引用`来贯穿我们的组合式 API。

需要注意的是，如果想要在`template`中使用变量就需要把它们`return`出去，而且由`ref`创建的变量也不需要使用`.value`来访问，会自动 unwrap

### Setup()

在`setup`中我们会有两个参数供我们使用，一个是`props`，另一个是`context`，下面我们来看看这两个参数到底是什么

#### Props

`props`其实就是我们父组件在传递值给我们子组件的时候的 prop 值，在`setup`中我们需要通过这个参数来调用它们，因为在`setup`中，`this`是无法使用的，`setup`中的`this`不是直接指向`Vue`实例

```js
export default defineComponent({
  props: {
    searchTemplate: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // 你可以直接这么访问
    console.log(props.searchTemplate);
  },
});
```

当你直接使用`props.xxx`访问的时候，这个是响应式的，当父组件的数据变化时，这里也会跟着变化，但是当你想使用`ES6`的解构的时候，这个属性就会失去响应性了，如果你想解构的方式去使用 props 里面传过来的值，那么你应该使用`toRefs`需要注意的是通过==.value==来进行访问

```js
export default defineComponent({
  props: {
    searchTemplate: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // 你可以直接这么访问
    console.log(props.searchTemplate);
    // ❌
    const { searchTemplate } = props;
    // ✅
    const { searchTemplate } = toRefs(props);
    console.log(searchTemplate.value);
  },
});
```

当你这个 prop 不是`required`的时候，它是不确定的，那么你用`toRefs`可能获取不到，那么他就不会创建一个`ref`，这个时候你要使用`toRef`了

```js
export default defineComponent({
  props: {
    searchTemplate: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { total } = toRef(props, "total");
    console.log(total.value);
  },
});
```

#### Context

`setup`中的第二个参数是`context`，在`Vue3`的官方文档中的介绍是一个普通的`JavaScript`对象，会暴露出三个组件属性，它们分别是`attrs`、`slots`、`emit`，但是其实在`Vue2`中使用`setup`的话，这个`context`对象里面，不仅仅只有这三个属性。

![image-20210527095433991](https://gitee.com/SKADaddy/pic/raw/master/image-20210527095433991.png)

我们可以看到除了上面介绍的三个属性以外，还有几个画了删除线的属性，~~parent~~、~~root~~、~~listeners~~、~~refs~~当我们鼠标移上去的时候就会看到提示，说这是一个废弃属性，这个属性在`Vue3`是用不了的，当然，如果你要用它也不是不行，除非你这个项目以后不想升级到`Vue3`，否则我的建议是遵循官方的做法，不要使用这些已经被废弃了的属性。

![image-20210527095736698](https://gitee.com/SKADaddy/pic/raw/master/image-20210527095736698.png)

上面这三个属性你也可以直接使用解构来获取它们，毕竟`context`只是一个普通的对象

```js
export default {
  setup(props, { attrs, slots, emit }) {
    ...
  }
}
```

在`setup`被执行的时候，组件实例是还没被创建的，`setup`是介于`beforeCreate`和`created`之间的，换句话说你只能在`setup`中访问以下属性

- `props`

- `attrs`

- `slots`

- `emit`

换句话说，你不能够访问`data`、`computed`、`methods`,而且`setup`里面没有`this`，你想访问也访问不到～～

#### this

那么可能就会有人问到，诶那既然在`setup`中都拿不到`this`那我绑定在`prototype`上的方法要怎么调用啊，不慌，我们来翻阅一下[官方文档](https://v3.vuejs.org/api/application-config.html#globalproperties)发现了这么个东东

![image-20210527102130075](https://gitee.com/SKADaddy/pic/raw/master/image-20210527102130075.png)

在`Vue3`中已经是不推荐我们将方法直接绑定在`prototype`上面了，而是换了个 api，看到这 ❤️ 都凉了半截，那组合式 API 岂不是与我无缘了，别慌，我们还有另一个[getCurrentInstance](https://v3.vuejs.org/api/composition-api.html#getcurrentinstance)，这个 API 可以让我们访问到内部的组件实例，让我们`console.log`👀 一下里面都有啥

![image-20210527104912561](https://gitee.com/SKADaddy/pic/raw/master/image-20210527104912561.png)

嚯，好家伙，东西可真不少啊，我们点进这个`proxy`看看

![image-20210527105235814](https://gitee.com/SKADaddy/pic/raw/master/image-20210527105235814.png)

之前`context`里面的各个属性，都出现在了这个`proxy`里面，不管是废弃的还是可以使用的，可能有的同学会问，但是我并没有看到那些`element`相关的方法啊，什么`$message`、`$confirm`，我们都知道，原型链是一级一级往上找的，这里没找到，我们往它的父级在看看

![image-20210527105914780](https://gitee.com/SKADaddy/pic/raw/master/image-20210527105914780.png)

不但看到`element`的方法，还看到了`Vue`自己的一些 api 方法，那具体我们可以如何使用这个`proxy`呢

```typescript
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "@vue/composition-api";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
  },
});
```

我们可以直接把它解构出来，但是这样的话，在`TypeScript`中会有一个报错

![image-20210527110244131](https://gitee.com/SKADaddy/pic/raw/master/image-20210527110244131.png)

我的办法是用类型断言 `const { proxy } = getCurrentInstance() as ComponentInternalInstance`，有的人可能会说那我`proxy.$message`、`proxy.$router.push`这样写多丑陋啊，我还是习惯用`this`。~~那我推荐你直接用回你的 options api 吧~~，你可以对这个`proxy`重命名，例如`const { proxy:_this } = getCurrentInstance() as ComponentInternalInstance`这样，看着和原来也没多大区别是不是？

### LifeCycle

在`setup`中的生命周期与传统的`options api`有那么点不一样，`setup`中是没有`created`和`beforeCreate`的，在`setup`中你直接打印一段话在控制台你会发现，setup 是在它们俩之间执行的

![image-20210527111252662](https://gitee.com/SKADaddy/pic/raw/master/image-20210527111252662.png)

而对于其他生命周期的钩子函数，`vue`也对它们进行了改名，更加的语义化了

| Options API       | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed\*        |
| `created`         | Not needed\*        |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |

### 一些踩到的坑

1、一开始用追求方便用`context.root`调用`$emit`方法的时候，虽然 vetur 有提示可以使用，但是实际根本就不会触发`$emit`

2、`getCurrentInstance`解构出来的值不要在`return`里面返回，否则会出错，详情可以看看这个[issue](https://github.com/vuejs/composition-api/issues/693)

3、因为`Vue2`和`Vue3`实现响应式的方式有点不同，所以`reactive`定义出来的变量会有那么点不一样，如果直接修改后，那么这个变量很有可能就不是响应式的了,最好还是使用`ref`来，详情可以看下这个[issue](https://github.com/vuejs/composition-api/issues/705)

### reactive([1,2,3]) VS ref([])

这个[issue](https://github.com/vuejs/docs-next/issues/801#issuecomment-757587022)说的挺清晰的

## 最后

只能说非常期待 Vue conf 所说的 Q3 会发布的 2.7 版本了，在 2.6 使用组合式 API 总的来说问题不大，而且比`mixin`用起来更爽。
