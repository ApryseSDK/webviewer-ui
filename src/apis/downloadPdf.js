/**
 * Downloads the pdf document with or without annotations added by WebViewer UI.
 * @method UI.downloadPdf
 * @param {object} [options] An object that contains the following download options.
 * @param {string} [options.filename] The filename of the downloaded document.
 * @param {string} [options.downloadType='pdf'] The type to download the file as, by default this is "pdf". PDF and image files can only be downloaded as PDFs, but office files can be downloaded as "pdf" or as "office" if you want to get the original file without annotations.
 * @param {string} [options.xfdfString] An xfdf string containing annotation data to be used when downloading. Use this option instead of `includeAnnotations` if not all annotations need to be contained in the downloaded file.
 * @param {boolean} [options.includeAnnotations=true] Whether or not to include annotations added by WebViewer UI.
 * @param {boolean} [options.flatten] Whether or not to flatten all the annotations in the downloaded document. Only useful fullAPI is enabled and either `xfdfString` or `includeAnnotations` is used.
 * @param {Core.Document} [options.documentToBeDownloaded] A document to be download instead of the one loaded by Document Viewer.
 * @param {boolean} [options.useDisplayAuthor] Whether to export annotations with the Display Author name from annotationManager.getDisplayAuthor()
 * @param {number} [options.flags=Core.SaveOptions.REMOVE_UNUSED] The flags with which to save the document. Possible values include `Core.SaveOptions.REMOVE_UNUSED` (remove unused objects during save) and `Core.SaveOptions.LINEARIZED` (optimize the document for fast web view and remove unused objects).
 * @returns {Promise<any>} A promise that is resolved once the document is downloaded.
 * @example
WebViewer(...)
  .then(async function(instance) {
    const docViewer = instance.Core.documentViewer;
    const annotManager = instance.Core.annotationManager;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', async function() {
      // download pdf without annotations added by WebViewer UI
      await instance.UI.downloadPdf({
        includeAnnotations: false,
      });

      console.log('Downloaded the first time!')

      // download pdf with all annotations flattened
      await instance.UI.downloadPdf({
        includeAnnotations: true,
        flatten: true,
      });

      console.log('Downloaded a second time!')

      // download pdf without links
      const xfdfString = await annotManager.exportAnnotations({ links: false });
      await instance.UI.downloadPdf({
        xfdfString: xfdfString,
      });

      console.log('Downloaded a third time!')
    });
  });
 */

import downloadPdf from 'helpers/downloadPdf';
import { workerTypes } from 'constants/types';
import core from 'core';

export default store => async (options = { includeAnnotations: true }) => {
  const documentType = core.getDocument()?.getType();
  const { PDF, WEBVIEWER_SERVER, OFFICE } = workerTypes;

  if (
    documentType !== PDF &&
    documentType !== OFFICE &&
    documentType !== WEBVIEWER_SERVER
  ) {
    console.warn('Document type is not PDF. Cannot be downloaded.');
    return Promise.reject();
  }

  // legacy interface: instance.downloadPdf(true);
  if (typeof options === 'boolean') {
    options = {
      includeAnnotations: options,
    };
  }

  return downloadPdf(store.dispatch, options);
};
