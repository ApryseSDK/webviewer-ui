export const isDesktop = () => window.innerWidth > 900;
export const isTabletOrMobile = () => window.innerWidth <= 900;
export const isMobile = () => window.innerWidth < 640;
export const isIEEdge = navigator.userAgent.indexOf('Edge') > -1;
export const isIE11 = navigator.userAgent.indexOf('Trident/7.0') > -1;
export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export const isIE = isIEEdge || isIE11;
// https://stackoverflow.com/a/58064481
const checkForIOS13 = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const isIOS = window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || checkForIOS13;
export const isAndroid = window.navigator.userAgent.match(/Android/i);
export const isMobileDevice = isIOS || isAndroid || window.navigator.userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i);
export const isMac = navigator.appVersion.indexOf('Mac') > -1;
