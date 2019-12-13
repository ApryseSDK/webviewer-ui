/**
 * Removes the search listener function.
 * @method WebViewer#removeSearchListener
 * @param {WebViewer.searchListener} listener Search listener function that was added.
 * @example
WebViewer(...)
  .then(function(instance) {
    function searchListener(searchValue, options, results) {
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