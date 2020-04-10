import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { withTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import Icon from 'components/Icon';
import SignatureRowContent from './SignatureRowContent';

import './SignatureStylePopup.scss';

const SignatureStylePopup = props => {
  const { t } = props;
  const [savedSignatures] = useSelector(
    state => [selectors.getSavedSignatures(state)],
    shallowEqual,
  );

  return (
    <div
      className="signature-style-popup"
    >
      {savedSignatures.map((_, i) =>
        <div
          key={i}
          className="row"
        >
          <SignatureRowContent/>
          <div
            className="icon"
            dataElement="defaultSignatureDeleteButton"
            onClick={() => {}}
          >
            <Icon glyph="icon-delete-line"/>
          </div>
        </div>
      )}
      <div
        className="row"
        onClick={() => {}}
      >
        <div
          className="signature-row-content"
        >
          <div
            className={classNames({
              'add-btn': true,
              disabled: savedSignatures.length >= 4
            })}
          >
            {t('option.signatureOverlay.addSignature')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SignatureStylePopup);