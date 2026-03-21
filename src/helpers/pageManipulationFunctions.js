import extractPagesWithAnnotations from 'helpers/extractPagesWithAnnotations';
import core from 'core';
import { saveAs } from 'file-saver';
import actions from 'actions';
import i18next from 'i18next';
import { workerTypes } from 'constants/types';
import { redactionTypeMap } from 'constants/redactionTypes';
import DataElements from 'constants/dataElement';
import { createAnnouncement } from './accessibility';

const getNewRotation = (curr, counterClockwise = false) => {
  const { E_0, E_90, E_180, E_270 } = window.Core.PageRotation;
  switch (curr) {
    case E_270:
      return counterClockwise ? E_180 : E_0;
    case E_180:
      return counterClockwise ? E_90 : E_270;
    case E_90:
      return counterClockwise ? E_0 : E_180;
    default:
      return counterClockwise ? E_270 : E_90;
  }
};

const canRotateLoadedDocument = (documentViewerKey = 1) => {
  const doc = core.getDocument(documentViewerKey);
  const docType = doc?.type;

  return (
    workerTypes.PDF === docType ||
    workerTypes.IMAGE === docType ||
    (docType === workerTypes.WEBVIEWER_SERVER && !doc.isWebViewerServerDocument())
  );
};

const rotatePages = (pageNumbers, counterClockwise, documentViewerKey = 1) => {
  if (canRotateLoadedDocument(documentViewerKey)) {
    const rotation = counterClockwise ? window.Core.PageRotation.E_270 : window.Core.PageRotation.E_90;
    core.rotatePages(pageNumbers, rotation, documentViewerKey);
  } else {
    const docViewer = core.getDocumentViewer(documentViewerKey);
    const currentRotations = docViewer.getPageRotations();
    for (const page of pageNumbers) {
      docViewer.setRotation(getNewRotation(currentRotations[page], counterClockwise), page);
    }
  }
};

const rotateClockwise = (pageNumbers, documentViewerKey = 1) => {
  rotatePages(pageNumbers, false, documentViewerKey);
  createAnnouncement(`${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.rotatedClockwise')} ${i18next.t('action.rotationIs')} ${(core.getDocument(documentViewerKey).getPageRotation(core.getCurrentPage(documentViewerKey)) + 90) % 360} degrees`);
};

const rotateCounterClockwise = (pageNumbers, documentViewerKey = 1) => {
  rotatePages(pageNumbers, true, documentViewerKey);
  createAnnouncement(`${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.rotatedCounterClockwise')} ${i18next.t('action.rotationIs')} ${(core.getDocument(documentViewerKey).getPageRotation(core.getCurrentPage(documentViewerKey)) + 270) % 360} degrees`);
};

const insertAbove = (pageNumbers, width, height, documentViewerKey = 1) => {
  core.insertBlankPages(pageNumbers, width, height, documentViewerKey);
};

const insertBelow = (pageNumbers, width, height, documentViewerKey = 1) => {
  core.insertBlankPages(pageNumbers.map((i) => i + 1), width, height, documentViewerKey);
};

const replace = (dispatch) => {
  dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
  dispatch(actions.openElement('pageReplacementModal'));
};

const extractPages = (pageNumbers, dispatch, documentViewerKey = 1) => {
  const message = i18next.t('warning.extractPage.message');
  const title = i18next.t('warning.extractPage.title');
  const confirmBtnText = i18next.t('warning.extractPage.confirmBtn');
  const secondaryBtnText = i18next.t('warning.extractPage.secondaryBtn');
  const extractAnnouncement = `${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.extracted')}`;
  const deleteAnnouncement = `${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.deleted')}`;

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: () => extractPagesWithAnnotations(pageNumbers, documentViewerKey).then((file) => {
      saveAs(file, 'extractedDocument.pdf');
      createAnnouncement(extractAnnouncement + deleteAnnouncement);
    }),
    secondaryBtnText,
    onSecondary: () => {
      extractPagesWithAnnotations(pageNumbers, documentViewerKey).then((file) => {
        saveAs(file, 'extractedDocument.pdf');
        core.removePages(pageNumbers, documentViewerKey).then(() => {
          dispatch(actions.setSelectedPageThumbnails([]));
        });
        createAnnouncement(extractAnnouncement);
      });
    },
  };

  dispatch(actions.showWarningMessage(warning));
};

const deletePages = (pageNumbers, dispatch, isModalEnabled = true, documentViewerKey = 1) => {
  const deleteAnnouncement = `${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.deleted')}`;
  if (isModalEnabled) {
    let message = i18next.t('warning.deletePage.deleteMessage');
    const title = i18next.t('warning.deletePage.deleteTitle');
    const confirmBtnText = i18next.t('action.ok');

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => core.removePages(pageNumbers, documentViewerKey).then(() => {
        dispatch(actions.setSelectedPageThumbnails([]));
        dispatch(actions.setShiftKeyThumbnailsPivotIndex());
        createAnnouncement(deleteAnnouncement);
      }),
    };

    if (core.getDocumentViewer(documentViewerKey).getPageCount() === pageNumbers.length) {
      message = i18next.t('warning.deletePage.deleteLastPageMessage');

      warning = {
        message,
        title,
        confirmBtnText,
        onConfirm: () => Promise.resolve(),
      };
    }

    dispatch(actions.showWarningMessage(warning));
  } else {
    core.removePages(pageNumbers, documentViewerKey).then(() => {
      dispatch(actions.setSelectedPageThumbnails([]));
      dispatch(actions.setShiftKeyThumbnailsPivotIndex());
      createAnnouncement(deleteAnnouncement);
    });
  }
};

const movePagesToBottom = (pageNumbers, documentViewerKey = 1) => {
  core.movePages(pageNumbers, core.getTotalPages(documentViewerKey) + 1, documentViewerKey);
  createAnnouncement(`${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.movedToBottomOfDocument')}`);
};

const movePagesToTop = (pageNumbers, documentViewerKey = 1) => {
  core.movePages(pageNumbers, 0, documentViewerKey);
  createAnnouncement(`${i18next.t('action.page')} ${pageNumbers} ${i18next.t('action.movedToTopofDocument')}`);
};

const noPagesSelectedWarning = (pageNumbers, dispatch) => {
  if (pageNumbers.length === 0) {
    const title = i18next.t('warning.selectPage.selectTitle');
    const message = i18next.t('warning.selectPage.selectMessage');
    const confirmBtnText = i18next.t('action.ok');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => Promise.resolve(),
      keepOpen: ['leftPanel'],
    };

    dispatch(actions.showWarningMessage(warning));
    return true;
  }
  return false;
};

const exitPageInsertionWarning = (closeModal, dispatch) => {
  const title = i18next.t('insertPageModal.warning.title');
  const message = i18next.t('insertPageModal.warning.message');
  const confirmBtnText = i18next.t('action.ok');

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: closeModal,
    keepOpen: ['leftPanel'],
  };

  dispatch(actions.showWarningMessage(warning));
};

const exitPageReplacementWarning = (closeModal, dispatch) => {
  const title = i18next.t('option.pageReplacementModal.warning.title');
  const message = i18next.t('option.pageReplacementModal.warning.message');
  const confirmBtnText = i18next.t('action.ok');

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: closeModal,
    keepOpen: ['leftPanel'],
  };

  dispatch(actions.showWarningMessage(warning));
};

const redactPages = (pageNumbers, redactionStyles, documentViewerKey = 1) => {
  core.applyRedactions(createPageRedactions(pageNumbers, redactionStyles, documentViewerKey), documentViewerKey);
};

const createPageRedactions = (pageNumbers, redactionStyles, documentViewerKey = 1) => {
  const annots = [];
  const document = core.getDocument(documentViewerKey);
  for (const page of pageNumbers) {
    const pageInfo = document.getPageInfo(page);
    const pageRotation = document.getPageRotation(page);
    if (pageInfo) {
      let width;
      let height;
      if (pageRotation === 90 || pageRotation === 270) {
        width = pageInfo.height;
        height = pageInfo.width;
      } else {
        width = pageInfo.width;
        height = pageInfo.height;
      }
      const redaction = new window.Core.Annotations.RedactionAnnotation({
        PageNumber: page,
        Rect: new window.Core.Annotations.Rect(0, 0, width, height),
        ...redactionStyles
      });
      redaction.type = redactionTypeMap['FULL_PAGE'];
      redaction.setCustomData('trn-redaction-type', redactionTypeMap['FULL_PAGE']);
      redaction.Author = core.getCurrentUser();
      annots.push(redaction);
    }
  }
  const annotationManager = core.getAnnotationManager(documentViewerKey);
  annotationManager.addAnnotations(annots);
  annotationManager.drawAnnotationsFromList(annots);
  return annots;
};

const replacePages = async (sourceDocument, pagesToRemove, pagesToReplaceIntoDocument, documentViewerKey = 1) => {
  const documentLoadedInViewer = core.getDocument(documentViewerKey);
  const pageCountOfLoadedDocument = documentLoadedInViewer.getPageCount();
  const pagesToRemoveFromOriginal = pagesToRemove.sort((a, b) => a - b);

  // If document to replace into has only one page, or we are replacing all pages
  // then we can insert pages at the end, and then remove the pages to avoid an error of removing all pages
  if (pageCountOfLoadedDocument === 1 || pagesToRemoveFromOriginal.length === pageCountOfLoadedDocument) {
    await documentLoadedInViewer.insertPages(sourceDocument, pagesToReplaceIntoDocument);
    await documentLoadedInViewer.removePages(pagesToRemoveFromOriginal);
  } else {
    // If document to replace into has > 1 page we need insert the new pages at the spot of the first removed page
    // pagesToRemoveFromOriginal is sorted in ascending order. Interleaving pages would be complex.
    await documentLoadedInViewer.removePages(pagesToRemoveFromOriginal);
    await documentLoadedInViewer.insertPages(sourceDocument, pagesToReplaceIntoDocument, pagesToRemoveFromOriginal[0]);
  }
};

const insertPages = async (sourceDocument, pagesToInsert, insertBeforeThisPage = null, documentViewerKey = 1) => {
  const documentLoadedInViewer = core.getDocument(documentViewerKey);
  await documentLoadedInViewer.insertPages(sourceDocument, pagesToInsert, insertBeforeThisPage);
};

export {
  rotateClockwise,
  rotateCounterClockwise,
  insertAbove,
  insertBelow,
  replace,
  extractPages,
  deletePages,
  movePagesToBottom,
  movePagesToTop,
  noPagesSelectedWarning,
  redactPages,
  createPageRedactions,
  replacePages,
  insertPages,
  exitPageInsertionWarning,
  exitPageReplacementWarning
};