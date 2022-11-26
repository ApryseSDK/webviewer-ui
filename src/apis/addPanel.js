import actions from 'actions';

/**
 * Adds a custom panel in left or right side of the UI.
 * @method UI.addPanel
 * @param {object} options
 * @param {string} options.dataElement data-element for panel.
 * @param {string} options.location Location of the panel in UI, left or right.
 * @param {UI.renderCustomPanel} options.render Function that returns panel element.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addPanel({
      dataElement: 'fooBarElement',
      location: 'left',
      render: function() {
        var div = document.createElement('div');
        div.innerHTML = 'Hello World, foobar panel';
        return div;
      }
    });

    instance.openElement('fooBarElement');
  });
 */
/**
 * Callback that gets passed to `options.panel.render` in {@link UI.setCustomPanel setCustomPanel}.
 * @callback UI.renderCustomPanel
 * @returns {HTMLElement} Panel element.
 */

export default (store) => (customPanel) => {
  store.dispatch(actions.addPanel(customPanel));
};