/**
 * Sets the grow of Grouped Items
 * @method UI.setGroupedItemsGrow
 * @param {number} grow The flex grow value of the group
 * @param {Object} [selectors] An object that contains the selectors to filter the Grouped Items to set the grow property on.
 * @example
 * WebViewer(...)
  .then(function (instance) {
    const myToolsGroup = new instance.UI.Components.GroupedItems({
      dataElement: 'group-1',
      items: [
        myButton,
        myToolButton,
        highlightToolButton,
      ],
    });

    // Group must be added to a header, and then the header must be added to the UI
    const newHeader = new instance.UI.Components.ModularHeader({
      dataElement: 'top-header',
      location: 'top',
      items: [myToolsGroup]
    });
    instance.UI.addModularHeaders([newHeader]);

    // Setting the grow property of all Grouped Items
    instance.UI.setGroupedItemsGrow(1);

    // Setting the grow property of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsGrow(1, {
      groupedItemsDataElement: 'group-1'
    });
 */
import actions from 'actions';
import { isGrowValid } from 'components/ModularComponents/Helpers/validation-helper';

export default (store) => (grow, selectors) => {
  if (isGrowValid(grow)) {
    const { groupedItemsDataElement } = selectors || {};
    if (groupedItemsDataElement) {
      store.dispatch(actions.setModularComponentProperty('grow', grow, groupedItemsDataElement));
    } else {
      store.dispatch(actions.setAllGroupedItemsProperty('grow', grow));
    }
  }
};