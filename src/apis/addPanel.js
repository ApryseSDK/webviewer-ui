import actions from 'actions';

/**
 * Adds a custom panel in left or right side of the UI.
 * @method UI.addPanel
 * @param {object} options
 * @param {string} options.dataElement data-element for panel.
 * @param {string} options.location Location of the panel in UI, left or right.
 * @param {string | UI.renderCustomPanel} options.render Either the name of a predefined panel to render or a function that returns a panel element.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addPanel({
      dataElement: 'myNewOutlinesPanel',
      render: instance.UI.Panels.OUTLINE,
    })

    instance.openElement('myNewOutlinesPanel');
  });
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
 * Callback that gets passed to `options.panel.render` in {@link UI.addPanel addPanel}.
 * @callback UI.renderCustomPanel
 * @returns {HTMLElement} Panel element.
 */

export default (store) => (customPanel) => {
  store.dispatch(actions.addPanel(customPanel));
};