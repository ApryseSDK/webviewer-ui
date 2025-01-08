import React from 'react';
import { useTranslation } from 'react-i18next';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import CollapsibleSection from '../CollapsibleSection';
import PropTypes from 'prop-types';

const SnippingSection = ({
  isMobile,
  isInDesktopOnlyMode,
  snippingMode,
  onSnippingModeChange,
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
};