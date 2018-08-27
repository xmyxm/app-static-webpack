/* eslint-disable camelcase,no-invalid-this,vars-on-top,new-cap,no-undef,no-undefined,callback-return,no-unused-vars,no-trailing-spaces */
import urlConfig from '../lib/urlconfig.js'
// 这里必须用 titans 
import KNB from '@dp/knb/titans'
import 'zepto'
import '../style/mobike.less';

let version, userId;

function isApp() {
    if (window.navigator.userAgent.indexOf('dianping') > -1) {
        return true
    } else {
        return false
    }
}

// 跳mobike页面
function gotoMobike() {
    if (isApp()) {
        KNB.jumpWebview({ url: urlConfig.mobikeUrl })
    } else {
        location.replace(urlConfig.mobikeUrl)
    }
}
