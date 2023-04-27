import getRootNode from 'helpers/getRootNode';

const paramCorrections = {
  'd': 'initialDoc',
  'filepicker': 'showLocalFilePicker',
  'pdfnet': 'fullAPI',
  'user': 'annotationUser',
  'a': 'enableAnnotations',
  'azureWorkaround': 'enableAzureWorkaround',
  'admin': 'isAdminUser',
  'l': 'licenseKey',
  'pdf': 'backendType',
  'office': 'backendType',
  'legacyOffice': 'backendType',
  'p': 'externalPath',
  'did': 'documentId',
  'toolbar': 'showToolbarControl',
  'pageHistory': 'showPageHistoryButtons',
};
const paramsToStringify = ['initialDoc'];

export default process.env.WEBCOMPONENT ? (param, defaultValue = false) => {
  const correctedParam = paramCorrections[param] ? paramCorrections[param] : param;
  const val = getRootNode().host.getAttribute(correctedParam);
  // Need to stringify because the Core function returns a string as well
  if (val && paramsToStringify.includes(correctedParam)) {
    return JSON.stringify(val);
  }
  return val || defaultValue;
} : window.Core.getHashParameter;
