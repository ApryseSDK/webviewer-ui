import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.MeasurementManager.html#getScales__anchor
 */
export default (documentViewerKey) => {
  return core.getDocumentViewer(documentViewerKey).getMeasurementManager().getScales();
};
