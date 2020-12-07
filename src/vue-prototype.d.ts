import lodash from 'lodash'
import Base64 from '/@/utils/base64'

declare module 'vue/types/vue' {
	interface Vue {
		$lodash: lodash
		$Base64: Base64
	}
}
