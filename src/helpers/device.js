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
export const isMobileDeviceFunc = () => window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || window.navigator.userAgent.match(/Android/i) || window.navigator.userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i);
export const isMac = navigator.appVersion.indexOf('Mac') > -1;
export const isWindows = navigator.appVersion.indexOf('Windows') > -1;


export const isChrome = (function() {
  // opera, edge, and maxthon have chrome in their useragent string so we need to be careful!
  const opera = window.navigator.userAgent.match(/OPR/);
  const maxthon = window.navigator.userAgent.match(/Maxthon/);
  const edge = window.navigator.userAgent.match(/Edge/);

  return (window.navigator.userAgent.match(/Chrome\/(.*?) /) && !opera && !maxthon && !edge);
})();

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (/^((?!chrome|android).)*$/.test(navigator.userAgent) && isIOS);


export const isChromeOniOS =  window.navigator.userAgent.match(/CriOS\/(.*?) /);
