/**
 * Returns a ribbon group component with the given dataElement.
 * @method UI.getRibbonGroup
 * @param {string} dataElement The dataElement of the ribbon group to be returned
 * @return {UI.Components.RibbonGroup} RibbonGroup
 * @example
WebViewer(...)
  .then(function(instance) {
    const ribbonGroup = instance.UI.getRibbonGroup('custom-ribbon-group')
  });
 */

import selectors from 'selectors';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { getModularComponentInstance } from 'helpers/getModularComponentInstance';

export default (store) => (dataElement) => {
  const state = store.getState();
  const ribbonGroup = selectors.getModularComponent(state, dataElement);

  if (!ribbonGroup || ribbonGroup?.type !== ITEM_TYPE.RIBBON_GROUP) {
    console.warn(`There is no ribbon group with dataElement ${dataElement}`);
    return null;
  }

  const ribbonGroupInstance = getModularComponentInstance(store)(ribbonGroup);
  return ribbonGroupInstance;
};