import axios from 'axios'
import qs from 'qs'
import { ElMessage as Message, ElMessageBox as MessageBox } from 'element-plus'
import { UserModule } from '@/store/modules/user'
import { convertRes2Blob } from '@/utils/dowloadFile'

const service = axios.create({
	baseURL: `${import.meta.env.VITE_BASE_API}/${import.meta.env.VITE_PROJECT_NAME}`, // url = base url + request url
	timeout: 5000
	// withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
	config => {
		// Add X-Access-Token header to every request, you can add other custom headers here
		if (UserModule.token) {
			// 让每个请求携带自定义token 请根据实际情况自行修改
			config.headers.Authorization = UserModule.token
			// 当前登陆者id
			config.headers.userId = UserModule.userid
			// 当前品牌id
			config.headers.bId = UserModule.bId
		}
		// 如果是文件，则特别设置responseType，这个需要在headers里面配置特殊字段：isFile
		if (config.headers.isFile) {
			config.responseType = 'blob'
		}
		// 支持传数组
		config.paramsSerializer = function(params) {
			return qs.stringify(params, { arrayFormat: 'repeat' })
		}

		return config
	},
	error => {
		Promise.reject(error)
	}
)

// Response interceptors
service.interceptors.response.use(
	response => {
		// 判断是否是文件
		const contentType = response.headers['content-type']
		if (contentType === 'application/msexcel;charset=UTF-8') {
			convertRes2Blob(response)
		} else {
			// Some example codes here:
			// code == 20000: success
			// code == 50001: invalid access token
			// code == 50002: already login in other place
			// code == 50003: access token expired
			// code == 50004: invalid user (user not exist)
			// code == 50005: username or password is incorrect
			// You can change this part for your own usage.
			const res = response.data
			if (res.result !== 200) {
				Message({
					message: res.msg || 'Error',
					type: 'error',
					duration: 3 * 1000
				})
				if (res.code === 403) {
					MessageBox.confirm('当前登录信息已失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
						confirmButtonText: '重新登录',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						UserModule.ResetToken()
						location.reload() // To prevent bugs from vue-router
					})
				}
				return Promise.reject(new Error(res.msg || 'Error'))
			} else {
				return res
			}
		}
	},
	error => {
		// 先判断是否超时，如果超时直接返回错误信息
		const originalRequest = error.config
		if (error.code === 'ECONNABORTED' && error.message.includes('timeout') && !originalRequest._retry) {
			Message({
				showClose: true,
				message: '网络连接超时',
				type: 'error',
				duration: 3 * 1000
			})
			return Promise.reject('网络连接超时')
		}

		// 没有超时，才会有response
		const errorStatus = error.response.status
		if (errorStatus === 403) {
			MessageBox.confirm('当前登录信息已失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
				confirmButtonText: '重新登录',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				UserModule.ResetToken()
				location.reload() // To prevent bugs from vue-router
			})
		} else {
			Message({
				showClose: true,
				message: error.message,
				type: 'error',
				duration: 3 * 1000
			})
		}
		return Promise.reject(error)
	}
)

export default service
