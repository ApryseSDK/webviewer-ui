import core from 'core';
import { saveAs } from 'file-saver';
import { PORTFOLIO_CONSTANTS } from './portfolio';

export async function getFileAttachments() {
  const attachments = {
    fileAttachmentAnnotations: [],
    embeddedFiles: [],
  };
  if (!core.isFullPDFEnabled()) {
    console.warn('Need fullAPI to be able to to view embedded files.');
  } else {
    const PDFNet = window.Core.PDFNet;
    let doc = core.getDocument();
    if (doc) {
      doc = await doc.getPDFDoc();
    }
    const main = async () => {
      const files = await PDFNet.NameTree.find(doc, 'EmbeddedFiles');
      if (files && (await files.isValid())) {
        // Traverse the list of embedded files.
        const fileItr = await files.getIteratorBegin();
        for (let counter = 0; await fileItr.hasNext(); await fileItr.next(), ++counter) {
          const filesIteratorValue = await fileItr.value();
          const filesIteratorKey = await fileItr.key();
          // filesIteratorKey.getAsPDFText() returns name with nested level if file is in folder: format "<0>name.pdf"
          const fileObject = await filesIteratorValue.get('F');
          const fileData = await fileObject.value();
          const filenameText = await fileData.getAsPDFText();
          const filename = filenameText.slice(filenameText.lastIndexOf('/') + 1);
          // Assume order is -1 for files without an order instead of getting the next largest value. Files will be displayed at the top of the list
          let order = -1;
          try {
            // After being created with Adobe, the nested files don’t have an internal order (the ones at root level will always have an internal order), so they won't always have 'CI'
            const ciValue = await (await filesIteratorValue.get(PORTFOLIO_CONSTANTS.CI)).value();
            const adobeOrderValue = await (await ciValue.get(PORTFOLIO_CONSTANTS.ADOBE_ORDER)).value();
            order = await adobeOrderValue.getNumber();
          } catch (e) {
            console.warn(e);
          }
          attachments.embeddedFiles.push({
            filename,
            id: filesIteratorKey.id,
            order,
            fileObject: filesIteratorValue
          });
        }
      }
    };

    // doc will be undefined for non-pdf files
    if (doc) {
      await PDFNet.runWithCleanup(main);
    }
  }
  const fileAttachmentAnnotations = core
    .getAnnotationsList()
    .filter((annot) => annot instanceof window.Core.Annotations.FileAttachmentAnnotation);

  // re-order fileAttachment annotations by page number
  fileAttachmentAnnotations.forEach((annot) => {
    if (!attachments.fileAttachmentAnnotations[annot.PageNumber]) {
      attachments.fileAttachmentAnnotations[annot.PageNumber] = [];
    }
    attachments.fileAttachmentAnnotations[annot.PageNumber].push(annot);
  });
  return attachments;
}

export async function getEmbeddedFileData(iterator) {
  const PDFNet = window.Core.PDFNet;
  const fileSpec = await PDFNet.FileSpec.createFromObj(iterator);
  const stm = await fileSpec.getFileData();
  const filterReader = await PDFNet.FilterReader.create(stm);
  const dataArray = [];
  const chunkLength = 1024;
  let retrievedLength = chunkLength;
  while (chunkLength === retrievedLength) {
    const bufferSubArray = await filterReader.read(chunkLength);
    retrievedLength = bufferSubArray.length;
    dataArray.push(bufferSubArray);
  }
  const buffer = new Uint8Array(dataArray.length * chunkLength + retrievedLength);
  for (let i = 0; i < dataArray.length; i++) {
    const offset = i * chunkLength;
    const currentArr = dataArray[i];
    buffer.set(currentArr, offset);
  }
  const blob = new Blob([buffer]);
  return blob;
}

// used for downloading portfolio files and attachment files
// there's an issue where these files can't be opened with Adobe
export const downloadFromEmbeddedFileData = async (iterator, name, extension) => {
  const blob = await getEmbeddedFileData(iterator);
  const document = await core.createDocument(blob, { extension });
  const data = await document.getFileData({
    downloadType: extension
  });
  const arr = new Uint8Array(data);
  // TODO: handle non-pdf files
  const downloadType = 'application/pdf';
  const file = new File([arr], name, { type: downloadType });
  saveAs(file, name);
};
