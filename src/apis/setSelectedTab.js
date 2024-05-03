/**
 * Sets the currently selected tab of a Tabs component.
 * @method UI.setSelectedTab
 * @param {string} id The id of the Tabs component to set.
 * @param {string} dataElement The 'dataElement' attribute of the TabPanel component to select.
 * @example
WebViewer(...)
  .then(function(instance) {
    // Set the currently selected tab of 'signatureModal' to be the 'Type' panel.
    instance.UI.setSelectedTab('signatureModal', 'textSignaturePanelButton'); //'inkSignaturePanelButton', 'imageSignaturePanelButton'
    // Set the currently selected tab of 'linkModal' to be the 'Page' panel.
    instance.UI.setSelectedTab('linkModal', 'PageNumberPanelButton'); //'URLPanelButton'
    // Set the currently selected tab of 'rubberStampTab' to be the 'Custom' panel.
    instance.UI.setSelectedTab('rubberStampTab', 'customStampPanelButton'); //'standardStampPanelButton'
  });
 */

import actions from 'actions';

export default (store) => (id, dataElement) => {
  store.dispatch(actions.setSelectedTab(id, dataElement));
};
