/**
 * Sets the gap of Grouped Items
 * @method UI.setGroupedItemsGap
 * @param {number} gap The gap in pixels between the items in the group.
 * @param {Object} [selectors] An object that contains selectors for the Grouped Items.
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

    // Setting the gap of all Grouped Items
    instance.UI.setGroupedItemsGap(20);

    // Setting the gap of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsGap(30, {
      groupedItemsDataElement: 'group-1'
    });
 */
import actions from 'actions';
import { isGapValid } from 'components/ModularComponents/Helpers/validation-helper';

export default (store) => (gap, selectors) => {
  if (isGapValid(gap)) {
    const { groupedItemsDataElement } = selectors || {};
    if (groupedItemsDataElement) {
      store.dispatch(actions.setModularComponentProperty('gap', gap, groupedItemsDataElement));
    } else {
      store.dispatch(actions.setAllGroupedItemsProperty('gap', gap));
    }
  }
};