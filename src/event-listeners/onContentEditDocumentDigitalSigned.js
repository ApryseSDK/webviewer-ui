import actions from 'actions';
import getCurrentT from 'helpers/getCurrentT';
import core from 'core';

export default (dispatch) => () => {
  const t = getCurrentT();
  const message = t('option.contentEdit.digitalSign.message');
  const title = t('option.contentEdit.digitalSign.title');
  const confirmBtnText = t('action.ok');

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