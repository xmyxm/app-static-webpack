/* eslint-disable camelcase,new-cap */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
let config = require('./webpack.base.config.js')

config.mode = 'production'
//我们把优化插件都放在这里
config.optimization.minimizer = [
	// js 文件压缩
	new UglifyJsPlugin({
		test: /\.js($|\?)/i,
		// 启用文件缓存。缓存目录的默认路径: node_modules/.cache/uglifyjs-webpack-plugin
		cache: true,
		// 实现并行化。默认并发运行数等于cpu核心数量减1
		parallel: true,
		uglifyOptions: {
			// 最紧凑的输出
			beautify: false,
			// 删除所有的注释
			comments: false,
			compress: {
				// 在UglifyJs删除没有用到的代码时不输出警告
				warnings: false,
				// 删除所有的 `console` 语句
				// 还可以兼容ie浏览器
				drop_console: true,
				// 内嵌定义了但是只用到一次的变量
				collapse_vars: true,
				// 提取出出现多次但是没有定义成变量去引用的静态值
				reduce_vars: true
			}
		}}),
	// css 文件压缩
	new OptimizeCssAssetsPlugin({
		assetNameRegExp: /\.optimize\.css$/g,
		cssProcessor: require('cssnano'),
		cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
		canPrint: true
	})
]
//source-map的打包可以告诉我们错误源自源码的具体的位置,devtool来选定生成的source-map的详细程度
//config.devtool = 'source-map';//
//config.devtool = 'cheap-module-source-map';//生成一个没有列信息（column-mappings）的SourceMaps文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。
config.devtool = 'eval-source-map';
config.output.chunkFilename = 'js/[name]-[chunkhash:8].js';//上线文件打上hash
module.exports = config;

