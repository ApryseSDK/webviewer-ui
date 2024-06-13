import { getInstanceNode } from 'helpers/getRootNode';

const isUndefined = (val) => typeof val === 'undefined';

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
};
const paramsToStringify = ['initialDoc'];

export default window.isApryseWebViewerWebComponent ? (param, defaultValue = false) => {
  const defaultType = typeof defaultValue;

  const correctedParam = paramCorrections[param] ? paramCorrections[param] : param;

  let val = getInstanceNode().getAttribute(correctedParam);
  if (correctedParam === 'initialDoc' && val) {
    val = val.split(',');
    // If initialDoc is string with commas,
    // we will split it and turn it to array
    if (val && val.length === 1) {
      val = val[0];
    }
  }
  // Need to stringify because the Core function returns a string as well
  if (val && paramsToStringify.includes(correctedParam)) {
    return JSON.stringify(val);
  }

  if (defaultType === 'boolean' && !isUndefined(val)) {
    const value = val;
    if (value === 'true' || value === '1') {
      return true;
    }
    if (value === 'false' || value === '0') {
      return false;
    }
  }

  return val || defaultValue;
} : window.Core.getHashParameter;
