import { createI18n } from 'vue-i18n'

import { getLanguage } from '/@/utils/cookies'

// element-plus built-in lang
// import elementEnLocale from 'element-plus'
import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
import elementJaLocale from 'element-plus/lib/locale/lang/ja'
import elementKoLocale from 'element-plus/lib/locale/lang/ko'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import jaLocale from './ja'
import koLocale from './ko'

const messages = {
	en: {
		...enLocale,
		...elementEnLocale
	},
	zh: {
		...zhLocale,
		...elementZhLocale
	},
	ja: {
		...jaLocale,
		...elementJaLocale
	},
	ko: {
		...koLocale,
		...elementKoLocale
	}
}

export const getLocale = () => {
	const cookieLanguage = getLanguage()
	if (cookieLanguage) {
		return cookieLanguage
	}

	const language = navigator.language.toLowerCase()
	const locales = Object.keys(messages)
	for (const locale of locales) {
		if (language.indexOf(locale) > -1) {
			return locale
		}
	}

	// Default language is english
	return 'en'
}

const i18n = createI18n({
	locale: getLocale(),
	messages
})

export default i18n
