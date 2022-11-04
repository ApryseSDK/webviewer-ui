import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import Icon from 'components/Icon';
import SignatureModes from 'constants/signatureModes';
import './SignatureStylePopup.scss';

const SignatureAddBtn = ({ t, disabled }) => {
  const dispatch = useDispatch();

  const openSignatureModal = () => {
    if (!disabled) {
      dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      dispatch(actions.openElement('signatureModal'));
      dispatch(actions.closeElement('toolStylePopup'));
    }
  };

  const isInitialsModeEnabled = useSelector((state) => selectors.getIsInitialsModeEnabled(state));
  const buttonText = isInitialsModeEnabled ? t('option.signatureOverlay.addSignatureOrInitials') : t('option.signatureOverlay.addSignature');

  return (
    <button
      className={classNames(
        'signature-row-content add-btn',
        { disabled },
      )}
      onClick={openSignatureModal}
    >
      <Icon className="signature-button-icon" glyph={disabled ? 'icon-signature-plus-disabled' : 'icon-signature-plus-sign'} />
      {buttonText}
    </button>
  );
};

export default withTranslation()(SignatureAddBtn);