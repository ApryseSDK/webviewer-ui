import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';
import disableFeatures from 'src/apis/disableFeatures';
import enableFeatures from 'src/apis/enableFeatures';
import Feature from 'constants/feature';
import { isOfficeEditorMode } from 'src/helpers/officeEditor';
import selectors from 'selectors';

export default (store) => () => {
  const { dispatch } = store;
  const isReadOnly = core.getIsReadOnly();
  const isViewOnly = selectors.isViewOnly(store.getState());
  const isCustomUI = selectors.getIsCustomUIEnabled(store.getState());

  if (isReadOnly || (isViewOnly && !isCustomUI)) {
    disableTools(store)();
    disableFeatures(store)([Feature.Annotating]);
    core.setToolMode(defaultTool);
    dispatch(actions.setActiveToolGroup(''));
    if (isReadOnly) {
      dispatch(actions.setActiveCustomRibbon('toolbarGroup-View'));
    }
  } else {
    enableTools(store)();
    if (!isOfficeEditorMode()) {
      enableFeatures(store)([Feature.Annotating]);
    }
  }

  dispatch(actions.setReadOnly(isReadOnly));
  dispatch(actions.setViewOnly(isViewOnly));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};