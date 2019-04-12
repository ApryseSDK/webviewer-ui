/**
 * Adds a listener function to be called when search is completed.
 * @method CoreControls.ReaderControl#addSearchListener
 * @param {CoreControls.ReaderControl~searchListener} searchListener Callback function that will be triggered when search completed
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  const searchListener = (searchValue, options, results) => {
    console.log(searchValue, options, results);
  };
  instance.addSearchListener(searchListener);
});
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#addSearchListener addSearchListener}.
 * @callback CoreControls.ReaderControl~searchListener
 * @param {string} searchValue Search value
 * @param {object} options Search options object, which includes 'caseSensitive', 'wholeWord', 'wildcard' and 'regex'
 * @param {Array.<object>} results Search results
 */

import actions from 'actions';

export default store => listener => {
  store.dispatch(actions.addSearchListener(listener));
};