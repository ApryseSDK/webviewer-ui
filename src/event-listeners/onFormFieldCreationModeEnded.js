import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store, hotkeysManager) => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('saveAsButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('filePickerButton', { disabled: false }));
  hotkeysManager.on();
  // Ensure we are not left in the Forms toolbargroup when we end form builder mode
  const currentToolbarGroup = selectors.getCurrentToolbarGroup(store.getState());
  if (currentToolbarGroup === 'toolbarGroup-Forms') {
    dispatch(actions.setToolbarGroup('toolbarGroup-View'));
  }
};
