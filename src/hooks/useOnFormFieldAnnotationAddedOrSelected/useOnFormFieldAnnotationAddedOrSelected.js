import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import useOnRightClick from '../useOnRightClick';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';

export default function useOnFormFieldAnnotationAddedOrSelected() {
  const dispatch = useDispatch();

  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

  const [annotation, setAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.isFormFieldPlaceholder() && annotation.getCustomData('trn-editing-widget-id') === '') {
        setAnnotation(annotations[0]);
        dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
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

  return { annotation };
}