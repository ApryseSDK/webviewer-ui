import React, { useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FieldFlags from '../FieldFlags';
import FormFieldPopupDimensionsInput from '../FormFieldPopupDimensionsInput';
import FormFieldEditPopupIndicator from '../FormFieldEditPopupIndicator';
import SignatureOptionsDropdown from './SignatureOptionsDropdown';
import HorizontalDivider from 'components/HorizontalDivider';
import TextInput from 'components/TextInput';

import '../FormFieldEditPopup.scss';
import { createDimensionChangeHandlers } from 'helpers/formFieldEditPopupHelpers';

const propTypes = {
  fields: PropTypes.array,
  flags: PropTypes.array,
  closeFormFieldEditPopup: PropTypes.func,
  isValid: PropTypes.bool,
  validationMessage: PropTypes.string,
  annotation: PropTypes.object,
  getPageHeight: PropTypes.func,
  getPageWidth: PropTypes.func,
  onSignatureOptionChange: PropTypes.func,
  getSignatureOptionHandler: PropTypes.func,
  indicator: PropTypes.object,
};

const FormFieldEditSignaturePopup = ({
  fields,
  flags,
  closeFormFieldEditPopup,
  isValid,
  validationMessage,
  annotation,
  getPageHeight,
  getPageWidth,
  onSignatureOptionChange,
  getSignatureOptionHandler,
  indicator,
}) => {
  const { t } = useTranslation();
  const className = classNames({
    Popup: true,
    FormFieldEditPopup: true,
  });

  const [width, setWidth] = useState((annotation.Width).toFixed(0));
  const [height, setHeight] = useState((annotation.Height).toFixed(0));

  const { onWidthChange, onHeightChange } = createDimensionChangeHandlers(
    annotation,
    getPageWidth,
    getPageHeight,
    setWidth,
    setHeight
  );

  const [indicatorPlaceholder, setIndicatorPlaceholder] = useState(t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${getSignatureOptionHandler(annotation)}`));

  function renderTextInput(field) {
    const hasError = field.required && !isValid;
    return (
      <TextInput
        label={`${field.label}-input`}
        value={field.value}
        onChange={field.onChange}
        validationMessage={validationMessage}
        hasError={hasError}
        ariaDescribedBy={hasError ? 'FormFieldInputError' : undefined}
        ariaLabelledBy={field.label}
      />
    );
  }

  const onOptionChange = (option) => {
    onSignatureOptionChange(option);
    const { value } = option;
    setIndicatorPlaceholder(t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${value}`));
  };

  return (
    <div className={className}>
      <SignatureOptionsDropdown onChangeHandler={onOptionChange} initialOption={getSignatureOptionHandler(annotation)} />
      <div className="fields-container">
        {fields.map((field) => (
          <div className="field-input" key={field.label}>
            <span id={field.label}>
              {t(field.label)}
              {field.required ? '*' : ''}:
            </span>
            {renderTextInput(field)}
          </div>
        ))}
      </div>
      <FieldFlags flags={flags} />
      <FormFieldPopupDimensionsInput
        width={width}
        height={height}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
      />
      <HorizontalDivider />
      <FormFieldEditPopupIndicator
        indicator={indicator}
        indicatorPlaceholder={indicatorPlaceholder}
      />
      <div className="form-buttons-container">
        <Button
          className="ok-form-field-button"
          onClick={closeFormFieldEditPopup}
          dataElement="formFieldOK"
          label={t('action.close')}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

FormFieldEditSignaturePopup.propTypes = propTypes;

export default FormFieldEditSignaturePopup;