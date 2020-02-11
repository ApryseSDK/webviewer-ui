/**
 * Downloads the pdf document with or without annotations added by WebViewer UI.
 * @method WebViewerInstance#downloadPdf
 * @param {object} [options] An object that contains the following download options.
 * @param {string} [options.filename] The filename of the downloaded document.
 * @param {string} [options.downloadType='pdf'] The type to download the file as, by default this is "pdf". PDF and image files can only be downloaded as PDFs, but office files can be downloaded as "pdf" or as "office" if you want to get the original file without annotations.
 * @param {string} [options.xfdfString] An xfdf string containing annotation data to be used when downloading. Use this option instead of `includeAnnotations` if not all annotations need to be contained in the downloaded file.
 * @param {boolean} [options.includeAnnotations=true] Whether or not to include annotations added by WebViewer UI.
 * @param {boolean} [options.flatten] Whether or not to flatten all the annotations in the downloaded document. Only useful fullAPI is enabled and either `xfdfString` or `includeAnnotations` is used.
 * @param {number} [options.flags=CoreControls.SaveOptions.REMOVE_UNUSED] The flags with which to save the document. Possible values include `CoreControls.SaveOptions.REMOVE_UNUSED` (remove unused objects during save) and `CoreControls.SaveOptions.LINEARIZED` (optimize the document for fast web view and remove unused objects).
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;
    var annotManager = instance.annotManager;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', async function() {
      // download pdf without annotations added by WebViewer UI
      instance.downloadPdf({
        includeAnnotations: false,
      });

      // download pdf with all annotations flattened
      instance.downloadPdf({
        includeAnnotations: true,
        flatten: true,
      });

      // download pdf without links
      const xfdfString = await annotManager.exportAnnotations({ links: false });
      instance.downloadPdf({
        xfdfString: xfdfString,
      });
    });
  });
 */

import downloadPdf from 'helpers/downloadPdf';
import { workerTypes } from 'constants/types';
import core from 'core';

export default store => (options = { includeAnnotations: true }) => {
  const documentType = core.getDocument()?.getType();
  const { PDF, BLACKBOX, OFFICE } = workerTypes;

  if (
    documentType !== PDF &&
    documentType !== OFFICE &&
    documentType !== BLACKBOX
  ) {
    console.warn('Document type is not PDF. Cannot be downloaded.');
    return;
  }

  // legacy interface: instance.downloadPdf(true);
  if (typeof options === 'boolean') {
    options = {
      includeAnnotations: options,
    };
  }

  downloadPdf(store.dispatch, options);
};
