/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#createScale__anchor
 */
export default (scale, applyTo) => {
  window.documentViewer.getMeasurementManager().createAndApplyScale({ scale, applyTo });
};
