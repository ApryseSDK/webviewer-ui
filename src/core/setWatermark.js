import core from 'core';

/**
 * https://www.pdftron.com/api/web/CoretViewer.html#setWatermark__anchor
 */
export default (watermarkOptions, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).setWatermark(watermarkOptions);
