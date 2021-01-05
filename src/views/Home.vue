<template>
	<div class="test"><div class="hello">This is a home page</div></div>

	<warning width="1rem" height="1rem" />
	<p>{{ parseTime(date) }}</p>
	<span>{{ formatText(num) }}</span>
</template>

<script lang="ts">
import { defineComponent, ref,getCurrentInstance } from 'vue'
import { VueComponent as warning } from '@/svg/warning.svg'
import * as filters from '@/filters'

export default defineComponent({
	name: 'Home',
	components: {
		warning
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		const { parseTime, formatText } = filters
		
		const num = ref(1760973896)
		const date = ref(new Date())
		
		return {
			parseTime,
			formatText,
			num,
			date
		}
	}
})
</script>
<style scoped="scoped">
.test {
	width: 100%;
	height: 140px;
	background-color: bisque;
	text-align: center;

	/*使用postcss-nesting进行嵌套语法，需要在前面加一个 '&'*/
	& .hello {
		/*var函数用来读取变量，还可以使用第二个参数，表示变量的默认值。如果该变量不存在，就会使用这个默认值*/
		color: var(--text-color);
		/*@apply引用代码块，但是@apply不是规范，这很可能不会得到来自浏览器供应商的更多支持，所以该功能将不会包含在 postcss-cssnext 的下一个主要版本中*/
		/* @apply --fontCommon; */
	}
}
</style>
