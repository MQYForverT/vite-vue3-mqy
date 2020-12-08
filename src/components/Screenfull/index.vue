<template>
	<div id="screenfull"><svg-icon :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" /></div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { defineComponent, ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

const sf = screenfull

export default defineComponent({
	name: 'Screenfull',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let isFullscreen = ref(false)
		onMounted(() => {
			if (sf.isEnabled) {
				sf.on('change', change)
			}
		})

		onBeforeUnmount(() => {
			if (sf.isEnabled) {
				sf.off('change', change)
			}
		})

		function change() {
			if (sf.isEnabled) {
				isFullscreen.value = sf.isFullscreen
			}
		}

		function click() {
			if (!sf.isEnabled) {
				ctx.$message({
					message: 'you browser can not work',
					type: 'warning'
				})
				return false
			}
			sf.toggle()
		}

		return {
			isFullscreen,
			click
		}
	}
})
</script>
