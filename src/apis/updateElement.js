import actions from 'actions';

/**
 * Update an element in the viewer. Currently this API can only update elements that have a Button class name.
 * @method WebViewerInstance#updateElement
 * @param {string} dataElement the data element of the element that will be updated.
 * @param {object} props An object that is used to override an existing item's properties.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.updateElement('thumbnailsPanelButton', {
      img: 'path/to/image',
      title: 'new_tooltip',
    })
  });
 */
export default store => (dataElement, overrides) => {
  switch (dataElement) {
    case 'colorPalette':
      overrides = validateColorPaletteOverrides(overrides);
      break;
    default:
      overrides = validateButtonOverrides(overrides);
  }

  if (overrides) {
    store.dispatch(actions.setCustomElementOverrides(dataElement, overrides));
  }
};

const validateColorPaletteOverrides = overrides => {
  if (!Array.isArray(overrides)) {
    return console.warn(
      'The second argument needs to be an array of strings to update the color palette',
    );
  }

  // examples of valid colors are: '#f0f0f0', '#FFFFFF'
  const isValidColor = color =>
    color === 'transparency' ||
    (color.startsWith('#') && color.split('#')[1].length === 6);

  if (!overrides.every(isValidColor)) {
    return console.warn('The color must be \'transparency\' or a hex color string. For example #F0F0F0');
  }

  return overrides;
};

const validateButtonOverrides = overrides => {
  if (overrides !== null && typeof overrides !== 'object') {
    return console.warn(
      'The second argument needs to be an object to update a button',
    );
  }

  return overrides;
};
