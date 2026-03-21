import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import { createWrappedCore } from 'hooks/useCore/useCore';

export default (dispatch, documentViewerKey) => (annotation) => {
  const core = createWrappedCore(documentViewerKey);
  core.setToolMode(defaultTool);
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(annotation);
};