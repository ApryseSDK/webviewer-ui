import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import useOnRightClick from '../useOnRightClick';

export default function useOnFormFieldAnnotationAddedOrSelected(openFormFieldPopup, closeFormFieldPopup) {
  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

  const [currentFormAnnotation, setCurrentlyEditingFormAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.isFormFieldPlaceholder() && annotation.getCustomData('trn-editing-widget-id') === '') {
        // If for some reason we are drawing a new form field place holder before filling the name for the previous one, we will not switch
        // to the new annotation until that name is filled
        if (currentFormAnnotation?.getCustomData('trn-form-field-name') === '') {
          return;
        }
        setCurrentlyEditingFormAnnotation(annotations[0]);
        openFormFieldPopup();
      } else if (action === 'delete' && annotation.isFormFieldPlaceholder()) {
        closeFormFieldPopup();
        setCurrentlyEditingFormAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      if (isRightClickAnnotationPopupEnabled) {
        return;
      }

      if (action === 'selected' && annotations.length && annotations[0].isFormFieldPlaceholder()) {
        // If the currently set form field annotation has no name set, we don't want to switch it out
        // as the form field edit popup will show the info for the wrong annotation, as we added logic to prevent
        // the popup from closing when the field name is empty
        if (currentFormAnnotation?.getCustomData('trn-form-field-name') === '') {
          // de-select the form field annotation that was recently selected to avoid confusion
          core.deselectAnnotation(annotations[0]);
          return;
        }
        setCurrentlyEditingFormAnnotation(annotations[0]);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, [currentFormAnnotation]);

  useOnRightClick(
    useCallback((e) => {
      if (!isRightClickAnnotationPopupEnabled) {
        return;
      }

      const annotUnderMouse = core.getAnnotationByMouseEvent(e);
      if (annotUnderMouse && annotUnderMouse !== currentFormAnnotation && annotUnderMouse.isFormFieldPlaceholder()) {
        setCurrentlyEditingFormAnnotation(annotUnderMouse);
      }
    }, [currentFormAnnotation, isRightClickAnnotationPopupEnabled])
  );

  return currentFormAnnotation;
}