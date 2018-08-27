const isbeta = location.hostname.indexOf('51ping') > -1
const protocol = 'https://'

export default {
	domain: protocol + (isbeta ? 'm.51ping.com' : 'maccount.dianping.com'),
	mobikeUrl: isbeta ? 'https://inspire-h5.mobike.com/' : 'https://h5.mobike.com/'
}
