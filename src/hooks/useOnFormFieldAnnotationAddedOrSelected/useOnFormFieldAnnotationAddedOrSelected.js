import { useEffect, useState } from 'react';
import core from 'core';

export default function useOnFormFieldAnnotationAddedOrSelected(openFormFieldPopup) {
  const [annotation, setAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.isFormFieldPlaceholder() && annotation.getCustomData('trn-editing-widget-id') === '') {
        setAnnotation(annotations[0]);
        openFormFieldPopup();
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length && annotations[0].isFormFieldPlaceholder()) {
        setAnnotation(annotations[0]);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  return annotation;
}