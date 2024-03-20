/**
 * Adds new custom Header(s) to the Header list
 * @method UI.setModularHeaders
 * @param {array<UI.Components.ModularHeader>} headerList The new list of headers to be used in the UI
 * @example
 * WebViewer(...)
 .then(function (instance) {
 const newHeader = new instance.UI.Components.ModularHeader({
 dataElement: 'top-header',
 placement: 'top'
 });

 instance.UI.setModularHeaders([newHeader]);
 */
import actions from 'actions';

export default (store) => (headerList) => {
  store.dispatch(actions.setModularHeaders(headerList));
};