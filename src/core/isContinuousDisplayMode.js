import core from 'core';

/**
 * @see displayModeObjects.js for more information
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDisplayModeManager().getDisplayMode().isContinuous();
