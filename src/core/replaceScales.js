import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.MeasurementManager.html#replaceScales__anchor
 */
export default (originalScales, scale, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getMeasurementManager().replaceScales(originalScales, scale);
};
