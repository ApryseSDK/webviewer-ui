export async function toggleAnnotationsVisibility(layers, core) {
  const layersMap = {};
  layers.forEach((layer) => {
    layersMap[layer.obj] = layer;
  });

  const annotationManager = core.getAnnotationManager();
  const doc = await core.getDocument().getPDFDoc();
  const rawAnnotationObjects = [];
  let pageNum = 0;
  const itr = await doc.getPageIterator();
  for (itr; (await itr.hasNext()); (await itr.next())) {
    pageNum += 1;
    const page = await itr.current();
    const numAnnots = await page.getNumAnnots();
    for (let i = 0; i < numAnnots; ++i) {
      const annot = await page.getAnnot(i);
      if (!(await annot.isValid())) {
        continue;
      }
      rawAnnotationObjects.push(annot);
    }
  }

  rawAnnotationObjects.forEach(async (rawAnnotation) => {
    const optionalContent = await rawAnnotation.getOptionalContent();
    if (optionalContent) {
      const optionalContentDictIterator = await optionalContent.getDictIterator();
      const optionalContentGroup = await optionalContentDictIterator.value();
      const optionalContentGroupID = optionalContentGroup.id;
      const annotSDF = await rawAnnotation.getSDFObj();
      const isNMKeyValid = await annotSDF.findObj('NM');
      if (isNMKeyValid) {
        const NMInfoDict = await annotSDF.get('NM');
        const NMInfoObject = await NMInfoDict.value();
        const idString = await NMInfoObject.getAsPDFText();
        const annotation = annotationManager.getAnnotationById(idString);
        // This condition is needed to handle the corener case where annotation is deleted but the doc isn't saved yet.
        if (annotation) {
          annotation.Hidden = !layersMap[optionalContentGroupID].visible;
        }
      } else {
        // corner case where the raw annotation doesn't have id
        const annotSDF = await rawAnnotation.getSDFObj();
        const subType = await annotSDF.get('Subtype');
        const subTypeObject = await subType.value();
        const rawAnnotType = await subTypeObject.getName();
        const rawAnnotPDFCoord = await rawAnnotation.getRect();
        const page = await rawAnnotation.getPage();
        const rawAnnotPageNumber = await page.getIndex();

        const viewerCoordsX1Y1 = await core.getDocument().getViewerCoordinates(pageNum, rawAnnotPDFCoord.x1, rawAnnotPDFCoord.y1);
        const viewerCoordsX2Y2 = await core.getDocument().getViewerCoordinates(pageNum, rawAnnotPDFCoord.x2, rawAnnotPDFCoord.y2);
        const annotationsOnPage = annotationManager.getAnnotationsList().filter((annot) => annot.PageNumber === rawAnnotPageNumber);
        annotationsOnPage.forEach((annotation) => {
          const rect = annotation.getRect();
          const rectFromRawAnnotation = new window.Core.Math.Rect(
            Math.min(viewerCoordsX1Y1.x, viewerCoordsX2Y2.x),
            Math.min(viewerCoordsX1Y1.y, viewerCoordsX2Y2.y),
            Math.max(viewerCoordsX1Y1.x, viewerCoordsX2Y2.x),
            Math.max(viewerCoordsX1Y1.y, viewerCoordsX2Y2.y),
          );
          const positionMatched = rect.equalTo(rectFromRawAnnotation);
          const typeMatched = rawAnnotType.toLowerCase() === annotation.elementName;
          if (positionMatched && typeMatched) {
            const layer = layersMap[optionalContentGroupID] || layersMap[optionalContent.id];
            annotation.Hidden = !layer?.visible;
          }
        });
      }
    }
  });
}