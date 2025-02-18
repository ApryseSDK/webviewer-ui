import getToolStyles from 'src/helpers/getToolStyles';
import core from 'core';

const { Annotations, Tools } = window.Core;

export const defaultProperties = {
  name: '',
  defaultValue: '',
  radioButtonGroups: [],
};

export const defaultDimension = {
  width: 0,
  height: 0,
};

export const defaultFlags = {
  ReadOnly: false,
  Multiline: false,
  Required: false,
  MultiSelect: false,
};

export const handleFieldCreation = (annotation, fields, isSignatureOptionsDropdownDisabled) => {
  const currentTool = core.getToolMode();
  const panelFields = [];

  switch (true) {
    case annotation instanceof Annotations.RadioButtonWidgetAnnotation:
      panelFields.push(fields['RADIO_GROUP']);
      break;
    case !!annotation:
      panelFields.push(fields['NAME']);
      break;
  }

  switch (true) {
    case annotation instanceof Annotations.SignatureWidgetAnnotation && !isSignatureOptionsDropdownDisabled:
    case currentTool instanceof Tools.SignatureFormFieldCreateTool && !isSignatureOptionsDropdownDisabled:
      panelFields.push(fields['SIGNATURE_OPTION']);
      break;
  }

  const noneSelected = !annotation;
  const isTextWidgetSelected = annotation instanceof Annotations.TextWidgetAnnotation;
  const isTextFormFieldToolSelected = currentTool instanceof Tools.TextFormFieldCreateTool;

  const showDefaultValueInput = (
    isTextWidgetSelected ||
    // This handles an edge case where if the text field tool is active but a non-text widget is selected
    // it will incorrectly show the default value input for the wrong widget type.
    (isTextFormFieldToolSelected && (isTextWidgetSelected || noneSelected))
  );

  if (showDefaultValueInput) {
    panelFields.push(fields['DEFAULT_VALUE']);
  }

  return panelFields;
};

export const handleFlagsCreation = (annotation, flags) => {
  const fieldFlags = [flags['READ_ONLY'], flags['REQUIRED']];
  const currentTool = core.getToolMode();

  switch (true) {
    case annotation instanceof Annotations.TextWidgetAnnotation:
    case currentTool instanceof Tools.TextFormFieldCreateTool:
      fieldFlags.push(flags['MULTI_LINE']);
      break;
    case annotation instanceof Annotations.ListWidgetAnnotation:
    case currentTool instanceof Tools.ListBoxFormFieldCreateTool:
      fieldFlags.push(flags['MULTI_SELECT']);
      break;
  }
  return fieldFlags;
};

export const isRenderingOptions = (annotation) => {
  const currentTool = core.getToolMode();
  const isRenderingOptionsForWidget = annotation instanceof Annotations.ListWidgetAnnotation || annotation instanceof Annotations.ChoiceWidgetAnnotation;
  const isToolWithFieldOptions = currentTool instanceof Tools.ComboBoxFormFieldCreateTool || currentTool instanceof Tools.ListBoxFormFieldCreateTool;
  const isRenderingOptionsForTool = (!annotation || isRenderingOptionsForWidget) && isToolWithFieldOptions;
  return isRenderingOptionsForTool || isRenderingOptionsForWidget;
};

export const getSignatureOption = (widget) => {
  const formFieldCreationManager = core.getFormFieldCreationManager();
  if (widget) {
    return formFieldCreationManager.getSignatureOption(widget);
  }
  const currentTool = core.getToolMode();
  const toolStyles = getToolStyles(currentTool.name);
  return toolStyles?.signatureType || '';
};

export const redrawAnnotation = (annotation) => {
  core.getAnnotationManager().drawAnnotationsFromList([annotation]);
};

export const getPageHeight = () => {
  return core.getPageHeight(core.getCurrentPage());
};

export const getPageWidth = () => {
  return core.getPageWidth(core.getCurrentPage());
};

export const createFlags = (handleFlagChange, fieldFlags) => {
  return {
    READ_ONLY: {
      label: 'formField.formFieldPopup.readOnly',
      name: 'READ_ONLY',
      onChange: handleFlagChange,
      isChecked: fieldFlags.ReadOnly,
    },
    MULTI_LINE: {
      label: 'formField.formFieldPopup.multiLine',
      name: 'MULTILINE',
      onChange: handleFlagChange,
      isChecked: fieldFlags.Multiline,
    },
    REQUIRED: {
      label: 'formField.formFieldPopup.required',
      name: 'REQUIRED',
      onChange: handleFlagChange,
      isChecked: fieldFlags.Required,
    },
    MULTI_SELECT: {
      name: 'MULTI_SELECT',
      label: 'formField.formFieldPopup.multiSelect',
      onChange: handleFlagChange,
      isChecked: fieldFlags.MultiSelect,
    },
  };
};

export const createFields = (options) => {
  const { onFieldNameChange, onFieldValueChange, fieldProperties, onSignatureOptionChange, getSignatureOption, annotation } = options;
  return {
    NAME: {
      label: 'formField.formFieldPopup.fieldName',
      onChange: onFieldNameChange,
      value: fieldProperties.name,
      required: true,
      type: 'text',
      focus: true,
    },
    DEFAULT_VALUE: {
      label: 'formField.formFieldPopup.fieldValue',
      onChange: onFieldValueChange,
      value: fieldProperties.defaultValue,
      type: 'text',
    },
    RADIO_GROUP: {
      label: 'formField.formFieldPopup.fieldName',
      onChange: onFieldNameChange,
      value: fieldProperties.name,
      required: true,
      type: 'select',
    },
    SIGNATURE_OPTION: {
      label: 'formField.formFieldPopup.signatureOption',
      onChange: onSignatureOptionChange,
      value: getSignatureOption(annotation),
      required: false,
      type: 'signatureOption',
    }
  };
};

export const validateDimension = (value, documentSize, annotationOffset) => {
  const maxDimension = documentSize - annotationOffset;
  return Math.min(value, maxDimension);
};