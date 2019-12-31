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
  if (overrides !== null && typeof overrides !== 'object') {
    return console.warn('The second argument to instance.updateElement needs to be an object.');
  }

  store.dispatch(actions.setCustomElementOverrides(dataElement, overrides));
};
