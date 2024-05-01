import React from 'react';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';


const FormFieldEditPopupIndicator = ({ indicator, indicatorPlaceholder }) => {
  const { t } = useTranslation();
  const onIndicatorChange = (showIndicator) => {
    if (indicator.value.length < 1 && showIndicator) {
      indicator.onChange(indicatorPlaceholder);
    }
    indicator.toggleIndicator(showIndicator);
  };

  return (
    <div className="form-field-indicator-container">
      <span className="field-indicator-title">{t('formField.formFieldPopup.fieldIndicator')}</span>
      <Choice
        checked={indicator.isChecked}
        onChange={(event) => onIndicatorChange(event.target.checked)}
        label={t(indicator.label)}
      />
      <div className="field-indicator">
        <Input
          type="text"
          onChange={(event) => indicator.onChange(event.target.value)}
          value={indicator.value}
          fillWidth="false"
          placeholder={indicatorPlaceholder}
          disabled={!indicator.isChecked}
        />
      </div>
    </div>
  );
};

export default FormFieldEditPopupIndicator;