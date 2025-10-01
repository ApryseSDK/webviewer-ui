import { getCurrentViewRect } from './printCurrentViewHelper';
import { convertToGrayscaleDocument } from './grayScaleHelper';
import core from 'core';

/**
 * Format options for the function formatDocumentForPrint.
 * values used in the core for specifying the document content to print
 * e_PrintContent_DocumentOnly = 0
 * e_PrintContent_DocumentAndAnnotations = 1
 * e_PrintContent_DocumentAnnotationsAndComments = 2
 * @ignore
 */
export const FORMAT_DOCUMENT_FOR_PRINT_OPTION = {
  'DocumentOnly': 0,
  'DocumentAndAnnotations': 1,
  'DocumentAnnotationsAndComments': 2,
};

/**
 * Create a copy of the document, it will have its own PDFDocument object
 * and will not be affected by any changes made to the original document.
 * It calls extractPages without xfdfString to create a clean document without
 * any annotations or comments.
 * @param {window.Core.Docment} document Document object
 * @returns {Promise<window.Core.Document>} Copied document
 * @ignore
 * @remarks
 * extractPages keeps a protected pdf password if the user has already entered it.
 */
export const createCleanDocumentCopy = async (document) => {
  const extension = document.getType();
  const shouldUsePageExtraction = extension === 'pdf' || extension === 'webviewerServer';

  const documentData = shouldUsePageExtraction
    ? await document.extractPages(getPageArray(document.getPageCount()))
    : await document.getFileData({ downloadType: 'pdf', includeAnnotations: false });

  return window.Core.createDocument(documentData, { extension: 'pdf' });
};

/**
 * Embedded print process to handle print options and return xfdf string
 * @param {window.Core.AnnotationManager} annotationManager annotation manager object
 * @param {Array<number>} pagesToPrint array of page numbers to print
 * @param {object} printingOptions printing options
 * @returns {Promise<string>} xfdf string
 * @ignore
 */
export const prepareAnnotations = (annotationManager, pagesToPrint, printingOptions) => {
  const includeComments = printingOptions?.includeComments;
  const includeAnnotations = includeComments ? true : printingOptions?.includeAnnotations;
  return extractXFDF(annotationManager, pagesToPrint, includeAnnotations);
};

/**
 * Extract pages from the document and merge annotations.
 * @param {window.Core.Document} document Document object using WebViewer Server
 * @param {window.Core.Document} processedDoc Document object copied from the original document
 * @param {Array<number>} pagesToPrint array of page numbers to print
 * @param {string} xfdfString string of xfdf data
 * @returns {window.Core.Document} Document object with the selected pages
 * @ignore
 */
export const extractPagesWithMergedAnnotations = async (document, processedDoc, pagesToPrint, xfdfString) => {
  if (useWebViewerServerDocument(document)) {
    return extractPages(document, pagesToPrint, xfdfString);
  }
  return extractPages(processedDoc, pagesToPrint, xfdfString);
};

/**
 * Embedded print process that handles the print option of Current View
 * @param {window.Core.Document} document Document object
 * @returns {Promise<window.Core.Document>} Document object with the selected pages
 * @ignore
 */
export const createCropDocument = async (document) => {
  const croppedDoc = await cropDocumentToCurrentView(document);
  const buf = await croppedDoc.getFileData();
  return window.Core.createDocument(buf, { extension: 'pdf' });
};

/**
 * Embedded print process that handles the print option of Watermark
 * @param {window.Core.Document} document Document object
 * @param {object} watermarkModalOptions object with watermark options
 * @returns {window.Core.Document} Document object with the watermark applied
 * @ignore
 */
export const applyWatermark = async (document, watermarkModalOptions) => {
  if (!watermarkModalOptions) {
    return document;
  }

  document.setWatermark(watermarkModalOptions);
  const appliedWaterMarkDocument = await createDocumentForPrint(document);
  return appliedWaterMarkDocument;
};

/**
 * Embedded print process that handles the print option of Comments
 * @param {window.Core.Document} document Document object
 * @param {object} printingOptions object with printing options
 * @returns {window.Core.Document} Document object with the comments formatted
 * @ignore
 * @remarks
 * formatDocumentForPrint does modify the document layers, annotations and documents. It is no longer
 * exclusively tied to fullAPI being enabled.
 */
export const formatFinalDocument = async (document, printingOptions) => {
  const { includeComments, includeAnnotations } = printingOptions;
  const pagesArray = getPageArray(document.getPageCount());

  if (!includeComments && includeAnnotations) {
    const formattedDoc = await document.formatDocumentForPrint(pagesArray, FORMAT_DOCUMENT_FOR_PRINT_OPTION.DocumentAndAnnotations);
    return formattedDoc;
  } else if (!includeComments) {
    return document;
  }

  const formattedDoc = await document.formatDocumentForPrint(pagesArray, FORMAT_DOCUMENT_FOR_PRINT_OPTION.DocumentAnnotationsAndComments);

  if (includeAnnotations) {
    return formattedDoc;
  }
  const commentPagesArray = getPageArray(formattedDoc.getPageCount());
  const data = await formattedDoc.extractPages(commentPagesArray);
  return await window.Core.createDocument(data, { extension: 'pdf' });
};

/**
 * Creates a document with the original document layers applied.
 * @param {window.Core.Document} baseDocument Original Document
 * @param {window.Core.Document} document Formatted Print Document
 * @returns {window.Core.Document} Document object with the layers applied
 * @ignore
 */
export const createLayerDocument = async (baseDocument, document) => {
  const pageArray = getPageArray(document.getPageCount());
  const [baseDocumentLayers, documentLayers] = await Promise.all([
    baseDocument.getLayersArray(),
    document.getLayersArray(),
  ]);
  const layer = syncLayersVisibility(baseDocumentLayers, documentLayers);

  return document.formatDocumentForPrint(
    pageArray,
    FORMAT_DOCUMENT_FOR_PRINT_OPTION.DocumentAnnotationsAndComments,
    layer
  );
};

/**
 * Sync the altered layers of visible layers from the base document to the formatted print document.
 * We need to maintain the associated ids of each layer in order for formatDocumentForPrint to
 * remove the layers that are not visible.
 * @param {window.Core.Document.LayerContext[]} sourceLayers Original Document Layers
 * @param {window.Core.Document.LayerContext[]} targetLayers Formatted Print Document Layers
 * @returns {window.Core.Document.LayerContext[]} Array of layers with their visibility synced
 * @ignore
 */
export const syncLayersVisibility = (sourceLayers, targetLayers) => {
  const sourceMapLayers = new Map(
    sourceLayers.map((layer) => [layer.name, layer.visible])
  );

  targetLayers.forEach((layer) => {
    if (layer?.name && sourceMapLayers.has(layer.name)) {
      layer.visible = sourceMapLayers.get(layer.name);
    }
  });
  return targetLayers;
};

/**
 * Get crop dimensions for the current view rect
 * @param {object} renderRect The current view rect
 * @param {object} pageDimensions The page dimensions
 * @returns {object} The crop dimensions
 * @ignore
 */
export const getCropDimensions = (renderRect, pageDimensions) => {
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  let x2Diff = 0;
  let y2Diff = 0;

  x1 = renderRect.y1 < 0 ? 0 : renderRect.x1;
  x2Diff = pageDimensions.width - renderRect.x2 < 0 ? 0 : pageDimensions.width - renderRect.x2;
  x2 = x2Diff > pageDimensions.width ? 0 : x2Diff;
  y1 = renderRect.y1 < 0 ? 0 : renderRect.y1;
  y2Diff = pageDimensions.height - renderRect.y2 < 0 ? 0 : pageDimensions.height - renderRect.y2;
  y2 = y2Diff > pageDimensions.height ? 0 : y2Diff;

  return { x1, x2, y1, y2 };
};

/**
 * Remove pages from the document
 * @param {number} currentPageNumber The current page number
 * @param {number} numPages The total number of pages
 * @returns {Array<number>} The array of pages to remove
 * @ignore
 */
export const getRemovePagesArray = (currentPageNumber, numPages) => {
  return Array.from({ length: numPages }, (_, i) => i + 1)
    .filter((page) => page !== currentPageNumber);

};

/**
 * This uses the annotation manager from the viewer and extracts an xfdf string
 * from the annotations that are on the pages to print.
 * @param {window.Core.AnnotationManager} annotationManager Annotation Manager object
 * @param {Array<number>} pagesToPrint Selected pages to print
 * @param {boolean} includeAnnotations Whether to include annotations in the xfdf string
 * @returns {string} xfdf string
 * @ignore
 */
export const extractXFDF = async (annotationManager, pagesToPrint, includeAnnotations) => {
  if (includeAnnotations) {
    const map = annotationManager.getRegisteredAnnotationTypes();
    const customAnnotationTypes = Object.keys(map).reduce((acc, key) => {
      const customTypes = map[key];
      customTypes.forEach((customType) => {
        if (Object.getPrototypeOf(customType.prototype) === window.Core.Annotations.CustomAnnotation.prototype) {
          acc.push({
            originalSerializationMode: customType.SerializationType,
            customType,
          });
          // Force stamp serialization for print
          customType.SerializationType = window.Core.Annotations.CustomAnnotation.SerializationTypes.STAMP;
        }
      });
      return acc;
    }, []);
    const annotationList = annotationManager.getAnnotationsList().filter((annotation) => pagesToPrint.indexOf(annotation.PageNumber) > -1);
    const xfdfString = await annotationManager.exportAnnotations({ annotationList: annotationList, widgets: true, links: true, fields: true, generateInlineAppearances: true });
    // Later, we restore the original setting
    customAnnotationTypes.forEach((type) => {
      type.customType.SerializationType = type.originalSerializationMode;
    });
    return xfdfString;
  }
  // removes annotations from document
  return '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"></xfdf>';
};

/**
 * Extract pages from the document
 * @param {window.Core.Document} document Document object
 * @param {Array<number>} pagesToPrint Array of page numbers to print
 * @param {string} xfdfString xfdf string
 * @returns {window.Core.Document} Document object with the extracted pages
 * @ignore
 */
const extractPages = async (document, pagesToPrint, xfdfString) => {
  const data = await document.extractPages(pagesToPrint, xfdfString);
  return window.Core.createDocument(data, { extension: 'pdf' });
};

/**
 * Checks if document is using WebViewer Server
 * @param {window.Core.Document} document Document object
 * @returns {boolean} True if document is using WebViewer Server
 * @ignore
 */
const useWebViewerServerDocument = (document) => {
  const extension = document.getType();
  const bbURLPromise = document.getPrintablePDF();
  return extension === 'pdf' && bbURLPromise;
};

/**
 * Creates an array of page numbers from 1 to pageCount
 * @param {number} pageCount Total number of pages
 * @returns {Array<number>} Array of page numbers
 * @ignore
 */
export const getPageArray = (pageCount) => {
  return Array.from({ length: pageCount }, (_, i) => (i + 1));
};

/**
 * Creates a document for printing
 * @param {window.Core.Document} document Document object
 * @param {object} fileDataOptions Options for the file data
 * @returns {window.Core.Document} Document object for printing
 * @ignore
 */
const createDocumentForPrint = async (document, fileDataOptions) => {
  const fileData = await document.getFileData(fileDataOptions);
  const blob = new Blob([fileData], { type: 'application/pdf' });
  const result = await window.Core.createDocument(blob, { extension: 'pdf' });
  return result;
};

/**
 * Crops the document to the current view rect and removes other pages
 * @param {window.Core.Document} document Document object
 * @returns {window.Core.Document} Document object cropped to the current view
 * @ignore
 */
const cropDocumentToCurrentView = async (document) => {
  const docViewer = core.getDocumentViewer();
  const currentPageNumber = docViewer.getCurrentPage();
  const numPages = document.getPageCount();

  // Crop Pages to Current View Rect for printing
  const renderRect = getCurrentViewRect(currentPageNumber);
  const pageDimensions = core.getDocument().getPageInfo(currentPageNumber);

  const cropRect = getCropDimensions(renderRect, pageDimensions);
  await document.cropPages([currentPageNumber], cropRect.y1, cropRect.y2, cropRect.x1, cropRect.x2);

  // Remove Pages
  const pagesToRemove = getRemovePagesArray(currentPageNumber, numPages);
  await document.removePages(pagesToRemove);

  return document;
};

/**
 * This function processes the document for printing with standard annotations.
 * It applies print options and then applies grayscale if needed over the annotated document.
 * @param {window.Core.Document} document document to print
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @ignore
 * @returns {Promise<window.Core.Document>}
 */
export const processStandardDocument = async (document, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  const documentWithColorAnnotations = await applyPrintOptions(
    document,
    modifiedDoc,
    xfdfString,
    printingOptions,
    pagesToPrint
  );
  return printingOptions.isGrayscale
    ? convertToGrayscaleDocument(documentWithColorAnnotations)
    : documentWithColorAnnotations;
};

/**
 * This function processes the document while preserving color.
 * Applies the grayscale first and then applies print options.
 * @param {window.Core.Document} document document to print
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @ignore
 * @returns {Promise<window.Core.Document>}
 */
export const processColorAnnotations = async (document, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  const grayscaleDoc = printingOptions.isGrayscale
    ? await convertToGrayscaleDocument(modifiedDoc)
    : modifiedDoc;

  return applyPrintOptions(
    document,
    grayscaleDoc,
    xfdfString,
    printingOptions,
    pagesToPrint
  );
};

/**
 * Applies annotations, currentView and generates comments page.
 * @param {window.Core.Document} document document to print
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @returns {Promise<window.Core.Document>} document with applied print options
 * @ignore
 */
export const applyPrintOptions = async (document, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  let processedDoc = await extractPagesWithMergedAnnotations(
    document,
    modifiedDoc,
    pagesToPrint,
    xfdfString,
  );
  if (printingOptions.isCurrentView) {
    processedDoc = await createCropDocument(processedDoc);
  }
  return formatFinalDocument(processedDoc, printingOptions);
};