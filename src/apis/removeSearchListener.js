/**
 * Removes the search listener function.
 * @method CoreControls.ReaderControl#removeSearchListener
 * @param {searchListener} listener Search listener function that was added.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  const searchListener = (searchValue, options, results) => {
    console.log(searchValue, options, results);
  };
  instance.addSearchListener(searchListener);
  instance.removeSearchListener(searchListener);
});
 */

import actions from 'actions';

export default store => listener => {
  store.dispatch(actions.removeSearchListener(listener));
};