import actions from 'actions';
import setColorPalette from './setColorPalette';

/**
 * Update an element in the viewer.
 * @method UI.updateElement
 * @param {string} dataElement the data element of the element that will be updated. Only the data element of HTML elements that have 'Button' in the class name will work.
 * @param {object} props An object that is used to override an existing item's properties.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.updateElement('thumbnailsPanelButton', {
      img: 'path/to/image',
      title: 'new_tooltip',
    })
  });
 */
export default (store) => (dataElement, overrides) => {
  switch (dataElement) {
    // for backwards compatibility
    case 'colorPalette':
      setColorPalette(store)(overrides);
      break;
    default:
      if (validateButtonOverrides(overrides)) {
        store.dispatch(actions.setCustomElementOverrides(dataElement, overrides));
      }
  }
};

const validateButtonOverrides = (overrides) => {
  if (overrides !== null && typeof overrides !== 'object') {
    return console.warn(
      'The second argument needs to be an object to update a button',
    );
  }

  return overrides;
};
