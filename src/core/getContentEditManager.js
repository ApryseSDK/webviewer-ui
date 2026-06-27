import core from 'core';

export default (pageNumber, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getContentEditManager();
