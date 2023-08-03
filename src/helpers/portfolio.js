const addFile = async (pdfDoc, file) => {
  const PDFNet = window.Core.PDFNet;

  // Create FileSpec dict
  const fs = await pdfDoc.createIndirectDict();
  fs.putName('Type', 'Filespec');
  fs.putString('F', file.name);
  fs.putText('UF', file.name);

  // Create EmbeddedFile dict
  const ef = await fs.putDict('EF');
  const flateFilter = await PDFNet.Filter.createFlateEncode();
  const embeddedStream = await pdfDoc.createIndirectStream(await file.arrayBuffer(), flateFilter);
  ef.put('F', embeddedStream);

  // Add file attachment
  const fileSpec = await PDFNet.FileSpec.createFromObj(fs);
  await pdfDoc.addFileAttachment(file.name, fileSpec);
};

const addCoverPage = async (pdfDoc) => {
  const PDFNet = window.Core.PDFNet;

  // Here we dynamically generate cover page (please see ElementBuilder
  // sample for more extensive coverage of PDF creation API).
  const page = await pdfDoc.pageCreate(await PDFNet.Rect.init(0, 0, 200, 200));

  const b = await PDFNet.ElementBuilder.create();
  const w = await PDFNet.ElementWriter.create();
  w.beginOnPage(page);
  const font = await PDFNet.Font.create(pdfDoc, PDFNet.Font.StandardType1Font.e_helvetica);
  w.writeElement(await b.createTextBeginWithFont(font, 12));
  const e = await b.createNewTextRun('My PDF Portfolio');
  e.setTextMatrixEntries(1, 0, 0, 1, 50, 96);
  const gstate = await e.getGState();
  gstate.setFillColorSpace(await PDFNet.ColorSpace.createDeviceRGB());
  gstate.setFillColorWithColorPt(await PDFNet.ColorPt.init(1, 0, 0));
  w.writeElement(e);
  w.writeElement(await b.createTextEnd());
  w.end();

  pdfDoc.pagePushBack(page);
};

const addCollection = async (pdfDoc) => {
  const root = await pdfDoc.getRoot();
  let collection = await root.findObj('Collection');
  if (!collection) {
    collection = await root.putDict('Collection');
  }

  // You could here manipulate any entry in the Collection dictionary.
  // For example, the following line sets the tile mode for initial view mode
  // Please refer to section '2.3.5 Collections' in PDF Reference for details.
  collection.putName('View', 'T');
};

export const createPortfolio = async (files) => {
  const PDFNet = window.Core.PDFNet;
  await PDFNet.initialize();

  const pdfDoc = await PDFNet.PDFDoc.create();

  for (const file of files) {
    await addFile(pdfDoc, file);
  }
  await addCoverPage(pdfDoc);
  await addCollection(pdfDoc);

  return pdfDoc;
};
