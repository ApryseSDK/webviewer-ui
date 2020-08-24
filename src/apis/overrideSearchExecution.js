import { overrideSearchExecution as overrideSearchExecutionHelper } from "helpers/search";

/**
 * Add custom override function for default search on UI.
 * Passing overrideSearchExecutionCallback function will be executed with search value and search options
 * when user executes search from UI. This won't have an affect on programmatic searches.
 * @method WebViewerInstance#overrideSearchExecution
 * @param {WebViewerInstance.overrideSearchExecution} function that will override default search functionality.
 * @example
 WebViewer(...)
 .then(function(instance) {
    function search(searchValue, options) {
      console.log(searchValue, options);
    };

    instance.overrideSearchExecution(search);
  });
 */
export default function overrideSearchExecution(overrideSearchExecutionCallback) {
  overrideSearchExecutionHelper(overrideSearchExecutionCallback);
}
