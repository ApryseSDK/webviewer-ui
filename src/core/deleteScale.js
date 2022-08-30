/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#deleteScale__anchor
 */
export default (scale) => {
  window.documentViewer.getMeasurementManager().deleteScale(scale);
};
