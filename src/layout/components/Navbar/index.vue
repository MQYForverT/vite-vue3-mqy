<template>
	<div class="navbar">
		<hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
		<breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
		<div class="right-menu">
			<template v-if="device !== 'mobile'">
				<!-- <header-search class="right-menu-item" /> -->
				<!-- <screenfull class="right-menu-item hover-effect" /> -->
				<!-- <el-tooltip :content="i18n.global.t('navbar.size')" effect="dark" placement="bottom"><size-select class="right-menu-item hover-effect" /></el-tooltip> -->
				<div class="right-menu-item hover-effect"><lang-select /></div>
			</template>
			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
				<div class="avatar-wrapper">
					<img :src="avatar" class="user-avatar" />
					<i class="el-icon-caret-bottom" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<router-link to="/">
							<el-dropdown-item>{{ i18n.global.t('navbar.dashboard') }}</el-dropdown-item>
						</router-link>
						<el-dropdown-item divided @click.native="logout">
							<span style="display:block;">{{ i18n.global.t('navbar.logOut') }}</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue'
import i18n from '/@/lang'
import { useRouter } from 'vue-router'
import { AppModule } from '/@/store/modules/app'
import { UserModule } from '/@/store/modules/user'
import Breadcrumb from '/@/components/Breadcrumb/index.vue'
import Hamburger from '/@/components/Hamburger/index.vue'
import LangSelect from '/@/components/LangSelect/index.vue'
// import HeaderSearch from '/@/components/HeaderSearch/index.vue'
// import Screenfull from '/@/components/Screenfull/index.vue'
// import SizeSelect from '/@/components/SizeSelect/index.vue'

export default defineComponent({
	name: 'Navbar',
	components: {
		Breadcrumb,
		Hamburger,
		LangSelect
		// HeaderSearch,
		// Screenfull,
		// SizeSelect
	},
	setup(props, context) {
		let { ctx } = getCurrentInstance()
		let router = useRouter()

		const sidebar = computed(() => AppModule.sidebar)

		const device = computed(() => AppModule.device.toString())

		const avatar = computed(() => UserModule.avatar)

		function toggleSideBar() {
			AppModule.ToggleSideBar(false)
		}

		async function logout() {
			await UserModule.LogOut()
			router.push('/login')
		}

		return {
			sidebar,
			toggleSideBar,
			device,
			avatar,
			logout,
			i18n
		}
	}
})
</script>

<style scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	& .hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		padding: 0 15px;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		& :hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	& .breadcrumb-container {
		float: left;
	}

	& .errLog-container {
		display: inline-block;
		vertical-align: top;
	}

	& .right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		& :focus {
			outline: none;
		}

		& .right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			& .hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				& :hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		& .avatar-container {
			& .avatar-wrapper {
				margin-right: 30px;
				margin-top: 5px;
				position: relative;

				& .user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				& .el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
