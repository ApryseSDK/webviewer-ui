/**
 * @ignore
 * Sets the alignment of Grouped Items
 * @method UI.setGroupedItemsAlignment
 * @example
 * WebViewer(...)
  .then(function (instance) {
    const newHeader = new instance.UI.Components.ModularHeader({
      dataElement: 'top-header',
      location: 'top'
    });

    // Setting the alignment of all Grouped Items
    instance.UI.setGroupedItemsAlignment('center');

    // Setting the alignment of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsAlignment('start', {
      groupedItem: 'group1'
    });

    // Setting the alignment of Grouped Items with a specific data element in a specifi header
    instance.UI.setGroupedItemsAlignment('space-between', {
      groupedItem: 'group1',
      header: 'top-header'
    });
 */
import actions from 'actions';

export default (store) => (alignment, selectors) => {
  store.dispatch(actions.setGroupedItemsProperty('alignment', alignment, selectors?.groupedItem, selectors?.header));
};