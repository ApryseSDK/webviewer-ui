/**
 * Adds new custom Header(s) to the Header list
 * @method UI.addModularHeaders
 * @param {array<UI.Components.ModularHeader>} headerList The list of headers to be added on the application
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
import { ModularHeader } from './ModularComponents/modularHeader';

const { checkTypes, TYPES } = window.Core;

const MODULAR_HEADER_LIST_TYPE = TYPES.MULTI_TYPE(TYPES.ARRAY(TYPES.OBJECT(ModularHeader)), TYPES.OBJECT(ModularHeader));

export default (store) => (headerList) => {
  checkTypes([headerList], [MODULAR_HEADER_LIST_TYPE], 'UI.addModularHeaders');
  store.dispatch(actions.addModularHeaders(headerList));
};