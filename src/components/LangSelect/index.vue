<template>
	<el-dropdown trigger="click" class="international" @command="handleSetLanguage">
		<div><svg-icon name="language"/> </div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :disabled="language === 'zh'" command="zh">中文</el-dropdown-item>
				<el-dropdown-item :disabled="language === 'en'" command="en">English</el-dropdown-item>
				<el-dropdown-item :disabled="language === 'ja'" command="ja">日本語</el-dropdown-item>
				<el-dropdown-item :disabled="language === 'ko'" command="ko">한국어</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue'
import { AppModule } from '@/store/modules/app'
import i18n from '@/lang'

export default defineComponent({
	name: 'LangSelect',
	setup(props, context) {
		const { ctx } = getCurrentInstance()
		
		const language = computed(() => AppModule.language)

		function handleSetLanguage(lang: string){
			i18n.global.locale = lang
			AppModule.SetLanguage(lang)
			ctx.$message({
				message: 'Switch Language Success',
				type: 'success'
			})
		}

		return {
			language,
			handleSetLanguage
		}
	}
})
</script>
