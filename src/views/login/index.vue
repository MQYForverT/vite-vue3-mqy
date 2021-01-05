<template>
	<div class="login-container">
		<el-form ref="formRef" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
			<div class="title-container">
				<h3 class="title">{{ i18n.global.t('login.title') }}</h3>
				<div class="set-language"><lang-select /></div>
			</div>

			<el-form-item prop="username">
				<span class="svg-container"><svg-icon name="username" /></span>
				<el-input
					ref="usernameRef"
					v-model.trim="loginForm.username"
					:placeholder="i18n.global.t('login.username')"
					name="username"
					type="text"
					tabindex="1"
					autocomplete="on"
				/>
			</el-form-item>

			<el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
				<el-form-item prop="password">
					<span class="svg-container"><svg-icon name="password" /></span>
					<el-input
						:key="passwordType"
						ref="passwordRef"
						v-model.trim="loginForm.password"
						:type="passwordType"
						:placeholder="i18n.global.t('login.password')"
						name="password"
						tabindex="2"
						autocomplete="on"
						@keyup.native="checkCapslock"
						@blur="capsTooltip = false"
						@keyup.enter.native="handleLogin"
					/>
					<span class="show-pwd" @click="showPwd">
						<svg-icon name="hiddenPsw" v-if="passwordType === 'password'" />
						<svg-icon v-else name="showPsw" />
					</span>
				</el-form-item>
			</el-tooltip>

			<el-button :loading="loading" type="primary" style="width:100%; margin-bottom:30px;" @click.native.prevent="handleLogin">{{ i18n.global.t('login.logIn') }}</el-button>
		</el-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch, getCurrentInstance, nextTick } from 'vue'
import i18n from '@/lang'
import { useRouter } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { UserModule } from '@/store/modules/user'
import LangSelect from '@/components/LangSelect/index.vue'

export default defineComponent({
	name: 'login',
	components: {
		LangSelect
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let router = useRouter()
		let usernameRef = ref(null)
		let passwordRef = ref(null)
		let formRef = ref(null)

		let loginForm = reactive({
			username: 'admin',
			password: '123456'
		})

		let loginRules = {
			username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
			password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
		}

		let passwordType = ref('password')
		let loading = ref(false)
		let capsTooltip = ref(false)
		let redirect = ''
		let otherQuery: Dictionary<string> = {}

		function checkCapslock(e: KeyboardEvent) {
			const { key } = e
			capsTooltip = key !== null && key !== undefined && key.length === 1 && (key >= 'A' && key <= 'Z')
		}

		function showPwd() {
			if (passwordType.value === 'password') {
				passwordType.value = ''
			} else {
				passwordType.value = 'password'
			}
			passwordRef.value.focus()
		}

		function handleLogin() {
			formRef.value.validate(async (valid: boolean) => {
				if (valid) {
					loading = true

					await UserModule.Login(loginForm).finally(() => {
						loading = false
					})

					router.push({
						path: redirect || '/',
						query: otherQuery
					})
				} else {
					return false
				}
			})
		}

		function getOtherQuery(query: Dictionary<string>) {
			return Object.keys(query).reduce(
				(acc, cur) => {
					if (cur !== 'redirect') {
						acc[cur] = query[cur]
					}
					return acc
				},
				{} as Dictionary<string>
			)
		}

		// 详细用法：https://v3.cn.vuejs.org/api/computed-watch-api.html#%E4%BE%A6%E5%90%AC%E4%B8%80%E4%B8%AA%E5%8D%95%E4%B8%80%E6%BA%90
		// 要素：如果监听对象，需要()=>形式，如果不是对象，直接写入即可
		watch(
			() => ctx.$router.currentRoute.value,
			route => {
				const query = route.query as Dictionary<string>
				if (query) {
					redirect = query.redirect
					otherQuery = getOtherQuery(query)
				}
			},
			{ immediate: true }
		)

		onMounted(() => {
			if (loginForm.username === '') {
				usernameRef.value.focus()
			} else if (loginForm.password === '') {
				passwordRef.value.focus()
			}
		})

		return {
			usernameRef,
			passwordRef,
			formRef,
			i18n,
			passwordType,
			loading,
			capsTooltip,
			loginForm,
			loginRules,
			checkCapslock,
			showPwd,
			handleLogin
		}
	}
})
</script>

<style scoped>
@supports (-webkit-mask: none) and (not (cater-color: var(--loginCursorColor))) {
	.login-container .el-input {
		& input {
			color: var(--loginCursorColor);
		}
		& input::first-line {
			color: var(--lightGray);
		}
	}
}

.login-container {
	& .el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		& ::v-deep(.el-input__inner) {
			height: 47px;
			background: transparent;
			border: 0px;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: var(--lightGray);
			caret-color: var(--loginCursorColor);
			-webkit-appearance: none;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px var(--loginBg) inset !important;
				-webkit-text-fill-color: #fff !important;
			}
		}
	}

	& .el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style scoped>
.login-container {
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: var(--loginBg);

	& .login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}

	& .tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	& .svg-container {
		padding: 6px 5px 6px 15px;
		color: var(--darkGray);
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	& .title-container {
		position: relative;

		& .title {
			font-size: 26px;
			color: var(--lightGray);
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}

		& .set-language {
			color: #fff;
			position: absolute;
			top: 3px;
			font-size: 18px;
			right: 0px;
			cursor: pointer;
		}
	}

	& .show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: var(--darkGray);
		cursor: pointer;
		user-select: none;
	}

	& .thirdparty-button {
		position: absolute;
		right: 0;
		bottom: 6px;
	}
}
</style>
