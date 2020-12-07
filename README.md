## 依赖(npm)
一、Vue3全家桶:[vite vue3 vuex4 vue-router ts]
1.npm i -g create-vite-app（全局安装create-vite-app，create vite-app '项目名'，安装的vue项目默认vue版本就是vue3）
2.npm i vuex@next（使用与 vuex3 相同的 API。）
3.vuex-module-decorators（vuex装饰器）
4.npm i vue-router@next
5.npm i typescript -D（因为ts-loader是webpack打包编译typescript的，我们这是vite，所以不需要安装ts-loader）
*在项目根目录创建配置文件vite.config.ts*

二、主Ui框架:我这里还是选用element，不过是plus版本，适配vue3的
1.npm install element-plus --save（(https://element-plus.gitee.io/#/zh-CN/component/installation)）

三、接口调用工具
1.npm install axios
2.npm install qs

死、css转换工具:PostCSS，是一个用 JavaScript 工具和插件转换 CSS 代码的工具，除了直接代替scss等预处理器之外还有其他功能
1.npm install postcss-cssnext -D（可以定义变量、样式嵌套、自动加前缀，集成了autoprefixer、postcss-nesting等，详细请自行查看）
2.npm install postcss-pxtorem -D（自动把px单位转换为rem）
3.npm install cssnano -D（css压缩工具）
4.npm install cssnano-preset-advanced（cssnano的高级设置，通常和cssnano配合使用）
*在项目根目录创建配置文件postcss.config.js*

五、语法规则和代码风格的检查工具：eslint（[ESlint 中文官方网站](https://cn.eslint.org/)）
1.npm install eslint -D（检查工具，它的目标是保证代码的一致性和避免错误）
2.npm install eslint-plugin-vue -D（这个插件允许我们用ESLint检查.vue文件的<template>和<script>）
*在项目根目录创建配置文件.eslintrc.js*

六.图标库
1.npm i -D vite-plugin-svg
直接引入svg图片，(建议从阿里图标库引入)，然后只需用VueComponent从文件路径导入即可
详细：[https://github.com/visualfanatic/vite-plugin-svg](https://github.com/visualfanatic/vite-plugin-svg)

七.国际化
1.npm install --save vue-i18n@next，使用自己的，在src下面新建lang文件夹，然后main.ts中引入自己的，详细自己看代码

八.工具类
1.npm install js-base64，并编写相关ts文件base64.ts,用于路由跳转时对传参进行加密
2.npm install js-cookie
3.npm install nprogress，并在相关ts文件permission.ts中引用
4.npm install clipboard，剪切板，并编写相关ts文件clipboard.ts