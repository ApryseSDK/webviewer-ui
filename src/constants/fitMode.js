/**
 * Contains all posible modes for fitting/zooming pages to the viewer. The behavior may vary depending on the LayoutMode.
 * @name WebViewer#FitMode
 * @property {string} FitPage A fit mode where the zoom level is fixed to the width or height of the page, whichever is smaller.
 * @property {string} FitWidth A fit mode where the zoom level is fixed to the width of the page.
 * @property {string} Zoom A fit mode where the zoom level is not fixed.
 * @example var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', () => {
  var instance = viewer.getInstance(); // returns instance of ReaderControl
  instance.setFitMode(instance.FitMode.FitWidth);
});
 */

export default {
  FitPage: 'FitPage',
  FitWidth: 'FitWidth',
  Zoom: 'Zoom'
};