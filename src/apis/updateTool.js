/**
 * Update existing tool's properties.
 * @method WebViewer#updateTool
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @param {object} [properties] Tool properties
 * @param {string} [properties.buttonImage] Path to an image or base64 data for the tool button
 * @param {string} [properties.buttonName] Name of the tool button that will be used in data-element
 * @param {string} [properties.buttonGroup] Group of the tool button belongs to
 * @param {string} [properties.tooltip] Tooltip of the tool button
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.updateTool('AnnotationCreateSticky', {
    buttonImage: 'https://www.pdftron.com/favicon-32x32.png'
  });
});
 */

import actions from 'actions';
import setHeaderItems from '../apis/setHeaderItems';

export default store => (toolName, properties) => {
  if (properties.buttonGroup === null){
    setHeaderItems(store)(function(header){
      let alreadyExist = false;
      header.getHeader('default').headers.default.forEach(function(element){
        if (element.toolName === toolName){
          alreadyExist = true;
        }
      });
      if (!alreadyExist){
        header.getHeader('default').get('miscToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: toolName,
          hidden: [ 'tablet', 'mobile' ]
        });
        header.getHeader('tools').get('miscToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: toolName,
          hidden: [ 'desktop' ]
        });
      }
    });
  } else {
    setHeaderItems(store)(function(header){
      const returnDefaultHeader = header.headers.default.filter(function(element){
        return element.toolName !== toolName;
      });
      header.getHeader('default').update(returnDefaultHeader);
      const returnToolsHeader = header.headers.tools.filter(function(element){
        return element.toolName !== toolName;
      });
      header.getHeader('tools').update(returnToolsHeader);
    });
  }
  store.dispatch(actions.updateTool(toolName, properties));
};