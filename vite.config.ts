import { UserConfig, ServerOptions, BuildOptions, DepOptimizationOptions } from 'vite'

import { resolve } from 'path'

// 用于正确编译.vue文件
import vue from '@vitejs/plugin-vue'

const svgPlugin = require('vite-plugin-svg')

function pathResolve(dir: string) {
	return resolve(__dirname, '.', dir)
}

const depOptimizationOption: DepOptimizationOptions = {
	include: [
		'lodash',
		'element-plus/package.json',
		'element-plus/lib/locale/lang/en',
		'element-plus/lib/locale/lang/zh-cn',
		'element-plus/lib/locale/lang/ja',
		'element-plus/lib/locale/lang/ko'
	]
}

const serverOption: ServerOptions = {
	/**
	 * port
	 * @default '3000'
	 */
	port: 8077,
	/**
	 * @default 'localhost'
	 */
	host: 'localhost',
	/**
	 * Run to open the browser automatically
	 * @default 'false'
	 */
	open: true,
	proxy: {}
}

const buildOption: BuildOptions = {
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
	assetsDir: 'assets',
	/**
	 * Static asset files smaller than this number (in bytes) will be inlined as
	 * base64 strings. Default limit is `4096` (4kb). Set to `0` to disable.
	 * @default 4096
	 */
	assetsInlineLimit: 4096,
	// 压缩
	minify: 'esbuild'
}

const viteConfig: UserConfig = {
	alias: [
		{
			find: '@',
			replacement: pathResolve('./src')
		}
	],
	plugins: [vue(), svgPlugin()],
	server: serverOption,
	build: buildOption,
	optimizeDeps: depOptimizationOption
}

export default {
	...viteConfig
} as UserConfig
