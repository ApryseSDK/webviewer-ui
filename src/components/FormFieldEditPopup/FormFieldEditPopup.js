import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import CreatableDropdown from '../CreatableDropdown';
import FormFieldPopupDimensionsInput from './FormFieldPopupDimensionsInput';
import HorizontalDivider from '../HorizontalDivider';

import './FormFieldEditPopup.scss';
import CreatableList from '../CreatableList';
import FormFieldEditPopupIndicator from './FormFieldEditPopupIndicator';

const FormFieldEditPopup = ({
  fields,
  flags,
  closeFormFieldEditPopup,
  isValid,
  setIsValid,
  validationMessage,
  setValidationMessage,
  radioButtonGroups,
  options,
  confirmFieldOptionsChange,
  annotation,
  selectedRadioGroup,
  getPageHeight,
  getPageWidth,
  redrawAnnotation,
  indicator,
  onCancelEmptyFieldName,
}) => {
  const { t } = useTranslation();
  const className = classNames({
    Popup: true,
    FormFieldEditPopup: true,
  });

  const [width, setWidth] = useState(annotation.Width.toFixed(0));
  const [height, setHeight] = useState(annotation.Height.toFixed(0));

  const [initialWidth] = useState(annotation.Width.toFixed(0));
  const [initialHeight] = useState(annotation.Height.toFixed(0));
  const popupRef = useRef(null);

  // If no radio group is yet set, set this as null as the select input will then show the correct prompt
  const [radioButtonGroup, setRadioButtonGroup] = useState(
    selectedRadioGroup === '' ? null : { value: selectedRadioGroup, label: selectedRadioGroup },
  );

  // In order to be draggable, each item needs a unique Id
  // These are managed internally in this component and not exposed to the user
  const draggableItems = options?.map((option, index) => {
    return {
      id: index,
      displayValue: option.displayValue,
      value: option.value,
    };
  });
  const [fieldSelectionOptions, setFieldSelectionOptions] = useState(draggableItems ?? []);

  useEffect(() => {
    // When we open up the popup the async call to set the right radio group may not be finished
    // we deal with this timing issue by updating state when the prop is refreshed
    if (selectedRadioGroup !== '') {
      setRadioButtonGroup({ value: selectedRadioGroup, label: selectedRadioGroup });
    } else {
      setRadioButtonGroup(null);
    }
  }, [selectedRadioGroup]);

  function onSelectInputChange(field, input) {
    if (input === null) {
      field.setValue('');
      setRadioButtonGroup(null);
    } else {
      field.setValue(input.value);
      setRadioButtonGroup({ value: input.value, label: input.value });
    }
  }

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

  const confirmIndicatorChange = () => {
    if (indicator.isChecked) {
      indicator.confirmTextChange(indicator.textValue || indicatorPlaceholder);
    }
    indicator.confirmToggleIndicator(indicator.isChecked);
  };

  function onCancel() {
    if (!isValid) {
      const { value } = fields.find((field) => field.label.includes('fieldName'));
      if (value.trim() === '') {
        onCancelEmptyFieldName(annotation);
        return;
      }
    }

    if (width !== initialWidth || height !== initialHeight) {
      annotation.setWidth(initialWidth);
      annotation.setHeight(initialHeight);
    }

    redrawAnnotation(annotation);
    closeFormFieldEditPopup();
  }

  function onConfirm() {
    for (let i = 0; i < fields.length; i++) {
      const isInvalidName = fields[i].label.includes('fieldName') && fields[i].value.trim() === '';
      if (isInvalidName) {
        // Field name is required, so if this is an empty string
        // the field is not valid and the user should be warned
        // As a failsafe the FormFieldCreationManager will create a unique field name if this is left blank
        setValidationMessage('formField.formFieldPopup.invalidField.empty');
        setIsValid(false);
        return;
      }
      if (fields[i].label.includes('fieldName')) {
        fields[i].confirmChange(fields[i].value);
      }
    }
    flags.forEach((flag) => {
      flag.confirmChange(flag.isChecked);
    });

    if (confirmFieldOptionsChange) {
      const sanitizedOptions = fieldSelectionOptions.map((option) => ({ value: option.value, displayValue: option.displayValue }));
      confirmFieldOptionsChange(sanitizedOptions);
    }
    confirmIndicatorChange();
    closeFormFieldEditPopup(true);
  }

  function renderInput(field) {
    if (field.type === 'text') {
      return renderTextInput(field);
    }
    if (field.type === 'select') {
      return renderSelectInput(field);
    }
  }

  function handleTextChange(event, field) {
    field.setValue(event.target.value);
    if (event.target.value.trim().length > 0) {
      setIsValid(true);
    }
  }

  function renderTextInput(field) {
    return (
      <Input
        type="text"
        onChange={(e) => handleTextChange(e, field)}
        value={field.value}
        fillWidth="false"
        messageText={field.required && !isValid ? t(validationMessage) : ''}
        message={field.required && !isValid ? 'warning' : 'default'}
        autoFocus={field.focus}
      />
    );
  }

  function renderSelectInput(field) {
    const displayRadioGroups = radioButtonGroups.map((group) => ({ value: group, label: group }));
    return (
      <>
        <CreatableDropdown
          textPlaceholder={t('formField.formFieldPopup.fieldName')}
          options={displayRadioGroups}
          onChange={(inputValue) => onSelectInputChange(field, inputValue)}
          value={radioButtonGroup}
          isValid={isValid}
          messageText={t(validationMessage)}
        />
        <div className="radio-group-label">{t('formField.formFieldPopup.radioGroups')}</div>
      </>
    );
  }

  function renderListOptions() {
    return (
      <div className="field-options-container">
        {t('formField.formFieldPopup.options')}
        <CreatableList
          draggableItems={draggableItems}
          popupRef={popupRef}
          fieldSelectionOptions={fieldSelectionOptions}
          setFieldSelectionOptions={setFieldSelectionOptions}
        />
      </div>
    );
  }

  const indicatorPlaceholder = t(`formField.formFieldPopup.indicatorPlaceHolders.${annotation.getFormFieldPlaceholderType()}`);

  return (
    <div className={className} ref={popupRef}>
      <div className="fields-container">
        {fields.map((field) => (
          <div className="field-input" key={field.label}>
            <label>
              {t(field.label)}
              {field.required ? '*' : ''}:
            </label>
            {renderInput(field)}
          </div>
        ))}
      </div>
      {options && renderListOptions()}
      <div className="field-flags-container">
        <span className="field-flags-title">{t('formField.formFieldPopup.flags')}</span>
        {flags.map((flag) => (
          <Choice
            key={flag.label}
            checked = {flag.isChecked}
            onChange={(event) => {
              flag.setIsChecked(event.target.checked);
            }}
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
          onClick={onConfirm}
          dataElement="formFieldOK"
          label={t('action.ok')}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

export default FormFieldEditPopup;
