/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces eslint-disable-next-line no-mixed-spaces-and-tabs */
import $ from 'zepto'
import yoda from '@dp/account-yoda'
import '@dp/account-yoda/build/css/index.css'
import '../style/yodaseed/index.less';

const m = {
	riskChannel: 201,
	countryCode: 86,
	mobile: 18516505581
}

var callback = function(data) {
	console.log(data)
}
yoda(m, callback)

