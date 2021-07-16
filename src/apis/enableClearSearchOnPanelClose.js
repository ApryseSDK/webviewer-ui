import actions from 'actions';

/**
 * Enable clearing search results when user closes search panel. When this is enabled and user closes search panel
 * all search results are cleared.
 *
 * Note, mobile devices never clear search results even if this setting is enabled. This is because the panel needs to be closed to view the search results on the document.
 * @method UI.enableClearSearchOnPanelClose
 * @example
 WebViewer(...)
 .then(function(instance) {
    // Will not affect on mobile devices
    instance.UI.enableClearSearchOnPanelClose();
  });
 */
function enableClearSearchOnPanelCloseClosure(store) {
  return function enableClearSearchOnPanelClose() {
    const shouldClear = true;
    store.dispatch(actions.setClearSearchOnPanelClose(shouldClear));
  };
}

export default enableClearSearchOnPanelCloseClosure;
