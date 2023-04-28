import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DisplayModeManager.html#getDisplayMode__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDisplayModeManager().getDisplayMode();
