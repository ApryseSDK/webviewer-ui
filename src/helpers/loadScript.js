import getHashParams from 'helpers/getHashParams';

const loadScript = (scriptSrc, warning) => {
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

// communicates with the parent window to get the URL of the config file and loads it
// in development mode this method will instead try finding the URL in the query parameters only for debugging purposes
// ignore subsequent messages after successfully loads a config file
const loadConfig = () => {
  const _loadConfig = (e, resolve) => {
    if (e.data.type === 'responseConfig') {
      loadScript(
        e.data.value,
        'Config script could not be loaded'
      ).then(() => {
        window.removeEventListener('message', _loadConfig);
        resolve();
      });
    }
  };

  return new Promise(resolve => {
    window.addEventListener('message', e => _loadConfig(e, resolve));

    // Use hash param when running UI by itself
    if (process.env.NODE_ENV === 'development' && window.parent === window) {
      loadScript(getHashParams('config', '')).then(() => {
        window.removeEventListener('message', _loadConfig);
        resolve();
      });
    }
    window.parent.postMessage('requestConfig', '*');
  });
};

export default loadScript;
export {
  loadConfig
};
