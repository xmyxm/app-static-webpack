/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces eslint-disable-next-line no-mixed-spaces-and-tabs */
import $ from 'zepto'
import '../style/yodaseed/index.less';

const env = {
	domain: '',
	val: 'test'
}
let reqSent = false,
	yodaData = null,
	callBack = function() {};

function verifyParam(param) {
	let result = {
		code: 200,
		msg: '验证成功'
	}
	if (!param) {
		result.code = 900
		result.msg = '参数错误'
	} else if (!(param.captchaSource && [1, 2, 3, 4, 5, 6].indexOf(parseInt(param.captchaSource, 10)) > -1)) {
		// captchaSource说明：
		// 1：找回密码
		// 2：账号密码登录
		// 3：手机号快捷登录
		// 4：注册
		// 5：修改密码
		// 6：换绑手机（验证新手机）
		result.code = 901
		result.msg = '无效captchaSource参数，有效范围>=1 & <=6'
	} else if (!param.mobile) {
		result.code = 902
		result.msg = '缺少mobile参数'
	} else if (!param.countryCode) {
		result.code = 903
		result.msg = '缺少countryCode参数'
	} else if (!(param.platform && ['pc', 'm'].indexOf(param.platform) > -1)) {
		result.code = 904
		result.msg = '缺少有效的platform值(pc|m)'
	} else if (!(param.callback && typeof param.callback == 'function')) {
		result.code = 904
		result.msg = '缺少回调函数'
	} else {
		callBack = param.callback
		param.className = param.className || ''
		yodaData = param
	}
	return result
}

// 授权拿到requestCode
function getYodaseedCode(param, callback) {
	let result = verifyParam(param)
	if (result.code != 200) {
		return callBack(result)
	}
	$.ajax({
		type: 'POST',
		url: '/ajax/json/account/slideBlockAuth',
		data: param,
		dataType: 'json',
		success: function(data) {
			if (data.requestCode) {
				yodaData.requestCode = data.requestCode
				showYodaseed(data.requestCode)
			} else {
				result.code == data.code
				result.msg = data.msg.err
				callBack(result)
			}
		},
		error: function() {
			// 超时
			result.code == 500
			result.msg = '服务异常'
			callBack(result)
		},
		beforeSend: function() {
			reqSent = true;
		},
		complete: function() {
			reqSent = false;
			console.log(reqSent)
		}
	});
}

// 验证
function verifyYodaseedCode(param) {
	let result = {
		code: 200,
		msg: '验证成功'
	}
	$.ajax({
		type: 'POST',
		url: '/ajax/json/account/slideBlockResult',
		data: param,
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				result.uuid = data.uuid
			} else {
				result.msg = '滑块验证失败'
			}
			callBack(result)
		},
		error: function() {
			// 超时
			result.code == 500
			result.msg = '服务异常'
			callBack(result)
		},
		beforeSend: function() {
			reqSent = true;
		},
		complete: function() {
			reqSent = false;
		}
	});
}

// 请求业务方后端获取requestCode参数
function showYodaseed(requestCode) {
	var rootId = yodaData.root || 'root'
	var className = ''
	if (yodaData.platform == 'pc') {
    	var container = document.getElementById(rootId)
		container.className = `root-pc ${container.className} ${yodaData.className}`
	} else {
		className = 'root-m ' + yodaData.className
		var rootbox = document.createElement('div')
		rootbox.id = rootId
		rootbox.className = className
		document.body.appendChild(rootbox)
		rootbox.onclick = function(e) {
			if (e.target == this) {
				document.body.removeChild(rootbox)
			}
		}
	}

	var mainTitle
	var options = {
		requestCode: requestCode,
		root: rootId, // yoda模块 挂载到业务方的节点 id --> #root
		succCallbackFun: 'yodaseedSusCallBack', // 成功回调函数 函数名为字符串
		failCallbackFun: 'yodaseedErrorCallBack', // 失败回调函数 函数名为字符串
		theme: 'dianping', // 主题
		style: { 'wrapper': 'wrapper', 'sliderTtile': 'titleaaaa' },
		mounted: function() {
			if (yodaData.platform == 'm') {
				var titEle = rootbox.getElementsByTagName('p')
				if (titEle && titEle.length) {
					mainTitle = titEle[0]
					mainTitle.innerText = '身份验证'
					mainTitle.className = `${mainTitle.className} starttitle`
				}
			}
		}
		// key: wrapper --> $wrapper, sliderTtile --> $sliderTtile;
		// value: wrapper --> #root .wrapper, title --> #root .title
	};
	// pro:"https://verify.meituan.com",
	// staging:"//verify-test.meituan.com",
	// dev:"//verify.inf.dev.sankuai.com",
	// test:"//verify.inf.test.sankuai.com",
	// ppe:"//verify.inf.ppe.sankuai.com",
	// development:"//verify-test.meituan.com"
	YodaSeed(options, env.val); //development
	// document.getElementById("root").getElementsByTagName('p')[0].innerText = '身份验证'
	window.yodaseedSusCallBack = function(data) {
		if (yodaData.platform == 'm') {
			if (mainTitle) {
				mainTitle.className = `${mainTitle.className.replace(/starttitle|errortitle/g, '')} sustitle`
			}
		}
		const param = { captchaSource: yodaData.captchaSource, requestCode: data.requestCode, responseCode: data.responseCode }
		verifyYodaseedCode(param)
	}
	// 系统错误 121000,
	// 没有该动作 121001,
	// 必要参数丢失 /* 使用时重置message字段,其他情况勿用 */ 121002,
	// 没有该业务场景 121003,
	// 用户不存在 121004,
	// 参数格式错误  /* 使用时重置message字段,其他情况勿用 */ 121005,
	// 验证方式不存在 121006,
	// 请按照顺序验证 121007,
	// 参数丢失 121018,
	// 授权码已过期，请退出验证页面，重新操作 121044,
	// 非法的验证方式集合 121045,
	// 非法的商户ID 121049,
	// 没有权限 121999
	// 获取验证信息次数超过限制，请一小时后重试 121009,
	// 验证出错次数过多，请一小时后重试 121010,
	// 用户没有绑定手机 121011,
	// 抱歉，验证链接已过期，请重新申请 121036,
	// 手机号不存在 121040,
	// 获取验证信息错误 121042,
	// 获取授权失败 121043,
	// 获取手机验证码次数过多，请24小时之后重试 121046,
	// 非法的手机号 121050,
	// 账号有风险，拒绝操作 121051,
	// 验证操作已过期，请重试 121052,
	// 验证存在风险，拒绝操作 121053,
	// 获取验证码次数超限，请24小时之后重试 121055,
	// 请求异常,拒绝操作 121056,
	// 验证信息已失效，请选择其他验证方式 121057,
	// 滑块验证失败 121058,
	// 验证信息刷新次数过多，请24小时之后重试 121061,
	// 支付密码错误次数过多，请三小时后再试 121064
	// 验证出错次数过多，请24小时之后重试 121065,
	// 目前语音服务异常，请您尝试其他登录方式 121066,
	// 获取验证信息错误，请重试 121067
	window.yodaseedErrorCallBack = function(data) {
		if (yodaData.platform == 'm') {
			if (mainTitle) {
				mainTitle.className = `${mainTitle.className.replace(/starttitle|sustitle/g, '')} errortitle`
			}
		}
		verifyParam({ code: data.code, msg: '滑块验证失败' })
	}
}

function init() {
	const mData = {
		captchaSource: 1,
		mobile: '18516505580',
		dpid: '',
		countryCode: 86,
		root: 'root-m',
		className: '',
		platform: 'm',
		callback: function(data) {
			console.log('打印回调：' + JSON.stringify(data))
		}
	}
	const pcData = {
		captchaSource: 1,
		mobile: '18516505580',
		dpid: '',
		countryCode: 86,
		root: 'root-pc',
		className: '',
		platform: 'pc',
		callback: function(data) {
			console.log('打印回调：' + JSON.stringify(data))
		}
	}

	getYodaseedCode(mData)
}

$(document).ready(function() {
	init()
});