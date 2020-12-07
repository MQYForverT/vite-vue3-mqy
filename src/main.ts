import { createApp } from 'vue'
import router from '/@/router'
import store from '/@/store'
import App from './App.vue'

// 注册全局插件/组件
import overall from '/@/utils/overall'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(overall)// app.use():全局注册插件
app.mount('#app')
