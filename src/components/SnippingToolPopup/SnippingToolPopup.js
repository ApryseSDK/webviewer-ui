import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';

import './SnippingToolPopup.scss';
import Button from 'components/Button';
import MobilePopupWrapper from '../MobilePopupWrapper';
import SnippingSection from './SnippingSection';
import useFocusHandler from 'hooks/useFocusHandler';

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

  const className = classNames({
    Popup: true,
    SnippingToolPopup: true,
    mobile: isMobile,
  });

  const applyPressed = useFocusHandler((e) => {
    shouldShowApplySnippingWarning && snippingMode === 'CROP_AND_REMOVE' ? openSnippingConfirmationWarning() : applySnipping(e);
  });
  const cancelPressed = useFocusHandler((e) => {
    isSnipping ? openSnippingCancellationWarning() : closeSnippingPopup(e);
  });

  const dispatch = useDispatch();

  const openSnippingConfirmationWarning = () => {
    const title = t('snippingPopUp.snippingModal.applyTitle');
    const message = t('snippingPopUp.snippingModal.applyMessage');
    const confirmationWarning = {
      message,
      title,
      onConfirm: (e) => {
        applySnipping(e);
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
      onConfirm: (e) => {
        closeSnippingPopup(e);
      },
    };
    dispatch(actions.showWarningMessage(cancellationWarning));
  };

  const popupContent = (
    <>
      <SnippingSection
        isMobile={isMobile}
        isInDesktopOnlyMode={isInDesktopOnlyMode}
        snippingMode={snippingMode}
        onSnippingModeChange={onSnippingModeChange} />
      <div className="snipping-mobile-section">
        <div className="buttons">
          <Button
            className="cancel-button"
            dataElement="snippingCancelButton"
            onClick={cancelPressed}
            label={t('action.cancel')} />
          <Button
            className="save-button"
            dataElement="snippingApplyButton"
            onClick={applyPressed}
            disabled={!isSnipping}
            label={t('action.apply')}
          />
        </div>
      </div>
    </>
  );

  if (isMobile && !isInDesktopOnlyMode) {
    return (
      <MobilePopupWrapper>
        { popupContent }
      </MobilePopupWrapper>
    );
  }

  return (
    <div className={className} data-element={DataElements.SNIPPING_TOOL_POPUP}>
      { popupContent}
    </div>
  );
};

export default SnippingToolPopup;
