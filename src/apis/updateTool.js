/**
 * Update existing tool's properties.
 * @method WebViewer#updateTool
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @param {object} [properties] Tool properties
 * @param {string} [properties.buttonImage] Path to an image or base64 data for the tool button
 * @param {string} [properties.buttonName] Name of the tool button that will be used in data-element
 * @param {string} [properties.buttonGroup] Group of the tool button belongs to
 * @param {string} [properties.tooltip] Tooltip of the tool button
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.updateTool('AnnotationCreateSticky', {
      buttonImage: 'https://www.pdftron.com/favicon-32x32.png'
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.updateTool('AnnotationCreateSticky', {
    buttonImage: 'https://www.pdftron.com/favicon-32x32.png'
  });
});
 */
export default store => (toolName, properties) => {
  store.dispatch({
    type: 'UPDATE_TOOL',
    payload: { toolName, properties },
  });
};
