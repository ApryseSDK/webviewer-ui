/**
 * Set save as handler that will be triggered in case of a save action instead of the default method.
 * @method UI.setSaveAsHandler
 * @param {UI.saveAsHandler} saveAsHandler Callback function that will be triggered when download started
 * @example
WebViewer(...)
  .then(function(instance) {
    function onDownload(data, filename) {
      console.log(filename);
    };
    instance.UI.setSaveAsHandler(onDownload);
  });
 */
/**
 * Callback that gets passed to {@link UI.setSaveAsHandler setSaveAsHandler}.
 * @callback UI.saveAsHandler
 * @param {Blob|File} data data
 * @param {string} filename filename
 */

import { setSaveAsHandler as saveAsHandlerHelper } from 'helpers/saveAs';

export default function setSaveAsHandler(handler) {
  saveAsHandlerHelper(handler);
}