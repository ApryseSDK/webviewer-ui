import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import CreatableDropdown from '../CreatableDropdown';
import FieldFlags from './FieldFlags';
import FormFieldPopupDimensionsInput from './FormFieldPopupDimensionsInput';
import HorizontalDivider from '../HorizontalDivider';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';

import './FormFieldEditPopup.scss';
import CreatableList from '../CreatableList';
import FormFieldEditPopupIndicator from './FormFieldEditPopupIndicator';

const propTypes = {
  fields: PropTypes.array.isRequired,
  flags: PropTypes.array.isRequired,
  closeFormFieldEditPopup: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string.isRequired,
  radioButtonGroups: PropTypes.array,
  options: PropTypes.array,
  onOptionsChange: PropTypes.func,
  annotation: PropTypes.object.isRequired,
  selectedRadioGroup: PropTypes.string,
  getPageHeight: PropTypes.func.isRequired,
  getPageWidth: PropTypes.func.isRequired,
  redrawAnnotation: PropTypes.func.isRequired,
  indicator: PropTypes.object.isRequired,
};

const FormFieldEditPopup = ({
  fields,
  flags,
  closeFormFieldEditPopup,
  isValid,
  validationMessage,
  radioButtonGroups,
  options,
  onOptionsChange,
  annotation,
  selectedRadioGroup,
  getPageHeight,
  getPageWidth,
  redrawAnnotation,
  indicator,
}) => {
  const { t } = useTranslation();
  const className = classNames({
    Popup: true,
    FormFieldEditPopup: true,
  });

  const [width, setWidth] = useState(annotation.Width.toFixed(0));
  const [height, setHeight] = useState(annotation.Height.toFixed(0));

  const popupRef = useRef(null);

  // If no radio group is yet set, set this as null as the select input will then show the correct prompt
  const [radioButtonGroup, setRadioButtonGroup] = useState(
    selectedRadioGroup === '' ? null : { value: selectedRadioGroup, label: selectedRadioGroup },
  );

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
      field.onChange('');
      setRadioButtonGroup(null);
    } else {
      field.onChange(input.value);
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

  function renderInput(field) {
    if (field.type === 'text') {
      return renderTextInput(field);
    }
    if (field.type === 'select') {
      return renderSelectInput(field);
    }
  }

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
        <CreatableList options={options} onOptionsUpdated={onOptionsChange} popupRef={popupRef}/>
      </div>
    );
  }

  const indicatorPlaceholder = t(`formField.formFieldPopup.indicatorPlaceHolders.${annotation.getField().getFieldType()}`);

  return (
    <div className={className} ref={popupRef}>
      <div className="fields-container">
        {fields.map((field) => (
          <div className="field-input" key={field.label}>
            <span id={field.label}>
              {t(field.label)}
              {field.required ? '*' : ''}:
            </span>
            {renderInput(field)}
          </div>
        ))}
      </div>
      {options && renderListOptions()}
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

FormFieldEditPopup.propTypes = propTypes;

export default FormFieldEditPopup;