import core from 'core';

export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getDocument()?.getOfficeEditor();
