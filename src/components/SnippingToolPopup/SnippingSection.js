import React from 'react';
import { useTranslation } from 'react-i18next';
import Choice from 'components/Choice';
import CollapsibleSection from '../CollapsibleSection';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';

const SnippingSection = ({
  isMobile,
  isInDesktopOnlyMode,
  snippingMode,
  onSnippingModeChange,
  shouldShowCropAndRemoveRadioButton=true,
}) => {
  const { t } = useTranslation();

  let snippingSectionTitle = null;
  if (!(isMobile && !isInDesktopOnlyMode)) {
    snippingSectionTitle = (
      <span id="snipping-tool-label" className="menu-title">{t('snippingPopUp.title')}</span>
    );
  }

  let content = (
    <div className="snipping-section" aria-labelledby='snipping-tool-label' role="group">
      { snippingSectionTitle }
      <Choice
        label={t('snippingPopUp.clipboard')}
        name="CLIPBOARD"
        data-element={DataElements.COPY_TO_CLIPBOARD_RADIO_BUTTON}
        onChange={() => onSnippingModeChange('CLIPBOARD')}
        checked={snippingMode === 'CLIPBOARD'}
        radio
      />
      <Choice
        label={t('snippingPopUp.download')}
        name="DOWNLOAD"
        data-element={DataElements.DOWNLOAD_SNIPPING_RADIO_BUTTON}
        onChange={() => onSnippingModeChange('DOWNLOAD')}
        checked={snippingMode === 'DOWNLOAD'}
        radio
      />
      { shouldShowCropAndRemoveRadioButton && (
        <Choice
          label={t('snippingPopUp.cropAndRemove')}
          name="CROP_AND_REMOVE"
          data-element={DataElements.CROP_AND_REMOVE_RADIO_BUTTON}
          onChange={() => onSnippingModeChange('CROP_AND_REMOVE')}
          checked={snippingMode === 'CROP_AND_REMOVE'}
          radio
        />
      )}
    </div>
  );

  if (isMobile && !isInDesktopOnlyMode) {
    content = (
      <CollapsibleSection
        header={t('snippingPopUp.title')}
        isInitiallyExpanded={false}>
        { content }
      </CollapsibleSection>
    );
  }

  return content;
};

export default SnippingSection;

SnippingSection.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isInDesktopOnlyMode: PropTypes.bool.isRequired,
  snippingMode: PropTypes.string.isRequired,
  onSnippingModeChange: PropTypes.func.isRequired,
  shouldShowCropAndRemoveRadioButton: PropTypes.bool,
};