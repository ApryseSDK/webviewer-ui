/**
 * Set a custom style for menus displayed through embedded JavaScript.
 * @method UI.setEmbeddedPopupMenuStyle
 * @param {object} customStyle A style object that overrides the existing embedded JS menu style. Properties/keys must follow the React style naming convention.
 * @example
WebViewer(...)
  .then(function(instance) {
    // Size width to fit content and let menu flow off the screen
    instance.UI.setEmbeddedPopupMenuStyle({
      minWidth: 'fit-content',
      minHeight: 'inheirit',
    });
  });
 */

import actions from 'actions';

export default (store) => (customStyle) => {
  store.dispatch(actions.setEmbeddedPopupMenuStyle(customStyle));
};
