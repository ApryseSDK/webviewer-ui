import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store) => () => {
  const state = store.getState();
  const isWidgetHighlightingEnabledInRedux = selectors.isWidgetHighlightingEnabled(state);
  const fieldManager = core.getAnnotationManager().getFieldManager();
  const isWidgetHighlightingEnabled = fieldManager.isWidgetHighlightingEnabled();
  if (isWidgetHighlightingEnabledInRedux === isWidgetHighlightingEnabled) {
    return;
  }

  if (isWidgetHighlightingEnabled) {
    dispatch(actions.enableWidgetHighlighting());
  } else {
    dispatch(actions.disableWidgetHighlighting());
  }
};