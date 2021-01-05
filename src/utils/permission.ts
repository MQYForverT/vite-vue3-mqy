import router from '@/router'
import NProgress from 'nprogress'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import 'nprogress/nprogress.css'
import i18n from '@/lang'
import settings from '@/settings'
import { ElMessage as Message } from 'element-plus'
import Layout from '@/layout/index.vue'

NProgress.configure({ showSpinner: false })

// 白名单
const whiteList = ['/login']

const getPageTitle = (key: string) => {
	if (key) {
		const pageName = i18n.global.t(`route.${key}`)
		return `${pageName} - ${settings.title}`
	}

	return `${settings.title}`
}

router.beforeEach(async (to, from, next) => {
	// Start progress bar
	NProgress.start()
	// 确定用户是否已登录
	if (UserModule.token) {
		if (to.path === '/login') {
			// 如果已登录，则重定向到主页
			next({ path: '/' })
			NProgress.done()
		} else {
			// 检查用户是否已获得权限角色
			if (UserModule.roles.length === 0) {
				try {
					await UserModule.getUserInfoByToken()
					const roles = UserModule.roles
					// 基于角色生成可访问路由图,先设置路由信息
					PermissionModule.GenerateRoutes(roles)
					// // 动态添加可访问路由，再从store取出路由数据信息
					PermissionModule.dynamicRoutes.forEach(x => {
						router.addRoute(x)
					})
					// Hack: 确保addRoutes已完成
					next({ ...to })
				} catch (err) {
					// 删除令牌并重定向到登录页
					UserModule.ResetToken()
					Message.error(err || 'Has Error')
					next('/login')
					NProgress.done()
				}
			} else {
				next()
			}
		}
	} else {
		// 没有token、
		if (whiteList.includes(to.path)) {
			// 在免费登录白名单中，直接进入
			next()
		} else {
			// 其他没有访问权限的页面将被重定向到登录页面。
			next('/login')
		}
		NProgress.done()
	}
})

router.afterEach(to => {
	// Finish progress bar
	// hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
	NProgress.done()

	// set page title
	document.title = getPageTitle(to.meta.title)
})
