import core from 'core';

export async function toggleAnnotationsVisibility(layers) {
  const layerMap = getLayerMapping(layers);
  const pdfNetAnnotations = await getPDFNetAnnotations(await core.getDocument().getPDFDoc());
  pdfNetAnnotations.forEach((pdfNetAnnotation) => {
    toggleAnnotationVisibility(pdfNetAnnotation, layerMap);
  });
}

/**
 * @ignore
 * Toggles the WebViewer annotation visibility based on its attached Optional Content (OC entry).
 * The OC entry is structured either as an OCG or OCMD.
 * @param {Core.PDFNet.Annot} pdfNetAnnotation The PDFNet annotation.
 * @param {object} layerMap An object mapping layer IDs to visibility properties and potential child nodes.
 */
async function toggleAnnotationVisibility(pdfNetAnnotation, layerMap) {
  const optionalContent = await pdfNetAnnotation.getOptionalContent();
  if (!optionalContent) {
    return;
  }

  const isOCGAnnotation = !!layerMap[optionalContent.id];
  if (isOCGAnnotation) {
    await handleOCGAnnotations(pdfNetAnnotation, layerMap, optionalContent);
    return;
  }

  await handleOCMDAnnotations(pdfNetAnnotation, layerMap, optionalContent);
}

/**
 * @ignore
 * Finds the matching WebViewer annotation and then updates its visibility based on the provided OCG visibility state.
 * @param {Core.PDFNet.Annot} pdfNetAnnotation The PDFNet annotation containing the OC entry.
 * @param {object} layerMap An object mapping layer IDs to visibility properties and potential child nodes.
 * @param {Core.PDFNet.Obj} optionalContent Reference to optional content object associated with an annotation. In this context it is an OCG.
 */
async function handleOCGAnnotations(pdfNetAnnotation, layerMap, optionalContent) {
  const annotationManager = core.getAnnotationManager();
  const annotation = await findMatchingWebViewerAnnotation(pdfNetAnnotation, annotationManager);
  if (annotation) {
    annotation.Hidden = !layerMap[optionalContent.id].visible;
    return;
  }

  await handleAnnotationVisibilityEdgeCase(pdfNetAnnotation, layerMap[optionalContent.id]);
}

/**
 * @ignore
 * Finds the matching WebViewer annotation and then updates its visibility based on the provided OCMD visibility state.
 * @param {Core.PDFNet.Annot} pdfNetAnnotation The PDFNet annotation containing the OC entry.
 * @param {object} layerMap An object mapping layer IDs to visibility properties and potential child nodes.
 * @param {Core.PDFNet.Obj} optionalContent Reference to optional content object associated with an annotation. In this context it is an OCMD.
 */
async function handleOCMDAnnotations(pdfNetAnnotation, layerMap, optionalContent) {
  const ocmdLayerId = await getOCMDLayerId(optionalContent);
  const annotationManager = core.getAnnotationManager();
  const annotation = await findMatchingWebViewerAnnotation(pdfNetAnnotation, annotationManager);
  if (annotation) {
    annotation.Hidden = !layerMap[ocmdLayerId].visible;
    return;
  }

  await handleAnnotationVisibilityEdgeCase(pdfNetAnnotation, layerMap[ocmdLayerId]);
}

/**
 * @ignore
 * There is an edge case where PDFNet annotations do not have a matching WebViewer annotation ID.
 * This function handles the edge case by iterating through WebViewer annotations and comparing its type and position to the PDFNet annotation.
 * @param {Core.PDFNet.Annot} pdfNetAnnotation The PDFNet annotation containing the OC entry.
 * @param {Core.Document.LayerContext} layer Object representing the layer attached to the PDFNet annotation.
 */
async function handleAnnotationVisibilityEdgeCase(pdfNetAnnotation, layer) {
  const annotationManager = core.getAnnotationManager();
  const { pageNum, annotationViewerCoordinates, annotationType } = await getAnnotationDetails(pdfNetAnnotation);
  const annotationsOnPage = await getAnnotationsOnPage(annotationManager, pageNum);
  annotationsOnPage.forEach((annotation) => {
    if (compareWebviewerPDFNetAnnotation(annotation, annotationType, annotationViewerCoordinates)) {
      annotation.Hidden = !layer.visible;
    }
  });
}

/**
 * @ignore
 * Finds the corresponding WebViewer annotation from a given PDFNet annotation.
 * @param {Core.PDFNet.Annot} pdfNetAnnotation The PDFNet annotation.
 * @param {Core.AnnotationManager} annotationManager An instance of annotationManager.
 * @returns {Core.Annotations.Annotation} Returns the WebViewer annotation matching the provided PDFNet annotation. Null otherwise.
 */
async function findMatchingWebViewerAnnotation(pdfNetAnnotation, annotationManager) {
  const annotSDF = await pdfNetAnnotation.getSDFObj();
  const isNMKeyValid = await annotSDF.findObj('NM');
  if (isNMKeyValid) {
    const NMInfoDict = await annotSDF.get('NM');
    const NMInfoObject = await NMInfoDict.value();
    const idString = await NMInfoObject.getAsPDFText();
    return annotationManager.getAnnotationById(idString);
  }

  return null;
}

/**
 * @ignore
 * Determines if there is a WebViewer annotation that matches a PDFNet annotation.
 * This method compares annotation types along with position (in viewer coordinates). If both are equal
 * we can assume the annotations match.
 * @param {Core.Annotations.Annotation} annotation The WebViewer annotation.
 * @param {string} pdfNetAnnotationType The PDFNet annotation type (rectangle, ellipse, etc).
 * @param {object} pdfNetAnnotationViewerCoords The position of PDFNet annotation in viewer coordinate space.
 * @returns {boolean} Returns true if a match was found. False otherwise.
 */
function compareWebviewerPDFNetAnnotation(annotation, pdfNetAnnotationType, pdfNetAnnotationViewerCoords) {
  const rectFromPDFNetAnnotation = createRectFromPDFNetAnnotation(pdfNetAnnotationViewerCoords);
  const positionMatched = annotation.getRect().equalTo(rectFromPDFNetAnnotation);
  const typeMatched = pdfNetAnnotationType.toLowerCase() === annotation.elementName;

  return positionMatched && typeMatched;
}

/**
 * @ignore
 * Gets the layer id associated with the provided OCMD (Optional Content Membership Dictionary).
 * NOTE: This implementation assumes only one layer is associated with the OCMD. The PDF spec allows multiple layers (OCGs) to be attached.
 * @param {Core.PDFNet.Obj} optionalContent Reference to optional content object associated with an annotation. In this context it is an OCMD.
 * @returns {string} Returns the layer id associated with the given OCMD.
 */
async function getOCMDLayerId(optionalContent) {
  const optionalContentDictIterator = await optionalContent.getDictIterator();
  const optionalContentGroup = await optionalContentDictIterator.value();
  return optionalContentGroup.id;
}

/**
 * @ignore
 * Returns all PDFNet annotations from a PDFNet document.
 * @param {Core.PDFNet.PDFDoc} pdfDoc The active PDFNet document.
 * @returns {Core.PDFNet.Annot[]}
 */
async function getPDFNetAnnotations(pdfDoc) {
  const pdfNetAnnotations = [];
  const itr = await pdfDoc.getPageIterator();
  for (itr; (await itr.hasNext()); (await itr.next())) {
    const page = await itr.current();
    const numAnnots = await page.getNumAnnots();
    for (let i = 0; i < numAnnots; ++i) {
      const annot = await page.getAnnot(i);
      if (!(await annot.isValid())) {
        continue;
      }
      pdfNetAnnotations.push(annot);
    }
  }

  return pdfNetAnnotations;
}

/**
 * @ignore
 * Gets PDFNet annotation type, page number, and converted rect in viewer coordinate space.
 * @param {number} pageNum The page number where the PDFNet annotation exists.
 * @param {Core.Math.Rect} pdfNetRect The bounding box of a PDFNet annotation.
 * @returns {object} Returns an object containing PDFNet annotation type, page number,
 * and Math.Rect of annotation position in viewer coordinate space.
 */
async function getAnnotationDetails(pdfNetAnnotation) {
  const annotSDF = await pdfNetAnnotation.getSDFObj();
  const subType = await annotSDF.get('Subtype');
  const subTypeObject = await subType.value();
  const annotationType = await subTypeObject.getName();

  const page = await pdfNetAnnotation.getPage();
  const pageNum = await page.getIndex();

  const annotationViewerCoordinates = await getViewerCoordinates(pageNum, await pdfNetAnnotation.getRect());

  return { annotationType, annotationViewerCoordinates, pageNum };
}

/**
 * @ignore
 * Gets the top-left and bottom-right position of a PDFNet annotation in viewer coordinates.
 * We need to convert the PDFNet rect to viewer coordinates so we can compare against WebViewer annotation rect.
 * @param {number} pageNum The page number where the PDFNet annotation exists.
 * @param {Core.Math.Rect} pdfNetRect The bounding box of a PDFNet annotation.
 */
async function getViewerCoordinates(pageNum, pdfNetRect) {
  const x1y1 = await core.getDocument().getViewerCoordinates(pageNum, pdfNetRect.x1, pdfNetRect.y1);
  const x2y2 = await core.getDocument().getViewerCoordinates(pageNum, pdfNetRect.x2, pdfNetRect.y2);
  return { x1y1, x2y2 };
}

/**
 * @ignore
 * Helper function that creates a Core.Math.Rect from the viewer coordinates of the PDFNet annotation.
 * @param {object} viewerCoords A reference to the exposed Core APIs available on WebViewer UI.
 * @returns {Core.Math.Rect} Returns the rect of a PDFNet annotation position, in viewer coordinates.
 */
function createRectFromPDFNetAnnotation(viewerCoords) {
  return new window.Core.Math.Rect(
    Math.min(viewerCoords.x1y1.x, viewerCoords.x2y2.x),
    Math.min(viewerCoords.x1y1.y, viewerCoords.x2y2.y),
    Math.max(viewerCoords.x1y1.x, viewerCoords.x2y2.x),
    Math.max(viewerCoords.x1y1.y, viewerCoords.x2y2.y)
  );
}

function getLayerMapping(layers) {
  const layersMap = {};

  layers.forEach((layer) => {
    layersMap[layer.obj] = layer;
  });

  return layersMap;
}

function getAnnotationsOnPage(annotationManager, pageNum) {
  return annotationManager.getAnnotationsList().filter((annot) => annot.PageNumber === pageNum);
}