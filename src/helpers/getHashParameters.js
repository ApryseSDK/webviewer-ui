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

const paramsRequiringJSONFormat = new Set(['initialDoc']);

const getAttributeValue = (param) => {
  const correctedParam = paramCorrections[param] ? paramCorrections[param] : param;
  const instanceNode = getInstanceNode();
  if (!instanceNode) {
    return undefined;
  }

  const attributeValue = instanceNode.getAttribute(correctedParam);

  return normalizeAttributeValue(attributeValue, correctedParam);
};

export default window.isApryseWebViewerWebComponent ? (param, defaultValue = false) => {
  const defaultType = typeof defaultValue;
  let val = getAttributeValue(param);

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

function normalizeAttributeValue(value, param) {
  if (isUndefined(value) || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  const stringValue = `${value}`.trim();
  if (!stringValue) {
    return stringValue;
  }

  try {
    JSON.parse(stringValue);
    return stringValue;
  } catch (error) {
    if (paramsRequiringJSONFormat.has(param)) {
      return JSON.stringify(stringValue);
    }
    return stringValue;
  }
}
