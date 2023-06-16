import core from 'core';

export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getContentEditManager();
