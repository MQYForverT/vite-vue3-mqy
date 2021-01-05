<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
				<span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">{{ i18n.global.t('route.' + item.meta.title) }}</span>
				<a v-else @click.prevent="handleLink(item)">{{ i18n.global.t('route.' + item.meta.title) }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { defineComponent, reactive, watch, getCurrentInstance } from 'vue'
import i18n from '@/lang'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'Breadcrumb',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let router = useRouter()
		let breadcrumbs = reactive([])

		function getBreadcrumb(){
			let matched = ctx.$router.currentRoute.value.matched.filter(item => item.meta && item.meta.title)
			const first = matched[0]
			if (!isDashboard(first)) {
				matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
			}
			breadcrumbs = matched.filter(item => {
				return item.meta && item.meta.title
			})
		}

		function isDashboard (route){
			const name = route && route.name
			if (!name) {
				return false
			}
			return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
		}

		function pathCompile(path: string){
			// To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
			const { params } = ctx.$router.currentRoute.value
			const toPath = compile(path)
			return toPath(params)
		}

		function handleLink(item: any){
			const { redirect, path } = item
			if (redirect) {
				router.push(redirect).catch(err => {
					// Throw Error "NavigationDuplicated"
					// https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
					console.warn(err)
				})
				return
			}
			router.push(pathCompile(path)).catch(err => {
				// Throw Error "NavigationDuplicated"
				// https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
				console.warn(err)
			})
		}

		getBreadcrumb()

		watch(
			() => ctx.$router.currentRoute.value,
			route => {
				if (route.path.startsWith('/redirect/')) {
					return
				}
				getBreadcrumb()
			}
		)

		return {
			breadcrumbs,
			handleLink,
			i18n
		}
	}
})
</script>

<style scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
	font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 8px;

	& .no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
