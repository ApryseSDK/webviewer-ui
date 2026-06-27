import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.MeasurementManager.html#createScale__anchor
 */
export default (scale, applyTo, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).getMeasurementManager().createAndApplyScale({ scale, applyTo });
};
