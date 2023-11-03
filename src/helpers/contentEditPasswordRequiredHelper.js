import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import { setCheckPasswordFunction, setCancelPasswordCheckCallback } from 'components/PasswordModal';
import DataElements from 'src/constants/dataElement';

const passwordRequiredButtonElement = 'passwordRequiredButton';
const searchButtonElement = 'searchButton';

/**
 * Callback fired when user cancels out of password modal.
 * @param {*} dispatch Redux object used to dispatch actions.
 * @param {*} store Redux object used to fetch current state.
 * @callback passwordCheckCallback
 * @callback successPasswordCallback
 * @ignore
 */
function cancelPasswordCheckCallback(dispatch, store, passwordCheckCallback, successPasswordCallback) {
  core.setToolMode('AnnotationEdit');
  addPasswordRequiredHeaderItem(
    dispatch,
    store,
    passwordCheckCallback,
    successPasswordCallback
  );
}

/**
 * Callback fired when users clicks submit within the password modal.
 * @param {*} dispatch Redux object used to dispatch actions.
 * @param {*} store Redux object used to fetch current state.
 * @param {*} password The password entered by user.
 * @callback passwordCheckCallback
 * @callback successPasswordCallback
 * @ignore
 */
async function checkPasswordCallback(dispatch, store, password, passwordCheckCallback, successPasswordCallback) {
  const isValidPassword = await passwordCheckCallback(password);
  if (isValidPassword) {
    await successPasswordCallback();
    removePasswordRequiredHeaderItem(dispatch, store);
    dispatch(actions.setToolbarGroup('toolbarGroup-EditText'));
    dispatch(actions.closeElement(DataElements.PASSWORD_MODAL));
    dispatch(actions.setPasswordAttempts(0));
    return;
  }

  let attempts = selectors.getPasswordAttempts(store.getState());
  dispatch(actions.setPasswordAttempts(++attempts));

  const maxAttempts = selectors.getMaxPasswordAttempts(store.getState());
  if (attempts === maxAttempts) {
    core.setToolMode('AnnotationEdit');
    addPasswordRequiredHeaderItem(
      dispatch,
      store,
      passwordCheckCallback,
      successPasswordCallback
    );
  }
}

/**
 * Helper function that adds "Password Lock" button to toolbar. Password modal callbacks
 * are passed into this function to be set when the password button is pressed.
 * @param {*} dispatch Redux object used to dispatch actions.
 * @param {*} store Redux object used to fetch current state.
 * @callback passwordCheckCallback
 * @callback successPasswordCallback
 * @ignore
 */
function addPasswordRequiredHeaderItem(dispatch, store, passwordCheckCallback, successPasswordCallback) {
  const headerItems = selectors.getDefaultHeaderItems(store.getState());
  const passwordRequiredButton = headerItems.find((item) => item.dataElement === passwordRequiredButtonElement);
  if (passwordRequiredButton) {
    return;
  }

  const searchButton = headerItems.find((item) => item.dataElement === searchButtonElement);
  const index = searchButton ? headerItems.indexOf(searchButton) : headerItems.length;

  const passwordLockHeaderItem = {
    type: 'actionButton',
    dataElement: passwordRequiredButtonElement,
    title: 'message.passwordRequired',
    img: 'icon-lock-wire',
    onClick: () => {
      // Reset the password modal callbacks to handle the
      // unlikely scenario of these callbacks being overwritten.
      setCancelPasswordCheckCallback(() => {
        cancelPasswordCheckCallback(dispatch, store);
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
    }
  };

  headerItems.splice(index, 0, passwordLockHeaderItem);
  dispatch(actions.setHeaderItems('default', [...headerItems]));
}

/**
 * Helper function that removes "Password Lock" button to toolbar.
 * @param {*} dispatch Redux object used to dispatch actions.
 * @param {*} store Redux object used to fetch current state.
 * @ignore
 */
function removePasswordRequiredHeaderItem(dispatch, store) {
  const headerItems = selectors.getDefaultHeaderItems(store.getState());
  const passwordRequiredButton = headerItems.find((item) => item.dataElement === passwordRequiredButtonElement);
  if (!passwordRequiredButton) {
    return;
  }

  const index = headerItems.indexOf(passwordRequiredButton);
  headerItems.splice(index, 1);
  dispatch(actions.setHeaderItems('default', [...headerItems]));
}

export {
  checkPasswordCallback,
  cancelPasswordCheckCallback,
  removePasswordRequiredHeaderItem
};