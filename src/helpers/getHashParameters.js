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
    // If initialDoc is string with commas,
    // we will split it and turn it to array
    const filesArray = val.split(',');
    const resultFilesArray = [];
    let currentFile = '';

    for (let file of filesArray) {
      currentFile += (currentFile ? ',' : '') + file;

      // Check if the filename has query parameters attached
      // E.g. "http://website.com/path/file.pdf?foo=bar"
      if (/\?\w+=\w+/.test(file)) {
        file = file.split('?')[0];
      }

      if (/\.\w{2,4}$/.test(file)) {  // Check if part ends with an extension (e.g. .pdf, .docx)
        resultFilesArray.push(currentFile);
        currentFile = ''; // Reset for the next file
      }
    }
    val = resultFilesArray;
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
