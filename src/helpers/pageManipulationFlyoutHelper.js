import selectors from 'selectors';
import {
  movePagesToTop,
  movePagesToBottom,
  rotateClockwise,
  rotateCounterClockwise,
  replace,
  extractPages,
  deletePages,
  noPagesSelectedWarning
} from 'helpers/pageManipulationFunctions';
import { isMobile } from 'helpers/device';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import i18next from 'i18next';


export const getPageAdditionalControls = (store, warn = false) => {
  const dispatch = store.dispatch;
  return [
    'option.thumbnailsControlOverlay.move',
    {
      dataElement: 'moveToTop',
      label: 'action.moveToTop',
      title: 'action.moveToTop',
      icon: 'icon-page-move-up',
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        movePagesToTop(pageNumbers);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
    {
      dataElement: 'moveToBottom',
      label: 'action.moveToBottom',
      title: 'action.moveToBottom',
      icon: 'icon-page-move-down',
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        movePagesToBottom(pageNumbers);
        isMobile() && dispatch(actions.closeElement);
      },
    },
  ];
};

export const getPageRotationControls = (store, warn = false) => {
  const dispatch = store.dispatch;
  return [
    'action.rotate',
    {
      dataElement: 'rotatePageClockwise',
      label: 'option.thumbnailPanel.rotatePageClockwise',
      title: 'option.thumbnailPanel.rotatePageClockwise',
      icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        rotateClockwise(pageNumbers);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
    {
      dataElement: 'rotatePageCounterClockwise',
      label: 'option.thumbnailPanel.rotateCounterClockwise',
      title: 'option.thumbnailPanel.rotateCounterClockwise',
      icon: 'icon-header-page-manipulation-page-rotation-counterclockwise-line',
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        rotateCounterClockwise(pageNumbers);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
  ];
};

export const getPageManipulationControls = (store, warn = false) => {
  const t = i18next.getFixedT();
  const dispatch = store.dispatch;
  return [
    'action.pageManipulation',
    {
      dataElement: 'insertPage',
      label: 'action.insert',
      title: 'action.insert',
      icon: 'icon-page-insertion-insert',
      onClickAnnouncement: `${t('action.insertPage')} ${t('action.modal')} ${t('action.isOpen')}`,
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
        dispatch(actions.openElement('insertPageModal'));
      },
    },
    {
      dataElement: 'replacePage',
      label: 'action.replace',
      title: 'action.replace',
      icon: 'icon-page-replacement',
      onClickAnnouncement: `${t('action.replacePage')} ${t('action.modal')} ${t('action.isOpen')}`,
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        replace(dispatch);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
    {
      dataElement: 'extractPage',
      label: 'action.extract',
      title: 'action.extract',
      icon: 'icon-page-manipulation-extract',
      onClickAnnouncement: `${t('action.extractPage')} ${t('action.modal')} ${t('action.isOpen')}`,
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        extractPages(pageNumbers, dispatch);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
    {
      dataElement: 'deletePage',
      label: 'action.delete',
      title: 'action.delete',
      icon: 'icon-delete-line',
      onClickAnnouncement: `${t('action.delete')} ${t('action.modal')} ${t('action.isOpen')}`,
      onClick: () => {
        const pageNumbers = getPageNumbers(store, warn);
        if (warn && noPagesSelectedWarning(pageNumbers, dispatch)) {
          return;
        }
        const isPageDeletionConfirmationModalEnabled = selectors.pageDeletionConfirmationModalEnabled(store.getState());
        deletePages(pageNumbers, dispatch, isPageDeletionConfirmationModalEnabled);
        isMobile() && dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    },
  ];
};

export const getPageCustomControlsFlyout = (store, customControls) => [
  customControls.header,
  ...customControls.operations.map((operation) => ({
    dataElement: operation.dataElement,
    label: operation.label || operation.title,
    title: operation.title,
    icon: operation.img,
    onClick: () => {
      const pageNumbers = getPageNumbers(store);
      operation.onClick(pageNumbers);
    },
  })),
];

export const getPageNumbers = (store, warn = false) => {
  const state = store.getState();
  const selectedPageIndexes = selectors.getSelectedThumbnailPageIndexes(state);
  const currentPage = selectors.getCurrentPage(state);
  const defaultPageNumbers = warn ? [] : [currentPage];
  return selectedPageIndexes.length > 0 ? selectedPageIndexes.map((i) => i + 1) : defaultPageNumbers;
};