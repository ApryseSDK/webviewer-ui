import React from 'react';
import Button from '../Button';
import classNames from 'classnames';
import SignatureModes from 'constants/signatureModes';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import useFocusHandler from 'hooks/useFocusHandler';

const SignatureAddButton = ({ isDisabled }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const openSignatureModal = () => {
    if (!isDisabled) {
      dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      dispatch(actions.openElement(DataElements.SIGNATURE_MODAL));
    }
  };

  const openSignatureModalWithFocus = useFocusHandler(openSignatureModal);

  const isInitialsModeEnabled = useSelector((state) => selectors.getIsInitialsModeEnabled(state));
  const buttonLabel = isInitialsModeEnabled ? 'signatureListPanel.newSignatureAndInitial' : 'signatureListPanel.newSignature';

  return (
    <Button
      className={classNames(
        'SignatureAddButton',
        { disabled: isDisabled },
      )}
      label={t(buttonLabel)}
      onClick={openSignatureModalWithFocus} />
  );
};

export default React.memo(SignatureAddButton);