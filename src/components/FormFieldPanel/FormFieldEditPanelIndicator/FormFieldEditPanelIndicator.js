import PropTypes from 'prop-types';
import React from 'react';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';

const propTypes = {
  indicator: PropTypes.object.isRequired,
  indicatorPlaceholder: PropTypes.string.isRequired,
};

const FormFieldEditPanelIndicator = ({ indicator, indicatorPlaceholder }) => {
  const { t } = useTranslation();
  const onIndicatorChange = (showIndicator) => {
    if (indicator.value.length < 1 && showIndicator) {
      indicator.onChange(indicatorPlaceholder);
    }
    indicator.toggleIndicator(showIndicator);
  };

  return (
    <div className="form-field-indicator-container">
      <Choice
        id="field-indicator"
        className='form-field-checkbox'
        checked={indicator.isChecked}
        onChange={(event) => onIndicatorChange(event.target.checked)}
        label={t(indicator.label)}
        aria-label={t(indicator.label)}
        aria-checked={indicator.isChecked}
      />
      {
        indicator.isChecked && (
          <div className="field-indicator">
            <Input
              id="field-indicator-input"
              type="text"
              onChange={(event) => indicator.onChange(event.target.value)}
              value={indicator.value}
              fillWidth="false"
              placeholder={indicatorPlaceholder}
              disabled={!indicator.isChecked}
              aria-disabled={!indicator.isChecked}
              aria-label={t('formField.formFieldPopup.fieldIndicator')}
            />
          </div>
        )
      }
    </div>
  );
};

FormFieldEditPanelIndicator.propTypes = propTypes;

export default FormFieldEditPanelIndicator;