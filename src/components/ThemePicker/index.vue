<template>
	<el-color-picker
		v-model="theme"
		:predefine="['#409EFF', '#1890ff', '#3F66F6', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']"
		class="theme-picker"
		popper-class="theme-picker-dropdown"
	/>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, getCurrentInstance } from 'vue'
import { SettingsModule } from '/@/store/modules/settings'

// eslint-disable-next-line @typescript-eslint/no-var-requires
import version from 'element-plus/package.json' // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color

export default defineComponent({
	name: 'ThemePicker',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let theme = ref('')
		let chalk = ref(null) // The content of theme-chalk css

		function updateStyle(style: string, oldCluster: string[], newCluster: string[]) {
			let newStyle = style
			oldCluster.forEach((color, index) => {
				newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
			})
			return newStyle
		}

		function getCSSString(url: string, variable: string) {
			return new Promise(resolve => {
				const xhr = new XMLHttpRequest()
				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						chalk.value = xhr.responseText.replace(/@font-face{[^}]+}/, '')
						resolve()
					}
				}
				xhr.open('GET', url)
				xhr.send()
			})
		}

		function getThemeCluster(theme: string) {
			function tintColor(color: string, tint: number) {
				let red = parseInt(color.slice(0, 2), 16)
				let green = parseInt(color.slice(2, 4), 16)
				let blue = parseInt(color.slice(4, 6), 16)
				if (tint === 0) {
					// when primary color is in its rgb space
					return [red, green, blue].join(',')
				} else {
					red += Math.round(tint * (255 - red))
					green += Math.round(tint * (255 - green))
					blue += Math.round(tint * (255 - blue))
					return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
				}
			}

			function shadeColor(color: string, shade: number) {
				let red = parseInt(color.slice(0, 2), 16)
				let green = parseInt(color.slice(2, 4), 16)
				let blue = parseInt(color.slice(4, 6), 16)
				red = Math.round((1 - shade) * red)
				green = Math.round((1 - shade) * green)
				blue = Math.round((1 - shade) * blue)
				return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
			}

			const clusters = [theme]
			for (let i = 0; i <= 9; i++) {
				clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
			}
			clusters.push(shadeColor(theme, 0.1))
			return clusters
		}

		const defaultTheme = computed(() => SettingsModule.theme)

		watch(
			defaultTheme,
			value => {
				theme.value = value
			},
			{ immediate: true }
		)

		watch(theme, value => {
			if (!value) return
			const oldValue = chalk.value ? theme.value : ORIGINAL_THEME
			const themeCluster = getThemeCluster(value.replace('#', ''))
			const originalCluster = getThemeCluster(oldValue.replace('#', ''))
			const message = ctx.$message({
				message: '  Compiling the theme',
				customClass: 'theme-message',
				type: 'success',
				duration: 0,
				iconClass: 'el-icon-loading'
			})

			if (!chalk.value) {
				const url = `https://unpkg.com/element-plus@${version.version}/lib/theme-chalk/index.css`
				getCSSString(url, 'chalk')
			}

			function getHandler(variable: string, id: string) {
				return () => {
					const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
					const newStyle = updateStyle('chalk', originalCluster, themeCluster)

					let styleTag = document.getElementById(id)
					if (!styleTag) {
						styleTag = document.createElement('style')
						styleTag.setAttribute('id', id)
						document.head.appendChild(styleTag)
					}
					styleTag.innerText = newStyle
				}
			}
			const chalkHandler = getHandler('chalk', 'chalk-style')
			chalkHandler()

			let styles: HTMLElement[] = [].slice.call(document.querySelectorAll('style'))
			styles = styles.filter(style => {
				const text = style.innerText
				return new RegExp(oldValue, 'i').test(text) && !/Chalk Variables/.test(text)
			})
			styles.forEach(style => {
				const { innerText } = style
				if (typeof innerText !== 'string') return
				style.innerText = updateStyle(innerText, originalCluster, themeCluster)
			})

			context.emit('change', value)
			message.close()
		})

		return {
			theme
		}
	}
})
</script>

<style scoped="scoped">
.theme-message,
.theme-picker-dropdown {
	z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
	height: 26px !important;
	width: 26px !important;
	padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
	display: none;
}
</style>
