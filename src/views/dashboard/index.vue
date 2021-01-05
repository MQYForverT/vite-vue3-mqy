<template>
	<div class="dashboard-container">
		<component :is="currentRole" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { UserModule } from '@/store/modules/user'
// import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'

export default defineComponent({
	name: 'Dashboard',
	components: {
		// AdminDashboard,
		EditorDashboard
	},
	setup(props, context) {
		let currentRole = ref('admin-dashboard')

		const roles = computed(() => UserModule.roles)

		onMounted(() => {
			if (!roles.value.includes('admin')) {
				currentRole.value = 'editor-dashboard'
			}
		})

		return {
			currentRole
		}
	}
})
</script>
