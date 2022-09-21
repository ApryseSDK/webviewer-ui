import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#getScalePrecision__anchor
 */
export default (scale, documentViewerKey = 1) => {
  return core.getDocumentViewer(documentViewerKey).getMeasurementManager().getScalePrecision(scale);
};
