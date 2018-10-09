export default () => {
  return !isIE() && ((scrollbarWidth() === 0 && navigator.userAgent.match(/Edge/i))
                || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Touch/i)
                || navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/Silk/i));
};

const isIE = () => {
  const ua = navigator.userAgent.toLowerCase();
  const match = /(msie) ([\w.]+)/.exec(ua) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(ua);

  return match ? parseInt(match[2], 10) : match;
};

// In windows 10 tablets, the tablet mode and desktop mode use the same user agent.  HOWEVER
// the scrollbar width in tablet mode is 0. This means that we can find the scrollbar width
// and use it to determine if they are in tablet mode (mobile viewer) or desktop mode
const scrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'width:100px;height:100px;overflow:scroll !important;position:absolute;top:-9999px';
  document.body.appendChild(scrollDiv);

  const result = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return result;  
};