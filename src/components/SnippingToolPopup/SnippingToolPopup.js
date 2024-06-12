import React from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Dropdown from 'components/Dropdown';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';

import './SnippingToolPopup.scss';

const SnippingToolPopup = ({
  snippingMode,
  onSnippingModeChange,
  closeSnippingPopup,
  applySnipping,
  isSnipping,
  isInDesktopOnlyMode,
  isMobile,
  shouldShowApplySnippingWarning,
}) => {
  const { t } = useTranslation();

  const snippingNames = {
    'CLIPBOARD': t('snippingPopUp.clipboard'),
    'DOWNLOAD': t('snippingPopUp.download'),
    'CROP_AND_REMOVE': t('snippingPopUp.cropAndRemove'),
  };

  const className = classNames({
    Popup: true,
    SnippingToolPopup: true,
    mobile: isMobile,
  });

  const handleButtonPressed = (button) => {
    switch (button) {
      case 'apply':
        shouldShowApplySnippingWarning && snippingMode === 'CROP_AND_REMOVE' ? openSnippingConfirmationWarning() : applySnipping();
        break;
      case 'cancel':
        isSnipping ? openSnippingCancellationWarning() : closeSnippingPopup();
        break;
    }
  };

  const dispatch = useDispatch();

  const openSnippingConfirmationWarning = () => {
    const title = t('snippingPopUp.snippingModal.applyTitle');
    const message = t('snippingPopUp.snippingModal.applyMessage');
    const confirmationWarning = {
      message,
      title,
      onConfirm: () => {
        applySnipping();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  const openSnippingCancellationWarning = () => {
    const title = t('snippingPopUp.snippingModal.cancelTitle');
    const message = t('snippingPopUp.snippingModal.cancelMessage');
    const cancellationWarning = {
      message,
      title,
      onConfirm: () => {
        closeSnippingPopup();
      },
    };
    dispatch(actions.showWarningMessage(cancellationWarning));
  };

  if (isMobile && !isInDesktopOnlyMode) {
    return (
      <div className={className} data-element={DataElements.SNIPPING_TOOL_POPUP}>
        <div className="snipping-mobile-section">
          <div className="snipping-mobile-container">
            <div className="custom-select snipping-selector">
              <Dropdown
                items={Object.values(snippingNames)}
                onClickItem={(e) => onSnippingModeChange(Object.keys(snippingNames).find((key) => snippingNames[key] === e))}
                currentSelectionKey={snippingNames[snippingMode]}
              />
            </div>
            <button
              className="save-button"
              data-element="snippingApplyButton"
              onClick={() => handleButtonPressed('apply')}
              disabled={!isSnipping}
            >
              {t('action.apply')}
            </button>
          </div>
          <button
            className="cancel-button"
            data-element="snippingCancelButton"
            onClick={() => handleButtonPressed('cancel')}
          >
            <Icon glyph="icon-close" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-element={DataElements.SNIPPING_TOOL_POPUP}>
      <div className="snipping-section">
        <span className="menu-title">{t('snippingPopUp.title')}</span>
        <Choice
          label={t('snippingPopUp.clipboard')}
          name="CLIPBOARD"
          data-element="copyToClipboardRadioButton"
          onChange={() => onSnippingModeChange('CLIPBOARD')}
          checked={snippingMode === 'CLIPBOARD'}
          radio
        />
        <Choice
          label={t('snippingPopUp.download')}
          name="DOWNLOAD"
          data-element="downloadSnippingRadioButton"
          onChange={() => onSnippingModeChange('DOWNLOAD')}
          checked={snippingMode === 'DOWNLOAD'}
          radio
        />
        <Choice
          label={t('snippingPopUp.cropAndRemove')}
          name="CROP_AND_REMOVE"
          data-element="cropAndRemoveRadioButton"
          onChange={() => onSnippingModeChange('CROP_AND_REMOVE')}
          checked={snippingMode === 'CROP_AND_REMOVE'}
          radio
        />
      </div>
      <div className="divider" />
      <div className="buttons">
        <button className="cancel-button" data-element="snippingCancelButton" onClick={() => handleButtonPressed('cancel')}>
          {t('action.cancel')}
        </button>
        <button
          className="save-button"
          data-element="snippingApplyButton"
          onClick={() => handleButtonPressed('apply')}
          disabled={!isSnipping}
        >
          {t('action.apply')}
        </button>
      </div>
    </div>
  );
};

export default SnippingToolPopup;
