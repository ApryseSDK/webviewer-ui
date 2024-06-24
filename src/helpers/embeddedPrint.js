import getRootNode from './getRootNode';
import { isIOS, isSafari } from 'helpers/device';
import { getGrayscaleDarknessFactor } from 'helpers/printGrayscaleDarknessFactor';
import { getCurrentViewRect } from './printCurrentViewHelper';

import core from 'core';

export const iosWindowOpen = () => {
  return (isIOS && isSafari) ? window.open() : null;
};

const getRemovePagesArray = (currentPageNumber, numPages) => {
  const pagesToRemove = [];
  for (let i = 1; i <= numPages; i++) {
    if (i !== currentPageNumber) {
      pagesToRemove.push(i);
    }
  }
  return pagesToRemove;
};

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

// printingOptions: isCurrentView, includeAnnotations, shouldFlatten
export const createPages = async (document, annotManager, pagesToPrint, printingOptions) => {
  const extension = document.getType();
  const bbURLPromise = document.getPrintablePDF();
  let result;
  let data;
  const xfdf = await extractXFDF(annotManager, pagesToPrint, printingOptions?.includeAnnotations);

  if (extension === 'pdf' && !bbURLPromise) {
    data = await document.extractPages(pagesToPrint, xfdf);
    result = await window.Core.createDocument(data, { extension: 'pdf' });
  } else {
    const buff = await document.getFileData({ downloadType: 'pdf' });
    result = await window.Core.createDocument(buff, { extension: 'pdf' });

    data = await result.extractPages(pagesToPrint, xfdf);
    result = await window.Core.createDocument(data, { extension: 'pdf' });
  }

  if (printingOptions?.isCurrentView) {
    result = await cropDocumentToCurrentView(result);
  }

  if (printingOptions?.shouldFlatten) {
    result = await flattenDocument(result);
  }

  return result;
};

export const extractXFDF = async (annotManager, pagesToPrint, includeAnnotations) => {
  if (includeAnnotations) {
    const map = annotManager.getRegisteredAnnotationTypes();
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

    const annotationList = annotManager.getAnnotationsList().filter((annot) => pagesToPrint.indexOf(annot.PageNumber) > -1);
    const xfdfString = await annotManager.exportAnnotations({ annotationList });
    // Later, we restore the original setting
    customAnnotationTypes.forEach((type) => {
      type.customType.SerializationType = type.originalSerializationMode;
    });
    return xfdfString;
  }
  // removes annotations from document
  return '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"></xfdf>';
};

export const printPDF = (pdfDocument, windowRef) => {
  const printDocument = true;

  return pdfDocument.getFileData({ printDocument })
    .then((data) => {
      const arr = new Uint8Array(data);
      const blob = new Blob([arr], { type: 'application/pdf' });
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
    })
    .catch((error) => console.error('Print Error status: ', error));
};

export const convertToGrayscaleDocument = async (pdfDocument) => {
  const { PDFNet } = window.Core;
  const { PDFDoc, ElementBuilder, ElementWriter, ColorSpace, ColorPt, Matrix2D, GState } = PDFNet;

  const pdfDoc = await pdfDocument.getPDFDoc();

  pdfDoc.initSecurityHandler();

  // We create a new PDFDoc and copy over content in grayscale
  const newDoc = await PDFDoc.create();
  const itr = await pdfDoc.getPageIterator(1);

  for (itr; (await itr.hasNext()); (await itr.next())) {
    const page = await itr.current();
    const cropBox = await page.getCropBox();
    const mediaBox = await page.getMediaBox();
    const newPage = await newDoc.pageCreate(mediaBox);

    await newPage.setRotation(await page.getRotation());

    const elementBuilder = await ElementBuilder.create();
    const elementWriter = await ElementWriter.create();
    await elementWriter.beginOnPage(newPage, ElementWriter.WriteMode.e_overlay, false);
    const formElement = await elementBuilder.createFormFromDoc(page, newDoc);
    const xObj = await formElement.getXObject();
    await xObj.putRect('BBox', mediaBox.x1, mediaBox.y1, mediaBox.x2, mediaBox.y2);
    await xObj.putMatrix('Matrix', await Matrix2D.createIdentityMatrix());
    await elementWriter.writeElement(formElement);
    let element = await elementBuilder.createRect(mediaBox.x1, mediaBox.y1, await mediaBox.width(), await mediaBox.height());
    await element.setPathFill(true);
    let gState = await element.getGState();
    await gState.setFillColorSpace(await ColorSpace.createDeviceRGB());
    // white color in the grayscale result
    await gState.setFillColorWithColorPt(await ColorPt.init(1, 1, 1));
    await elementWriter.writeElement(element);
    await elementBuilder.reset();
    element = await elementBuilder.createRect(mediaBox.x1, mediaBox.y1, await mediaBox.width(), await mediaBox.height());
    await element.setPathFill(true);
    await element.setPathStroke(false);
    gState = await element.getGState();
    await gState.setBlendMode(GState.BlendMode.e_bl_darken);
    await gState.setFillColorSpace(await ColorSpace.createDeviceGray());
    // black color in the grayscale result
    await gState.setFillColorWithColorPt(await ColorPt.init(0.0));
    const softMask = await createLuminositySoftMask(newDoc, mediaBox, await Matrix2D.createIdentityMatrix(), xObj);
    await gState.setSoftMask(softMask);
    await elementWriter.writeElement(element);
    await elementWriter.end();
    await newPage.setCropBox(cropBox);
    await newDoc.pagePushBack(newPage);
  }

  return window.Core.createDocument(newDoc);
};

const createLuminositySoftMask = async (doc, boundingBox, matrix, xObj) => {
  await xObj.putRect('BBox', boundingBox.x1, boundingBox.y1, boundingBox.x2, boundingBox.y2);
  const group = await xObj.putDict('Group');
  await xObj.putMatrix('Matrix', matrix);
  await group.putName('S', 'Transparency');
  await group.putName('CS', 'DeviceGray');
  await group.putBool('I', true);
  const mask = await doc.createIndirectDict();
  await mask.putName('S', 'Luminosity');
  await mask.put('G', xObj);
  const bcArray = await mask.putArray('BC');
  await bcArray.pushBackNumber(1);
  const tr = await doc.createIndirectDict();
  await tr.putNumber('FunctionType', 2);
  // Input range for the luminosity function
  const array1 = await tr.putArray('Domain');
  await array1.pushBackNumber(0.0);
  await array1.pushBackNumber(1.0);
  // Output range for the luminosity function
  const array2 = await tr.putArray('Range');
  await array2.pushBackNumber(0);
  await array2.pushBackNumber(1);

  const grayscaleDarknessFactor = getGrayscaleDarknessFactor();

  // shape of the exponential curve
  // low numbers will make middle gray values lighter
  // high numbers will make middle gray values darker
  await tr.putNumber('N', grayscaleDarknessFactor);
  // Color at 0; 1 is full black
  const array3 = await tr.putArray('C0');
  await array3.pushBackNumber(1);
  // Color at 1; 0 is full white
  const array4 = await tr.putArray('C1');
  await array4.pushBackNumber(0);
  await mask.put('TR', tr);
  return mask;
};

const flattenDocument = async (document) => {
  const fileData = await document.getFileData({ flatten: true });
  const blob = new Blob([fileData], { type: 'application/pdf' });
  const flatDoc = await window.Core.createDocument(blob, { extension: 'pdf' });
  return flatDoc;
};
