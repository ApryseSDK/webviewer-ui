import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import CreatableDropdown from '../CreatableDropdown';


import './FormFieldEditPopup.scss';
import CreatableList from '../CreatableList';

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

  // If no radio group is yet set, set this as null as the select input will then show the correct prompt
  const [radioButtonGroup, setRadioButtonGroup] = useState(selectedRadioGroup === '' ? null : { value: selectedRadioGroup, label: selectedRadioGroup });

  useEffect(() => {
    // When we open up the popup the async call to set the right radio group may not be finished
    // we deal with this timing issue by updating state when the prop is refreshed
    if (selectedRadioGroup !== '') {
      setRadioButtonGroup({ value: selectedRadioGroup, label: selectedRadioGroup })
    } else {
      setRadioButtonGroup(null)
    }
  }, [selectedRadioGroup])

  function onSelectInputChange(field, input) {
    if (input === null) {
      field.onChange('');
      setRadioButtonGroup(null);

    } else {
      field.onChange(input.value);
      setRadioButtonGroup({ value: input.value, label: input.value })
    }
  };

  function onWidthChange(width) {
    const validatedWidth = validateWidth(width);
    annotation.setWidth(validatedWidth);
    setWidth(validatedWidth);
    redrawAnnotation(annotation);
  };

  function onHeightChange(height) {
    const validatedHeight = validateHeight(height);
    annotation.setHeight(validatedHeight);
    setHeight(validatedHeight);
    redrawAnnotation(annotation);
  };

  function validateWidth(width) {
    const documentWidth = getPageWidth();
    const maxWidth = documentWidth - annotation.X;
    if (width > maxWidth) {
      return maxWidth;
    } else {
      return width;
    }
  };

  function validateHeight(height) {
    const documentHeight = getPageHeight();
    const maxHeight = documentHeight - annotation.Y;
    if (height > maxHeight) {
      return maxHeight;
    } else {
      return height;
    }
  };

  function onCancel() {
    // If width/height changed return to original values
    if (width !== initialWidth || height !== initialHeight) {
      annotation.setWidth(initialWidth);
      annotation.setHeight(initialHeight);
    }
    redrawAnnotation(annotation);
    closeFormFieldEditPopup();
  };

  function renderInput(field) {
    if (field.type === 'text') {
      return renderTextInput(field);
    } else if (field.type === 'select') {
      return renderSelectInput(field);
    }
  };

  function renderTextInput(field) {
    return (
      <Input
        type="text"
        onChange={event => field.onChange(event.target.value)}
        value={field.value}
        fillWidth="false"
        messageText={field.required && !isValid ? t(validationMessage) : ''}
        message={field.required && !isValid ? 'warning' : 'default'}
        autoFocus={field.focus}
      />
    )
  };

  function renderSelectInput(field) {
    const displayRadioGroups = radioButtonGroups.map(group => ({ value: group, label: group }));
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
        <div className='radio-group-label'>{t('formField.formFieldPopup.radioGroups')}</div>
      </>)
  };

  function renderListOptions() {
    return (
      <div className="field-options-container">
        {t('formField.formFieldPopup.options')}
        <CreatableList
          options={options}
          onOptionsUpdated={onOptionsChange}
        />
      </div>
    )
  };

  return (
    <div className={className}>
      <div className="fields-container">
        {fields.map(field => (
          <div className="field-input" key={field.label}>
            <label>
              {t(field.label)}{field.required ? '*' : ''}:
            </label>
            {renderInput(field)}
          </div>
        ))}
      </div>
      {options && renderListOptions()}
      <div className="field-flags-container">
        <span className="field-flags-title">{t('formField.formFieldPopup.flags')}</span>
        {flags.map(flag => (
          <Choice
            key={flag.label}
            checked={flag.isChecked}
            onChange={event => flag.onChange(event.target.checked)}
            label={t(flag.label)} />
        ))}
      </div>
      <DimensionsInput
        width={width}
        height={height}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
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

const DimensionsInput = ({ width, height, onWidthChange, onHeightChange }) => {
  const { t } = useTranslation();

  return (
    <div className="form-dimension">
      <div>{t("formField.formFieldPopup.size")}:</div>
      <div className="form-dimension-input">
        <input
          id='form-field-width'
          type="number"
          min={0}
          value={width}
          onChange={(e) => onWidthChange(e.target.value)}
        /> {t("formField.formFieldPopup.width")}
      </div>
      <div className="form-dimension-input">
        <input
          id="form-field-height"
          type="number"
          min={0}
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
        /> {t("formField.formFieldPopup.height")}
      </div>
    </div>
  );
};
export default FormFieldEditPopup;
