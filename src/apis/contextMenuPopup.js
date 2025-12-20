/**
 * An instance of Popup that can be used to edit items in the context menu popup component
 * @name UI.contextMenuPopup
 * @type {UI.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom action to the context menu
    instance.UI.contextMenuPopup.add({
      type: 'actionButton',
      img: 'icon-tool-measurement-distance',
      title: 'Measure Distance',
      dataElement: 'measureDistanceButton',
      onClick: () => {
        instance.Core.documentViewer.setToolMode(instance.Core.documentViewer.getTool('AnnotationCreateDistanceMeasurement'));
      }
    });

    // Add a divider and another custom tool
    instance.UI.contextMenuPopup.add([
      { type: 'divider' },
      {
        type: 'actionButton',
        img: 'icon-tool-crop',
        title: 'Crop Pages',
        dataElement: 'cropToolButton',
        onClick: () => {
          instance.Core.documentViewer.setToolMode(instance.Core.documentViewer.getTool('CropCreateTool'));
        }
      }
    ]);
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';
import DataElements from 'src/constants/dataElement';

export default (store) => createPopupAPI(store, DataElements.CONTEXT_MENU_POPUP);