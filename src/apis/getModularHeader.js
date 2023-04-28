/**
 * @ignore
 * Return a Custom Header
 * @method UI.getModularHeader
 * @return {ModularHeader} Custom Header
 * @example
WebViewer(...)
  .then(function(instance) {
    const header = instance.UI.getModularHeader('custom-header')
  });
 */

import selectors from 'selectors';

export default (store) => (dataElement) => selectors.getModularHeader(store.getState(), dataElement);