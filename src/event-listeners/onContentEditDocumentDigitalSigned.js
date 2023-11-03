import actions from 'actions';
import i18next from 'i18next';
import core from 'core';

export default (dispatch) => () => {
  const message = i18next.t('option.contentEdit.digitalSign.message');
  const title = i18next.t('option.contentEdit.digitalSign.title');
  const confirmBtnText = i18next.t('action.ok');

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: () => {
      core.setToolMode('AnnotationEdit');
    },
    onCancel: () => {
      core.setToolMode('AnnotationEdit');
    }
  };
  dispatch(actions.showWarningMessage(warning));
};