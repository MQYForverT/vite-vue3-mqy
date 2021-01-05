import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from './App.vue'

// 注册全局插件/组件
import overall from '@/utils/overall'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(overall)// app.use():全局注册插件
router.isReady().then(() => app.mount('#app'))//如果使用transition，则可能需要在安装应用程序之前等待路由器准备就绪：

