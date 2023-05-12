import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import useOnRightClick from '../useOnRightClick';

export default function useOnFormFieldAnnotationAddedOrSelected(openFormFieldPopup) {
  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

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
      if (isRightClickAnnotationPopupEnabled) {
        return;
      }

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

  useOnRightClick(
    useCallback((e) => {
      if (!isRightClickAnnotationPopupEnabled) {
        return;
      }

      const annotUnderMouse = core.getAnnotationByMouseEvent(e);
      if (annotUnderMouse && annotUnderMouse !== annotation && annotUnderMouse.isFormFieldPlaceholder()) {
        setAnnotation(annotUnderMouse);
      }
    }, [annotation, isRightClickAnnotationPopupEnabled])
  );

  return annotation;
}