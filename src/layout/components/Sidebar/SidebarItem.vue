<template>
	<div v-if="!item.meta || !item.meta.hidden" :class="[isCollapse ? 'simple-mode' : 'full-mode', { 'first-level': isFirstLevel }]">
		<template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
			<sidebar-item-link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
				<el-menu-item :index="resolvePath(theOnlyOneChild.path)" :class="{ 'submenu-title-noDropdown': isFirstLevel }">
					<svg-icon v-if="theOnlyOneChild.meta.icon" :name="theOnlyOneChild.meta.icon" :fill="getActive(theOnlyOneChild.meta.icon)" />
					<template #title v-if="theOnlyOneChild.meta.title">
						<span>{{ i18n.global.t('route.' + theOnlyOneChild.meta.title) }}</span>
					</template>
				</el-menu-item>
			</sidebar-item-link>
		</template>
		<el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
			<template #title>
				<svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" :fill="getActive(item.meta.icon)" />
				<span v-if="item.meta && item.meta.title">{{ i18n.global.t('route.' + item.meta.title) }}</span>
			</template>
			<template v-if="item.children">
				<sidebar-item
					v-for="child in item.children"
					:key="child.path"
					:item="child"
					:is-collapse="isCollapse"
					:is-first-level="false"
					:base-path="resolvePath(child.path)"
					class="nest-menu"
				/>
			</template>
		</el-submenu>
	</div>
</template>

<script lang="ts">
import { resolve } from 'path'
import { defineComponent, computed, getCurrentInstance } from 'vue'
import i18n from '/@/lang'
import { isExternal } from '/@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

export default defineComponent({
	name: 'SidebarItem',
	components: {
		SidebarItemLink
	},
	props: {
		item: Object,
		isCollapse: {
			type: Boolean,
			default: false
		},
		isFirstLevel: {
			type: Boolean,
			default: true
		},
		basePath: {
			type: String,
			default: ''
		}
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()

		const alwaysShowRootMenu = computed(() => {
			if (props.item.meta && props.item.meta.alwaysShow) {
				return true
			}
			return false
		})

		const showingChildNumber = computed(() => {
			if (props.item.children) {
				const showingChildren = props.item.children.filter(item => {
					if (item.meta && item.meta.hidden) {
						return false
					} else {
						return true
					}
				})
				return showingChildren.length
			}
			return 0
		})

		const theOnlyOneChild = computed(() => {
			if (showingChildNumber.value > 1) {
				return null
			}
			if (props.item.children) {
				for (const child of props.item.children) {
					if (!child.meta || !child.meta.hidden) {
						return child
					}
				}
			}
			// If there is no children, return itself with path removed,
			// because this.basePath already conatins item's path information
			return { ...props.item, path: '' }
		})

		// 判断是不是外部链接
		function resolvePath(routePath) {
			if (isExternal(routePath)) {
				return routePath
			}
			if (isExternal(props.basePath)) {
				return props.basePath
			}
			return resolve(props.basePath, routePath)
		}

		function getActive(v) {
			if (ctx.$router.currentRoute.value.meta.icon === v) {
				return '#3F66F6';
			}
		}

		return {
			i18n,
			alwaysShowRootMenu,
			theOnlyOneChild,
			resolvePath,
			getActive
		}
	}
})
</script>

<style>
.el-submenu .is-active > .el-submenu__title {
	color: var(--subMenuActiveText) !important;
}

.full-mode {
	& .nest-menu .el-submenu > .el-submenu__title,
	& .el-submenu .el-menu-item {
		min-width: var(--sideBarWidth) !important;
		background-color: var(--subMenuBg) !important;

		&:hover {
			background-color: var(--subMenuHover) !important;
		}
	}
}

.simple-mode {
	&.first-level {
		& .submenu-title-noDropdown {
			padding: 0 !important;
			position: relative;

			& .el-tooltip {
				padding: 0 !important;
			}
		}

		& .el-submenu {
			overflow: hidden;

			& > .el-submenu__title {

				& .el-submenu__icon-arrow {
					display: none;
				}

				& span {
					visibility: hidden;
				}
			}
		}
	}
}
</style>

<style scoped>
.icon {
	margin-right: 16px;
}
</style>
