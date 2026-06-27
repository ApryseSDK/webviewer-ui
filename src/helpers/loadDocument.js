import { setCheckPasswordFunction } from 'components/PasswordModal';
import core from 'core';
import { fireError } from 'helpers/fireEvent';
import getFileExtension from 'helpers/getFileExtension';
import getHashParameters from 'helpers/getHashParameters';
import normalizeInitialEditMode from 'helpers/normalizeInitialEditMode';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { VIEWER_CONFIGURATIONS, VALID_DOCX_EXTENSIONS, VALID_SPREADSHEET_EXTENSIONS } from 'constants/customizationVariables';
import { SpreadsheetEditorEditMode } from 'src/constants/spreadsheetEditor';

export default (dispatch, src, options = {}, documentViewerKey = 1) => {
  options = { ...getDefaultOptions(), ...options };

  const normalizedSpreadsheetInitialEditMode = normalizeInitialEditMode(
    options.spreadsheetEditorOptions?.initialEditMode,
    Object.values(SpreadsheetEditorEditMode),
    undefined,
    SpreadsheetEditorEditMode.EDITING,
  );
  if (normalizedSpreadsheetInitialEditMode !== undefined) {
    options = {
      ...options,
      spreadsheetEditorOptions: {
        ...options.spreadsheetEditorOptions,
        initialEditMode: normalizedSpreadsheetInitialEditMode,
      },
    };
  }

  options.docId = options.docId || options.documentId || null;
  const customLoadingProgressFunction = options.onLoadingProgress;
  options.onLoadingProgress = (percent) => {
    customLoadingProgressFunction && customLoadingProgressFunction(percent);
    dispatch(actions.setLoadingProgress(percent));
  };
  options.password = transformPasswordOption(options.password, dispatch);
  options.xodOptions = extractXodOptions(options);
  if ('onError' in options) {
    const userDefinedOnErrorCallback = options.onError;
    options.onError = function(error) {
      fireError(error);
      userDefinedOnErrorCallback(error);
    };
  } else {
    options.onError = fireError;
  }

  dispatch(actions.closeElement(DataElements.PASSWORD_MODAL));
  const extension = getFileExtension(src, options);

  const isDOCXEditorMode = options.initialMode === VIEWER_CONFIGURATIONS.DOCX_EDITOR || options.enableOfficeEditing; // For backward compatibility
  const isXLSXEditorMode = options.initialMode === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;

  if (isDOCXEditorMode && VALID_DOCX_EXTENSIONS.includes(extension)) {
    options.enableOfficeEditing = true;
  } else if (isXLSXEditorMode && VALID_SPREADSHEET_EXTENSIONS.includes(extension)) {
    options.enableOfficeEditing = true;
  } else {
    options.enableOfficeEditing = false;
  }

  let loadPromise;
  if (!src) {
    if (isXLSXEditorMode) {
      loadPromise = core.loadBlankSpreadsheet(options);
    } else if (isDOCXEditorMode) {
      loadPromise = core.loadBlankOfficeEditorDocument(options);
    }
  } else {
    // ignore caught errors because they are already being handled in the onError callback
    loadPromise = core.loadDocument(src, options, documentViewerKey).catch(() => {});
  }

  dispatch(actions.openElement(DataElements.PROGRESS_MODAL));

  return loadPromise;
};


/**
 * Default options are some of the options used to initialize WebViewer, and will be preserved on loadDocument calls.
 * We do this so that users don't need to pass these options every time they call instance.loadDocument
 * For example, if WebViewer is initialized with WebViewer Server, subsequent calls to instance.loadDocument will assume WebViewer Server is used.
 * @ignore
 */
const getDefaultOptions = () => ({
  startOffline: getHashParameters('startOffline', false),
  azureWorkaround: getHashParameters('azureWorkaround', false),
  webviewerServerURL: getHashParameters('webviewerServerURL', ''),
  fallbackToClientSide: getHashParameters('fallbackToClientSide', false),
  singleServerMode: getHashParameters('singleServerMode', false),
  webviewerServerRangeRequests: getHashParameters('wvsRange', true),
  forceClientSideInit: getHashParameters('forceClientSideInit', false),
  disableWebsockets: getHashParameters('disableWebsockets', false),
  cacheKey: getHashParameters('cacheKey', null),
  officeOptions: safeJsonParse(getHashParameters('officeOptions', null)),
  rasterizerOptions: safeJsonParse(getHashParameters('rasterizerOptions', null)),
  streaming: getHashParameters('streaming', null),
  useDownloader: getHashParameters('useDownloader', true),
  backendType: getHashParameters('pdf', null),
  loadAsPDF: getHashParameters('loadAsPDF', null),
  initialMode: getHashParameters('initialMode', null),
  enableOfficeEditing: getHashParameters('enableOfficeEditing', false),
  spreadsheetEditorOptions: safeJsonParse(getHashParameters('spreadsheetEditorOptions', '{}'), {}),
});

/**
 * transform the password argument from a string to a function to hook up UI logic
 * @ignore
 */
const transformPasswordOption = (password, dispatch) => {
  // a boolean that is used to prevent infinite loop when wrong password is passed as an argument
  let passwordChecked = false;
  let attempt;

  return (checkPassword) => {
    dispatch(actions.setPasswordAttempts(attempt++));

    if (!password) {
      password = '';
    }

    if (!passwordChecked && typeof password === 'string') {
      checkPassword(password);
      passwordChecked = true;
      attempt = 0;
    } else {
      if (passwordChecked && attempt !== 1) {
        console.error(
          'Wrong password has been passed as an argument. WebViewer will open password modal.',
        );
      }

      setCheckPasswordFunction(checkPassword);
      dispatch(actions.openElement(DataElements.PASSWORD_MODAL));
    }
  };
};

const extractXodOptions = (options) => {
  const xodOptions = options.xodOptions || {};

  if (options.decryptOptions) {
    xodOptions.decrypt = window.Core.Encryption.decrypt;
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

const safeJsonParse = (param, fallback = {}) => {
  if (param === null) {
    return null;
  }
  try {
    const parsed = JSON.parse(param);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};
