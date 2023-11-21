/**
 * Registers tool in the document viewer tool mode map, and adds a button object to be used in the header. See <a href='https://docs.apryse.com/documentation/web/guides/customizing-tools/' target='_blank'>Customizing tools</a> to learn how to make a tool.
 * <br/><br/>
 * If you are using using multiviewer mode, you will have to register the tool to each document viewer.
 * @method UI.registerTool
 * @param {object} properties Tool properties.
 * @param {string} properties.toolName Name of the tool.
 * @param {Core.Tools.Tool} properties.toolObject Instance of the tool.
 * @param {string} properties.buttonImage Path to an image or base64 data for the tool button.
 * @param {string} [properties.buttonName] Name of the tool button that will be used in data-element.
 * @param {string} [properties.buttonGroup] Group of the tool button belongs to.
 * @param {string} [properties.tooltip] Tooltip of the tool button.
 * @param {number} [properties.documentViewerNumber] The document viewer number when there are multiple viewers. Default is 1.
 * @param {'always'|'active'|'never'} [properties.showColor] Controls when the tool button should show the color.
 * @param {boolean} [properties.showPresets] Option to whether show or hide preset styles. Default is true.
 * @param {function} [annotationConstructor] Deprecated Please use customAnnotationCheckFunc instead. Will be removed in the future.
 * @param {function} [customAnnotationCheckFunc] Function that takes in a parameter of an annotation. Returns a boolean if the specified annotation is a certain type of annotation. This function is used by the viewer to check if the annotation passed in is associated(created) with the registered tool.
 * @example
WebViewer(...)
  .then(function(instance) {
    // assume myCustomTool and myCustomAnnotation are already defined
    const myTool = {
      toolName: 'MyTool',
      toolObject: myCustomTool,
      buttonImage: 'path/to/image',
      buttonName: 'myToolButton',
      buttonGroup: 'miscTools',
      tooltip: 'MyTooltip'
    };

    instance.UI.registerTool(myTool, undefined, annot => annot && annot.isCustomAnnot);
  });
 */

import core from 'core';
import { register, copyMapWithDataProperties } from 'constants/map';
import actions from 'actions';
import { setDefaultToolStyle } from 'src/helpers/setDefaultToolStyles';

export default (store) => (tool, annotationConstructor, customAnnotationCheckFunc) => {
  registerToolInToolModeMap(tool);
  registerToolInRedux(store, tool);
  register(tool, annotationConstructor, customAnnotationCheckFunc);
  updateColorMapInRedux(store);
  setDefaultToolStyle(tool.toolName);
};

const registerToolInRedux = (store, tool) => {
  store.dispatch(actions.registerTool(tool));
};

const registerToolInToolModeMap = ({ toolObject, toolName, documentViewerNumber }) => {
  if (core.getDocumentViewers().length > 1) {
    console.warn('Multiple document viewers detected. If you plan to register tools with all document viewers, please use the documentViewerNumber parameter to register with each of them.');
  }
  let viewer = core.getDocumentViewer(documentViewerNumber);
  if (!viewer) {
    documentViewerNumber = 1;
    viewer = core.getDocumentViewer(documentViewerNumber);
  }
  // Cannot create tools with their constructor since parameters can vary. Especially for custom tools.
  const toolModeMap = viewer.getToolModeMap();
  toolModeMap[toolName] = toolObject;
  toolModeMap[toolName].name = toolName;
};

const updateColorMapInRedux = (store) => {
  store.dispatch(actions.setColorMap(copyMapWithDataProperties('iconColor', 'currentStyleTab')));
};
