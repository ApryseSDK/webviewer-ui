/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#getScales__anchor
 */
export default () => {
  return window.documentViewer.getMeasurementManager().getScales();
};
