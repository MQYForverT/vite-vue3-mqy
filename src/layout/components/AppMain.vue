<template>
	<section class="app-main">
		<router-view >
			<template #defaul="{ Component, route }">
				<transition name="fade-transform" mode="out-in">
					<keep-alive :include="cachedViews">
						<component class="view" :is="Component" :key="route.fullPath"/>
					</keep-alive>
				</transition>
			</template>
		</router-view>
		<div class="footer-main">
			<span>{{ footerTitle }}</span>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, getCurrentInstance } from 'vue'
import { TagsViewModule } from '/@/store/modules/tags-view'
import defaultSettings from '/@/settings'

export default defineComponent({
	name: 'AppMain',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		const footerTitle = ref(defaultSettings.footerTitle)

		const cachedViews = computed(() => TagsViewModule.cachedViews)

		const key = computed(() => ctx.$router.currentRoute.value.path)

		return {
			footerTitle,
			cachedViews,
			key
		}
	}
})
</script>

<style scoped>
.app-main {
	/* 50= navbar  50  */
	min-height: calc(100vh - 50px);
	width: 100%;
	position: relative;
	overflow: hidden;
}

.fixed-header + .app-main {
	padding-top: 50px;
	height: 100vh;
	overflow: auto;
}

.hasTagsView {
	& .app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh - 84px);
	}

	& .fixed-header + .app-main {
		padding-top: 84px;
	}
}

.footer-main {
	position: relative;
	bottom: 0px;
	width: 100%;
	height: 50px;
	font-size: 12px;
	color: #9bacb9;
	background-color: #f0f2f5;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
