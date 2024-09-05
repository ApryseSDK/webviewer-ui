import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import core from 'core';
import FormFieldEditPopup from './FormFieldEditPopup';
import FormFieldEditSignaturePopup from './FormFieldEditSignaturePopup';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import DataElementWrapper from '../DataElementWrapper';
import { isMobileSize } from 'helpers/getDeviceSize';
import DataElements from 'constants/dataElement';
import { PRIORITY_THREE } from 'constants/actionPriority';
import throttle from 'lodash/throttle';
import './FormFieldEditPopup.scss';
import debounce from 'lodash/debounce';

function FormFieldEditPopupContainer({ annotation }) {
  const formFieldCreationManager = core.getFormFieldCreationManager();
  const fieldLabels = formFieldCreationManager.getFieldLabels();
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [isReadOnly, setReadOnly] = useState(false);
  const [isMultiLine, setMultiLine] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [radioButtonGroups, setRadioButtonGroups] = useState([]);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [validationMessage, setValidationMessage] = useState('');
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorText, setIndicatorText] = useState('');
  const popupRef = useRef();
  const mountedRef = useRef(true);
  const sixtyFramesPerSecondIncrement = 16;

  const { RectangleAnnotation, EllipseAnnotation } = window.Core.Annotations;

  function validateEditingPlaceHolder(annot) {
    return (
      (annot instanceof RectangleAnnotation || annot instanceof EllipseAnnotation) &&
        !!annot.getCustomData(formFieldCreationManager.getFieldLabels().WIDGET_ID)
    );
  }
  const isEditingPlaceHolder = validateEditingPlaceHolder(annotation);

  const [isOpen] = useSelector(
    (state) => [selectors.isElementOpen(state, DataElements.FORM_FIELD_EDIT_POPUP)],
    shallowEqual,
  );

  const dispatch = useDispatch();

  useOnClickOutside(popupRef, () => {
    if (fieldName.trim() !== '') {
      closeAndReset();
    }
  });

  function closeAndReset(isConfirmingChanges) {
    dispatch(actions.enableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.closeElement(DataElements.FORM_FIELD_EDIT_POPUP));
    setFieldName('');
    setFieldValue('');
    setReadOnly(false);
    setMultiLine(false);
    setIsRequired(false);
    setIsMultiSelect(false);
    setIsValid(true);
    setShowIndicator(false);
    setIndicatorText('');
    const isTempDataPlaceholder = !isEditingPlaceHolder;
    if (isConfirmingChanges) {
      handleFieldConfirmation();
    } else if (isTempDataPlaceholder) {
      core.getAnnotationManager().deleteAnnotations([annotation]);
    }
  }

  function handleFieldConfirmation() {
    const ToolNames = window.Core.Tools.ToolNames;
    const fieldName = formFieldCreationManager.getFieldName(annotation);
    const existingField = core.getAnnotationManager().getFieldManager().getField(fieldName);
    const widget = formFieldCreationManager.getWidgetFromPlaceholder(annotation);
    const isCopying = annotation.getCustomData(fieldLabels.IS_DATA_PLACEHOLDER_COPY) === 'true';
    const isCreatingRadioFieldWithExistingGroup = existingField && annotation.ToolName === ToolNames.RADIO_FORM_FIELD && !validateEditingPlaceHolder(annotation);

    if ((!existingField || isCreatingRadioFieldWithExistingGroup || isCopying)) {
      formFieldCreationManager.createFormField(annotation);
    } else if (widget) {
      formFieldCreationManager.applyChangesToFormField(widget, annotation);
    } else {
      formFieldCreationManager.createFormField(annotation);
    }
  }

  const deleteFormFieldPlaceholder = useCallback((annotation) => {
    core.deleteAnnotations([annotation]);
  }, []);

  useEffect(() => {
    const onFormFieldCreationModeStarted = () => {
      // Do some cleanup of radio button groups,
      // gets rid of groups that may have been added but never actually placed as fields
      // or that were created but unlinked from a widget
      setRadioButtonGroups(formFieldCreationManager.getRadioButtonGroups());
    };

    core.addEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);

    return () => {
      core.removeEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
    };
  }, []);

  // When we open the popup we need to populate the radio list with radio groups that are created,
  // but not yet added as fields
  useEffect(() => {
    const radioButtons = core.getAnnotationsList().filter((annotation) => {
      return annotation.isFormFieldPlaceholder() && annotation.getFormFieldPlaceholderType() === 'RadioButtonFormField';
    });
    const radioGroups = radioButtons.map((radioButton) => {
      return formFieldCreationManager.getFieldName(radioButton);
    });
    const dedupedRadioGroups = [...(new Set([...radioGroups]))];
    setRadioButtonGroups(dedupedRadioGroups);
  }, []);

  const setPopupPosition = () => {
    if (popupRef.current && mountedRef.current) {
      setPosition(getAnnotationPopupPositionBasedOn(annotation, popupRef));
    }
  };

  const handleResize = throttle(() => {
    setPopupPosition();
  }, sixtyFramesPerSecondIncrement);

  useEffect(() => {
    mountedRef.current = true;
    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // We use layout effect to avoid a flickering as the popup is repositioned
  // The flow is open popup -> update position.
  // So we first open with an old position and then re-render to the new position. By using layoutEffect
  // we let the hook run and update the position, and then the browser updates
  useLayoutEffect(() => {
    if (isOpen && annotation) {
      setPopupPosition();
      setFieldName(formFieldCreationManager.getFieldName(annotation));
      setFieldValue(formFieldCreationManager.getFieldValue(annotation));
      setReadOnly(formFieldCreationManager.getFieldFlag(annotation, fieldLabels.READ_ONLY));
      setMultiLine(formFieldCreationManager.getFieldFlag(annotation, fieldLabels.MULTI_LINE));
      setIsRequired(formFieldCreationManager.getFieldFlag(annotation, fieldLabels.REQUIRED));
      setIsMultiSelect(formFieldCreationManager.getFieldFlag(annotation, fieldLabels.MULTI_SELECT));
      const dedupedRadioGroups = [...(new Set([...radioButtonGroups, ...formFieldCreationManager.getRadioButtonGroups()]))];
      setRadioButtonGroups(dedupedRadioGroups);
      setShowIndicator(formFieldCreationManager.getShowIndicator(annotation));
      setIndicatorText(formFieldCreationManager.getIndicatorText(annotation));
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    const setPosition = debounce(() => {
      if (popupRef.current) {
        setPopupPosition();
      }
    }, 100);

    const scrollViewElement = core.getDocumentViewer().getScrollViewElement();
    scrollViewElement?.addEventListener('scroll', setPosition);

    return () => scrollViewElement?.removeEventListener('scroll', setPosition);
  }, [annotation]);

  const onFieldNameChange = useCallback((name) => {
    const validatedResponse = formFieldCreationManager.setFieldName(annotation, name);
    setIsValid(validatedResponse.isValid);
    mapValidationResponseToTranslation(validatedResponse);
  }, [annotation]);

  const mapValidationResponseToTranslation = (validationResponse) => {
    const { errorType } = validationResponse;
    let translationKey = '';

    switch (errorType) {
      case 'empty':
        translationKey = 'formField.formFieldPopup.invalidField.empty';
        break;
      case 'duplicate':
        translationKey = 'formField.formFieldPopup.invalidField.duplicate';
        break;
    }

    setValidationMessage(translationKey);
  };

  const onFieldValueChange = useCallback((value) => {
    formFieldCreationManager.setFieldValue(annotation, value);
  }, [annotation]);

  const confirmReadOnlyChange = useCallback((isReadOnly) => {
    formFieldCreationManager.setFieldFlag(annotation, fieldLabels.READ_ONLY, isReadOnly);
  }, [annotation]);

  const confirmMultiLineChange = useCallback((isMultiLine) => {
    formFieldCreationManager.setFieldFlag(annotation, fieldLabels.MULTI_LINE, isMultiLine);
  }, [annotation]);

  const confirmRequiredChange = useCallback((isRequired) => {
    formFieldCreationManager.setFieldFlag(annotation, fieldLabels.REQUIRED, isRequired);
  }, [annotation]);

  const confirmMultiSelectChange = useCallback((isMultiSelect) => {
    formFieldCreationManager.setFieldFlag(annotation, fieldLabels.MULTI_SELECT, isMultiSelect);
  }, [annotation]);

  const confirmFieldOptionsChange = useCallback((options) => {
    formFieldCreationManager.setFieldOptions(annotation, options);
  }, [annotation]);

  const confirmShowFieldIndicatorChange = useCallback((showIndicator) => {
    formFieldCreationManager.setShowIndicator(annotation, showIndicator);
  }, [annotation]);

  const confirmFieldIndicatorTextChange = useCallback((indicatorText) => {
    formFieldCreationManager.setIndicatorText(annotation, indicatorText);
  }, [annotation]);

  const closeFormFieldEditPopup = useCallback((isConfirmingChanges) => {
    closeAndReset(isConfirmingChanges);
  }, []);

  const onCancelEmptyFieldName = useCallback((placeholderAnnotation) => {
    const widget = formFieldCreationManager.getWidgetFromPlaceholder(placeholderAnnotation);
    if (widget) {
      // Reset name field to widget's original name.
      onFieldNameChange(widget.getField().name);
    } else {
      deleteFormFieldPlaceholder(placeholderAnnotation);
    }

    closeFormFieldEditPopup();
  }, []);

  const onCloseRadioButtonPopup = useCallback((isConfirmingChanges) => {
    // Add new radio group (if any) to existing radio groups and we were in a valid state
    if (isValid && radioButtonGroups.indexOf(fieldName) === -1 && fieldName !== '') {
      setRadioButtonGroups([fieldName, ...radioButtonGroups]);
    }
    closeAndReset(isConfirmingChanges);
  }, [fieldName, radioButtonGroups]);

  const redrawAnnotation = useCallback((annotation) => {
    core.getAnnotationManager().drawAnnotationsFromList([annotation]);
  }, []);

  const getPageHeight = useCallback(() => {
    return core.getPageHeight(core.getCurrentPage());
  }, []);

  const getPageWidth = useCallback(() => {
    return core.getPageWidth(core.getCurrentPage());
  }, []);

  const getSignatureOption = useCallback((formFieldPlaceHolder) => {
    return formFieldCreationManager.getSignatureOption(formFieldPlaceHolder);
  }, []);

  const fields = {
    NAME: {
      label: 'formField.formFieldPopup.fieldName',
      confirmChange: onFieldNameChange,
      value: fieldName,
      setValue: setFieldName,
      required: true,
      type: 'text',
      focus: true,
    },
    VALUE: {
      label: 'formField.formFieldPopup.fieldValue',
      confirmChange: onFieldValueChange,
      value: fieldValue,
      setValue: setFieldValue,
      type: 'text',
    },
    RADIO_GROUP: {
      label: 'formField.formFieldPopup.fieldName',
      confirmChange: onFieldNameChange,
      value: fieldName,
      setValue: setFieldName,
      required: true,
      type: 'select',
    },
  };

  const textFields = [fields['NAME'], fields['VALUE']];

  const defaultFields = [fields['NAME']];

  const radioButtonFields = [fields['RADIO_GROUP']];

  const listBoxFields = [fields['NAME']];

  const comboBoxFields = [fields['NAME']];

  const isMobile = isMobileSize();

  const flags = {
    READ_ONLY: {
      label: 'formField.formFieldPopup.readOnly',
      confirmChange: confirmReadOnlyChange,
      isChecked: isReadOnly,
      setIsChecked: setReadOnly,
    },
    MULTI_LINE: {
      label: 'formField.formFieldPopup.multiLine',
      confirmChange: confirmMultiLineChange,
      isChecked: isMultiLine,
      setIsChecked: setMultiLine,
    },
    REQUIRED: {
      label: 'formField.formFieldPopup.required',
      confirmChange: confirmRequiredChange,
      isChecked: isRequired,
      setIsChecked: setIsRequired
    },
    MULTI_SELECT: {
      label: 'formField.formFieldPopup.multiSelect',
      confirmChange: confirmMultiSelectChange,
      isChecked: isMultiSelect,
      setIsChecked: setIsMultiSelect
    },
  };

  const textFieldFlags = [flags['READ_ONLY'], flags['MULTI_LINE'], flags['REQUIRED']];

  const signatureFlags = [flags['REQUIRED'], flags['READ_ONLY']];

  const checkBoxFlags = [flags['READ_ONLY'], flags['REQUIRED']];

  const radioButtonFlags = [flags['READ_ONLY'], flags['REQUIRED']];

  const listBoxFlags = [flags['MULTI_SELECT'], flags['READ_ONLY'], flags['REQUIRED']];

  const comboBoxFlags = [flags['READ_ONLY'], flags['REQUIRED']];

  const indicator = {
    label: 'formField.formFieldPopup.documentFieldIndicator',
    confirmToggleIndicator: confirmShowFieldIndicatorChange,
    confirmTextChange: confirmFieldIndicatorTextChange,
    isChecked: showIndicator,
    setIsChecked: setShowIndicator,
    textValue: indicatorText,
    setTextValue: setIndicatorText
  };

  const renderTextFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={textFields}
      flags={textFieldFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      setIsValid={setIsValid}
      validationMessage={validationMessage}
      setValidationMessage={setValidationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
      onCancelEmptyFieldName={onCancelEmptyFieldName}
    />
  );

  const renderSignatureFormFieldEditPopup = () => (
    <FormFieldEditSignaturePopup
      fields={defaultFields}
      flags={signatureFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      setIsValid={setIsValid}
      validationMessage={validationMessage}
      setValidationMessage={setValidationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      getSignatureOptionHandler={getSignatureOption}
      indicator={indicator}
      onCancelEmptyFieldName={onCancelEmptyFieldName}
    />
  );

  const renderCheckboxFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={defaultFields}
      flags={checkBoxFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      setIsValid={setIsValid}
      validationMessage={validationMessage}
      setValidationMessage={setValidationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
      onCancelEmptyFieldName={onCancelEmptyFieldName}
    />
  );

  const renderRadioButtonFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={radioButtonFields}
      flags={radioButtonFlags}
      closeFormFieldEditPopup={onCloseRadioButtonPopup}
      isValid={isValid}
      setIsValid={setIsValid}
      validationMessage={validationMessage}
      setValidationMessage={setValidationMessage}
      radioButtonGroups={radioButtonGroups}
      annotation={annotation}
      selectedRadioGroup={fieldName}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
      onCancelEmptyFieldName={onCancelEmptyFieldName}
    />
  );

  const renderListBoxFormFieldEditPopup = () => {
    const fieldOptions = formFieldCreationManager.getFieldOptions(annotation);

    return (
      <FormFieldEditPopup
        fields={listBoxFields}
        flags={listBoxFlags}
        options={fieldOptions}
        confirmFieldOptionsChange={confirmFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        setIsValid={setIsValid}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
        annotation={annotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
        indicator={indicator}
        onCancelEmptyFieldName={onCancelEmptyFieldName}
      />
    );
  };

  const renderComboBoxFormFieldEditPopup = () => {
    const fieldOptions = formFieldCreationManager.getFieldOptions(annotation);

    return (
      <FormFieldEditPopup
        fields={comboBoxFields}
        flags={comboBoxFlags}
        options={fieldOptions}
        confirmFieldOptionsChange={confirmFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        setIsValid={setIsValid}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
        annotation={annotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
        indicator={indicator}
        onCancelEmptyFieldName={onCancelEmptyFieldName}
      />
    );
  };

  const renderPopUp = () => {
    const intent = annotation?.getFormFieldPlaceholderType();
    if (intent === 'TextFormField') {
      return renderTextFormFieldEditPopup();
    }
    if (intent === 'SignatureFormField') {
      return renderSignatureFormFieldEditPopup();
    }
    if (intent === 'CheckBoxFormField') {
      return renderCheckboxFormFieldEditPopup();
    }
    if (intent === 'RadioButtonFormField') {
      return renderRadioButtonFormFieldEditPopup();
    }
    if (intent === 'ListBoxFormField') {
      return renderListBoxFormFieldEditPopup();
    }
    if (intent === 'ComboBoxFormField') {
      return renderComboBoxFormFieldEditPopup();
    }
    return null;
  };

  const renderFormFieldEditPopup = () => (
    <DataElementWrapper
      className={classNames({
        Popup: true,
        FormFieldEditPopupContainer: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element={DataElements.FORM_FIELD_EDIT_POPUP}
      style={{ ...position }}
      ref={popupRef}
    >
      {isOpen && renderPopUp()}
    </DataElementWrapper>
  );

  if (!isMobile) {
    // disable draggable on mobile devices
    return (
      <Draggable cancel=".Button, .cell, .sliders-container svg, .creatable-list, .ui__input__input, .form-dimension-input, .ui__choice__input">
        {renderFormFieldEditPopup()}
      </Draggable>
    );
  }
  return renderFormFieldEditPopup();
}

export default React.memo(FormFieldEditPopupContainer);
