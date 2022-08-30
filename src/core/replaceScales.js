/**
 * https://www.pdftron.com/api/web/Core.MeasurementManager.html#replaceScales__anchor
 */
export default (originalScales, scale) => {
  window.documentViewer.getMeasurementManager().replaceScales(originalScales, scale);
};
