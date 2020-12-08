<template>
	<div :class="[{ 'is-active': isActive }]" @click="toggleClick">
		<svg-icon name="hamburger" width="20" height="20" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Hamburger',
	props: {
		isActive: {
			type: Boolean,
			default: false
		}
	},
	setup(props, context) {
		const toggleClick = () => {
			context.emit('toggleClick')
		}

		return {
			toggleClick
		}
	}
})
</script>

<style scoped>
.icon {
	vertical-align: middle;
}

.is-active {
	transform: rotate(180deg);
}
</style>
