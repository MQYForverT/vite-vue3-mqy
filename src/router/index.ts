import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '/@/layout/index.vue'

/* Router modules */
// import chartsRouter from './modules/charts'
import nestedRouter from './modules/nested'

export const constantRoutes = [
	{
		path: '/redirect',
		name:'Redirect',
		component: Layout,
		meta: { hidden: true },
		children: [
			{	
				name:'RedirectAll',
				path: '/redirect/:path(.*)*',
				component: () => import('/@/views/redirect/index.vue')
			}
		]
	},
	{
		path: '/',
		name:'Layout',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: 'dashboard',
				component: () => import('/@/views/dashboard/index.vue'),
				name: 'Dashboard',
				meta: {
					title: 'dashboard',
					icon: 'dashboard',
					affix: true
				}
			}
		]
	},
	{	
		name: 'Login',
		path: '/login',
		component: () => import('/@/views/login/index.vue'),
		meta: { hidden: true }
	}
]

/**
 * asyncRoutes
 */
export const asyncRoutes = [
	// chartsRouter,
	nestedRouter
]

const initRouter = () =>
	createRouter({
		history: createWebHistory(),
		routes: constantRoutes,
		strict: true,
		scrollBehavior: (to, from, savedPosition) => {
			if (savedPosition) {
				return savedPosition
			} else {
				return { x: 0, y: 0 }
			}
		}
	})

const router = initRouter()

export function resetRouter() {
	//删除异步路由
	const resetWhiteNameList = ['Login','Redirect','RedirectAll','Layout','Dashboard']
	router.getRoutes().forEach(route => {
		const { name } = route
		if (name && !resetWhiteNameList.includes(name as string)) {
			router.hasRoute(name) && router.removeRoute(name)
		}
	})
}

export default router
