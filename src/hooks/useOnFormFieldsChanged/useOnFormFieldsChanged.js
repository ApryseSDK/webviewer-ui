import { useState, useEffect } from 'react';
import core from 'core';

const { Annotations } = window.Core;

export default function useOnFormFieldsChanged() {
  const [formFieldAnnotationsList, setFormFieldAnnotationsList] = useState([]);

  useEffect(() => {
    const setFormFieldIndicators = () => {
      let formFieldIndicators = [];
      const annotations = core.getAnnotationsList();
      const formFieldCreationManager = core.getFormFieldCreationManager();
      if (formFieldCreationManager.isInFormFieldCreationMode()) {
        const widgets = annotations.filter((annotation) => annotation instanceof Annotations.WidgetAnnotation);
        formFieldIndicators = [
          ...widgets
            .reduce(
              (fieldNameMap, field) => {
                if (!fieldNameMap.has(field.getField().name)) {
                  fieldNameMap.set(field.getField().name, field);
                }
                return fieldNameMap;
              },
              new Map()
            ).values(),
        ];
      } else {
        const widgets = annotations.filter(
          (annotation) => formFieldCreationManager.getShowIndicator(annotation)
        );
        formFieldIndicators = [
          ...widgets
            .reduce(
              (fieldNameMap, field) => {
                if (!fieldNameMap.has(field['fieldName'])) {
                  fieldNameMap.set(field['fieldName'], field);
                }
                return fieldNameMap;
              },
              new Map()
            ).values(),
        ];
      }
      setFormFieldAnnotationsList(formFieldIndicators);
    };

    const onDocumentLoaded = () => {
      setFormFieldAnnotationsList([]);
    };

    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('zoomUpdated', setFormFieldIndicators);
    core.addEventListener('annotationChanged', setFormFieldIndicators);
    core.addEventListener('pageNumberUpdated', setFormFieldIndicators);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('zoomUpdated', setFormFieldIndicators);
      core.removeEventListener('annotationChanged', setFormFieldIndicators);
      core.removeEventListener('pageNumberUpdated', setFormFieldIndicators);
    };
  });

  return formFieldAnnotationsList;
}
