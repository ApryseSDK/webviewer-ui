/**
 * An instance of Popup that can be used to edit items in the annotation popup component
 * @name UI.annotationPopup
 * @type {UI.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom button to the annotation popup
    instance.UI.annotationPopup.add({
      type: 'actionButton',
      img: 'icon-save',
      title: 'Save annotation data',
      dataElement: 'saveAnnotationButton',
      onClick: () => {
        console.log('Annotation saved!');
      }
    });

    // Get current items in the popup
    const items = instance.UI.annotationPopup.getItems();
    console.log('Current annotation popup items:', items);
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';
import DataElements from 'constants/dataElement';

export default (store) => createPopupAPI(store, DataElements.ANNOTATION_POPUP);