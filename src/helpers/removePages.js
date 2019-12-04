import core from 'core';
import actions from 'actions';
import i18next from 'i18next';

export default pages => dispatch => {
  if (core.getDocumentViewer().getPageCount() === 1) {
    const message = i18next.t('option.thumbnailPanel.deleteLastPageError');
    const title = i18next.t('option.thumbnailPanel.deleteWarningTitle');
    const confirmBtnText = i18next.t('option.thumbnailPanel.deleteWarningConfirmText');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => Promise.resolve(),
    };

    setTimeout(() => {
      dispatch(actions.showWarningMessage(warning));
    }, 0);

    return Promise.resolve();
  }

  return core.removePages(pages);
};
