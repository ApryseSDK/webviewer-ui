import core from 'core';
import actions from 'actions';

export default ({ dispatch }) => () => core.closeDocument(dispatch).then(() => {
  dispatch(actions.setDocumentLoaded(false));
  dispatch(actions.closeElements([ 'pageNavOverlay', 'passwordModal' ]));
  dispatch(actions.setOutlines([]));
});