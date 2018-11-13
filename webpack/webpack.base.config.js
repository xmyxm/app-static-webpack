const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

const f2eci = require('../f2eci')
//const STATIC_SRC = f2eci['static-src']
const DIST_PATH = f2eci.dist
const devMode = f2eci.env == 'dev'

module.exports = {
	entry: {
		mobike: ['./src/page/mobike.js'],
		qashare: ['./src/page/qashare.js'],
		service: ['./src/page/service.js'],
		yodaseed: ['./src/page/yodaseed.js']
		//,common:['react','redux']
	},
	output: {
		path: path.join(__dirname, '../', DIST_PATH) //STATIC_SRC
		//,filename:'js/[name]-[chunkhash].js'//dev 环境不能使用这个配置，因为您不应该使用纯或散列进行开发。这将导致许多其他问题，比如内存泄漏，因为dev服务器不知道什么时候清理旧文件。
		,
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
		publicPath: '/app/app-static-page/',
		crossOriginLoading: 'anonymous' //script 标签加上跨域错误捕获权限
	},
	module: {
		rules: [{
			test: require.resolve('zepto'), // require.resolve() 是 nodejs 用来查找模块位置的方法，返回模块的入口文件
			// [script-loader] 用 eval 的方法将 zepto 在引入的时候执行了一遍，此时 zepto 库已存在于 window.Zepto
			// [exports-loader] 将传入的 window.Zepto 以 module.exports = window.Zepto 的形式向外暴露接口，使这个模块符合 CommonJS 规范，支持 import
			use: ['exports-loader?window.Zepto', 'script-loader']
		},
		{
			test: /\.(es6|jsx|js)$/,
			loader: 'babel-loader?cacheDirectory', //babel-loader缓存机制加参数 cacheDirectory,webpack构建将尝试从缓存中读取，以避免在每次运行时，需要运行 Babel 重新编译过程可能带来的高昂的开销
			exclude: /node_modules/,
			query: {
				//先执行完所有Plugin，再执行Preset。多个Plugin，按照声明次序顺序执行。多个Preset，按照声明次序逆序执行。
				presets: ['stage-0', 'es2015'],
				//est-spread 解构代码转换, decorators-legacy装饰器语法转换,stage-0 包含 transform-class-properties
				plugins: ['transform-runtime', 'transform-object-rest-spread', 'transform-decorators-legacy']
			}
		},
		{
			test: /\.less$/,
			use: [{
				loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
				options: {
					// 您可以在这里指定公共路径,默认情况下，它在webpackOptions.output中使用publicPath
				}
			},
			{
				loader: 'css-loader',
				options: { minimize: true }
			},
			'postcss-loader',
			'less-loader'
			]
		},
		{
			test: /\.css$/,
			use: [{
				loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
				options: {
					// 您可以在这里指定公共路径,默认情况下，它在webpackOptions.output中使用publicPath
				}
			},
			{
				loader: 'css-loader',
				options: { minimize: true }
			}
			]
		},
		{
			test: /\.(png|jpg|jpeg|gif)$/,
			//url-loader是对file-loader的上层封装，一般限制小图片转 base64 可以用 url-loader
			use: [{ loader: 'url-loader', options: { limit: 5000, name: 'images/[name]-[hash:8].[ext]' } }]
			// 内联的base64的图片地址, 图片要小于5k, 直接的url的地址则不解析
		},
		{
			test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/vnd.ms-fontobject', name: 'font/[name]-[hash:8].[ext]' } }]
		},
		{
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream', name: 'font/[name]-[hash:8].[ext]' } }]
		},
		{
			test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff', name: 'font/[name]-[hash:8].[ext]' } }]
		},
		{
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'image/svg+xml', name: 'images/[name]-[hash:8].[ext]' } }]
		}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2
				},
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		},
		runtimeChunk: {
			// manifest文件用来引导所有模块的交互。manifest文件包含了加载和处理模块的逻辑。
			// 当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。当模块被打包并运输到浏览器上时，
			name: 'manifest'
		}
	},
	plugins: [
		new webpack.BannerPlugin('大众点评网'), //打包后代码版权申明插件
		// new CleanPlugin(
		// 	['dist', 'build'],
		// 	{
		// 		root: __dirname, //根目录
		// 		verbose: true, //开启在控制台输出信息
		// 		dry: false //启用删除文件
		// 	}
		// ),//每次打包清理上次的打包文件
		// css文件抽离设置
		new MiniCssExtractPlugin({
			filename: 'css/[name].css'
		}),
		new DashboardPlugin(),
		new HtmlWebpackPlugin({
			template: './src/html/mobike.html',
			filename: 'mobike.html' //可以使用hash命名
			,
			title: '服务授权',
			inject: 'body' //脚本包含到body 也可以写到head里面
			,
			chunks: ['manifest', 'vendors', 'common', 'mobike'] //指定当前模板需要打入哪些js模块
			,
			minify: { //启用代码代码压缩
				removeComments: true, //移除注释
				collapseWhitespace: true //移除空格
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/html/qashare.html',
			filename: 'qashare.html' //可以使用hash命名
			,
			title: '服务授权',
			inject: 'body' //脚本包含到body 也可以写到head里面
			,
			chunks: ['manifest', 'vendors', 'common', 'qashare'] //指定当前模板需要打入哪些js模块
			,
			minify: { //启用代码代码压缩
				removeComments: true, //移除注释
				collapseWhitespace: true //移除空格
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/html/service.html',
			filename: 'service.html' //可以使用hash命名
			,
			title: 'service',
			inject: 'body' //脚本包含到body 也可以写到head里面
			,
			chunks: ['manifest', 'vendors', 'common', 'service'] //指定当前模板需要打入哪些js模块
			,
			minify: { //启用代码代码压缩
				removeComments: true, //移除注释
				collapseWhitespace: true //移除空格
			}
		}),
		new HtmlWebpackPlugin({
			template: './src/html/yodaseed.html',
			filename: 'yodaseed.html' //可以使用hash命名
			,
			title: '点评滑块验证',
			inject: 'body' //脚本包含到body 也可以写到head里面
			,
			chunks: ['manifest', 'vendors', 'common', 'yodaseed'] //指定当前模板需要打入哪些js模块
			,
			minify: { //启用代码代码压缩
				removeComments: true, //移除注释
				collapseWhitespace: true //移除空格
			}
		})
		// 允许你创建一个在编译时可以配置的全局常量，只能在被打包的文件中读取到这个全局变量
		// new webpack.DefinePlugin({
		// 	'env':'测试'
		// })
	],
	resolve: {
		//别名设置,主要是为了配和webpack.ProvidePlugin设置全局插件;
		alias: {
			//绝对路径;特别注意这里定义的路径和依赖的包名不能重名
			actionpath: path.resolve(__dirname, '../src/redux/action'),
			utilspath: path.resolve(__dirname, '../src/utils'),
			componentpath: path.resolve(__dirname, '../src/component'),
			stylepath: path.resolve(__dirname, '../src/style'),
			reduxpath: path.resolve(__dirname, '../src/redux')
		}
	},
	devServer: {
		headers: {
			'Access-Control-Allow-Origin': '*' //支持服务跨域
		},
		contentBase: DIST_PATH,
		watchContentBase: true, //告诉服务器监视那些通过 devServer.contentBase 选项提供的文件。文件改动将触发整个页面重新加载。默认被禁用。
		compress: true, //一切服务都启用gzip 压缩：
		inline: true, //应用程序启用内联模式,默认内联模式,当源文件改变时会自动刷新页面
		hot: true, //启用 webpack 的模块热替换特性
		host:'localhost',//指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定为ip
		//host:'m.51ping.com',
		stats: { colors: true }, // 用颜色标识
		port: 9000,
		//port: 80, // 如果是小于1000的端口号，是需要sudo权限的，启用方式 sudo node server.js即可(可使用默认80端口)
		proxy: {
			'/ajax/json/account/*': {
				target: 'http://w.51ping.com',
				changeOrigin: true,
				secure: false
			}
		}
	}
}
//img处理
//url-loader 可以根据自定义文件大小或者转化为 base64 格式的 dataUrl, 或者单独作为文件, 也可以自定义对应的hash 文件名
//file-loader 默认情况下会根据图片生成对应的 MD5hash 的文件格式
//image-webpack-loader 提供压缩图片的功能


//css处理
//style-loader自动将css代码放到生成的style标签中插入到head标签里
//use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
//fallback:编译后用什么loader来提取css文件
//使用PostCSS来为CSS代码自动添加适应不同浏览器的CSS前缀, postcss-loader 需要结合加前缀工具 autoprefixer ,
//在webpack配置文件中添加postcss-loader，在根目录新建postcss.config.js 指明 添加前缀的插件及其插件的配置

//{
//     loader: "css-loader",
//     options: {
//         modules: true
//     }
// }
//CSS modules 的技术就意在把JS的模块化思想带入CSS中来,这样做只对当前组件有效，不必担心在不同的模块中使用相同的类名造成冲突

//babel-polyfill 是对浏览器缺失API的支持。比如浏览器可能没有Array.from() 方法。
//babel-runtime 是为了减少重复代码而生的。 babel生成的代码，可能会用到一些_extend()， classCallCheck() 之类的工具函数，默认情况下，这些工具函数的代码会包含在编译后的文件中。如果存在多个文件，那每个文件都有可能含有一份重复的代码。