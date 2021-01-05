<template>
	<div :class="classObj" class="app-wrapper">
		<div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
		<!--左侧菜单栏-->
		<sidebar class="sidebar-container" />

		<div :class="{ hasTagsView: showTagsView }" class="main-container">
			<!--header-->
			<div :class="{ 'fixed-header': fixedHeader }">
				<navbar />
				<tags-view v-if="showTagsView" />
			</div>

			<!--主视图-->
			<app-main />

			<!--右边的设置按钮-->
			<right-panel v-if="showSettings"><settings /></right-panel>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted,onBeforeMount,onBeforeUnmount, computed, watch, getCurrentInstance } from 'vue'
import { DeviceType, AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import { useRouter } from 'vue-router'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import RightPanel from '@/components/RightPanel/index.vue'

const WIDTH = 992

export default defineComponent({
	name: 'login',
	components: {
		AppMain,
		Navbar,
		RightPanel,
		Settings,
		Sidebar,
		TagsView
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()

		const device = computed(() => AppModule.device)

		const sidebar = computed(() => AppModule.sidebar)

		watch(
			()=>ctx.$router.currentRoute.value,
			route => {
				if (device.value === DeviceType.Mobile && sidebar.value.opened) {
				  AppModule.CloseSideBar(false)
				}
			}
		)

		function isMobile(){
		  const rect = document.body.getBoundingClientRect()
		  return rect.width - 1 < WIDTH
		}

		function resizeHandler(){
		  if (!document.hidden) {
		    const isMobile2 = isMobile()
		    AppModule.ToggleDevice(isMobile2 ? DeviceType.Mobile : DeviceType.Desktop)
		    if (isMobile2) {
		      AppModule.CloseSideBar(true)
		    }
		  }
		}

		const classObj = computed(() => {
			return {
				hideSidebar: !sidebar.value.opened,
				openSidebar: sidebar.value.opened,
				withoutAnimation: sidebar.value.withoutAnimation,
				mobile: device.value === DeviceType.Mobile
			}
		})

		const showSettings = computed(() =>SettingsModule.showSettings)

		const showTagsView = computed(() => SettingsModule.showTagsView)

		const fixedHeader = computed(() => SettingsModule.fixedHeader)



		function handleClickOutside(){
			AppModule.CloseSideBar(false)
		}

		onMounted(()=>{
			const isMobile2 = isMobile()
			if (isMobile2) {
			  AppModule.ToggleDevice(DeviceType.Mobile)
			  AppModule.CloseSideBar(true)
			}
		})

		onBeforeMount(()=>{
			 window.addEventListener('resize', resizeHandler)
		})

		onBeforeUnmount(()=>{
			window.removeEventListener('resize', resizeHandler)
		})

		return {
			classObj,
			sidebar,
			handleClickOutside,
			showTagsView,
			fixedHeader,
			showSettings
		}
	}
})
</script>

<style scoped>
.app-wrapper {
	@include clearfix;
	position: relative;
	height: 100%;
	width: 100%;
}

.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}

.main-container {
	min-height: 100%;
	transition: margin-left 0.28s;
	margin-left: var(--sideBarWidth);
	position: relative;
}

.sidebar-container {
	transition: width 0.28s;
	width: var(--sideBarWidth) !important;
	height: 100%;
	position: fixed;
	font-size: 0px;
	top: 0;
	bottom: 0;
	left: 0;
	z-index: 1001;
	overflow: hidden;
}

.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9;
	width: calc(100% - var(--sideBarWidth));
	transition: width 0.28s;
}

.hideSidebar {
	& .main-container {
		margin-left: 54px;
	}

	& .sidebar-container {
		width: 54px !important;
	}

	& .fixed-header {
		width: calc(100% - 54px);
	}
}

/* for mobile response 适配移动端 */
.mobile {
	&.main-container {
		margin-left: 0px;
	}

	&.sidebar-container {
		transition: transform 0.28s;
		width: var(--sideBarWidth) !important;
	}

	&.openSidebar {
		position: fixed;
		top: 0;
	}

	&.hideSidebar {
		&.sidebar-container {
			pointer-events: none;
			transition-duration: 0.3s;
			transform: translate3d(var(--sideBarWidth), 0, 0);
		}
	}

	&.fixed-header {
		width: 100%;
	}
}

.withoutAnimation {
	& .main-container,
	& .sidebar-container {
		transition: none;
	}
}
</style>
