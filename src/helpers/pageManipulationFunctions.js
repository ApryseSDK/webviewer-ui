import extractPagesWithAnnotations from 'helpers/extractPagesWithAnnotations';
import core from 'core';
import { saveAs } from 'file-saver';
import actions from 'actions';
import i18next from 'i18next';
import { workerTypes } from 'constants/types';
import { redactionTypeMap } from 'components/RedactionPageGroup/RedactionItem/RedactionItem';

const getNewRotation = (curr, counter_clockwise = false) => {
  const { e_0, e_90, e_180, e_270 } = window.Core.PageRotation;
  switch (curr) {
    case e_270:
      return counter_clockwise ? e_180 : e_0;
    case e_180:
      return counter_clockwise ? e_90 : e_270;
    case e_90:
      return counter_clockwise ? e_0 : e_180;
    default:
      return counter_clockwise ? e_270 : e_90;
  }
};

const canRotateLoadedDocument = () => {
  const doc = core.getDocument();
  const docType = doc?.type;
  return (
    workerTypes.PDF === docType ||
    (docType === workerTypes.WEBVIEWER_SERVER && !doc.isWebViewerServerDocument())
  );
};

const rotatePages = (pageNumbers, counter_clockwise) => {
  if (canRotateLoadedDocument()) {
    const rotation = counter_clockwise ? window.Core.PageRotation.e_270 : window.Core.PageRotation.e_90;
    pageNumbers.forEach(index => {
      core.rotatePages([index], rotation);
    });
  } else {
    const docViewer = core.getDocumentViewer();
    const currentRotations = docViewer.getPageRotations();
    for (const page of pageNumbers) {
      docViewer.setRotation(getNewRotation(currentRotations[page], counter_clockwise), page);
    }
  }
};

const rotateClockwise = pageNumbers => {
  rotatePages(pageNumbers, false);
};

const rotateCounterClockwise = pageNumbers => {
  rotatePages(pageNumbers, true);
};

const insertAbove = pageNumbers => {
  core.insertBlankPages(pageNumbers, core.getPageWidth(pageNumbers[0]), core.getPageHeight(pageNumbers[0]));
};

const insertBelow = pageNumbers => {
  core.insertBlankPages(pageNumbers.map(i => i + 1), core.getPageWidth(pageNumbers[0]), core.getPageHeight(pageNumbers[0]));
};

const replace = dispatch => {
  dispatch(actions.openElement('pageReplacementModal'));
};

const extractPages = (pageNumbers, dispatch) => {
  const message = i18next.t('warning.extractPage.message');
  const title = i18next.t('warning.extractPage.title');
  const confirmBtnText = i18next.t('warning.extractPage.confirmBtn');
  const secondaryBtnText = i18next.t('warning.extractPage.secondaryBtn');

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: () =>
      extractPagesWithAnnotations(pageNumbers).then(file => {
        saveAs(file, 'extractedDocument.pdf');
      }),
    secondaryBtnText,
    onSecondary: () => {
      extractPagesWithAnnotations(pageNumbers).then(file => {
        saveAs(file, 'extractedDocument.pdf');
        core.removePages(pageNumbers).then(() => {
          dispatch(actions.setSelectedPageThumbnails([]));
        });
      });
    },
  };

  dispatch(actions.showWarningMessage(warning));
};

const deletePages = (pageNumbers, dispatch, isModalEnabled = true) => {

  if (isModalEnabled) {
    let message = i18next.t('warning.deletePage.deleteMessage');
    const title = i18next.t('warning.deletePage.deleteTitle');
    const confirmBtnText = i18next.t('action.ok');

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () =>
        core.removePages(pageNumbers).then(() => {
          dispatch(actions.setSelectedPageThumbnails([]));
        }),
    };

    if (core.getDocumentViewer().getPageCount() === pageNumbers.length) {
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
    core.removePages(pageNumbers).then(() => {
      dispatch(actions.setSelectedPageThumbnails([]));
    });
  }
};

const movePagesToBottom = pageNumbers => {
  core.movePages(pageNumbers, core.getTotalPages() + 1);
};

const movePagesToTop = pageNumbers => {
  core.movePages(pageNumbers, 0);
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

const redactPages = pageNumbers => {
  core.applyRedactions(createPageRedactions(pageNumbers));
};

const createPageRedactions = pageNumbers => {
  const annots = [];
  for (const page of pageNumbers) {
    const pageInfo = core.getPageInfo(page);
    if (pageInfo) {
      const redaction = new Annotations.RedactionAnnotation({
        PageNumber: page,
        Rect: new Annotations.Rect(0, 0, pageInfo.width, pageInfo.height),
      });
      redaction.type = redactionTypeMap['FULL_PAGE'];
      redaction.setCustomData('trn-redaction-type', redactionTypeMap['FULL_PAGE']);
      redaction.Author = core.getCurrentUser();
      annots.push(redaction);
    }
  }
  core.getAnnotationManager().addAnnotations(annots);
  core.getAnnotationManager().drawAnnotationsFromList(annots);
  return annots;
};

const replacePages = async (sourceDoc, pagesToRemove, pagesToReplaceIntoDocument) => {
  const documentLoadedInViewer = core.getDocument();
  const pageCountOfLoadedDocument = documentLoadedInViewer.getPageCount();
  const pagesToRemoveFromOriginal = pagesToRemove.sort((a, b) => a - b);

  // If document to replace into has only one page, or we are replacing all pages
  // then we can insert pages at the end, and then remove the pages to avoid an error of removing all pages
  if (pageCountOfLoadedDocument === 1 || pagesToRemoveFromOriginal.length === pageCountOfLoadedDocument) {
    await documentLoadedInViewer.insertPages(sourceDoc, pagesToReplaceIntoDocument);
    await documentLoadedInViewer.removePages(pagesToRemoveFromOriginal);
  } else {
    // If document to replace into has > 1 page we need insert the new pages at the spot of the first removed page
    // pagesToRemoveFromOriginal is sorted in ascending order. Interleaving pages would be complex.
    await documentLoadedInViewer.removePages(pagesToRemoveFromOriginal);
    await documentLoadedInViewer.insertPages(sourceDoc, pagesToReplaceIntoDocument, pagesToRemoveFromOriginal[0]);
  }
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
};