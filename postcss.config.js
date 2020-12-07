module.exports = {
	plugins: {
		'postcss-cssnext': {
			browsers: 'last 2 versions', // 浏览器兼容的版本
			stage: 3 // 你用的属性所在的阶段
		},
		'postcss-pxtorem': {
			rootValue: 14, // html节点设的font-size大小，由于chrome最小12px，所以基值要设置大写
			unitPrecision: 5, // 转rem精确到小数点多少位
			propList: ['*'], // 指定转换成rem的属性，支持 * ！
			selectorBlackList: ['el'], // str或reg ，指定不转换的选择器，str时包含字段即匹配
			replace: true,
			mediaQuery: false, // 媒体查询内的px是否转换
			minPixelValue: 0 // 小于指定数值的px不转换
		},
		"cssnano": {
			"assets": "default", //使用默认配置
			"cssnano-preset-advanced": { //高级配置中有一些选项又可以我们不需要，所以我们需要去掉
				zindex: false,
				autoprefixer: false
			},
		}
	}
}
