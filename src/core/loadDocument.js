import core from 'core';

export default (src, options, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).loadDocument(src, options);
