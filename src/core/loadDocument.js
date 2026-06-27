import core from 'core';

export default (src, options, documentViewerKey) => core.getDocumentViewer(documentViewerKey).loadDocument(src, options);
