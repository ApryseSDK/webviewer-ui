
import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';

const propTypes = {
  annotation: PropTypes.object,
  overlayPosition: PropTypes.object,
  overlayRef: PropTypes.object,
};

const FormFieldWidgetOverlay = ({ annotation, overlayPosition, overlayRef }) => {
  const [t] = useTranslation();
  const formFieldWidgetName = annotation.getField().name;

  const mapWidgetypeToTranslation = (widget) => {
    switch (true) {
      case widget instanceof window.Core.Annotations.TextWidgetAnnotation:
        return 'formField.types.text';
      case widget instanceof window.Core.Annotations.SignatureWidgetAnnotation:
        return 'formField.types.signature';
      case widget instanceof window.Core.Annotations.CheckButtonWidgetAnnotation:
        return 'formField.types.checkbox';
      case widget instanceof window.Core.Annotations.ListWidgetAnnotation:
        return 'formField.types.listbox';
      case widget instanceof window.Core.Annotations.ChoiceWidgetAnnotation:
        return 'formField.types.combobox';
      case widget instanceof window.Core.Annotations.RadioButtonWidgetAnnotation:
        return 'formField.types.radio';
      case widget instanceof window.Core.Annotations.PushButtonWidgetAnnotation:
        return 'formField.types.button';
      default:
        return undefined;
    }
  };

  return (
    <div
      className="Overlay AnnotationContentOverlay"
      data-element={DataElements.ANNOTATION_CONTENT_OVERLAY}
      style={{ ...overlayPosition }}
      ref={overlayRef}
    >
      <div>
        <span style={{ 'fontWeight': 'bold' }}>{t('formField.type')}: </span>
        {t(mapWidgetypeToTranslation(annotation))}
      </div>
      <div>
        <span style={{ 'fontWeight': 'bold' }}>{t('formField.formFieldPopup.fieldName')}: </span>
        {formFieldWidgetName}
      </div>
    </div>
  );
};

FormFieldWidgetOverlay.propTypes = propTypes;
export default FormFieldWidgetOverlay;