import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setWatermark__anchor
 */
export default (watermarkOptions, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).setWatermark(watermarkOptions);
