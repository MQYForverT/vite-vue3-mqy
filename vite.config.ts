import { UserConfig } from 'vite'
import { resolve } from 'path'
const svgPlugin = require('vite-plugin-svg')

function pathResolve(dir: string) {
	return resolve(__dirname, dir)
}

/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 */
const viteConfig: UserConfig = {
	/**
	 * port
	 * @default '3000'
	 */
	port: 8077,
	/**
	 * @default 'localhost'
	 */
	hostname: 'localhost',
	/**
	 * Run to open the browser automatically
	 * @default 'false'
	 */
	open: true,
	/**
	 * Directory relative from `root` where build output will be placed. If the
	 * directory exists, it will be removed before the build.
	 * @default 'dist'
	 */
	outDir: 'dist',
	/**
	 * Base public path when served in production.
	 * @default '/'
	 */
	base: process.env.NODE_ENV === 'development' ? '/' : '/index/',
	/**
	 * Whether to generate sourcemap
	 * @default false
	 */
	sourcemap: false,
	/**
	 * Directory relative from `outDir` where the built js/css/image assets will
	 * be placed.
	 * @default '_assets'
	 */
	assetsDir: '_assets',
	/**
	 * Static asset files smaller than this number (in bytes) will be inlined as
	 * base64 strings. Default limit is `4096` (4kb). Set to `0` to disable.
	 * @default 4096
	 */
	assetsInlineLimit: 4096,
	/**
	 * Transpile target for esbuild.
	 * @default 'es2020'
	 */
	esbuildTarget: 'es2020',
	/**
	 * Whether to log asset info to console
	 * @default false
	 */
	silent: false,
	/**
	 * Import alias. The entries can either be exact request -> request mappings
	 * (exact, no wildcard syntax), or request path -> fs directory mappings.
	 * When using directory mappings, the key **must start and end with a slash**.
	 * ```
	 */
	alias: {
		'/@/': pathResolve('./src')
	},
	// 压缩
	minify: 'esbuild',
	// 引入第三方的配置
	optimizeDeps: {
		include: [
			'lodash',
			'element-plus/package.json',
			'element-plus/lib/locale/lang/en',
			'element-plus/lib/locale/lang/zh-cn',
			'element-plus/lib/locale/lang/ja',
			'element-plus/lib/locale/lang/ko'
		]
	},
	proxy: {},
	rollupInputOptions: {
		//外部的
		external: []
	},
	plugins: [svgPlugin()]
}

export default {
	...viteConfig
} as UserConfig
