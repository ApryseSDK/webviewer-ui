import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import core from 'core';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import classNames from 'classnames';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import { PRIORITY_THREE } from 'constants/actionPriority';
import getToolStyles from 'helpers/getToolStyles';
import setToolStyles from 'helpers/setToolStyles';
import { isMobileSize } from 'helpers/getDeviceSize';
import mapValidationResponseToTranslation from 'helpers/mapValidationResponseToTranslation';
import FormFieldPanel from './FormFieldPanel';
import './FormFieldPanel.scss';
import { createFields, createFlags, defaultDimension, defaultFlags, defaultProperties, getPageHeight, getPageWidth, getSignatureOption, handleFieldCreation, handleFlagsCreation, isRenderingOptions, redrawAnnotation, validateDimension } from './utils';

const { Annotations, Tools } = window.Core;

const propTypes = {
  annotation: PropTypes.object,
};

const FormFieldPanelContainer = React.memo(({ annotation }) => {
  const [
    isOpen,
    toolButtonObject,
    isSignatureOptionsDropdownDisabled,
    isInDesktopOnlyMode,
    mobilePanelSize,
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.FORM_FIELD_PANEL),
      selectors.getToolButtonObjects(state),
      selectors.isElementDisabled(state, 'signatureOptionsDropdown'),
      selectors.isInDesktopOnlyMode(state),
      selectors.getMobilePanelSize(state),
      selectors.getFeatureFlags(state),
    ],
    shallowEqual,
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isMobile = isMobileSize();
  const customizableUI = featureFlags.customizableUI;

  const [fieldProperties, setFieldProperties] = useState(defaultProperties);
  const [fieldDimension, setFieldDimension] = useState(defaultDimension);
  const [fieldFlags, setFieldFlags] = useState(defaultFlags);
  const [indicator, setIndicator] = useState({
    showIndicator: false,
    indicatorText: '',
  });

  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const currentTool = core.getToolMode();
  const isUsingDefaultOptions = currentTool instanceof Tools.ListBoxFormFieldCreateTool || currentTool instanceof Tools.ComboBoxFormFieldCreateTool;

  const [toolOptions, setToolOptions] = useState(isUsingDefaultOptions ? currentTool.defaults.options : []);
  const [fieldOptions, setFieldOptions] = useState(annotation?.getFieldOptions() ?? []);
  const [panelTitle, setPanelTitle] = useState();
  function closeAndReset() {
    dispatch(actions.enableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.closeElement(DataElements.FORM_FIELD_PANEL));
    setFieldProperties(defaultProperties);
    setFieldDimension(defaultDimension);
    setFieldFlags(defaultFlags);
    setIndicator({
      showIndicator: false,
      indicatorText: '',
    });
    setPanelTitle('');
    setIsValid(true);
  }

  const formFieldCreationManager = core.getFormFieldCreationManager();

  const setPanelTitleForTool = (toolName) => {
    const title = toolButtonObject[toolName].title;
    setPanelTitle(`${t(title)} ${t('stylePanel.headings.tool')}`);
  };

  const deleteWidgetsInFormBuilderMode = useCallback((annotation) => {
    core.deleteAnnotations([annotation]);
  }, []);

  const handleToolModeChange = useCallback((newTool) => {
    if (newTool instanceof Tools.FormFieldCreateTool) {
      const { options , flags, Width: width = 0, Height: height = 0, value = '', indicatorText = '', showIndicator = false } = getToolStyles(newTool.name) || {};
      setFieldProperties((prev) => ({ ...prev, value }));
      setFieldDimension({ width, height });
      setFieldFlags({
        ReadOnly: flags?.READ_ONLY || false,
        Required: flags?.REQUIRED || false,
        Multiline: flags?.MULTILINE || false,
        MultiSelect: flags?.MULTI_SELECT || false
      });
      setToolOptions(options);
      setIndicator({ showIndicator, indicatorText });
      setPanelTitleForTool(newTool.name);
    } else {
      closeAndReset();
    }
  }, [toolButtonObject, t]);

  useEffect(() => {
    const radioButtons = core.getAnnotationsList().filter((annotation) => {
      return annotation instanceof Annotations.RadioButtonWidgetAnnotation;
    });
    const radioGroups = radioButtons.map((radioButton) => radioButton.getField().name);
    const dedupedRadioGroups = [...(new Set([...radioGroups]))];
    setFieldProperties((previousFieldProperties) => ({
      ...previousFieldProperties,
      radioButtonGroups: dedupedRadioGroups,
    }));

    const onFormFieldCreationModeStarted = () => {
      setFieldProperties((fieldProperties) => ({
        ...fieldProperties,
        radioButtonGroups: formFieldCreationManager.getRadioButtonGroups(),
      }));
    };
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'deselected') {
        const currentTool = core.getToolMode();
        const isFormFieldCreateTool = currentTool instanceof Tools.FormFieldCreateTool;
        if (isFormFieldCreateTool) {
          handleToolModeChange(currentTool);
        } else {
          setTimeout(() => {
            if (!annotation) {
              closeAndReset();
            }
          }, 500);
        }
      }
    };

    core.addEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => {
      core.removeEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, []);

  const handleOptionsSettings = (annotation) => {
    const options = annotation.getFieldOptions();
    if (options.length === 1 && options[0].value === '' && options[0].displayValue === '') {
      setFieldOptions([]);
    } else {
      setFieldOptions(options);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (!annotation) {
      handleToolModeChange(core.getToolMode());
      return;
    }
    handleOptionsSettings(annotation);
    const currentFlags = annotation.getFieldFlags();
    const { READ_ONLY, MULTILINE, REQUIRED, MULTI_SELECT } = Annotations.WidgetFlags;
    const field = annotation.getField();
    const fieldName = field.name;
    const radioButtons = fieldProperties.radioButtonGroups;
    const isFieldNameValid = Boolean(fieldName);
    const validationMessage = isFieldNameValid ? '' : 'formField.formFieldPopup.invalidField.empty';

    setIsValid(isFieldNameValid);
    setFieldDimension({ width: parseInt(annotation.Width), height: parseInt(annotation.Height) });
    setFieldProperties((prev) => ({
      ...prev,
      name: fieldName,
      value: field.value,
      radioButtonGroups: [...new Set([...radioButtons, ...formFieldCreationManager.getRadioButtonGroups()])]
    }));
    setFieldFlags({
      ReadOnly: currentFlags[READ_ONLY] || false,
      Multiline: currentFlags[MULTILINE] || false,
      Required: currentFlags[REQUIRED] || false,
      MultiSelect: currentFlags[MULTI_SELECT] || false,
    });
    setIndicator({
      showIndicator: formFieldCreationManager.getShowIndicator(annotation),
      indicatorText: formFieldCreationManager.getIndicatorText(annotation),
    });
    setPanelTitle(t(`formField.formFieldPanel.${field.getFieldType()}`));
    setValidationMessage(validationMessage);
  }, [isOpen, annotation]);

  const onFieldNameChange = useCallback((name) => {
    const validatedResponse = formFieldCreationManager.setFieldName(annotation, name);
    setIsValid(validatedResponse.isValid);
    const validationResponse = mapValidationResponseToTranslation(validatedResponse);
    setValidationMessage(validationResponse);
    setFieldProperties((previousFieldProperties) => ({
      ...previousFieldProperties,
      name,
    }));
    updateFlagsForRadioAnnotation();
  }, [annotation]);

  const updateFlagsForRadioAnnotation = useCallback(() => {
    if (annotation && annotation instanceof Annotations.RadioButtonWidgetAnnotation) {
      const currentFlags = annotation.getField().flags;
      const { READ_ONLY, REQUIRED } = Annotations.WidgetFlags;
      setFieldFlags((flags) => ({
        ...flags,
        ReadOnly: currentFlags.get(READ_ONLY) || false,
        Required: currentFlags.get(REQUIRED) || false,
      }));
    }
  }, [annotation]);

  const handleFlagChange = useCallback((value, flagName) => {
    setFieldFlags((previousFieldFlags) => ({
      ...previousFieldFlags,
      [Annotations.WidgetFlags[flagName]]: value,
    }));
    if (annotation) {
      annotation.setFieldFlag(Annotations.WidgetFlags[flagName], value);
    } else {
      const currentTool = core.getToolMode();
      const toolStyles = getToolStyles(currentTool.name);
      const flags = { ...toolStyles?.flags };
      flags[flagName] = value;
      setToolStyles(currentTool.name, 'flags', flags);
    }
  }, [annotation]);

  const onFieldValueChange = useCallback((value) => {
    setFieldProperties((previousFieldProperties) => ({
      ...previousFieldProperties,
      value,
    }));
    if (annotation) {
      annotation.getField().setValue(value);
    } else {
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'value', value);
    }
  }, [annotation]);

  const onFieldOptionsChange = useCallback((options) => {
    annotation.setFieldOptions(options);
  }, [fieldOptions, annotation]);

  const onToolOptionsChange = useCallback((options) => {
    const currentTool = core.getToolMode();
    currentTool.defaults.options = options;
  });

  const onShowFieldIndicatorChange = useCallback((showIndicator) => {
    setIndicator((previousIndicator) => ({
      ...previousIndicator,
      showIndicator,
    }));
    if (annotation) {
      formFieldCreationManager.setShowIndicator(annotation, showIndicator);
    } else {
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'showIndicator', showIndicator);
    }
  }, [annotation]);

  const onFieldIndicatorTextChange = useCallback((indicatorText) => {
    setIndicator((previousIndicator) => ({
      ...previousIndicator,
      indicatorText,
    }));
    if (annotation) {
      formFieldCreationManager.setIndicatorText(annotation, indicatorText);
    } else {
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'indicatorText', indicatorText);
    }
  }, [annotation]);

  const closeFormFieldEditPanel = useCallback(() => {
    closeAndReset();
  }, []);

  const onWidthChange = (newWidth) => {
    if (annotation) {
      const validatedWidth = validateDimension(newWidth, getPageWidth(), annotation.X);
      annotation.setWidth(validatedWidth);
      setFieldDimension((previousFieldDimension) => ({
        ...previousFieldDimension,
        width: validatedWidth,
      }));
      redrawAnnotation(annotation);
    } else {
      setFieldDimension((previousFieldDimension) => ({
        ...previousFieldDimension,
        width: newWidth,
      }));
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'Width', newWidth);
    }
  };

  const onHeightChange = (newHeight) => {
    if (annotation) {
      const validatedHeight = validateDimension(newHeight, getPageHeight(), annotation.Y);
      annotation.setHeight(validatedHeight);
      setFieldDimension((previousFieldDimension) => ({
        ...previousFieldDimension,
        height: validatedHeight
      }));
      redrawAnnotation(annotation);
    } else {
      setFieldDimension((previousFieldDimension) => ({
        ...previousFieldDimension,
        height: newHeight,
      }));
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'Height', newHeight);
    }
  };

  const onCancelEmptyFieldName = useCallback((widgetAnnotation) => {
    const widget = widgetAnnotation;
    if (widget) {
      onFieldNameChange(widget.getField().name);
    } else {
      deleteWidgetsInFormBuilderMode(widgetAnnotation);
    }
    closeFormFieldEditPanel();
  }, []);

  const onCloseRadioButtonPanel = useCallback(() => {
    if (isValid && fieldProperties.radioButtonGroups.indexOf(fieldProperties.name) === -1 && fieldProperties.name !== '') {
      setFieldProperties((previousFieldProperties) => ({
        ...previousFieldProperties,
        radioButtonGroups: [fieldProperties.name, ...previousFieldProperties.radioButtonGroups],
      }));
    }
    closeAndReset();
  }, [fieldProperties]);

  const onSignatureOptionChange = useCallback((signatureOption) => {
    const { value } = signatureOption;
    if (annotation) {
      formFieldCreationManager.setSignatureOption(annotation, value);
    } else {
      const currentTool = core.getToolMode();
      setToolStyles(currentTool.name, 'signatureType', value);
    }
  }, [annotation]);

  const closeFormFieldPanel = () => {
    dispatch(actions.closeElement(DataElements.FORM_FIELD_PANEL));
  };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <button className="close-icon-container" onClick={closeFormFieldPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </button>
      </div>
    );
  };

  const options = { onFieldNameChange, onFieldValueChange, fieldProperties, onSignatureOptionChange, getSignatureOption, annotation };
  const fields = createFields(options);
  const flags = createFlags(handleFlagChange, fieldFlags);

  const indicatorProps = {
    label: 'formField.formFieldPopup.includeFieldIndicator',
    toggleIndicator: onShowFieldIndicatorChange,
    isChecked: indicator.showIndicator,
    onChange: onFieldIndicatorTextChange,
    value: indicator.indicatorText,
  };

  const renderPanel = () => {
    const panelFields = handleFieldCreation(annotation, fields, isSignatureOptionsDropdownDisabled);
    const panelFlags = handleFlagsCreation(annotation, flags);
    const shouldShowOptions = isRenderingOptions(annotation);

    return (
      <FormFieldPanel
        width={fieldDimension.width}
        height={fieldDimension.height}
        isValid={isValid}
        panelTitle={panelTitle}
        fields={panelFields}
        flags={panelFlags}
        validationMessage={validationMessage}
        radioButtonGroups={fieldProperties.radioButtonGroups}
        onFieldOptionsChange={onFieldOptionsChange}
        fieldOptions={fieldOptions}
        onToolOptionsChange={onToolOptionsChange}
        toolOptions={toolOptions}
        annotation={annotation}
        selectedRadioGroup={fieldProperties.name}
        redrawAnnotation={redrawAnnotation}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
        indicator={indicatorProps}
        onCancelEmptyFieldName={onCancelEmptyFieldName}
        closeFormFieldEditPanel={onCloseRadioButtonPanel}
        shouldShowOptions={shouldShowOptions}
      />
    );
  };

  return (
    <DataElementWrapper dataElement={DataElements.FORM_FIELD_PANEL} className={
      classNames({
        'Panel': true,
        'FormFieldPanel': true,
        [mobilePanelSize]: isMobile,
        'modular-ui-panel': customizableUI,
      })
    }>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      {renderPanel()}
    </DataElementWrapper>
  );
});

FormFieldPanelContainer.displayName = 'FormFieldPanelContainer';
FormFieldPanelContainer.propTypes = propTypes;

export default FormFieldPanelContainer;