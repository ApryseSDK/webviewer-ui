import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import CreatableDropdown from '../CreatableDropdown';
import CreatableList from '../CreatableList';
import HorizontalDivider from '../HorizontalDivider';
import Button from '../Button';
import getToolStyles from 'helpers/getToolStyles';
import core from 'core';
import TextInput from 'components/TextInput';
import SignatureOptionsDropdown from 'components/FormFieldEditPopup/FormFieldEditSignaturePopup/SignatureOptionsDropdown';
import FormFieldEditPanelIndicator from './FormFieldEditPanelIndicator';
import './FormFieldPanel.scss';

const FormFieldPanel = ({
  width,
  height,
  panelTitle,
  fields,
  flags,
  closeFormFieldEditPanel,
  isValid,
  validationMessage,
  toolOptions,
  onToolOptionsChange,
  fieldOptions,
  onFieldOptionsChange,
  annotation,
  onWidthChange,
  onHeightChange,
  indicator,
  shouldShowOptions = false,
  fieldProperties,
  onRadioFieldNameChange,
}) => {
  const { t } = useTranslation();

  const getIndicatorPlaceholderFromAnnotation = useCallback((annotation) => {
    const isSignatureAnnotation = annotation.getField().getFieldType() === 'SignatureFormField';
    if (isSignatureAnnotation) {
      const formFieldCreationManager = core.getFormFieldCreationManager();
      return t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${formFieldCreationManager.getSignatureOption(annotation)}`);
    }
    return t(`formField.formFieldPopup.indicatorPlaceHolders.${annotation.getField().getFieldType()}`);
  });

  const getIndicatorPlaceholderFromTool = useCallback((currentTool) => {
    const style = getToolStyles(currentTool.name);
    const isSignatureTool = currentTool.name === 'SignatureFormFieldCreateTool';
    if (isSignatureTool) {
      const signatureType = style?.signatureType;
      return t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${signatureType}`);
    }
    const formFieldTypes = style?.FormFieldTypes;
    return t(`formField.formFieldPopup.indicatorPlaceHolders.${formFieldTypes}`);
  });

  const getIndicatorPlaceholder = useCallback(() => {
    if (annotation) {
      return getIndicatorPlaceholderFromAnnotation(annotation);
    }
    const currentTool = core.getToolMode();
    return getIndicatorPlaceholderFromTool(currentTool);
  }, [annotation, t]);

  const [indicatorPlaceholder, setIndicatorPlaceholder] = useState(getIndicatorPlaceholder());

  useEffect(() => {
    setIndicatorPlaceholder(getIndicatorPlaceholder());
  }, [panelTitle, getIndicatorPlaceholder]);

  const onSelectInputChange = useCallback((field, input) => {
    field.onChange(input?.value || '');
    onRadioFieldNameChange(input?.value || '');
  }, []);

  const renderTextInput = (field) => {
    const { required, label, onChange, value } = field;
    const hasError = required && !isValid;
    return (
      <div className="field-text-input">
        <span id={label}>
          {t(label)}{required ? '*' : ''}:
        </span>
        <TextInput
          label={`${label}-input`}
          value={value}
          onChange={onChange}
          validationMessage={validationMessage}
          hasError={hasError}
          ariaDescribedBy={hasError ? 'FormFieldInputError' : undefined}
          ariaLabelledBy={label}
        />
      </div>
    );
  };
  const renderSelectInput = (field) => {
    const value = { value: fieldProperties.name, label: fieldProperties.name };
    return (
      <div className="field-select-input">
        <label>
          {t(field.label)}{field.required ? '*' : ''}:
        </label>
        <CreatableDropdown
          textPlaceholder={t('formField.formFieldPopup.fieldName')}
          options={fieldProperties.radioButtonGroups.map((group) => ({ value: group, label: group }))}
          onChange={(inputValue) => onSelectInputChange(field, inputValue)}
          value={value}
          isValid={isValid}
          messageText={t(validationMessage)}
        />
        <div className="radio-group-label">{t('formField.formFieldPopup.radioGroups')}</div>
      </div>
    );
  };

  const renderSignatureOption = (field) => {
    const onOptionChange = (option) => {
      field.onChange(option);
      const { value } = option;
      setIndicatorPlaceholder(t(`formField.formFieldPopup.indicatorPlaceHolders.SignatureFormField.${value}`));
    };
    return <SignatureOptionsDropdown onChangeHandler={onOptionChange} initialOption={field.value} />;
  };

  const renderFieldInput = (field) => {
    switch (field.type) {
      case 'text':
        return renderTextInput(field);
      case 'select':
        return renderSelectInput(field);
      case 'signatureOption':
        return renderSignatureOption(field);
      default:
        return null;
    }
  };

  const renderListOptions = (options) => {
    const optionsKey = options.map((option) => option.value || '').join('');
    return (
      <>
        <div className="field-options-container">
          <span className="option-title">{t('formField.formFieldPopup.options')}</span>
          <CreatableList
            options={annotation ? fieldOptions : toolOptions}
            onOptionsUpdated={annotation ? onFieldOptionsChange : onToolOptionsChange}
            key={optionsKey}
          />
        </div>
        <HorizontalDivider />
      </>
    );
  };

  const renderProperties = (flags) => (
    <div className="properties-container">
      <h2 className="property-title" id="property-group">{t('formField.formFieldPopup.properties')}</h2>
      <div role="group" aria-labelledby="property-group">
        {flags.map((flag) => (
          <Choice
            id={t(flag.label)}
            className="form-field-checkbox"
            key={t(flag.label)}
            checked={flag.isChecked}
            onChange={(event) => flag.onChange(event.target.checked, flag.name)}
            label={t(flag.label)}
            aria-checked={flag.isChecked}
          />
        ))}
        <FormFieldEditPanelIndicator indicator={indicator} indicatorPlaceholder={indicatorPlaceholder} />
      </div>
    </div>
  );

  const renderFormFieldDimensions = () => (
    <div className="form-dimension">
      <span className="form-dimension-title">{t('formField.formFieldPopup.fieldSize')}</span>
      <div className='form-dimension-input-container'>
        <div className="form-dimension-input">
          <span id="form-field-width">{t('formField.formFieldPopup.width')}</span>
          <input
            id="form-field-width-input"
            type="number"
            min={0}
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            aria-label='form-field-width-input'
            aria-labelledby='form-field-width'
          />
        </div>
        <div className="form-dimension-input">
          <span id="form-field-height">{t('formField.formFieldPopup.height')}</span>
          <input
            id="form-field-height"
            type="number"
            min={0}
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            aria-label='form-field-height-input'
            aria-labelledby='form-field-height'
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="form-field-content-container">
        <div className="field-title">{panelTitle}</div>
        {!!fields.length && (
          <>
            <div className="fields-container">
              {fields.map((field) => (
                <div className="field-input" key={field.label}>
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
            <HorizontalDivider />
          </>
        )}
        {shouldShowOptions && renderListOptions(annotation ? fieldOptions : toolOptions)}
        {renderProperties(flags)}
        <HorizontalDivider />
        {renderFormFieldDimensions()}
      </div>
      <div className="form-buttons-container">
        <Button
          className="ok-form-field-button"
          onClick={closeFormFieldEditPanel}
          dataElement="formFieldOK"
          label={t('action.close')}
          disabled={!isValid}
        />
      </div>
    </>
  );
};

FormFieldPanel.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  panelTitle: PropTypes.string,
  fields: PropTypes.array.isRequired,
  flags: PropTypes.array.isRequired,
  closeFormFieldEditPanel: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string,
  toolOptions: PropTypes.array,
  onToolOptionsChange: PropTypes.func,
  fieldOptions: PropTypes.array,
  onFieldOptionsChange: PropTypes.func,
  annotation: PropTypes.object,
  indicator: PropTypes.object.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  shouldShowOptions: PropTypes.bool,
  fieldProperties: PropTypes.object,
  onRadioFieldNameChange: PropTypes.func,
};

export default FormFieldPanel;
