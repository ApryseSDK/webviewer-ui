/**
 * @ignore
 * Sets the grow of Grouped Items
 * @method UI.setGroupedItemsGrow
 * @example
 * WebViewer(...)
  .then(function (instance) {
    const newHeader = new instance.UI.Components.ModularHeader({
      dataElement: 'top-header',
      location: 'top'
    });

    // Setting the grow property of all Grouped Items
    instance.UI.setGroupedItemsGrow(1);

    // Setting the grow property of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsGrow(1, {
      groupedItem: 'group1'
    });

    // Setting the grow property of Grouped Items with a specific data element in a specifi header
    instance.UI.setGroupedItemsGrow(2, {
      groupedItem: 'group1',
      header: 'top-header'
    });
 */
import actions from 'actions';

export default (store) => (grow, selectors) => {
  store.dispatch(actions.setGroupedItemsProperty('grow', grow, selectors?.groupedItem, selectors?.header));
};