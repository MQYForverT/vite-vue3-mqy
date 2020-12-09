module.exports = {
	root: true,
	// 环境定义了预定义的全局变量
	env: {
		node: true
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'@vue/standard',
		'@vue/typescript/recommended',
		'@vue/typescript'
	],
	// JavaScript 语言选项
	parserOptions: {
		ecmaVersion: 2020,
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		}
	},
	rules: {
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': ['error',
			{
				multiline: {
					delimiter: 'none'
				},
				singleline: {
					delimiter: 'comma'
				}
			}
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'space-before-function-paren': ['error', 'never'],
		'vue/array-bracket-spacing': 'error',
		'vue/arrow-spacing': 'error',
		'vue/block-spacing': 'error',
		'vue/brace-style': 'error',
		'vue/camelcase': 'error',
		'vue/comma-dangle': 'error',
		'vue/component-name-in-template-casing': 'error',
		'vue/eqeqeq': 'error',
		'vue/key-spacing': 'error',
		'vue/match-component-file-name': 'error',
		'vue/object-curly-spacing': 'error'
	},

	overrides: [{
		files: [
			'**/__tests__/*.{j,t}s?(x)',
			'**/tests/unit/**/*.spec.{j,t}s?(x)'
		],
		env: {
			jest: true
		}
	}]
}
