/**
 * Programmatically print the document without opening a modal with the print options provided.
 * @method WebViewerInstance#printInBackground
 * @param {Array.<number>} [pagesToPrint] Optionally pass in the pages you want to print. By default, all pages will be printed.
 * @param {boolean} [includeAnnotations=false] If true, will print the documents with the annotations
 * @param {boolean} [includeComments=false] If true, will append comments to the document printed
 * @param {function} [onProgress] A callback function that is executed on each page processed
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.printInBackground({
        includeComments:true,
        includeAnnotations: true,
        onProgress: function(pageNumber, img) {},
      });
    });
  });
 */

import { print } from 'helpers/print';
import selectors from 'selectors';

export default store => options => {
  const defaultOptions = {
    includeAnnotations: false,
    includeComments: false,
  };

  const printOptions = {
    ...defaultOptions,
    ...options,
  };

  const { pagesToPrint } = printOptions;

  if (pagesToPrint && pagesToPrint.length === 0) {
    console.warn('No pages to be printed were found in the "pagesToPrint" array provided. If you want to print all pages, please set this to undefined or null.');
    return;
  }

  print(
    store.dispatch,
    selectors.isEmbedPrintSupported(store.getState()),
    selectors.getSortStrategy(store.getState()),
    selectors.getColorMap(store.getState()),
    printOptions,
  );
};
