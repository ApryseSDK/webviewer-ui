import extractPagesWithAnnotations from "helpers/extractPagesWithAnnotations";
import core from 'core';
import { saveAs } from 'file-saver';
import actions from 'actions';
import i18next from 'i18next';


const rotateClockwise = pageNumbers => {
  pageNumbers.forEach(index => {
    core.rotatePages([index], window.Core.PageRotation.e_90);
  });
};

const rotateCounterClockwise = pageNumbers => {
  pageNumbers.forEach(index => {
    core.rotatePages([index], window.Core.PageRotation.e_270);
  });
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
    core.removePages();
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
};