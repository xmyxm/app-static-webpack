/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces eslint-disable-next-line no-mixed-spaces-and-tabs */
import $ from 'zepto'
import yoda from '@dp/account-yoda'
import '../style/yodaseed/index.less';

const m = {
	riskChannel: 101,
	countryCode: 86,
	mobile: 18516505580,
	root: 'root-pc',
	platform: 'pc'
}

var callback = function(data) {
	console.log(data)
}
// 测试代码
m.env = 'dev'
yoda(m, callback)

