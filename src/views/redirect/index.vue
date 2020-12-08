<script lang="ts">
import { defineComponent,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router'

// 为什么需要先跳到这里再跳回去？因为刷新的时候如果调用router.replace是无效的，replace必须跳转到不同的路径才有效
export default defineComponent({
	name:'redirect',
	setup(props, context) {
		let router = useRouter()
		let { ctx } = getCurrentInstance()
		const { params, query } = ctx.$router.currentRoute.value
		const { path } = params
		router.replace({ path: '/' + path.join('/'), query })
	}
})
</script>
