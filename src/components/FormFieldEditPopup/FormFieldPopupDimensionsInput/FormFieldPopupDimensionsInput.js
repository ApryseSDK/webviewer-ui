import React from 'react';
import { useTranslation } from 'react-i18next';

const FormFieldPopupDimensionsInput = ({ width, height, onWidthChange, onHeightChange }) => {
  const { t } = useTranslation();

  return (
    <div className="form-dimension">
      <div>{t('formField.formFieldPopup.size')}:</div>
      <div className="form-dimension-input">
        <input
          id="form-field-width"
          type="number"
          min={0}
          value={width}
          onChange={(e) => onWidthChange(e.target.value)}
        /> {t('formField.formFieldPopup.width')}
      </div>
      <div className="form-dimension-input">
        <input
          id="form-field-height"
          type="number"
          min={0}
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
        /> {t('formField.formFieldPopup.height')}
      </div>
    </div>
  );
};

export default FormFieldPopupDimensionsInput;