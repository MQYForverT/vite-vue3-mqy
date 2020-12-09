<template>
	<el-dropdown id="size-select" trigger="click" @command="handleSetSize">
		<div><svg-icon name="size"/></div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref,markRaw,  computed, getCurrentInstance,nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { AppModule } from '/@/store/modules/app'
import { TagsViewModule } from '/@/store/modules/tags-view'

export default defineComponent({
	name: 'SizeSelect',
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let router = useRouter()

		const sizeOptions = markRaw([{ label: 'Default', value: 'default' }, { label: 'Medium', value: 'medium' }, { label: 'Small', value: 'small' }, { label: 'Mini', value: 'mini' }])

		const  size = computed(()=>AppModule.size)

		function handleSetSize(size: string) {
			ctx.$ELEMENT.size = size
			AppModule.SetSize(size)
			refreshView()
			ctx.$message({
				message: 'Switch Size Success',
				type: 'success'
			})
		}

		function refreshView() {
			// In order to make the cached page re-rendered
			TagsViewModule.delAllCachedViews()
			const { fullPath } = ctx.$router.currentRoute.value
			nextTick(() => {
				router.replace({
					path: '/redirect' + fullPath
				})
			})
		}

		return{
			handleSetSize,
			sizeOptions,
			size
		}
	}
})
</script>
