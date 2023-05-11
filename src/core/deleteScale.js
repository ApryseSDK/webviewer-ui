import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.MeasurementManager.html#deleteScale__anchor
 */
export default (scale, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getMeasurementManager().deleteScale(scale);
};
