/**
 * @ignore
 * Adds new custom Header(s) to the Header list
 * @method UI.CustomHeader.addModularHeaders
 * @property {array} headerList The list of headers to be added on the application
 * @example
 * WebViewer(...)
  .then(function (instance) {
    const newHeader = new instance.UI.Components.ModularHeader({
      dataElement: 'top-header',
      location: 'top'
    });

    instance.UI.addModularHeaders([newHeader]);
 */
import actions from 'actions';

export default (store) => (headerList) => {
  store.dispatch(actions.addModularHeaders(headerList));
};