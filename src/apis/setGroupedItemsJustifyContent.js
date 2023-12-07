/**
 * @ignore
 * Sets the justifyContent property of Grouped Items. This property is analogous to the CSS justify-content property.
 * @method UI.setGroupedItemsJustifyContent
 * @example
 * WebViewer(...)
  .then(function (instance) {
    const newHeader = new instance.UI.Components.ModularHeader({
      dataElement: 'top-header',
      location: 'top'
    });

    // Setting the justifyContent of all Grouped Items
    instance.UI.setGroupedItemsJustifyContent('center');

    // Setting the justifyContent property of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsJustifyContent('start', {
      groupedItem: 'group1'
    });

    // Setting the justifyContent property of Grouped Items with a specific data element in a specific header
    instance.UI.setGroupedItemsJustifyContent('space-between', {
      groupedItem: 'group1',
      header: 'top-header'
    });
 */
import actions from 'actions';
import { isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

export default (store) => (justifyContent, selectors) => {
  if (isJustifyContentValid(justifyContent)) {
    store.dispatch(actions.setGroupedItemsProperty('justifyContent', justifyContent, selectors?.groupedItem, selectors?.header));
  }
};