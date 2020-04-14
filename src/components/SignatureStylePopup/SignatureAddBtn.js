import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import actions from 'actions';

import './SignatureStylePopup.scss';

const SignatureAddBtn = ({ t, disabled }) => {
  const dispatch = useDispatch();

  const openSignatureModal = () => {
    dispatch(actions.openElement('signatureModal'));
  };

  return (
    <div
      className={classNames({
        'signature-row-content': true,
        'add-btn': true,
        disabled,
      })}
      onClick={openSignatureModal}
    >
      {t('option.signatureOverlay.addSignature')}
    </div>
  );
};

export default withTranslation()(SignatureAddBtn);