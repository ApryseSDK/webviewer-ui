export default (scriptSrc, warning) => {
  return new Promise(resolve => {
    if (!scriptSrc) {
      return resolve();
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      resolve();
    };
    script.onerror = function() {
      if (warning) {
        console.warn(warning);
      }
      resolve();
    };
    script.src = scriptSrc;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};