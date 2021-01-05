<template>
	<div ref="rightPanel" :class="{ show: show }" class="rightPanel-container">
		<div class="rightPanel-background" />
		<div class="rightPanel">
			<div class="handle-button" :style="{ top: buttonTop + 'px' }" @click="show = !show"><i :class="show ? 'el-icon-close' : 'el-icon-setting'" /></div>
			<div class="rightPanel-items"><slot /></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { addClass, removeClass } from '@/utils'

export default defineComponent({
	name: 'RightPanel',
	props: {
		clickNotClose: {
			type: Boolean,
			default: false
		},
		buttonTop: {
			type: Number,
			default: 250
		}
	},
	setup(props, context) {
		const { ctx } = getCurrentInstance()
		let show = ref(false)
		let rightPanel = ref(null)

		watch(show, value => {
			if (value && !props.clickNotClose) {
				addEventClick()
			}
			if (value) {
				addClass(document.body, 'showRightPanel')
			} else {
				removeClass(document.body, 'showRightPanel')
			}
		})

		onMounted(() => {
			insertToBody()
		})

		onBeforeUnmount(() => {
			const elx = rightPanel.value as Element
			elx.remove()
		})

		function addEventClick() {
			window.addEventListener('click', closeSidebar)
		}

		function closeSidebar(ev: MouseEvent) {
			const parent = (ev.target as HTMLElement).closest('.rightPanel')
			if (!parent) {
				show.value = false
				window.removeEventListener('click', closeSidebar)
			}
		}

		function insertToBody() {
			const elx = rightPanel.value as Element
			const body = document.querySelector('body')
			if (body) {
				body.insertBefore(elx, body.firstChild)
			}
		}

		return {
			rightPanel,
			show
		}
	}
})
</script>

<style>
.showRightPanel {
	overflow: hidden;
	position: relative;
	width: calc(100% - 15px);
}
</style>

<style scoped>
.rightPanel-background {
	position: fixed;
	top: 0;
	left: 0;
	opacity: 0;
	transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	background: rgba(0, 0, 0, 0.2);
	z-index: -1;
}

.rightPanel {
	width: 100%;
	max-width: 260px;
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
	transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
	transform: translate(100%);
	background: #fff;
	z-index: 40000;
}

.show {
	transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

	& .rightPanel-background {
		z-index: 20000;
		opacity: 1;
		width: 100%;
		height: 100%;
	}

	& .rightPanel {
		transform: translate(0);
	}
}

.handle-button {
	width: 48px;
	height: 48px;
	position: absolute;
	left: -48px;
	text-align: center;
	font-size: 24px;
	border-radius: 6px 0 0 6px !important;
	z-index: 0;
	cursor: pointer;
	pointer-events: auto;
	color: #fff;
	line-height: 48px;
	background-color: #3f66f6;

	& i {
		font-size: 24px;
		line-height: 48px;
	}
}
</style>
