<template>
	<div class="dashboard-editor-container">
		<div class="clearfix">
			<pan-thumb :image="avatar" style="float: left">
				Your roles:
				<span v-for="item in roles" :key="item" class="info-roles">{{ item }}</span>
			</pan-thumb>
			<div class="info-container">
				<span class="display_name">{{ name }}</span>
				<span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span>
			</div>
		</div>
		<div><img :src="emptyGif" class="emptyGif" /></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { UserModule } from '/@/store/modules/user'
import PanThumb from '/@/components/PanThumb/index.vue'

export default defineComponent({
	name: 'editor',
	components: {
		PanThumb
	},
	setup(props, context) {
		let emptyGif = ref('https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3')
		
		const name = computed(() => UserModule.name)
		
		const avatar = computed(() => UserModule.avatar)
		
		const roles = computed(() => UserModule.roles)
		
		return {
			emptyGif,
			name,
			avatar,
			roles
		}
	}
})
</script>
<style scoped>
.emptyGif {
	display: block;
	width: 45%;
	margin: 0 auto;
}

.dashboard-editor-container {
	background-color: #e3e3e3;
	min-height: 100vh;
	padding: 50px 60px 0px;

	& .info-roles {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		display: block;
	}

	& .info-container {
		position: relative;
		margin-left: 190px;
		height: 150px;
		line-height: 200px;

		& .display_name {
			font-size: 48px;
			line-height: 48px;
			color: #212121;
			position: absolute;
			top: 25px;
		}
	}
}
</style>
