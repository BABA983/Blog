module.exports = {
  base: "/Blog/",
  title: `BABA's Blog`,
  description: "BABA 的个人博客",
  theme: "reco",
  themeConfig: {
    subSidebar: "auto",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "BABA",
        items: [
          { text: "Github", link: "https://github.com/SKADaddy" },
          {
            text: "掘金",
            link: "https://juejin.cn/user/2137106337768238/posts",
          },
        ],
      },
    ],
    sidebar: [
      {
        title: "Vue",
        path: "/article/vue/composition-api",
        collapsable: false, // 不折叠
        children: [
          { title: "composition-api", path: "/article/vue/composition-api" },
        ],
      },
      {
        title: "React",
        path: "/article/react/remix-offical-tutorial",
        collapsable: false, // 不折叠
        children: [
          {
            title: "remix-offical-tutorial",
            path: "/article/react/remix-offical-tutorial",
          },
        ],
      },
    ],
  },
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
