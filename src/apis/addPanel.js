import actions from 'actions';
import { panelNames } from 'constants/panel';
import { Panel } from 'src/apis/getPanels';

/**
 * @typedef {Object} PanelProperties
 * @property {string} dataElement The data-element for panel.
 * @property {string} location Location of the panel in UI, left or right.
 * @property {string | UI.renderCustomPanel} render Either the name of a predefined panel to render or a function that returns a panel element.
 */

/**
 * Adds a custom panel in left or right side of the UI.
 * @method UI.addPanel
 * @param {Object<PanelProperties>} panel The panel object to be added in the UI.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addPanel({
      dataElement: 'myNewOutlinesPanel',
      render: instance.UI.Panels.OUTLINE,
    })

    instance.UI.openElements(['myNewOutlinesPanel']);
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

    instance.UI.openElements(['fooBarElement']);
  });
 */
/**
 * Callback that gets passed to `options.panel.render` in {@link UI.addPanel addPanel}.
 * @callback UI.renderCustomPanel
 * @returns {HTMLElement} Panel element.
 */
const { TYPES } = window.Core;
const PANEL_TYPE = TYPES.MULTI_TYPE(TYPES.OBJECT({
  dataElement: TYPES.STRING,
  location: TYPES.ONE_OF('left', 'right'),
  render: TYPES.MULTI_TYPE(TYPES.ONE_OF(...Object.values(panelNames)), TYPES.FUNCTION)
}), TYPES.OBJECT(Panel));

export default (store) => (customPanel) => {
  const { checkTypes } = window.Core;
  checkTypes([customPanel], [PANEL_TYPE], 'UI.addPanel');
  if (customPanel instanceof Panel) {
    customPanel = customPanel.toObject();
  }
  store.dispatch(actions.addPanel(customPanel));
};

export { PANEL_TYPE };