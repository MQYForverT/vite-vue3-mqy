import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '/@/store'
import defaultSettings from '/@/settings'
import { getTheme, setTheme } from '/@/utils/cookies'

export interface ISettingsState {
	theme: string
	fixedHeader: boolean
	showSettings: boolean
	showTagsView: boolean
	showSidebarLogo: boolean
	sidebarTextTheme: boolean
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements ISettingsState {
	public theme = getTheme() || '#3F66F6'
	public fixedHeader = defaultSettings.fixedHeader
	public showSettings = defaultSettings.showSettings
	public showTagsView = defaultSettings.showTagsView
	public showSidebarLogo = defaultSettings.showSidebarLogo
	public sidebarTextTheme = defaultSettings.sidebarTextTheme

	@Mutation
	private CHANGE_SETTING(payload: { key: string; value: any }) {
		const { key, value } = payload
		if (Object.prototype.hasOwnProperty.call(this, key)) {
			;(this as any)[key] = value
		}

		if (key === 'theme') {
			setTheme(value)
		}
	}

	@Action
	public ChangeSetting(payload: { key: string; value: any }) {
		this.CHANGE_SETTING(payload)
	}
}

export const SettingsModule = getModule(Settings)
