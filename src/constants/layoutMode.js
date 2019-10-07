/**
 * Contains string enums for all layouts for WebViewer. They are used to dictate how pages are placed within the viewer.
 * @name WebViewer#LayoutMode
 * @property {string} Single Only the current page will be visible.
 * @property {string} Continuous All pages are visible in one column.
 * @property {string} Facing Up to two pages will be visible.
 * @property {string} FacingContinuous All pages visible in two columns.
 * @property {string} FacingCover All pages visible in two columns, with an even numbered page rendered first. (i.e. The first page of the document is rendered by itself on the right side of the viewer to simulate a book cover.)
 * @property {string} FacingCoverContinuous All pages visible, with an even numbered page rendered first. (i.e. The first page of the document is rendered by itself on the right side of the viewer to simulate a book cover.)
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var LayoutMode = instance.LayoutMode;
    instance.setLayoutMode(LayoutMode.Single);
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var LayoutMode = instance.LayoutMode;
  instance.setLayoutMode(LayoutMode.Single);
});
 */

export default {
  Single: 'Single',
  Continuous: 'Continuous',
  Facing: 'Facing',
  FacingContinuous: 'FacingContinuous',
  FacingCover: 'CoverFacing',
  FacingCoverContinuous: 'Cover',
};