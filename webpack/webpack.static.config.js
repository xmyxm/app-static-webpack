const path = require('path')
const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const glob = require('glob')
const f2eci = require('../f2eci')
const DIST_PATH = f2eci.dist

// 获取客户端entry
let entries = {}
glob.sync(`./html/js/*.js`).map(file => {
    entries[path.basename(file, '.js')] = [file]
})

module.exports = {
	entry:entries,
	output:{
		path: path.join(__dirname, '../', DIST_PATH)
		,filename:'js/[name].js'
		,chunkFilename: 'js/[name].js'
	},
	module:{
		rules:[
			{
				test: require.resolve('zepto'),
				use: ['exports-loader?window.Zepto','script-loader']
			},
			{
				test: /\.(es6|jsx|js)$/,
				loader: 'babel-loader?cacheDirectory',//babel-loader缓存机制加参数 cacheDirectory,webpack构建将尝试从缓存中读取，以避免在每次运行时，需要运行 Babel 重新编译过程可能带来的高昂的开销
				exclude: /node_modules/,
				query: {
					presets: ['stage-0', 'es2015'],
					plugins: ['transform-runtime', 'transform-object-rest-spread', 'transform-decorators-legacy']
				}
			}
		]
		
	}
	,mode: 'production'//'development'
	,plugins:[
		new webpack.BannerPlugin('大众点评网'),
		new DashboardPlugin()
	]
}
