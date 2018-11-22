/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces */
import '../style/aboutapp/index.less';
import Clipboard from 'clipboard'

var clipboard = new Clipboard('#copybtn'); //实例化
//复制成功执行的回调，可选
clipboard.on('success', function(e) {
	console.log(e);
});

//复制失败执行的回调，可选
clipboard.on('error', function(e) {
	console.log(e);
});
