import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import core from 'core';
import FormFieldEditPopup from './FormFieldEditPopup';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import useOnFormFieldAnnotationAddedOrSelected from '../../hooks/useOnFormFieldAnnotationAddedOrSelected';
import DataElementWrapper from '../DataElementWrapper';
import useCloseOnWindowResize from '../../hooks/useCloseOnWindowResize';
import './FormFieldEditPopup.scss';

function FormFieldEditPopupContainer() {
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
  const [validationMessage, setValidationMessage] = useState('')
  const popupRef = useRef();

  const [isOpen] = useSelector(state => [selectors.isElementOpen(state, 'formFieldEditPopup')], shallowEqual);
  const dispatch = useDispatch();

  useOnClickOutside(popupRef, e => {
    closeAndReset();
  });

  useCloseOnWindowResize(closeAndReset);

  function closeAndReset() {
    dispatch(actions.closeElement('formFieldEditPopup'));
    setFieldName('');
    setFieldValue('');
    setReadOnly(false);
    setMultiLine(false);
    setIsRequired(false);
    setIsMultiSelect(false);
    setIsValid(true);
  }

  const formFieldAnnotation = useOnFormFieldAnnotationAddedOrSelected(openFormFieldPopup);

  function openFormFieldPopup() {
    dispatch(actions.openElement('formFieldEditPopup'));
  }

  useEffect(() => {
    const onFormFieldCreationModeStarted = () => {
      // Do some cleanup of radio button groups,
      // gets rid of groups that may have been added but never actually placed as fields
      // or that were created but unlinked from a widget
      setRadioButtonGroups(formFieldCreationManager.getRadioButtonGroups())
    };

    core.addEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);

    return () => {
      core.removeEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
    };
  }, []);

  // We use layout effect to avoid a flickering as the popup is repositioned
  // The flow is open popup -> update position. 
  // So we first open with an old position and then re-render to the new position. By using layoutEffect
  // we let the hook run and update the position, and then the browser updates
  useLayoutEffect(() => {
    const setPopupPosition = () => {
      if (popupRef.current) {
        setPosition(getAnnotationPopupPositionBasedOn(formFieldAnnotation, popupRef));
      }
    };

    if (isOpen) {
      setPopupPosition();
      setFieldName(formFieldCreationManager.getFieldName(formFieldAnnotation));
      setFieldValue(formFieldCreationManager.getFieldValue(formFieldAnnotation));
      setReadOnly(formFieldCreationManager.getFieldFlag(formFieldAnnotation, fieldLabels.READ_ONLY));
      setMultiLine(formFieldCreationManager.getFieldFlag(formFieldAnnotation, fieldLabels.MULTI_LINE));
      setIsRequired(formFieldCreationManager.getFieldFlag(formFieldAnnotation, fieldLabels.REQUIRED));
      setIsMultiSelect(formFieldCreationManager.getFieldFlag(formFieldAnnotation, fieldLabels.MULTI_SELECT));
      const dedupedRadioGroups = [...(new Set([...radioButtonGroups, ...formFieldCreationManager.getRadioButtonGroups()]))]
      setRadioButtonGroups(dedupedRadioGroups);
      // Field name is required, so if this is an empty string
      // the field is not valid and should not be converted to a real field
      setIsValid(!!formFieldCreationManager.getFieldName(formFieldAnnotation));
      setValidationMessage('')
    }
  }, [isOpen]);

  const onFieldNameChange = useCallback(name => {
    const validatedResponse = formFieldCreationManager.setFieldName(formFieldAnnotation, name);
    setIsValid(validatedResponse.isValid);
    mapValidationResponseToTranslation(validatedResponse);
    setFieldName(name);
  }, [formFieldAnnotation]);

  const mapValidationResponseToTranslation = (validationResponse) => {
    const { errorType } = validationResponse;
    let translationKey = ''

    switch (errorType) {
      case 'empty':
        translationKey = 'formField.formFieldPopup.invalidField.empty';
        break;
      case 'duplicate':
        translationKey = 'formField.formFieldPopup.invalidField.duplicate';
        break;
    }

    setValidationMessage(translationKey);
  }

  const onFieldValueChange = useCallback(value => {
    setFieldValue(value);
    formFieldCreationManager.setFieldValue(formFieldAnnotation, value);
  }, [formFieldAnnotation]);

  const onReadOnlyChange = useCallback(isReadOnly => {
    setReadOnly(isReadOnly);
    formFieldCreationManager.setFieldFlag(formFieldAnnotation, fieldLabels.READ_ONLY, isReadOnly);
  }, [formFieldAnnotation]);

  const onMultiLineChange = useCallback(isMultiLine => {
    setMultiLine(isMultiLine);
    formFieldCreationManager.setFieldFlag(formFieldAnnotation, fieldLabels.MULTI_LINE, isMultiLine);
  }, [formFieldAnnotation]);

  const onRequiredChange = useCallback(isRequired => {
    setIsRequired(isRequired);
    formFieldCreationManager.setFieldFlag(formFieldAnnotation, fieldLabels.REQUIRED, isRequired);
  }, [formFieldAnnotation]);

  const onMultiSelectChange = useCallback(isMultiSelect => {
    setIsMultiSelect(isMultiSelect)
    formFieldCreationManager.setFieldFlag(formFieldAnnotation, fieldLabels.MULTI_SELECT, isMultiSelect);
  }, [formFieldAnnotation]);

  const onFieldOptionsChange = useCallback(options => {
    formFieldCreationManager.setFieldOptions(formFieldAnnotation, options);
  }, [formFieldAnnotation]);

  const closeFormFieldEditPopup = useCallback(() => {
    closeAndReset();
  }, []);

  const onCloseRadioButtonPopup = useCallback(() => {
    // Add new radio group (if any) to existing radio groups and we were in a valid state
    if (isValid && radioButtonGroups.indexOf(fieldName) === -1 && fieldName !== '') {
      setRadioButtonGroups([fieldName, ...radioButtonGroups])
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
      type: 'text'
    },
    RADIO_GROUP: {
      label: 'formField.formFieldPopup.fieldName',
      onChange: onFieldNameChange,
      value: fieldName,
      required: true,
      type: 'select'
    }
  };

  const textFields = [
    fields['NAME'],
    fields['VALUE'],
  ];

  const defaultFields = [
    fields['NAME'],
  ];

  const radioButtonFields = [
    fields['RADIO_GROUP']
  ];

  const listBoxFields = [
    fields['NAME']
  ];

  const comboBoxFields = [
    fields['NAME']
  ];

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
    }
  }

  const textFieldFlags = [
    flags['READ_ONLY'],
    flags['MULTI_LINE'],
    flags['REQUIRED'],
  ];

  const signatureFlags = [
    flags['REQUIRED'],
    flags['READ_ONLY'],
  ];

  const checkBoxFlags = [
    flags['READ_ONLY'],
    flags['REQUIRED'],
  ];

  const radioButtonFlags = [
    flags['READ_ONLY'],
    flags['REQUIRED'],
  ];

  const listBoxFlags = [
    flags['MULTI_SELECT'],
    flags['READ_ONLY'],
    flags['REQUIRED'],
  ];

  const comboBoxFlags = [
    flags['READ_ONLY'],
    flags['REQUIRED'],
  ];

  const renderTextFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={textFields}
      flags={textFieldFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={formFieldAnnotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
    />
  );

  const renderSignatureFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={defaultFields}
      flags={signatureFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={formFieldAnnotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
    />
  );

  const renderCheckboxFormFieldEditPopup = () => (
    <FormFieldEditPopup
      fields={defaultFields}
      flags={checkBoxFlags}
      closeFormFieldEditPopup={closeFormFieldEditPopup}
      isValid={isValid}
      validationMessage={validationMessage}
      annotation={formFieldAnnotation}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
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
      annotation={formFieldAnnotation}
      selectedRadioGroup={fieldName}
      redrawAnnotation={redrawAnnotation}
      getPageHeight={getPageHeight}
      getPageWidth={getPageWidth}
    />
  );

  const renderListBoxFormFieldEditPopup = () => {
    const fieldOptions = formFieldCreationManager.getFieldOptions(formFieldAnnotation);

    return (
      <FormFieldEditPopup
        fields={listBoxFields}
        flags={listBoxFlags}
        options={fieldOptions}
        onOptionsChange={onFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        validationMessage={validationMessage}
        annotation={formFieldAnnotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
      />
    )
  };

  const renderComboBoxFormFieldEditPopup = () => {
    const fieldOptions = formFieldCreationManager.getFieldOptions(formFieldAnnotation);

    return (
      <FormFieldEditPopup
        fields={comboBoxFields}
        flags={comboBoxFlags}
        options={fieldOptions}
        onOptionsChange={onFieldOptionsChange}
        closeFormFieldEditPopup={closeFormFieldEditPopup}
        isValid={isValid}
        validationMessage={validationMessage}
        annotation={formFieldAnnotation}
        redrawAnnotation={redrawAnnotation}
        getPageHeight={getPageHeight}
        getPageWidth={getPageWidth}
      />
    )
  };

  const renderPopUp = () => {
    const intent = formFieldAnnotation.getFormFieldPlaceHolderType();
    if (intent === 'TextFormField') {
      return renderTextFormFieldEditPopup();
    } else if (intent === 'SignatureFormField') {
      return renderSignatureFormFieldEditPopup();
    } else if (intent === 'CheckBoxFormField') {
      return renderCheckboxFormFieldEditPopup();
    } else if (intent === 'RadioButtonFormField') {
      return renderRadioButtonFormFieldEditPopup();
    } else if (intent === 'ListBoxFormField') {
      return renderListBoxFormFieldEditPopup();
    } else if (intent === 'ComboBoxFormField') {
      return renderComboBoxFormFieldEditPopup();
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
      data-element="formFieldEditPopup"
      style={{ ...position }}
      ref={popupRef}
    >
      {renderPopUp()}
    </DataElementWrapper>
  );

  if (isOpen) {
    //Note: Draggable and react-dnd don't play nice, and having both is redundant. Maybe in the future we can refactor to only use react-dnd
    return (
      <Draggable
        cancel=".Button, .cell, .sliders-container svg, .creatable-list, .ui__input__input, .form-dimension-input">
        {renderFormFieldEditPopup()}
      </Draggable>);
  } else {
    return null;
  }

}

export default FormFieldEditPopupContainer;
