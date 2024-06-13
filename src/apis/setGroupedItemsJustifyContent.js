/**
 * Sets the justifyContent property of Grouped Items. This property is analogous to the CSS justify-content property.
 * @method UI.setGroupedItemsJustifyContent
  * @param {'start' | 'end' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} justifyContent A string that determines the flex justify content value of the group
  * @param {Object} [selectors]  An object that contains the selectors to filter the Grouped Items to set the justify content property on.
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

    // Setting the justifyContent property of all Grouped Items
    instance.UI.setGroupedItemsJustifyContent('start');

    // Setting the justifyContent property of all Grouped Items with a specific data element
    instance.UI.setGroupedItemsJustifyContent('space-between', {
      groupedItemsDataElement: 'group-1'
    });
 */
import actions from 'actions';
import { isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

export default (store) => (justifyContent, selectors) => {
  if (isJustifyContentValid(justifyContent)) {
    const { groupedItemsDataElement } = selectors || {};
    if (groupedItemsDataElement) {
      store.dispatch(actions.setModularComponentProperty('justifyContent', justifyContent, groupedItemsDataElement));
    } else {
      store.dispatch(actions.setAllGroupedItemsProperty('justifyContent', justifyContent));
    }
  }
};