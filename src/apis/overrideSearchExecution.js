import { overrideSearchExecution as overrideSearchExecutionHelper } from 'helpers/search';

/**
 * Add custom override function for default search on UI.
 * overrideSearchExecutionCallback function will be executed with search value and search options
 * when user executes search from UI. This function won't be executed when search is triggered through programmatic searches.
 * @method UI.overrideSearchExecution
 * @param {function} overrideSearchExecutionCallback Function that will executed instead of default search functionality.
 * @example
 WebViewer(...)
 .then(function(instance) {
    function searchFn(searchValue, options) {
      console.log(searchValue, options);
    };

    instance.UI.overrideSearchExecution(searchFn);
  });
 */
export default function overrideSearchExecution(overrideSearchExecutionCallback) {
  overrideSearchExecutionHelper(overrideSearchExecutionCallback);
}
