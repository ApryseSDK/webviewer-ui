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
      if (annotations.length !== 1) {
        return;
      }
      const selectedAnnots = core.getAnnotationManager().getSelectedAnnotations();
      if (selectedAnnots.length > 1) {
        return;
      }
      const annotation = annotations[0];
      if (action === 'add' && annotation.isWidget?.()) {
        setCurrentlyEditingFormAnnotation(annotations[0]);
        openFormFieldPopup();
      } else if (action === 'delete' && annotation.isWidget?.()) {
        closeFormFieldPopup();
        setCurrentlyEditingFormAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      if (isRightClickAnnotationPopupEnabled) {
        return;
      }

      if (action === 'selected' && annotations.length && annotations[0].isWidget?.()) {
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
      if (annotUnderMouse && annotUnderMouse !== currentFormAnnotation && annotUnderMouse.isWidget?.()) {
        setCurrentlyEditingFormAnnotation(annotUnderMouse);
      }
    }, [currentFormAnnotation, isRightClickAnnotationPopupEnabled])
  );

  return { annotation: currentFormAnnotation };
}