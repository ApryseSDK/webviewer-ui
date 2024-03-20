/**
 * Returns a modular header component with the given dataElement.
 * @method UI.getModularHeader
 * @param {string} dataElement The dataElement of the header to be returned
 * @return {UI.Components.ModularHeader} Custom Header
 * @example
WebViewer(...)
  .then(function(instance) {
    const header = instance.UI.getModularHeader('custom-header')
  });
 */

import selectors from 'selectors';
import ModularHeader from './ModularComponents/modularHeader';
import createModularInstance from './ModularComponents/createModularInstance';

export default (store) => (dataElement) => {
  const hydratedHeader = selectors.getHydratedHeader(store.getState(), dataElement);

  if (!hydratedHeader) {
    console.warn(`There is no header with dataElement ${dataElement}`);
    return null;
  }

  const nestedItems = hydratedHeader.items.map((item) => createModularInstance(item, store));
  return new ModularHeader(store)({ ...hydratedHeader, items: nestedItems });
};