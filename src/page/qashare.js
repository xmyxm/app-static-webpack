/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces */
import 'zepto'
import '../style/qashare/index.less';

let openApp = function (scheme, downlink) {
	let ua = navigator.userAgent.toLocaleLowerCase(),
		openBrowser = null,
		deviceVersion = 0,
		openAppType = '',
		matchAndroid = navigator.userAgent.match(/Android\s*(\d+)/),
		matchIOS = navigator.userAgent.match(/OS\s*(\d+)/);
    
	//如果是在微信内部点击的时候
	if(ua.indexOf('micromessenger') != -1 ) {
		openApp = function(){
			alert('微信不支持APP唤起，请在移动端的浏览器查看！');
		}
	} else {
		//在浏览器打开，判断是在移动端还是在PC端
		if(matchIOS){
			//赋值，并且判断IOS设备的浏览器
			deviceVersion = matchIOS[1] || 0;
			if(deviceVersion - 9 >= 0){
				openAppType = 'newType';
			}
		}else if(matchAndroid){
			//Android的设备
			deviceVersion = matchAndroid[1] || 0;
			if(deviceVersion - 5 >= 0){
				openAppType = 'newType';
			}
		}else{
			//PC端的设备
			openAppType = 'pc';
			openApp = function(){
				alert('当前设备不支持唤起，请在移动设备浏览器查看！');
			}
		}
		if(openAppType == 'newType'){
			//使用新的方法，尝试打开APP
			//IOS>9,Android>5的版本
			openApp = function(scheme_url){
				let iframeEle = document.createElement('iframe')
				iframeEle.style.display = 'none'
				iframeEle.src = scheme_url
				document.body.appendChild(iframeEle)
				setTimeout(function() {
					document.body.removeChild(iframeEle);
				}, 1000);
			}
		}
	}
}

$(document).ready(function () {
	let videoPlayer = document.getElementById('videoplay')
	let playbtn = document.getElementById('playbtn')
	let openbtn = document.getElementById('openbtn')
	let content = document.getElementById('content')
	let options = document.getElementById('options')
	let $videoPlayer = $(videoPlayer)
	let $playbtn = $(playbtn)
	let $openbtn = $(openbtn)
	let $content = $(content)
	let $options = $(options)
	let imgEle,scheme = 'QA://Home',downlink = '';

	// 点击播放暂停
	$videoPlayer.on('click', function(e){ 
		console.log('是否暂停状态：' + videoPlayer.paused)
		if (imgEle) {
			screenshot.removeChild(imgEle)
		}
		if (videoPlayer.paused) {
			console.log('开始播放')
			videoPlayer.play()
			$playbtn.hide()
		} else {
			console.log('暂停播放')
			videoPlayer.pause()
			$playbtn.show()
		}
	})
	// 播放结束事件
	$videoPlayer.on('ended', function(e){ 
		console.log('播放完毕')
		$playbtn.show()
	})
	// 
	$videoPlayer.on('loadeddata', function(e){ 
		console.log('视频第一帧')
		try {
			let scale = 0.8;
			let canvas = document.createElement('canvas')
			canvas.width = videoPlayer.videoWidth * scale
			canvas.height = videoPlayer.videoHeight * scale
			canvas.getContext('2d').drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)
			imgEle = document.createElement('img')
			imgEle.setAttribute('crossOrigin','anonymous')
			imgEle.src = canvas.toDataURL('image/png')
			imgEle.className = 'screenshot'
			playbtn.appendChild(imgEle)
		} catch(err) {
			imgEle = null
			console.warn(err)
		}
	})
	// 点击播放按钮
	$playbtn.on('click', function(e){ 
		videoPlayer.play()
		$playbtn.hide()
	})
	// 点击唤起按钮
	$openbtn.on('click', function(e){ 
		openApp(scheme, downlink)
	})
	// 点击作者信息唤起
	$options.on('click', function(e){ 
		openApp(scheme, downlink)
	})
	// 点击问题唤起
	$content.on('click', function(e){ 
		openApp(scheme, downlink)
	})
	// 初始化唤起环境
	openApp()
});

