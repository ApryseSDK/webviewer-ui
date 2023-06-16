import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import useOnRightClick from '../useOnRightClick';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRIORITY_THREE } from 'constants/actionPriority';

export default function useOnFormFieldAnnotationAddedOrSelected() {
  const dispatch = useDispatch();
  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

  const [currentFormAnnotation, setCurrentlyEditingFormAnnotation] = useState(null);

  const openFormFieldPopup = () => {
    dispatch(actions.disableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
  };

  const closeFormFieldPopup = () => {
    dispatch(actions.enableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.closeElement(DataElements.FORM_FIELD_EDIT_POPUP));
  };

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

  return { annotation: currentFormAnnotation };
}