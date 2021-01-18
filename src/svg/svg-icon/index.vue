<template>
	<component :is="name" :height="height" :width="width" :fill="color"></component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import language from '@/svg/language.svg'
import warning from '@/svg/warning.svg'
import username from '@/svg/username.svg'
import showPsw from '@/svg/showPsw.svg'
import password from '@/svg/password.svg'
import hiddenPsw from '@/svg/hiddenPsw.svg'
import hamburger from '@/svg/hamburger.svg'
import nested from '@/svg/nested.svg'
import dashboard from '@/svg/dashboard.svg'
import size from '@/svg/size.svg'
import fullscreen from '@/svg/fullscreen.svg'
import exitFullscreen from '@/svg/exit-fullscreen.svg'
import search from '@/svg/search.svg'

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
		exitFullscreen,
		search
	}
})
</script>
