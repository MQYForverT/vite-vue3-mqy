<template>
	<div :class="{ show: show }" class="header-search">
		<svg-icon class="search-icon" name="search" @click.stop="click" />
		<el-select
			ref="headerSearchSelect"
			v-model="search"
			:remote-method="querySearch"
			filterable
			default-first-option
			remote
			placeholder="Search"
			class="header-search-select"
			@change="change"
		>
			<el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
		</el-select>
	</div>
</template>

<script lang="ts">
import path from 'path'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { defineComponent, onMounted, ref, reactive, computed, watch, getCurrentInstance, nextTick } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization

export default defineComponent({
	name: 'HeaderSearch',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let router = useRouter()
		let search = ref('')
		let show = ref(false)
		let options = ref([])
		let searchPool = ref([])
		let fuse = null
		let headerSearchSelect = ref(null)

		const routes = computed(() => PermissionModule.routes)

		const lang = computed(() => AppModule.language)

		watch(lang, () => {
			searchPool.value = generateRoutes(routes.value)
		})

		watch(routes, () => {
			searchPool.value = generateRoutes(routes.value)
		})

		watch(show, value => {
			if (value) {
				document.body.addEventListener('click', close)
			} else {
				document.body.removeEventListener('click', close)
			}
		})

		watch(searchPool, value => {
			initFuse(value)
		})

		onMounted(() => {
			searchPool.value = generateRoutes(routes.value)
		})

		function click() {
			show.value = !show.value
			if (show.value) {
				headerSearchSelect.value && (headerSearchSelect.value as HTMLElement).focus()
			}
		}

		function close() {
			headerSearchSelect.value && (headerSearchSelect.value as HTMLElement).blur()
			options.value = []
			show.value = false
		}

		function change(route: RouteRecordRaw) {
			router.push(route.path)
			search.value = ''
			options.value = []
			nextTick(() => {
				show.value = false
			})
		}

		function initFuse(list: RouteRecordRaw[]) {
			fuse = new Fuse(list, {
				shouldSort: true,
				threshold: 0.4,
				location: 0,
				distance: 100,
				minMatchCharLength: 1,
				keys: [
					{
						name: 'title',
						weight: 0.7
					},
					{
						name: 'path',
						weight: 0.3
					}
				]
			})
		}

		// 筛选出可以在侧边栏中显示的路由
		// 并产生国际化的称号
		function generateRoutes(routes: RouteRecordRaw[], basePath = '/', prefixTitle: string[] = []) {
			let res: RouteRecordRaw[] = []
			for (let router of routes) {
				// 跳过隐藏路由器
				if (router.meta && router.meta.hidden) {
					continue
				}
				const data: any = {
					path: path.resolve(basePath, router.path),
					meta: {
						title: [...prefixTitle]
					}
				}
				if (router.meta && router.meta.title) {
					// 生成国际化标题
					const i18ntitle = i18n.global.t(`route.${router.meta.title}`).toString()
					// data.meta.title = [...data.meta.title, i18ntitle];
					data.title = [...data.meta.title, i18ntitle]

					if (router.redirect !== 'noRedirect') {
						// 只推带标题的路由
						// 特殊情况：需要排除没有重定向的父路由器
						res.push(data)
					}
				}
				// 递归子路由
				if (router.children) {
					const tempRoutes = generateRoutes(router.children, data.path, data.title)
					if (tempRoutes.length >= 1) {
						res = [...res, ...tempRoutes]
					}
				}
			}
			return res
		}

		function querySearch(query: string) {
			if (query !== '') {
				if (fuse) {
					options.value = fuse.search(query).map(result => result.item)
				}
			} else {
				options.value = []
			}
		}

		return {
			headerSearchSelect,
			options,
			show,
			click,
			search,
			querySearch,
			change
		}
	}
})
</script>

<style scoped>
.header-search {
	font-size: 0 !important;
	& .search-icon {
		cursor: pointer;
		font-size: 18px;
		vertical-align: middle;
	}
	& .header-search-select {
		font-size: 18px;
		transition: width 0.2s;
		width: 0;
		overflow: hidden;
		background: transparent;
		border-radius: 0;
		display: inline-block;
		vertical-align: middle;
		& .el-input__inner {
			border-radius: 0;
			border: 0;
			padding-left: 0;
			padding-right: 0;
			box-shadow: none !important;
			border-bottom: 1px solid #d9d9d9;
			vertical-align: middle;
		}
	}
	&.show {
		& .header-search-select {
			width: 210px;
			margin-left: 10px;
		}
	}
}
</style>
