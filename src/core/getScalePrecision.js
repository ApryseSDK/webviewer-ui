/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#getScalePrecision__anchor
 */
export default (scale) => {
  return window.documentViewer.getMeasurementManager().getScalePrecision(scale);
};
