import core from 'core';
import { saveAs } from 'file-saver';
import { getEmbeddedFileData, getFileAttachments } from './getFileAttachments';

const extensionRegExp = /(?:\.([^.?]+))?$/;

const getExtension = (filename) => extensionRegExp.exec(filename)[1] || '';

const getFileNameWithoutExtension = (filename) => {
  const extension = getExtension(filename);
  if (extension === '') {
    return filename;
  }
  return filename.slice(0, -(extension.length + 1));
};

export const PORTFOLIO_CONSTANTS = {
  COLLECTION: 'Collection',
  FILE_NAME: 'FileName',
  ADOBE_ORDER: 'adobe:Order',
  CI: 'CI',
  REORDER: 'Reorder',
  SORT: 'Sort',
  SCHEMA: 'Schema',
  SUBTYPE: 'Subtype',
};

export const isOpenableFile = (extension) => {
  return window.Core.SupportedFileFormats.CLIENT.includes(extension);
};

export const hasChildren = (portfolioItem) => {
  return portfolioItem?.children?.length > 0;
};

const getNextLargestValue = (files) => {
  // TODO: will need to also get order values from folders
  return Math.max(...files.map((a) => a.order)) + 1;
};

export const getPortfolioFiles = async () => {
  if (!core.isFullPDFEnabled()) {
    return [];
  }

  const { embeddedFiles } = await getFileAttachments();
  const unsortedPortfolioFiles = embeddedFiles.map(({ filename, fileObject, id, order }) => ({
    id,
    order,
    name: filename,
    nameWithoutExtension: getFileNameWithoutExtension(filename),
    extension: getExtension(filename),
    isFolder: false,
    getNestedLevel: () => 0,
    children: [],
    fileObject,
  }));

  return unsortedPortfolioFiles.sort((a, b) => a.order - b.order);
};

export const addFile = async (pdfDoc, file, order = undefined) => {
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

  if (order === undefined) {
    order = getNextLargestValue(await getPortfolioFiles());
  }

  // Add internal order
  const ci = await pdfDoc.createIndirectDict();
  await ci.putNumber(PORTFOLIO_CONSTANTS.ADOBE_ORDER, order);
  await fs.put(PORTFOLIO_CONSTANTS.CI, ci);

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
  const e = await b.createNewTextRun('PDF Portfolio');
  e.setTextMatrixEntries(1, 0, 0, 1, 70, 96);
  const gstate = await e.getGState();
  gstate.setFillColorSpace(await PDFNet.ColorSpace.createDeviceRGB());
  gstate.setFillColorWithColorPt(await PDFNet.ColorPt.init(0, 0, 0));
  w.writeElement(e);
  w.writeElement(await b.createTextEnd());
  w.end();

  pdfDoc.pagePushBack(page);
};

const addCollection = async (pdfDoc, defaultFile = '') => {
  const root = await pdfDoc.getRoot();
  let collection = await root.findObj(PORTFOLIO_CONSTANTS.COLLECTION);
  if (!collection) {
    collection = await pdfDoc.createIndirectDict();
  }

  // You could here manipulate any entry in the Collection dictionary.
  // For example, the following line sets the tile mode for initial view mode
  // Please refer to section '2.3.5 Collections' in PDF Reference for details.
  await collection.putName('View', 'T');

  // Add default file for viewing (if not set, the cover page will show)
  if (defaultFile) {
    await collection.putString('D', defaultFile);
  }

  // Add Reorder
  const reorder = await pdfDoc.createIndirectName(PORTFOLIO_CONSTANTS.REORDER);
  await reorder.setName(PORTFOLIO_CONSTANTS.ADOBE_ORDER);
  await collection.put(PORTFOLIO_CONSTANTS.REORDER, reorder);

  // Add Sort
  const sort = await collection.putDict(PORTFOLIO_CONSTANTS.SORT);
  const sArray = await sort.putArray('S');
  await sArray.insertName(0, PORTFOLIO_CONSTANTS.ADOBE_ORDER);
  await sArray.insertName(1, PORTFOLIO_CONSTANTS.FILE_NAME);

  // Add Schema
  const schema = await pdfDoc.createIndirectDict();

  const orderSchema = await pdfDoc.createIndirectDict();
  await orderSchema.putString('N', 'Order');
  await orderSchema.putNumber('O', 5);
  await orderSchema.putName(PORTFOLIO_CONSTANTS.SUBTYPE, 'N');

  const fileNameSchema = await pdfDoc.createIndirectDict();
  await fileNameSchema.putString('N', 'Name');
  await fileNameSchema.putBool('E', true);
  await fileNameSchema.putNumber('O', 0);
  await fileNameSchema.putName(PORTFOLIO_CONSTANTS.SUBTYPE, 'F');

  // There are other fields in Schema (AFRelationship, CompressedSize, CreationDate, Description, ModDate, Size) but looks like we don't really need them
  await schema.put(PORTFOLIO_CONSTANTS.ADOBE_ORDER, orderSchema);
  await schema.put(PORTFOLIO_CONSTANTS.FILE_NAME, fileNameSchema);
  await collection.put(PORTFOLIO_CONSTANTS.SCHEMA, schema);

  // Add collection to root as an indirect dict
  await root.put(PORTFOLIO_CONSTANTS.COLLECTION, collection);
};

export const createPortfolio = async (files) => {
  const PDFNet = window.Core.PDFNet;
  await PDFNet.initialize();

  const pdfDoc = await PDFNet.PDFDoc.create();

  let firstFileName = '';
  for (const [index, file] of files.entries()) {
    if (index === 0) {
      firstFileName = file.name;
    }
    await addFile(pdfDoc, file, index);
  }
  await addCoverPage(pdfDoc);
  await addCollection(pdfDoc, firstFileName);

  return pdfDoc;
};

const getPDFNetFiles = async () => {
  let files = null;
  if (core.isFullPDFEnabled()) {
    const PDFNet = window.Core.PDFNet;
    let doc = core.getDocument();
    if (doc) {
      doc = await doc.getPDFDoc();
    }
    // doc will be undefined for non-pdf files
    if (doc) {
      await PDFNet.runWithCleanup(async () => {
        files = await PDFNet.NameTree.find(doc, 'EmbeddedFiles');
      });
    }
    if (files && (await files.isValid())) {
      return files;
    }
  }
  return null;
};

export const findPDFNetPortfolioItem = async (id) => {
  let target = null;
  const files = await getPDFNetFiles();
  if (!files) {
    return;
  }

  // Traverse the list of embedded files.
  const fileItr = await files.getIteratorBegin();
  while (await fileItr.hasNext()) {
    const filesIteratorKey = await fileItr.key();
    if (id === filesIteratorKey.id) {
      target = fileItr;
      break;
    }
    await fileItr.next();
  }

  return target;
};

export const renamePortfolioFile = async (id, newName) => {
  const target = await findPDFNetPortfolioItem(id);
  if (!target) {
    return;
  }
  const filesIteratorValue = await target.value();
  // filesIteratorKey.getAsPDFText() returns name with nested level if file is in folder: format "<0>name.pdf"
  await filesIteratorValue.putString('F', newName);
  await filesIteratorValue.putText('UF', newName);
};

export const deletePortfolioFile = async (id) => {
  const target = await findPDFNetPortfolioItem(id);
  const files = await getPDFNetFiles();
  if (!target || !files) {
    return;
  }
  await files.erase(target);
};

export const downloadPortfolioFile = async (portfolioItem) => {
  const { fileObject, name } = portfolioItem;
  try {
    const blob = await getEmbeddedFileData(fileObject);
    saveAs(blob, name);
  } catch (e) {
    console.warn(e);
  }
};

export const reorderPortfolioFile = async (id, newOrder) => {
  const target = await findPDFNetPortfolioItem(id);
  if (!target) {
    return;
  }
  const filesIteratorValue = await target.value();
  const ciValue = await (await filesIteratorValue.get(PORTFOLIO_CONSTANTS.CI)).value();
  await ciValue.putNumber(PORTFOLIO_CONSTANTS.ADOBE_ORDER, newOrder);
};