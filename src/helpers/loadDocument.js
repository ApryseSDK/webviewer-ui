import { setCheckPasswordFunction } from 'components/PasswordModal';

import core from 'core';
import { fireError } from 'helpers/fireEvent';
import getHashParams from 'helpers/getHashParams';
import actions from 'actions';

export default (dispatch, src, options = {}) => {
  options = { ...getDefaultOptions(), ...options };

  options.docId = options.documentId || null;
  options.onLoadingProgress = percent => dispatch(actions.setLoadingProgress(percent));
  options.password = transformPasswordOption(options.password, dispatch);
  options.xodOptions = extractXodOptions(options);
  options.onError = fireError;

  dispatch(actions.closeElement('passwordModal'));
  core.loadDocument(src, options);
  dispatch(actions.openElement('progressModal'));
};


/**
 * Default options are some of the options used to initialize WebViewer, and will be preserved on loadDocument calls.
 * We do this so that users don't need to pass these options every time they call instance.loadDocument
 * For example, if WebViewer is initialized with WebViewer Server, subsequent calls to instance.loadDocument will assume WebViewer Server is used.
 * @ignore
 */
const getDefaultOptions = () => ({
  startOffline: getHashParams('startOffline', false),
  azureWorkaround: getHashParams('azureWorkaround', false),
  pdftronServer: getHashParams('pdftronServer', ''),
  fallbackToClientSide: getHashParams('fallbackToClientSide', false),
  singleServerMode: getHashParams('singleServerMode', false),
  forceClientSideInit: getHashParams('forceClientSideInit', false),
  disableWebsockets: getHashParams('disableWebsockets', false),
  cacheKey: JSON.parse(getHashParams('cacheKey', null)),
  streaming: getHashParams('streaming', null),
  useDownloader: getHashParams('useDownloader', true),
  backendType: getHashParams('pdf', null),
  loadAsPDF: getHashParams('loadAsPDF', null),
});

/**
 * transform the password argument from a string to a function to hook up UI logic
 * @ignore
 */
const transformPasswordOption = (password, dispatch) => {
  // a boolean that is used to prevent infinite loop when wrong password is passed as an argument
  let passwordChecked = false;
  let attempt = 0;

  return checkPassword => {
    dispatch(actions.setPasswordAttempts(attempt++));

    if (!passwordChecked && typeof password === 'string') {
      checkPassword(password);
      passwordChecked = true;
    } else {
      if (passwordChecked) {
        console.error(
          'Wrong password has been passed as an argument. WebViewer will open password modal.',
        );
      }

      setCheckPasswordFunction(checkPassword);
      dispatch(actions.openElement('passwordModal'));
    }
  };
};

const extractXodOptions = options => {
  const xodOptions = options.xodOptions || {};

  if (options.decryptOptions) {
    xodOptions.decrypt = window.CoreControls.Encryption.decrypt;
    xodOptions.decryptOptions = options.decryptOptions;
  }

  if (options.decrypt) {
    xodOptions.decrypt = options.decrypt;
  }

  if (options.streaming !== null) {
    // depending on combination of value in loadDocument and in WV constructor
    // getHashedParam will either return back a boolean or a stringed boolean value
    xodOptions.streaming = options.streaming === 'true' || options.streaming === true;
  }

  if (options.azureWorkaround) {
    xodOptions.azureWorkaround = options.azureWorkaround;
  }

  if (options.startOffline) {
    xodOptions.startOffline = options.startOffline;
  }

  return xodOptions;
};
