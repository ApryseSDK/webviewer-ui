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
import PropTypes from 'prop-types';

const { Annotations } = window.Core;

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

function FormFieldEditPopupContainer({ annotation }) {
  const formFieldCreationManager = core.getFormFieldCreationManager();
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

  function closeAndReset() {
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
  }

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
      return annotation instanceof Annotations.RadioButtonWidgetAnnotation;
    });
    const radioGroups = radioButtons.map((radioButton) => {
      return radioButton.getField().name;
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
      const currentFlags = annotation.getFieldFlags();
      const isReadOnly = currentFlags[Annotations.WidgetFlags.READ_ONLY];
      const isMultiLine = currentFlags[Annotations.WidgetFlags.MULTILINE];
      const isRequired = currentFlags[Annotations.WidgetFlags.REQUIRED];
      const isMultiSelect = currentFlags[Annotations.WidgetFlags.MULTI_SELECT];

      const field = annotation.getField();

      setPopupPosition();
      setFieldName(field.name);
      setFieldValue(field.value);
      setReadOnly(isReadOnly || false);
      setMultiLine(isMultiLine || false);
      setIsRequired(isRequired || false);
      setIsMultiSelect(isMultiSelect || false);
      const dedupedRadioGroups = [...(new Set([...radioButtonGroups, ...formFieldCreationManager.getRadioButtonGroups()]))];
      setRadioButtonGroups(dedupedRadioGroups);
      // Field name is required, so if this is an empty string
      // the field is not valid and the user should be warned
      // As a failsafe the FormFieldCreationManager will create a unique field name if this is left blank
      const isFieldNameValid = !!field.name;
      setIsValid(isFieldNameValid);
      let validationMessage = '';
      if (!isFieldNameValid) {
        validationMessage = 'formField.formFieldPopup.invalidField.empty';
      }
      setValidationMessage(validationMessage);
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
    setFieldName(name);
    updateFlagsForRadioAnnotation(annotation);
  }, [annotation]);

  const updateFlagsForRadioAnnotation = useCallback((annotation) => {
    if (annotation && annotation instanceof Annotations.RadioButtonWidgetAnnotation) {
      const currentFlags = annotation.getField().flags;
      const { READ_ONLY, REQUIRED } = Annotations.WidgetFlags;
      const isReadOnly = currentFlags.get(READ_ONLY);
      const isRequired = currentFlags.get(REQUIRED);
      setReadOnly(isReadOnly || false);
      setIsRequired(isRequired || false);
    }
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
    setFieldValue(value);
    annotation.getField().setValue(value);
  }, [annotation]);

  const onReadOnlyChange = useCallback((isReadOnly) => {
    setReadOnly(isReadOnly);
    annotation.setFieldFlag(Annotations.WidgetFlags.READ_ONLY, isReadOnly);
  }, [annotation]);

  const onMultiLineChange = useCallback((isMultiLine) => {
    setMultiLine(isMultiLine);
    annotation.setFieldFlag(Annotations.WidgetFlags.MULTILINE, isMultiLine);
  }, [annotation]);

  const onRequiredChange = useCallback((isRequired) => {
    setIsRequired(isRequired);
    annotation.setFieldFlag(Annotations.WidgetFlags.REQUIRED, isRequired);
  }, [annotation]);

  const onMultiSelectChange = useCallback((isMultiSelect) => {
    setIsMultiSelect(isMultiSelect);
    annotation.setFieldFlag(Annotations.WidgetFlags.MULTI_SELECT, isMultiSelect);
  }, [annotation]);

  const onFieldOptionsChange = useCallback((options) => {
    annotation.setFieldOptions(options);
  }, [annotation]);

  const onShowFieldIndicatorChange = useCallback((showIndicator) => {
    setShowIndicator(showIndicator);
    formFieldCreationManager.setShowIndicator(annotation, showIndicator);
  }, [annotation]);

  const onFieldIndicatorTextChange = useCallback((indicatorText) => {
    setIndicatorText(indicatorText);
    formFieldCreationManager.setIndicatorText(annotation, indicatorText);
  }, [annotation]);

  const closeFormFieldEditPopup = useCallback(() => {
    closeAndReset();
  }, []);

  const onCloseRadioButtonPopup = useCallback(() => {
    // Add new radio group (if any) to existing radio groups and we were in a valid state
    if (isValid && radioButtonGroups.indexOf(fieldName) === -1 && fieldName !== '') {
      setRadioButtonGroups([fieldName, ...radioButtonGroups]);
    }
    closeAndReset();
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

  const onSignatureOptionChange = useCallback((signatureOption) => {
    const { value } = signatureOption;
    formFieldCreationManager.setSignatureOption(annotation, value);
  }, [annotation]);

  const getSignatureOption = useCallback((widget) => {
    return formFieldCreationManager.getSignatureOption(widget);
  }, []);

  const fields = {
    NAME: {
      label: 'formField.formFieldPopup.fieldName',
      onChange: onFieldNameChange,
      value: fieldName,
      required: true,
      type: 'text',
      focus: true,
    },
    VALUE: {
      label: 'formField.formFieldPopup.fieldValue',
      onChange: onFieldValueChange,
      value: fieldValue,
      type: 'text',
    },
    RADIO_GROUP: {
      label: 'formField.formFieldPopup.fieldName',
      onChange: onFieldNameChange,
      value: fieldName,
      required: true,
      type: 'select',
    },
  };


  const flags = {
    READ_ONLY: {
      label: 'formField.formFieldPopup.readOnly',
      onChange: onReadOnlyChange,
      isChecked: isReadOnly,
    },
    MULTI_LINE: {
      label: 'formField.formFieldPopup.multiLine',
      onChange: onMultiLineChange,
      isChecked: isMultiLine,
    },
    REQUIRED: {
      label: 'formField.formFieldPopup.required',
      onChange: onRequiredChange,
      isChecked: isRequired,
    },
    MULTI_SELECT: {
      label: 'formField.formFieldPopup.multiSelect',
      onChange: onMultiSelectChange,
      isChecked: isMultiSelect,
    },
  };

  const textFields = [fields['NAME'], fields['VALUE']];
  const defaultFields = [fields['NAME']];
  const radioButtonFields = [fields['RADIO_GROUP']];
  const listBoxFields = [fields['NAME']];
  const comboBoxFields = [fields['NAME']];
  const pushButtonFields = [fields['NAME']];

  const textFieldFlags = [flags['READ_ONLY'], flags['MULTI_LINE'], flags['REQUIRED']];
  const signatureFlags = [flags['REQUIRED'], flags['READ_ONLY']];
  const checkBoxFlags = [flags['READ_ONLY'], flags['REQUIRED']];
  const radioButtonFlags = [flags['READ_ONLY'], flags['REQUIRED']];
  const listBoxFlags = [flags['MULTI_SELECT'], flags['READ_ONLY'], flags['REQUIRED']];
  const comboBoxFlags = [flags['READ_ONLY'], flags['REQUIRED']];
  const pushButtonFlags = [flags['READ_ONLY']];

  const isMobile = isMobileSize();

  const indicator = {
    label: 'formField.formFieldPopup.documentFieldIndicator',
    toggleIndicator: onShowFieldIndicatorChange,
    isChecked: showIndicator,
    onChange: onFieldIndicatorTextChange,
    value: indicatorText,
  };

  const renderTextFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={textFields}
      flags={textFieldFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
    />
  );

  const renderSignatureFormFieldEditPopup = () => (
    <FormFieldEditSignaturePopup
      fields={defaultFields}
      flags={signatureFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      onSignatureOptionChange={onSignatureOptionChange}
      getSignatureOptionHandler={getSignatureOption}
      indicator={indicator}
    />
  );

  const renderCheckboxFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={defaultFields}
      flags={checkBoxFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={annotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
    />
  );

  const renderRadioButtonFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={radioButtonFields}
      flags={radioButtonFlags}
      closeFormFieldEditPopup={onCloseRadioButtonPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      radioButtonGroups={radioButtonGroups}
      annotation={annotation}
      selectedRadioGroup={fieldName}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
      indicator={indicator}
    />
  );

  const renderListBoxFormFieldEditPopup = () => {
    const fieldOptions = annotation.getFieldOptions();

    return (
      <FormFieldEditPopup
        fields={listBoxFields}
        flags={listBoxFlags}
        options={fieldOptions}
        onOptionsChange={onFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        validationMessage={validationMessage}
        annotation={annotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
        indicator={indicator}
      />
    );
  };

  const renderComboBoxFormFieldEditPopup = () => {
    const fieldOptions = annotation.getFieldOptions();

    return (
      <FormFieldEditPopup
        fields={comboBoxFields}
        flags={comboBoxFlags}
        options={fieldOptions}
        onOptionsChange={onFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        validationMessage={validationMessage}
        annotation={annotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
        indicator={indicator}
      />
    );
  };

  const renderPushButtonFormFieldEditPopup = () => {
    return (
      <FormFieldEditPopup
        fields={pushButtonFields}
        flags={pushButtonFlags}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        validationMessage={validationMessage}
        annotation={annotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
        indicator={indicator}
      />
    );
  };

  const renderPopUp = () => {
    switch (true) {
      case annotation instanceof Annotations.TextWidgetAnnotation:
        return renderTextFormFieldEditPopup();
      case annotation instanceof Annotations.SignatureWidgetAnnotation:
        return renderSignatureFormFieldEditPopup();
      case annotation instanceof Annotations.CheckButtonWidgetAnnotation:
        return renderCheckboxFormFieldEditPopup();
      case annotation instanceof Annotations.RadioButtonWidgetAnnotation:
        return renderRadioButtonFormFieldEditPopup();
      case annotation instanceof Annotations.ListWidgetAnnotation:
        return renderListBoxFormFieldEditPopup();
      case annotation instanceof Annotations.ChoiceWidgetAnnotation:
        return renderComboBoxFormFieldEditPopup();
      case annotation instanceof Annotations.PushButtonWidgetAnnotation:
        return renderPushButtonFormFieldEditPopup();
      default:
        return null;
    }
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

FormFieldEditPopupContainer.propTypes = propTypes;

export default React.memo(FormFieldEditPopupContainer);