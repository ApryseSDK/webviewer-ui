import { getCurrentViewRect } from './printCurrentViewHelper';
import { convertToGrayscaleDocument } from './grayScaleHelper';

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
 * @param {window.Core.Document} document Document object
 * @returns {Promise<window.Core.Document>} Copied document
 * @ignore
 * @remarks
 * extractPages keeps a protected pdf password if the user has already entered it.
 * WVS documents with forceClientSideInit false does not have access to edit layers.
 */
export const createCleanDocumentCopy = async (document) => {
  const extension = document.getType();
  const shouldUsePageExtraction = extension === 'pdf';

  const documentData = shouldUsePageExtraction
    ? await document.extractPages(getPageArray(document.getPageCount()))
    : await document.getFileData({ downloadType: 'pdf', includeAnnotations: false });

  const createdDocument = await window.Core.createDocument(documentData, { extension: 'pdf' });

  return createdDocument;
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
  const flattenGroupedAnnotationRepliesForComments =
    !!includeComments && !!printingOptions?.includeAnnotations;

  return extractXFDF(
    annotationManager,
    pagesToPrint,
    includeAnnotations,
    {
      flattenGroupedAnnotationRepliesForComments,
      includeComments,
    },
  );
};

/**
 * Embedded print process that handles the print option of Current View
 * @param {object} core Core object
 * @param {window.Core.Document} document Document object
 * @returns {Promise<window.Core.Document>} Document object with the selected pages
 * @ignore
 */
export const createCropDocument = async (core, document) => {
  const croppedDoc = await cropDocumentToCurrentView(core, document);
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
 * @param {boolean} [printingOptions.preserveGroupedAnnotationReplies] when true,
 * skips DocumentAndAnnotations formatting because that core path removes grouped replies.
 * @returns {window.Core.Document} Document object with the comments formatted
 * @ignore
 * @remarks
 * formatDocumentForPrint does modify the document layers, annotations and documents. It is no longer
 * exclusively tied to fullAPI being enabled.
 */
export const formatFinalDocument = async (document, printingOptions) => {
  const {
    includeComments,
    includeAnnotations,
    preserveGroupedAnnotationReplies,
  } = printingOptions;
  const pagesArray = getPageArray(document.getPageCount());

  if (!includeComments && includeAnnotations) {
    // Core DocumentAndAnnotations formatting currently removes grouped reply
    // children, so preserve the extracted annotation state for grouped prints.
    if (preserveGroupedAnnotationReplies) {
      return document;
    }
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

const getDocumentViewerFromAnnotationManager = (annotationManager) => {
  if (annotationManager.getDocumentViewer) {
    return annotationManager.getDocumentViewer();
  }

  return annotationManager.docViewer;
};

const ensureAnnotationsLoaded = async (annotationManager) => {
  const documentViewer = getDocumentViewerFromAnnotationManager(annotationManager);
  if (!documentViewer?.getAnnotationsLoadedPromise) {
    return;
  }

  const annotationsLoadedPromise = documentViewer.getAnnotationsLoadedPromise();
  if (!annotationsLoadedPromise) {
    return;
  }

  documentViewer.downloadRemainingAnnotations?.();
  await annotationsLoadedPromise;
};

const isStickyReplyAnnotation = (annotation) => {
  const StickyAnnotation = window.Core?.Annotations?.StickyAnnotation;
  const isStickyAnnotation = typeof annotation?.isType === 'function'
    ? annotation.isType('StickyAnnotation')
    : (StickyAnnotation && annotation instanceof StickyAnnotation);

  return (
    isStickyAnnotation &&
    typeof annotation?.isReply === 'function' &&
    annotation.isReply()
  );
};

const shouldExcludeFromPrintAnnotationList = (annotation, includeComments = false) => {
  const isStickyReply = isStickyReplyAnnotation(annotation);

  return !!isStickyReply && !includeComments;
};

/**
 * Adds an annotation to the grouped annotations list for embedded print, if it meets the criteria.
 * Mutates the groupedAnnotations and seenAnnotationIds arrays.
 * @param {window.Core.Annotation} annotation
 * @param {boolean} forceInclude
 * @param {boolean} includeComments
 * @param {Set<number>} pagesToPrintSet
 * @param {Array<window.Core.Annotation>} groupedAnnotations
 * @param {Set<string>} seenAnnotationIds
 * @returns {void}
 * @ignore
 */
const addAnnotationForEmbeddedPrint = (
  annotation,
  forceInclude,
  includeComments,
  pagesToPrintSet,
  groupedAnnotations,
  seenAnnotationIds,
) => {
  if (
    !annotation ||
    shouldExcludeFromPrintAnnotationList(annotation, includeComments) ||
    (!forceInclude && !pagesToPrintSet.has(annotation.PageNumber))
  ) {
    return;
  }

  const annotationId = annotation.Id;
  if (!annotationId) {
    if (!groupedAnnotations.includes(annotation)) {
      groupedAnnotations.push(annotation);
    }
    return;
  }

  if (!seenAnnotationIds.has(annotationId)) {
    seenAnnotationIds.add(annotationId);
    groupedAnnotations.push(annotation);
  }
};

/**
 * Builds a map of grouped reply children by their parent annotation ID for embedded print.
 * This function filters out annotations that should be excluded from the print annotation list.
 * @param {Array<window.Core.Annotation>} annotations
 * @param {boolean} includeComments
 * @returns {Map<string, Array<window.Core.Annotation>>}
 * @ignore
 */
const buildGroupedReplyChildrenByParentId = (annotations, includeComments) => {
  const groupedReplyChildrenByParentId = new Map();

  annotations.forEach((annotation) => {
    if (
      annotation?.ReplyType === 'group' &&
      annotation?.InReplyTo &&
      !shouldExcludeFromPrintAnnotationList(annotation, includeComments)
    ) {
      const children = groupedReplyChildrenByParentId.get(annotation.InReplyTo) || [];
      children.push(annotation);
      groupedReplyChildrenByParentId.set(annotation.InReplyTo, children);
    }
  });

  return groupedReplyChildrenByParentId;
};

/**
 * Adds grouped reply descendants for embedded print, including comments if specified.
 * This function recursively traverses the grouped reply hierarchy and adds the descendants to the grouped annotations list.
 * @param {string} parentAnnotationId
 * @param {boolean} includeComments
 * @param {Set<number>} pagesToPrintSet
 * @param {Map<string, Array<window.Core.Annotation>>} groupedReplyChildrenByParentId
 * @param {Array<window.Core.Annotation>} groupedAnnotations
 * @param {Set<string>} seenAnnotationIds
 * @param {Set<string>} visitedGroupedReplyParentIds
 * @ignore
 */
const addGroupedReplyDescendantsForEmbeddedPrint = (
  parentAnnotationId,
  includeComments,
  pagesToPrintSet,
  groupedReplyChildrenByParentId,
  groupedAnnotations,
  seenAnnotationIds,
  visitedGroupedReplyParentIds,
) => {
  if (!parentAnnotationId) {
    return;
  }

  const pendingParentIds = [parentAnnotationId];

  while (pendingParentIds.length) {
    const currentParentId = pendingParentIds.pop();
    if (!currentParentId || visitedGroupedReplyParentIds.has(currentParentId)) {
      continue;
    }

    visitedGroupedReplyParentIds.add(currentParentId);
    const groupedReplyChildren = groupedReplyChildrenByParentId.get(currentParentId) || [];
    groupedReplyChildren.forEach((groupedReplyChild) => {
      addAnnotationForEmbeddedPrint(
        groupedReplyChild,
        true,
        includeComments,
        pagesToPrintSet,
        groupedAnnotations,
        seenAnnotationIds,
      );
      if (groupedReplyChild?.Id) {
        pendingParentIds.push(groupedReplyChild.Id);
      }
    });
  }
};

/**
 * Collects grouped annotations for the specified pages, including comments if specified.
 * Filters out annotations that should be excluded from the print annotation list.
 * @param {window.Core.AnnotationManager} annotationManager
 * @param {Array<window.Core.Annotation>} annotations
 * @param {Set<number>} pagesToPrintSet
 * @param {boolean} includeComments
 * @param {Map<string, Array<window.Core.Annotation>>} groupedReplyChildrenByParentId
 * @returns {Array<window.Core.Annotation>}
 * @ignore
 */
const collectGroupedAnnotationsForPages = (
  annotationManager,
  annotations,
  pagesToPrintSet,
  includeComments,
  groupedReplyChildrenByParentId,
) => {
  const groupedAnnotations = [];
  const seenAnnotationIds = new Set();
  const visitedGroupedReplyParentIds = new Set();

  annotations.forEach((annotation) => {
    if (
      !pagesToPrintSet.has(annotation.PageNumber) ||
      shouldExcludeFromPrintAnnotationList(annotation, includeComments)
    ) {
      return;
    }

    const group = annotationManager.getGroupAnnotations(annotation);
    if (!group.length) {
      addAnnotationForEmbeddedPrint(
        annotation,
        false,
        includeComments,
        pagesToPrintSet,
        groupedAnnotations,
        seenAnnotationIds,
      );
      addGroupedReplyDescendantsForEmbeddedPrint(
        annotation.Id,
        includeComments,
        pagesToPrintSet,
        groupedReplyChildrenByParentId,
        groupedAnnotations,
        seenAnnotationIds,
        visitedGroupedReplyParentIds,
      );
      return;
    }

    group.forEach((groupAnnotation) => {
      addAnnotationForEmbeddedPrint(
        groupAnnotation,
        true,
        includeComments,
        pagesToPrintSet,
        groupedAnnotations,
        seenAnnotationIds,
      );
      addGroupedReplyDescendantsForEmbeddedPrint(
        groupAnnotation.Id,
        includeComments,
        pagesToPrintSet,
        groupedReplyChildrenByParentId,
        groupedAnnotations,
        seenAnnotationIds,
        visitedGroupedReplyParentIds,
      );
    });
  });

  return groupedAnnotations;
};

/**
 * Gets grouped annotations for the specified pages, including comments if specified.
 * @param {window.Core.AnnotationManager} annotationManager The annotation manager instance
 * @param {Array<number>} pagesToPrint The pages to print
 * @param {object} options Options for getting grouped annotations
 * @param {boolean} [options.includeComments=false] Whether to include comments in the grouped annotations
 * @returns {Array<object>} The grouped annotations for the specified pages
 * @ignore
 */
const getGroupedAnnotationsForPages = (
  annotationManager,
  pagesToPrint,
  options = {},
) => {
  const { includeComments = false } = options;
  const annotations = annotationManager.getAnnotationsList();
  if (!pagesToPrint.length || !annotations.length) {
    return [];
  }

  const pagesToPrintSet = new Set(pagesToPrint);
  const groupedReplyChildrenByParentId = buildGroupedReplyChildrenByParentId(
    annotations,
    includeComments,
  );

  return collectGroupedAnnotationsForPages(
    annotationManager,
    annotations,
    pagesToPrintSet,
    includeComments,
    groupedReplyChildrenByParentId,
  );
};

/**
 * Checks if there are any grouped annotations on the specified pages.
 * @param {window.Core.AnnotationManager} annotationManager The annotation manager instance
 * @param {Array<number>} pagesToPrint The pages to print
 * @returns {boolean} True if there are any grouped annotations on the specified pages, false otherwise
 * @ignore
 */
export const hasGroupedAnnotationsOnPages = (annotationManager, pagesToPrint) => {
  const pagesToPrintSet = new Set(pagesToPrint);

  return annotationManager.getAnnotationsList().some((annotation) => {
    if (
      !pagesToPrintSet.has(annotation.PageNumber) ||
      shouldExcludeFromPrintAnnotationList(annotation)
    ) {
      return false;
    }

    const group = annotationManager.getGroupAnnotations(annotation);
    if (group.length > 1) {
      return true;
    }

    // Grouped child annotations may be represented as replies in some flows.
    if (annotation.ReplyType === 'group') {
      return true;
    }

    return group.some((groupAnnotation) => groupAnnotation?.ReplyType === 'group');
  });
};

/**
 * Flattens grouped replies for comments export.
 * This is necessary because the core's exportAnnotations method does not include grouped replies in the exported XFDF when exporting comments.
 * @param {*} annotationManager The annotation manager instance
 * @param {*} annotationList The list of annotations to be exported
 * @returns The modified annotation list with flattened grouped replies
 * @ignore
 */
const flattenRepliesForCommentsExport = (annotationManager, annotationList) => {
  return annotationList.reduce((acc, annotation) => {
    if (annotation?.ReplyType === 'group' && annotation?.InReplyTo) {
      acc.push({
        annotation,
        originalInReplyTo: annotation.InReplyTo,
        originalReplyType: annotation.ReplyType,
      });
      annotation.InReplyTo = null;
      annotation.ReplyType = null;
      return acc;
    }

    if (isStickyReplyAnnotation(annotation) && annotation?.InReplyTo) {
      const parentAnnotation = annotationManager.getAnnotationById(annotation.InReplyTo);
      const parentIsReply = typeof parentAnnotation?.isReply === 'function' && parentAnnotation.isReply();

      if (parentIsReply) {
        const rootAnnotation = annotationManager.getRootAnnotation?.(annotation);
        if (rootAnnotation?.Id && rootAnnotation.Id !== annotation.InReplyTo) {
          acc.push({
            annotation,
            originalInReplyTo: annotation.InReplyTo,
            originalReplyType: annotation.ReplyType,
          });
          annotation.InReplyTo = rootAnnotation.Id;
        }
      }
    }

    return acc;
  }, []);
};

const restoreGroupedRepliesAfterExport = (groupedReplyMetadata) => {
  groupedReplyMetadata.forEach(({ annotation, originalInReplyTo, originalReplyType }) => {
    annotation.InReplyTo = originalInReplyTo;
    annotation.ReplyType = originalReplyType;
  });
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
export const extractXFDF = async (
  annotationManager,
  pagesToPrint,
  includeAnnotations,
  options = {},
) => {
  const {
    flattenGroupedAnnotationRepliesForComments = false,
    includeComments = false,
  } = options;

  if (includeAnnotations) {
    await ensureAnnotationsLoaded(annotationManager);

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
    const exportOptions = { widgets: true, links: true, fields: true, generateInlineAppearances: true };
    const annotationList = getGroupedAnnotationsForPages(
      annotationManager,
      pagesToPrint,
      { includeComments },
    );
    const groupedReplyMetadata = flattenGroupedAnnotationRepliesForComments
      ? flattenRepliesForCommentsExport(annotationManager, annotationList)
      : [];

    try {
      return await annotationManager.exportAnnotations({ ...exportOptions, annotationList });
    } finally {
      restoreGroupedRepliesAfterExport(groupedReplyMetadata);
      // Later, we restore the original setting
      customAnnotationTypes.forEach((type) => {
        type.customType.SerializationType = type.originalSerializationMode;
      });
    }
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
  return extension === 'webviewerServer' && bbURLPromise;
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
 * @param {object} core Core object
 * @param {window.Core.Document} document Document object
 * @returns {window.Core.Document} Document object cropped to the current view
 * @ignore
 */
const cropDocumentToCurrentView = async (core, document) => {
  const docViewer = core.getDocumentViewer();
  const currentPageNumber = docViewer.getCurrentPage();
  const numPages = document.getPageCount();

  // Crop Pages to Current View Rect for printing
  const renderRect = getCurrentViewRect(core, currentPageNumber);
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
 * @param {object} core Core object
 * @param {window.Core.Document} document document to print
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @ignore
 * @returns {Promise<window.Core.Document>}
 */
export const processStandardDocument = async (core, document, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  await ensurePDFNetInitialized(document, printingOptions.isGrayscale);
  const documentWithColorAnnotations = await applyPrintOptions(
    core,
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
 * @param {object} core Core object
 * @param {window.Core.Document} document document to print
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @ignore
 * @returns {Promise<window.Core.Document>}
 */
export const processColorAnnotations = async (core, document, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  await ensurePDFNetInitialized(document, printingOptions.isGrayscale);
  const grayscaleDoc = printingOptions.isGrayscale
    ? await convertToGrayscaleDocument(modifiedDoc)
    : modifiedDoc;

  return applyPrintOptions(
    core,
    grayscaleDoc,
    xfdfString,
    printingOptions,
    pagesToPrint
  );
};

/**
 * Ensures that PDFNet is initialized if needed.
 * @param {window.Core.Document} document document to check
 * @param {boolean} isGrayScale whether grayscale is needed
 * @returns {Promise<void>}
 * @ignore
 * @remarks
 * `forceClientSideInit` determines whether to initialize PDFNet on the client side.
 * `forceClientSideInit: false` never calls PDFNet.initialize(), which is required to
 * convertToGrayscale.
 */
const ensurePDFNetInitialized = async (document, isGrayScale) => {
  const isForceClientSideInit = useWebViewerServerDocument(document) && document.isWebViewerServerDocument();
  const { PDFNet } = window.Core;
  if (isGrayScale && isForceClientSideInit) {
    await PDFNet.initialize();
  }
};

/**
 * Applies annotations, currentView and generates comments page.
 * @param {object} core Core object
 * @param {window.Core.Document} modifiedDoc document prepped for printing
 * @param {string} xfdfString string of xfdf data
 * @param {object} printingOptions object with printing options
 * @param {number[]} pagesToPrint array of page numbers to print
 * @returns {Promise<window.Core.Document>} document with applied print options
 * @ignore
 */
export const applyPrintOptions = async (core, modifiedDoc, xfdfString, printingOptions, pagesToPrint) => {
  let processedDoc = await extractPages(
    modifiedDoc,
    pagesToPrint,
    xfdfString,
  );

  if (printingOptions.isCurrentView) {
    processedDoc = await createCropDocument(core, processedDoc);
  }

  return formatFinalDocument(processedDoc, printingOptions);
};