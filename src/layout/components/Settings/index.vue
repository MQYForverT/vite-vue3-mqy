<template>
	<div class="drawer-container">
		<div>
			<h3 class="drawer-title">{{ i18n.global.t('settings.title') }}</h3>
			<div class="drawer-item">
				<span>{{ i18n.global.t('settings.theme') }}</span>
				<theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
			</div>

			<div class="drawer-item">
				<span>{{ i18n.global.t('settings.showTagsView') }}</span>
				<el-switch v-model="showTagsView" class="drawer-switch" />
			</div>

			<div class="drawer-item">
				<span>{{ i18n.global.t('settings.showSidebarLogo') }}</span>
				<el-switch v-model="showSidebarLogo" class="drawer-switch" />
			</div>

			<div class="drawer-item">
				<span>{{ i18n.global.t('settings.fixedHeader') }}</span>
				<el-switch v-model="fixedHeader" class="drawer-switch" />
			</div>

			<div class="drawer-item">
				<span>{{ i18n.global.t('settings.sidebarTextTheme') }}</span>
				<el-switch v-model="sidebarTextTheme" class="drawer-switch" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import i18n from '/@/lang'
import { SettingsModule } from '/@/store/modules/settings'
import ThemePicker from '/@/components/ThemePicker/index.vue'

export default defineComponent({
	name: 'Settings',
	components: {
		ThemePicker
	},
	setup(props, context) {
		const fixedHeader = computed({
			get: () => SettingsModule.fixedHeader,
			set: value => SettingsModule.ChangeSetting({ key: 'fixedHeader', value })
		})

		const showTagsView = computed({
			get: () => SettingsModule.showTagsView,
			set: value => SettingsModule.ChangeSetting({ key: 'showTagsView', value })
		})

		const showSidebarLogo = computed({
			get: () => SettingsModule.showSidebarLogo,
			set: value => SettingsModule.ChangeSetting({ key: 'showSidebarLogo', value })
		})

		const sidebarTextTheme = computed({
			get: () => SettingsModule.sidebarTextTheme,
			set: value => SettingsModule.ChangeSetting({ key: 'sidebarTextTheme', value })
		})

		function themeChange(value: string){
			SettingsModule.ChangeSetting({ key: 'theme', value })
		}

		return {
			fixedHeader,
			showTagsView,
			showSidebarLogo,
			sidebarTextTheme,
			themeChange,
			i18n
		}
	}
})
</script>

<style scoped>
.drawer-container {
	padding: 24px;
	font-size: 14px;
	line-height: 1.5;
	word-wrap: break-word;

	& .drawer-title {
		margin-bottom: 12px;
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
		line-height: 22px;
	}

	& .drawer-item {
		color: rgba(0, 0, 0, 0.65);
		font-size: 14px;
		padding: 12px 0;
	}

	& .drawer-switch {
		float: right;
	}
}
</style>
