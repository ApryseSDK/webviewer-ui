/**
 * @ignore
 * Return the list of Custom Headers.
 * @method UI.getModularHeaderList
 * @return {ModularHeader} Custom Header List
 * @example
WebViewer(...)
  .then(function(instance) {
    const headerList = instance.UI.getModularHeaderList()
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getModularHeaderList(store.getState());