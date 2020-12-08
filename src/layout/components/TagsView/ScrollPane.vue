<template>
	<el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll"><slot /></el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, computed, ref, getCurrentInstance } from 'vue'

const tagSpacing = 4

export default defineComponent({
	name: 'ScrollPane',
	setup(props, context) {
		const { ctx } = getCurrentInstance()
		let scrollContainer = ref(null)

		const scrollWrapper = computed(() => {
			return scrollContainer.value.wrap as HTMLElement
		})

		function handleScroll(e: MouseWheelEvent) {
			const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
			const scrollWrapper = scrollWrapper.value
			scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4
		}

		function emitScroll() {
			context.emit('scroll')
		}

		function moveToTarget(currentTag: HTMLElement) {
			const container = scrollContainer.value.$el as HTMLElement
			const containerWidth = container.offsetWidth
			const scrollWrapper2 = scrollWrapper.value
			const tagList = ctx.$parent.tagRefs

			let firstTag = null
			let lastTag = null

			// find first tag and last tag
			if (tagList.length > 0) {
				firstTag = tagList[0]
				lastTag = tagList[tagList.length - 1]
			}

			if (firstTag === currentTag) {
				scrollWrapper2.scrollLeft = 0
			} else if (lastTag === currentTag) {
				scrollWrapper2.scrollLeft = scrollWrapper2.scrollWidth - containerWidth
			} else {
				// find preTag and nextTag
				const currentIndex = tagList.findIndex(item => {
					return item === currentTag
				})
				if (currentIndex === -1) {
					return
				}
				const prevTag = tagList[currentIndex - 1]
				const nextTag = tagList[currentIndex + 1]
				// the tag's offsetLeft after of nextTag
				const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
				// the tag's offsetLeft before of prevTag
				const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing

				if (afterNextTagOffsetLeft > scrollWrapper2.scrollLeft + containerWidth) {
					scrollWrapper2.scrollLeft = afterNextTagOffsetLeft - containerWidth
				} else if (beforePrevTagOffsetLeft < scrollWrapper2.scrollLeft) {
					scrollWrapper2.scrollLeft = beforePrevTagOffsetLeft
				}
			}
		}

		onMounted(() => {
			scrollWrapper.value.addEventListener('scroll', emitScroll, true)
		})

		onBeforeUnmount(() => {
			scrollWrapper.value.removeEventListener('scroll', emitScroll)
		})

		return {
			scrollContainer,
			handleScroll,
			moveToTarget
		}
	}
})
</script>

<style>
.scroll-container {
	& .el-scrollbar__bar {
		bottom: 0px;
	}

	& .el-scrollbar__wrap {
		height: 49px;
	}
}
</style>

<style scoped>
.scroll-container {
	white-space: nowrap;
	position: relative;
	overflow: hidden;
	width: 100%;
}
</style>
