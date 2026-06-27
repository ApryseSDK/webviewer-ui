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
  return getAttributeValueFromNode(param, getInstanceNode());
};

const getAttributeValueFromNode = (param, instanceNode) => {
  const correctedParam = paramCorrections[param] ? paramCorrections[param] : param;
  if (!instanceNode) {
    return undefined;
  }

  const attributeValue = instanceNode.getAttribute(correctedParam);

  return normalizeAttributeValue(attributeValue, correctedParam);
};

const resolveHashParameter = (val, defaultValue) => {
  const defaultType = typeof defaultValue;

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
};

/**
 * Reads a hash-style parameter directly from the supplied WebComponent host element (instead of resolving through the global `getInstanceNode()` singleton). Use this whenever the call may execute asynchronously (e.g. inside a setTimeout, microtask, or Promise) where the singleton may have already been flipped to a more recently created instance.
 * Falls back to `getHashParameters` for non-WC builds.
 *
 * @ignore
 */
export const getHashParameterFromHost = window.isApryseWebViewerWebComponent
  ? (instanceNode, param, defaultValue = false) => resolveHashParameter(getAttributeValueFromNode(param, instanceNode), defaultValue)
  : (_instanceNode, param, defaultValue = false) => window.Core.getHashParameter(param, defaultValue);

export default window.isApryseWebViewerWebComponent ? (param, defaultValue = false) => {
  return resolveHashParameter(getAttributeValue(param), defaultValue);
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
    const parsed = JSON.parse(stringValue);
    if (paramsRequiringJSONFormat.has(param)) {
      return JSON.stringify(parsed);
    }
    if (Array.isArray(parsed)) {
      return parsed.join(',');
    }
    return stringValue;
  } catch (error) {
    if (paramsRequiringJSONFormat.has(param)) {
      return JSON.stringify(stringValue);
    }
    return stringValue;
  }
}
