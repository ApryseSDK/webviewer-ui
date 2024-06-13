/**
 * Return the list of Custom Headers.
 * @method UI.getModularHeaderList
 * @return {UI.Components.ModularHeader} Custom Header List
 * @example
WebViewer(...)
  .then(function(instance) {
    const headerList = instance.UI.getModularHeaderList()
  });
 */


import selectors from 'selectors';
import ModularHeader from './ModularComponents/modularHeader';
import createModularInstance from './ModularComponents/createModularInstance';

export default (store) => () => {
  const hydratedHeaders = selectors.getHydratedHeaders(store.getState());

  // Now we create instance of each class and return it
  return hydratedHeaders.map((header) => {
    const nestedItems = header.items.map((item) => createModularInstance(item, store));
    const headerInstance = new ModularHeader(store)({ ...header, items: nestedItems });
    return headerInstance;
  });
};