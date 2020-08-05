/**
 * Print the current document.
 * @method WebViewerInstance#printInBackground
 * @param {boolean} [allPages=false] If true, all pages will be printed
 * @param {Array.<number>} [pagesToPrint=[]] If allPages is false and pagesToPrint is passed in, will print only the pages passed in
 * @param {boolean} [includeAnnotations=false] If true, will print the documents with the annotations
 * @param {boolean} [includeComments=false] If true, will append comments to the document printed
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.printInBackground({ includeComments:true, includeAnnotations: true });
    });
  });
 */

import { print } from 'helpers/print';
import selectors from 'selectors';

export default store => options => {
  const defaultOptions = {
    allPages: false,
    pagesToPrint: [],
    includeAnnotations: false,
    includeComments: false,
  };

  const printOptions = {
    ...defaultOptions,
    ...options,
  };

  const { allPages, pagesToPrint } = printOptions;

  if (!allPages && pagesToPrint.length === 0) {
    console.warn('No pages were passed in to be printed. Please pass either allPages set to true or a range of pages in pagesToPrint.');
  } else {
    print(
      store.dispatch,
      selectors.isEmbedPrintSupported(store.getState()),
      selectors.getSortStrategy(store.getState()),
      selectors.getColorMap(store.getState()),
      printOptions,
    );
  }
};
