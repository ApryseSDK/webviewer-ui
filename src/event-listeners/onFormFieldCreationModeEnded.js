import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';

export default (dispatch, store, hotkeysManager) => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('saveAsButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('filePickerButton', { disabled: false }));
  dispatch(actions.enableElement('textPopup', 1));
  const keysToEnable = hotkeysManager.formBuilderDisabledKeys;
  for (const shortcutKey in keysToEnable) {
    hotkeysManager.enableShortcut(keysToEnable[shortcutKey]);
  }
  hotkeysManager.formBuilderDisabledKeys = {};
  // Ensure we are not left in the Forms toolbargroup when we end form builder mode
  const currentToolbarGroup = selectors.getCurrentToolbarGroup(store.getState());
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;

  if (!customizableUI) {
    if (currentToolbarGroup === DataElements.FORMS_TOOLBAR_GROUP) {
      dispatch(actions.setToolbarGroup(DataElements.VIEW_TOOLBAR_GROUP));
    }
  } else {
    core.setToolMode('AnnotationEdit');
  }
};
