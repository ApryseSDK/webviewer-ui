import core from 'core';

export default (documentViewerKey) => core.getOfficeEditor(documentViewerKey)?.getTrackedChangeManager();
