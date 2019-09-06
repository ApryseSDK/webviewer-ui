/**
 * Contains all possible modes for fitting/zooming pages to the viewer. The behavior may vary depending on the LayoutMode.
 * @name WebViewer#FitMode
 * @property {string} FitPage A fit mode where the zoom level is fixed to the width or height of the page, whichever is smaller.
 * @property {string} FitWidth A fit mode where the zoom level is fixed to the width of the page.
 * @property {string} Zoom A fit mode where the zoom level is not fixed.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var FitMode = instance.FitMode;
    instance.setFitMode(FitMode.FitWidth);
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var FitMode = instance.FitMode;
  instance.setFitMode(FitMode.FitWidth);
});
 */

export default {
  FitPage: 'FitPage',
  FitWidth: 'FitWidth',
  Zoom: 'Zoom',
};