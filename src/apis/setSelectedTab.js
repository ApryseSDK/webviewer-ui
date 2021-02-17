/**
 * Sets the currently selected tab of a Tabs component.
 * @method WebViewerInstance#setSelectedTab
 * @param {string} id The id of the Tabs component to set.
 * @param {string} dataElement The 'dataElement' attribute of the TabPanel component to select.
 * @example
WebViewer(...)
  .then(function(instance) {
    // Set the currently selected tab of 'signatureModal' to be the 'Type' panel.
    instance.setSelectedTab('signatureModal', 'textSignaturePanelButton'); //'inkSignaturePanelButton', 'imageSignaturePanelButton'
    // Set the currently selected tab of 'linkModal' to be the 'Page' panel.
    instance.setSelectedTab('linkModal', 'PageNumberPanelButton'); //'URLPanelButton'
    // Set the currently selected tab of 'rubberStampTab' to be the 'Custom' panel.
    instance.setSelectedTab('rubberStampTab', 'customStampPanelButton'); //'standardStampPanelButton'
  });
 */

import actions from 'actions';

export default store => (id, dataElement) => {
  store.dispatch(actions.setSelectedTab(id, dataElement));
};
