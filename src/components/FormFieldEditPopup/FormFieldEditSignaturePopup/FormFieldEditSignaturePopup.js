import React, { useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import FormFieldPopupDimensionsInput from '../FormFieldPopupDimensionsInput';
import FormFieldEditPopupIndicator from '../FormFieldEditPopupIndicator';
import SignatureOptionsDropdown from './SignatureOptionsDropdown';
import HorizontalDivider from 'components/HorizontalDivider';

import '../FormFieldEditPopup.scss';

const FormFieldEditSignaturePopup = ({
  fields,
  flags,
  closeFormFieldEditPopup,
  isValid,
  validationMessage,
  annotation,
  getPageHeight,
  getPageWidth,
  redrawAnnotation,
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

  const [initialWidth] = useState((annotation.Width).toFixed(0));
  const [initialHeight] = useState((annotation.Height).toFixed(0));
  const [indicatorPlaceholder, setIndicatorPlaceholder] = useState(t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${getSignatureOptionHandler(annotation)}`));


  function onWidthChange(width) {
    const validatedWidth = validateWidth(width);
    annotation.setWidth(validatedWidth);
    setWidth(validatedWidth);
    redrawAnnotation(annotation);
  }

  function onHeightChange(height) {
    const validatedHeight = validateHeight(height);
    annotation.setHeight(validatedHeight);
    setHeight(validatedHeight);
    redrawAnnotation(annotation);
  }

  function validateWidth(width) {
    const documentWidth = getPageWidth();
    const maxWidth = documentWidth - annotation.X;
    if (width > maxWidth) {
      return maxWidth;
    }
    return width;
  }

  function validateHeight(height) {
    const documentHeight = getPageHeight();
    const maxHeight = documentHeight - annotation.Y;
    if (height > maxHeight) {
      return maxHeight;
    }
    return height;
  }

  function onCancel() {
    // If width/height changed return to original values
    if (width !== initialWidth || height !== initialHeight) {
      annotation.setWidth(initialWidth);
      annotation.setHeight(initialHeight);
    }
    redrawAnnotation(annotation);
    closeFormFieldEditPopup();
  }

  function renderTextInput(field) {
    return (
      <Input
        type="text"
        onChange={(event) => field.onChange(event.target.value)}
        value={field.value}
        fillWidth="false"
        messageText={field.required && !isValid ? t(validationMessage) : ''}
        message={field.required && !isValid ? 'warning' : 'default'}
        autoFocus={field.focus}
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
            <label>
              {t(field.label)}{field.required ? '*' : ''}:
            </label>
            {renderTextInput(field)}
          </div>
        ))}
      </div>
      <div className="field-flags-container">
        <span className="field-flags-title">{t('formField.formFieldPopup.flags')}</span>
        {flags.map((flag) => (
          <Choice
            key={flag.label}
            checked={flag.isChecked}
            onChange={(event) => flag.onChange(event.target.checked)}
            label={t(flag.label)}
          />
        ))}
      </div>
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
          className="cancel-form-field-button"
          onClick={onCancel}
          dataElement="formFieldCancel"
          label={t('formField.formFieldPopup.cancel')}
        />
        <Button
          className="ok-form-field-button"
          onClick={closeFormFieldEditPopup}
          dataElement="formFieldOK"
          label={t('action.ok')}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

export default FormFieldEditSignaturePopup;
