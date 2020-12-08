<template>
	<component :is="name" :height="height" :width="width" :fill="color"></component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueComponent as language } from '/@/svg/language.svg'
import { VueComponent as warning } from '/@/svg/warning.svg'
import { VueComponent as username } from '/@/svg/username.svg'
import { VueComponent as showPsw } from '/@/svg/showPsw.svg'
import { VueComponent as password } from '/@/svg/password.svg'
import { VueComponent as hiddenPsw } from '/@/svg/hiddenPsw.svg'
import { VueComponent as hamburger } from '/@/svg/hamburger.svg'
import { VueComponent as nested } from '/@/svg/nested.svg'
import { VueComponent as dashboard } from '/@/svg/dashboard.svg'
import { VueComponent as size } from '/@/svg/size.svg'
import { VueComponent as fullscreen } from '/@/svg/fullscreen.svg'
import { VueComponent as exitFullscreen } from '/@/svg/exit-fullscreen.svg'

export default defineComponent({
	name: 'svg-icon',
	props: {
		name: {
			type: String,
			required: true
		},
		width: {
			type: String
		},
		height: {
			type: String
		},
		color: {
			type: String
		}
	},
	components: {
		language,
		warning,
		username,
		showPsw,
		password,
		hiddenPsw,
		hamburger,
		nested,
		dashboard,
		size,
		fullscreen,
		exitFullscreen
	}
})
</script>
