import core from 'core';

/**
 * @see displayModeObjects.js for more information
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getDisplayModeManager().getDisplayMode().isContinuous();
