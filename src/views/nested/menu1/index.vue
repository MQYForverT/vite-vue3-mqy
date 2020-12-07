<template>
	<div style="padding:30px;">
		<el-alert :closable="false" title="menu 1">
			<!-- <transition name="fade-transform" mode="out-in"><router-view /></transition> -->
			<router-view #default="{ Component }">
				<transition name="fade-transform" mode="out-in">
					<component class="view" :is="Component" />
				</transition>
			</router-view>
		</el-alert>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Menu1'
})
</script>
