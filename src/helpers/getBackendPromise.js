export default (docType) => (docType === 'auto' || docType === 'wait'
  ? window.Core.getDefaultBackendType()
  : Promise.resolve(docType));
