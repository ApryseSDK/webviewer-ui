/**
 * Contains the UI elements whose HTML tags can be changed with {@link UI.setElementTag}.
 * @name UI.ElementTagTarget
 * @property {string} DOCUMENT_CONTAINER The document container element.
 * @example
WebViewer(...)
  .then(function(instance) {
    const { ElementTagTarget } = instance.UI;
    instance.UI.setElementTag(ElementTagTarget.DOCUMENT_CONTAINER, 'div');
  });
 */

import DataElements from 'constants/dataElement';

export default {
  DOCUMENT_CONTAINER: DataElements.DOCUMENT_CONTAINER,
};
