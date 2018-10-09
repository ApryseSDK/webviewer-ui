export default docType => (docType === 'auto' || docType === 'wait') ? window.CoreControls.getDefaultBackendType() : Promise.resolve(docType);
