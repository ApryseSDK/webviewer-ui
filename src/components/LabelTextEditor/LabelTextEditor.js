import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LabelTextEditor.scss';

const LabelTextEditor = ({ onPropertyChange, properties }) => {
  const overlayText = properties.OverlayText || '';
  const [curOverlayText, setCurOverlayText] = useState(overlayText);
  const setOverlayText = (e) => {
    setCurOverlayText(e.target.value);
    onPropertyChange('OverlayText', e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target?.blur();
    }
  };

  const [t] = useTranslation();

  return (
    <>
      <input
        className="overlay-text-input"
        value={curOverlayText}
        onChange={setOverlayText}
        onKeyDown={onKeyDown}
        placeholder={t('option.stylePopup.labelTextPlaceholder')}
      />
    </>
  );
};

export default LabelTextEditor;
