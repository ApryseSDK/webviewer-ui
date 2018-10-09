export default (property, defaultValue) =>  {
  const defaultType = typeof defaultValue;

  const result = getWindowHash().split('&').reduce(function (result, item) {
    var parts = item.split('=');
    result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return result;
  }, {});

  if (defaultType === 'boolean' && !isUndefined(result[property])) {
    const value = result[property];
    if (value === 'true' || value === '1') {
      return true;
    } else if (value === 'false' || value === '0') {
      return false;
    }
  }
  return result[property] || defaultValue;  
};

// use instead of window.location.hash because of https://bugzilla.mozilla.org/show_bug.cgi?id=483304
const getWindowHash = () => {
  const url = window.location.href;
  const i = url.indexOf('#');
  return (i >= 0 ? url.substring(i + 1) : '');
};

const isUndefined = val => typeof val === 'undefined';
