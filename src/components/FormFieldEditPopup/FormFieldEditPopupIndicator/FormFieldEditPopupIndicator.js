import React from 'react';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  indicator: PropTypes.object,
  indicatorPlaceholder: PropTypes.string
};

const FORM_FIELD_INDICATOR_INPUT_ID = 'field-indicator-input';

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
      <span id={FORM_FIELD_INDICATOR_INPUT_ID} className="field-indicator-title">
        {t('formField.formFieldPopup.fieldIndicator')}
      </span>
      <Choice
        id="field-indicator"
        checked={indicator.isChecked}
        onChange={(event) => onIndicatorChange(event.target.checked)}
        label={t(indicator.label)}
        aria-label={t(indicator.label)}
        aria-checked={indicator.isChecked}
      />
      <div className="field-indicator">
        <Input
          id="indicator-input"
          type="text"
          onChange={(event) => indicator.onChange(event.target.value)}
          value={indicator.value}
          fillWidth="false"
          placeholder={indicatorPlaceholder}
          disabled={!indicator.isChecked}
          aria-disabled={!indicator.isChecked}
          aria-labelledby={FORM_FIELD_INDICATOR_INPUT_ID}
        />
      </div>
    </div>
  );
};

FormFieldEditPopupIndicator.propTypes = propTypes;

export default FormFieldEditPopupIndicator;