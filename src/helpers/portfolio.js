import { saveAs } from 'file-saver';
import { getEmbeddedFileData, getFileAttachments } from './getFileAttachments';
import core from 'core';

const extensionRegExp = /(?:\.([^.?]+))?$/;

const getExtension = (filename) => extensionRegExp.exec(filename)[1] || '';

const getFileNameWithoutExtension = (filename) => {
  const extension = getExtension(filename);
  if (extension === '') {
    return filename;
  }
  return filename.slice(0, -(extension.length + 1));
};

const adobeOrderKey = 'adobe:Order';

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
  await ci.putNumber(adobeOrderKey, order);
  await fs.put('CI', ci);

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

  for (const [index, file] of files.entries()) {
    await addFile(pdfDoc, file, index);
  }
  await addCoverPage(pdfDoc);
  await addCollection(pdfDoc);

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
  const ciValue = await (await filesIteratorValue.get('CI')).value();
  await ciValue.putNumber(adobeOrderKey, newOrder);
};