<template>
	<div :class="{ 'has-logo': showLogo }">
		<sidebar-logo v-if="showLogo" :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				:default-active="activeMenu"
				:collapse="isCollapse"
				:background-color="'#304156'"
				:text-color="'#bfcbd9'"
				:active-text-color="'#3F66F6'"
				:unique-opened="true"
				:collapse-transition="false"
				mode="vertical"
			>
				<sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" :is-collapse="isCollapse" />
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'

export default defineComponent({
	name: 'SideBar',
	components: {
		SidebarItem,
		SidebarLogo
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()

		const sidebar = computed(() => AppModule.sidebar)

		const routes = computed(() => PermissionModule.routes)

		const showLogo = computed(() => SettingsModule.showSidebarLogo)

		const activeMenu = computed(() => {
			const route = ctx.$router.currentRoute.value
			const { meta, path } = route
			// if set path, the sidebar will highlight the path you set
			if (meta.activeMenu) {
				return meta.activeMenu
			}
			return path
		})

		const isCollapse = computed(() => !sidebar.value.opened)

		return {
			showLogo,
			isCollapse,
			activeMenu,
			routes
		}
	}
})
</script>

<style>
.sidebar-container {
	& .horizontal-collapse-transition {
		transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
	}

	& .scrollbar-wrapper {
		overflow-x: hidden !important;
	}

	& .el-scrollbar__view {
		height: 100%;
	}

	& .el-scrollbar__bar {
		&.is-vertical {
			right: 0px;
		}

		&.is-horizontal {
			display: none;
		}
	}
}
</style>

<style scoped>
.el-scrollbar {
	height: 100%;
}

.has-logo {
	& .el-scrollbar {
		height: calc(100% - 50px);
	}
}

.el-menu {
	border: none;
	height: 100%;
	width: 100% !important;
}
</style>
