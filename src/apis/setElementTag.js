/**
 * Sets the HTML tag used for a supported UI element.
 * @method UI.setElementTag
 * @param {string} dataElement The UI element to update. Use a value from {@link UI.ElementTagTarget}.
 * @param {string} tag The HTML tag to use. The caller is responsible for choosing a valid and semantically appropriate tag.
 * @see UI.ElementTagTarget
 * @example
WebViewer(...)
  .then(function(instance) {
    const { ElementTagTarget } = instance.UI;
    instance.UI.setElementTag(ElementTagTarget.DOCUMENT_CONTAINER, 'div');
  });
 */

import actions from 'actions';
import ElementTagTarget from 'constants/elementTagTarget';

const setElementTag = (store) => {
  const setTag = (dataElement, tag) => {
    const { checkTypes, TYPES } = window.Core;
    checkTypes(
      [dataElement, tag],
      [TYPES.ONE_OF(Object.values(ElementTagTarget)), TYPES.STRING],
      'UI.setElementTag'
    );
    if (!tag.trim()) {
      throw new Error('UI.setElementTag: tag must be a non-empty string.');
    }
    store.dispatch(actions.setElementTag(dataElement, tag));
  };

  return setTag;
};

export default setElementTag;
