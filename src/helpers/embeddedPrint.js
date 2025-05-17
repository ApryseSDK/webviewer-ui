import getRootNode from './getRootNode';
import { isIOS, isSafari } from 'helpers/device';
import { workerTypes } from 'constants/types';
import {
  prepareAnnotations,
  applyWatermark,
  createDocumentWithVisibleLayers,
  getPageArray,
  createCleanDocumentCopy,
  processStandardDocument,
  processColorAnnotations,
} from './embeddedPrintHelper';
import core from 'core';

/**
 * Handle different process of embedded print for iOS Safari
 * @returns {boolean} true if the current browser is iOS Safari
 * @ignore
 */
export const iosWindowOpen = () => {
  return (isIOS && isSafari) ? window.open() : null;
};

/**
 * Helper function to check if embedded print is supported
 * @param {boolean} isEmbedPrintSupported a check if useEmbeddedPrint is toggled and not an Android device
 * @returns {boolean} true if embedded print is supported
 * @ignore
 */
export const canEmbedPrint = (isEmbedPrintSupported) => {
  const supportedFileTypes = [
    workerTypes.PDF,
  ];
  const embeddedFileTypeSupport = supportedFileTypes.includes(core.getDocument().getType());
  return isEmbedPrintSupported && embeddedFileTypeSupport;
};

/**
 * Print API has optional parameters that are not supported in embedded printing,
 * if passed we console.warn the user
 * @param {object} options - options object passed to the print API
 * @ignore
 */
export const embeddedPrintNoneSupportedOptions = (options) => {
  const unsupportedOptions = {
    maintainPageOrientation: 'Embedded Printing does not support maintaining page orientation.',
    onProgress: 'Embedded Printing does not support a callback function for printing',
  };
  Object.entries(unsupportedOptions).forEach(([key, message]) => {
    if (options[key]) {
      console.warn(message);
    }
  });
};

/**
 * Creates an embedded PDF document for printing with the specified pages and options.
 * @param {object} options print options
 * @param {window.Core.Document} document document to print
 * @param {window.Core.AnnotationManager} annotationManager annotation manager object
 * @returns {window.Core.Document} pdf
 * @ignore
 */
export const processEmbeddedPrintOptions = async (options, document, annotationManager) => {
  const {
    includeAnnotations,
    includeComments,
    isCurrentView,
    isGrayscale = false,
    watermarkModalOptions,
    pagesToPrint,
    isAlwaysPrintAnnotationsInColorEnabled,
  } = options;
  const pagesToPrintArray = pagesToPrint ?? getPageArray(document.getPageCount());
  const printingOptions = {
    includeAnnotations,
    includeComments,
    isCurrentView,
    isGrayscale,
    isAlwaysPrintAnnotationsInColorEnabled
  };
  try {
    const pdf = await createEmbeddedPrintPages(
      document,
      annotationManager,
      pagesToPrintArray,
      printingOptions,
      watermarkModalOptions
    );
    return pdf;
  } catch (error) {
    console.error('Error processing embedded print options:', error);
    throw error;
  }
};

/**
 * Creates am embedded PDF document for printing with the specified pages and options.
 * @param {window.Core.Document} document document to print
 * @param {window.Core.AnnotationManager} annotationManager Manage document annotations
 * @param {number[]} pagesToPrint array of page numbers to print
 * @param {object} printingOptions object with printing options
 * @param {object} watermarkModalOptions object with watermark options
 * @returns {Promise<window.Core.Document>} pdf
 * @ignore
 */
export const createEmbeddedPrintPages = async (
  document,
  annotationManager,
  pagesToPrint,
  printingOptions,
  watermarkModalOptions
) => {
  try {
    const { isAlwaysPrintAnnotationsInColorEnabled } = printingOptions;
    const processedBaseDoc = await createCleanDocumentCopy(document, pagesToPrint);
    const processedDocWithVisibleLayers = await createDocumentWithVisibleLayers(document, processedBaseDoc);
    const xfdfString = await prepareAnnotations(annotationManager, pagesToPrint, printingOptions);
    const watermarkedDoc = await applyWatermark(processedDocWithVisibleLayers, watermarkModalOptions);
    return isAlwaysPrintAnnotationsInColorEnabled
      ? await processColorAnnotations(document, watermarkedDoc, xfdfString, printingOptions, pagesToPrint)
      : await processStandardDocument(document, watermarkedDoc, xfdfString, printingOptions, pagesToPrint);
  } catch (error) {
    console.error('Error creating embedded print pages:', error);
    throw error;
  }
};

/**
 * Retrieves file data from the document and sends it to a print handler
 * @param {window.Core.Document} pdfDocument document to print
 * @returns {Promise<void>} Promise that resolves when the print job is complete
 * @ignore
 */
export const printEmbeddedPDF = (pdfDocument) => {
  const windowRef = iosWindowOpen();
  const printDocument = true;
  return pdfDocument.getFileData({ printDocument })
    .then((data) => {
      const arr = new Uint8Array(data);
      printDocumentArrayBuffer(arr, windowRef);
    })
    .catch((error) => console.error('Print Error status: ', error));
};

/**
 * Converts a Uint8Array PDF buffer into a Blob, sets it as the source of an iframe for printing,
 * and triggers the print dialog either in a new window or within the iframe itself.
 * @param {Uint8Array} arrayBuffer Binary data of PDF File
 * @param {Window|null} windowRef window to print the PDF
 * @returns {Promise<void>} Promise that resolves when the print job is complete
 * @ignore
 */
const printDocumentArrayBuffer = (arrayBuffer, windowRef) => {
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  const printHandler = getRootNode().getElementById('print-handler');
  printHandler.src = URL.createObjectURL(blob);
  if (windowRef) {
    windowRef.location.href = printHandler.src;
    setTimeout(() => {
      windowRef.print();
    }, 100);
  } else {
    return new Promise((resolve) => {
      const loadListener = function() {
        printHandler.contentWindow.print();
        printHandler.removeEventListener('load', loadListener);
        resolve();
      };
      printHandler.addEventListener('load', loadListener);
    });
  }
};