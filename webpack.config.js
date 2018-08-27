/**
 * Created by madlord on 16/1/14.
 */
const env = require('./f2eci').env

var configMap = {
	'dev': () => require('./webpack/webpack.beta.config'),
	'beta': () => require('./webpack/webpack.beta.config'),
	'ppe': () => require('./webpack/webpack.product.config'),
	'product': () => require('./webpack/webpack.product.config')
}
module.exports = configMap[env] && configMap[env]() || configMap.dev();


