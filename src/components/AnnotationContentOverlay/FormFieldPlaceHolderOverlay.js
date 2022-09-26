
import React from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';

const FormFieldPlaceHolderOverlay = ({ annotation, overlayPosition, overlayRef }) => {
  const [t] = useTranslation();

  const formFieldCreationManager = core.getFormFieldCreationManager();
  const formFieldPlaceHolderName = formFieldCreationManager.getFieldName(annotation);
  const formFieldPlaceHolderType = annotation.getFormFieldPlaceHolderType();

  const mapPlaceHolderTypeToTranslation = (formFieldPlaceHolderType) => {
    switch (formFieldPlaceHolderType) {
      case 'TextFormField':
        return 'formField.types.text';
      case 'SignatureFormField':
        return 'formField.types.signature';
      case 'CheckBoxFormField':
        return 'formField.types.checkbox';
      case 'ListBoxFormField':
        return 'formField.types.listbox';
      case 'ComboBoxFormField':
        return 'formField.types.combobox';
      case 'RadioButtonFormField':
        return 'formField.types.radio';
    }
  };

  return (
    <div
      className="Overlay AnnotationContentOverlay"
      data-element="annotationContentOverlay"
      style={{ ...overlayPosition }}
      ref={overlayRef}
    >
      <div>
        <span style={{ 'fontWeight': 'bold' }}>{t('formField.type')}: </span>
        {t(mapPlaceHolderTypeToTranslation(formFieldPlaceHolderType))}
      </div>
      <div>
        <span style={{ 'fontWeight': 'bold' }}>{t('formField.formFieldPopup.fieldName')}: </span>
        {formFieldPlaceHolderName}
      </div>
    </div>
  );
};

export default FormFieldPlaceHolderOverlay;