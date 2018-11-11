/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces */
import 'zepto'
import '../style/mobike/index.less';

let version, userId;

function isApp() {
	if (window.navigator.userAgent.indexOf('dianping') > -1) {
		return true
	} 
	return false
}

// 跳mobike页面
function gotoMobike() {
	if (isApp()) {
		console.log('app环境')
	} else {
		console.log('浏览器')
	}
}
