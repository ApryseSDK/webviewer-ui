
import actions from 'src/redux/actions';
import DataElements from 'src/constants/dataElement';

import { setCheckPasswordFunction, setCancelPasswordCheckCallback } from 'components/PasswordModal';
import { checkPasswordCallback, cancelPasswordCheckCallback } from 'src/helpers/contentEditPasswordRequiredHelper';

export default (dispatch, store) => (passwordCheckCallback, successPasswordCallback) => {
  setCancelPasswordCheckCallback(() => {
    cancelPasswordCheckCallback(
      dispatch,
      store,
      passwordCheckCallback,
      successPasswordCallback
    );
  });

  setCheckPasswordFunction((password) => {
    checkPasswordCallback(
      dispatch,
      store,
      password,
      passwordCheckCallback,
      successPasswordCallback
    );
  });

  dispatch(actions.setPasswordAttempts(0));
  dispatch(actions.openElement(DataElements.PASSWORD_MODAL));
};