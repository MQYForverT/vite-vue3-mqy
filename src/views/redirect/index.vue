<script lang="ts">
import { defineComponent,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name:'redirect',
	setup(props, context) {
		let router = useRouter()
		let { ctx } = getCurrentInstance()
		const { params, query } = ctx.$router.currentRoute.value
		const { path } = params
		router.replace({ path: '/' + path, query })
	}
})
</script>
