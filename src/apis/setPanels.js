/**
 * Sets the list of panels to be used in the UI
 * @method UI.setPanels
 * @param {array} panelList The new list of panels to be used in the UI
 * @example
 * WebViewer(...)
 .then(function (instance) {
 instance.UI.setPanels([
 {
 dataElement: 'fooBarElement',
 location: 'left',
 render: function() {
 var div = document.createElement('div');
 div.innerHTML = 'Hello World, foobar panel';
 return div;
 }
 },
 {
 dataElement: 'myNewOutlinesPanel',
 location: 'right',
 render: instance.UI.Panels.OUTLINE,
 }
 ]);
 */
import actions from 'actions';
import { PANEL_TYPE } from './addPanel';
import { Panel } from 'src/apis/getPanels';

export default (store) => (panelList) => {
  const { checkTypes, TYPES } = window.Core;
  checkTypes([panelList], [TYPES.ARRAY(PANEL_TYPE)], 'UI.setPanels');
  panelList = panelList.map((panel) => {
    if (panel instanceof Panel) {
      panel = panel.toObject();
    }
    return panel;
  });
  store.dispatch(actions.setGenericPanels(panelList));
};