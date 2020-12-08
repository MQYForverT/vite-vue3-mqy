// 在这里全局注册插件
import { ObjectDirective } from 'vue'
import { AppModule } from '/@/store/modules/app'
import lodash from 'lodash'
import Base64 from './base64'
import '/@/utils/permission'
import '/@/utils/rem'
import '/@/styles/index.css'

import * as directives from '/@/directives'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import i18n from '/@/lang'

// import DialogClustom from '@/components/DialogClustom/index.vue'
import MainBody from '/@/components/MainBody/index.vue'
import SvgIcon from '/@/svg/svg-icon/index.vue'

export default {
	install(app) {
		// 全局方法
		// prototype => config.globalProperties
		app.config.globalProperties.$lodash = lodash // 赋值使用
		app.config.globalProperties.$Base64 = Base64

		app.use(i18n)

		app.use(ElementPlus, {
			size: AppModule.size, // Set element-plus default size
			i18n: (key: string, value: string) => i18n.global.t(key, value)
		})

		// 注册指令
		Object.keys(directives).forEach(key => {
			app.directive(key, (directives as { [key: string]: ObjectDirective })[key])
		})

		// 全局组件
		app.component('svg-icon', SvgIcon)
		app.component('main-body', MainBody)
	}
}
