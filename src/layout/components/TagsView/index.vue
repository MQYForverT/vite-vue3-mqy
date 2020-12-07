<template>
	<div id="tags-view-container" class="tags-view-container">
		<scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
			<div>
				<router-link
					v-for="tag in visitedViews"
					:ref="tagRefs"
					:key="tag.path"
					:class="isActive(tag) ? 'active' : ''"
					:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
					class="tags-view-item"
					@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
					@contextmenu.prevent.native="openMenu(tag, $event)"
				>
					{{ i18n.global.t('route.' + tag.meta.title) }}
					<span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
				</router-link>
			</div>
		</scroll-pane>
		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<li @click="refreshSelectedTag(selectedTag)">{{ i18n.global.t('tagsView.refresh') }}</li>
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">{{ i18n.global.t('tagsView.close') }}</li>
			<li @click="closeOthersTags">{{ i18n.global.t('tagsView.closeOthers') }}</li>
			<li @click="closeAllTags(selectedTag)">{{ i18n.global.t('tagsView.closeAll') }}</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { resolve } from 'path'
import { defineComponent, watch, ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from 'vue'
import i18n from '/@/lang'
import { useRouter } from 'vue-router'
import { PermissionModule } from '/@/store/modules/permission'
import { TagsViewModule } from '/@/store/modules/tags-view'
import ScrollPane from './ScrollPane.vue'

export default defineComponent({
	name: 'TagsView',
	components: {
		ScrollPane
	},
	setup(props, context) {
		const { ctx } = getCurrentInstance()
		let tagRefs = []
		const setTagRefs = el => {
			itemRefs.push(el)
		}
		let scrollPane = ref(null)
		let router = useRouter()
		let visible = ref(false)
		let top = ref(0)
		let left = ref(0)
		let selectedTag = reactive({})
		let affixTags = reactive([])

		onMounted(() => {
			initTags()
			addTags()
		})

		const visitedViews = computed(() => {
			return TagsViewModule.visitedViews
		})

		const routes = computed(() => PermissionModule.routes)

		watch(
			() => ctx.$router.currentRoute.value,
			route => {
				if (route.name === 'Login') return
				addTags()
				moveToCurrentTag()
			}
		)

		watch(visible, value => {
			if (value) {
				document.body.addEventListener('click', closeMenu)
			} else {
				document.body.removeEventListener('click', closeMenu)
			}
		})

		function isActive(route) {
			return route.path === ctx.$router.currentRoute.value.path
		}

		function isAffix(tag) {
			return tag.meta && tag.meta.affix
		}

		function filterAffixTags(routes, basePath = '/') {
			let tags = []
			routes.forEach(route => {
				if (route.meta && route.meta.affix) {
					const tagPath = resolve(basePath, route.path)
					tags.push({
						fullPath: tagPath,
						path: tagPath,
						name: route.name,
						meta: { ...route.meta }
					})
				}
				if (route.children) {
					const childTags = filterAffixTags(route.children, route.path)
					if (childTags.length >= 1) {
						tags = [...tags, ...childTags]
					}
				}
			})
			return tags
		}

		function initTags() {
			affixTags = filterAffixTags(routes.value)
			for (const tag of affixTags) {
				// Must have tag name
				if (tag.name) {
					TagsViewModule.addVisitedView(tag)
				}
			}
		}

		function addTags() {
			const { name } = ctx.$router.currentRoute.value
			if (name) {
				TagsViewModule.addView(ctx.$router.currentRoute.value)
			}
			return false
		}

		function moveToCurrentTag() {
			const tags = tagRefs // TODO: better typescript support for router-link
			nextTick(() => {
				for (const tag of tags) {
					if (tag.to.path === ctx.$router.currentRoute.value.path) {
						scrollPane.value.moveToTarget(tag)
						// When query is different then update
						if (tag.to.fullPath !== ctx.$router.currentRoute.value.fullPath) {
							TagsViewModule.updateVisitedView(ctx.$router.currentRoute.value)
						}
						break
					}
				}
			})
		}

		function refreshSelectedTag(view) {
			// 删除缓存
			TagsViewModule.delCachedView(view)
			const { fullPath } = view
			// 重定向
			nextTick(() => {
				router.replace({
					path: '/redirect' + fullPath
				})
			})
		}

		function closeSelectedTag(view) {
			TagsViewModule.delView(view)
			if (isActive(view)) {
				toLastView(TagsViewModule.visitedViews, view)
			}
		}

		function closeOthersTags() {
			if (selectedTag.fullPath !== ctx.$router.currentRoute.value.path && selectedTag.fullPath !== undefined) {
				router.push(selectedTag.fullPath)
			}
			TagsViewModule.delOthersViews(selectedTag)
			moveToCurrentTag()
		}

		function closeAllTags(view) {
			TagsViewModule.delAllViews()
			if (affixTags.some(tag => tag.path === ctx.$router.currentRoute.value.path)) {
				return
			}
			toLastView(TagsViewModule.visitedViews, view)
		}

		function toLastView(visitedViews, view) {
			const latestView = visitedViews.slice(-1)[0]
			if (latestView !== undefined && latestView.fullPath !== undefined) {
				router.push(latestView.fullPath)
			} else {
				// Default redirect to the home page if there is no tags-view, adjust it if you want
				if (view.name === 'Dashboard') {
					// to reload home page
					router.replace({ path: '/redirect' + view.fullPath })
				} else {
					router.push('/')
				}
			}
		}

		function openMenu(tag, e) {
			const menuMinWidth = 105
			const offsetLeft = ctx.$el.getBoundingClientRect().left // container margin left
			const offsetWidth = ctx.$el.offsetWidth // container width
			const maxLeft = offsetWidth - menuMinWidth // left boundary
			const left2 = e.clientX - offsetLeft + 15 // 15: margin right
			if (left2 > maxLeft) {
				left.value = maxLeft
			} else {
				left.value = left2
			}
			top.value = e.clientY
			visible.value = true

			for (let x in tag) {
				selectedTag[x] = tag[x]
			}
		}

		function closeMenu() {
			visible.value = false
		}

		function handleScroll() {
			closeMenu()
		}

		return {
			i18n,
			tagRefs,
			handleScroll,
			visitedViews,
			isActive,
			isAffix,
			closeSelectedTag,
			openMenu,
			visible,
			left,
			top,
			refreshSelectedTag,
			selectedTag,
			closeOthersTags,
			closeAllTags
		}
	}
})
</script>

<style>
.tags-view-wrapper {
	& .tags-view-item {
		& .el-icon-close {
			width: 16px;
			height: 16px;
			vertical-align: 2px;
			border-radius: 50%;
			text-align: center;
			transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			transform-origin: 100% 50%;

			&:before {
				transform: scale(0.6);
				display: inline-block;
				vertical-align: -3px;
			}

			&:hover {
				background-color: #b4bccc;
				color: #fff;
			}
		}
	}
}
</style>
<style scoped>
.tags-view-container {
	height: 34px;
	width: 100%;
	background: #fff;
	border-bottom: 1px solid #d8dce5;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

	& .tags-view-wrapper {
		& .tags-view-item {
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 26px;
			line-height: 26px;
			border: 1px solid #d8dce5;
			color: #495060;
			background: #fff;
			padding: 0 8px;
			font-size: 12px;
			margin-left: 5px;
			margin-top: 4px;

			&:first-of-type {
				margin-left: 15px;
			}

			&:last-of-type {
				margin-right: 15px;
			}

			&.active {
				background-color: #42b983;
				color: #fff;
				border-color: #42b983;

				&::before {
					content: '';
					background: #fff;
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					position: relative;
					margin-right: 2px;
				}
			}
		}
	}

	& .contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

		& li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;

			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
