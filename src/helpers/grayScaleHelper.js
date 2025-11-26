let grayscaleDarknessFactor = 1;

export const setGrayscaleDarknessFactor = (factor) => {
  grayscaleDarknessFactor = factor;
};

export const getGrayscaleDarknessFactor = () => grayscaleDarknessFactor;

/**
 * Convert a PDF document to grayscale.
 * @param {window.Core.Document} pdfDocument document to convert
 * @returns {Promise<window.Core.Document>} the grayscale document
 * @ignore
 */
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