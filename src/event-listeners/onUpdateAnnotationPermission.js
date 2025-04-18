import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';
import disableFeatures from 'src/apis/disableFeatures';
import enableFeatures from 'src/apis/enableFeatures';
import Feature from 'constants/feature';
import { isOfficeEditorMode } from 'src/helpers/officeEditor';

export default (store) => () => {
  const { dispatch } = store;
  const isReadOnly = core.getIsReadOnly();

  if (isReadOnly) {
    disableTools(store)();
    disableFeatures(store)([Feature.Annotating]);
    core.setToolMode(defaultTool);
    dispatch(actions.setActiveToolGroup(''));
    dispatch(actions.setActiveCustomRibbon('toolbarGroup-View'));
  } else {
    enableTools(store)();
    if (!isOfficeEditorMode()) {
      enableFeatures(store)([Feature.Annotating]);
    }
  }

  dispatch(actions.setReadOnly(core.getIsReadOnly()));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};