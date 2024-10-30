import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import useOnRightClick from '../useOnRightClick';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRIORITY_THREE } from 'constants/actionPriority';
import { getInstanceNode } from 'helpers/getRootNode';

const { Annotations } = window.Core;

export default function useOnFormFieldAnnotationAddedOrSelected() {
  const dispatch = useDispatch();
  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

  const { customizableUI = false } = useSelector(
    (state) => selectors.getFeatureFlags(state) || {}
  );

  const [currentFormAnnotation, setCurrentlyEditingFormAnnotation] = useState(null);

  const openFormFieldPopup = () => {
    if (customizableUI) {
      dispatch(actions.closeElement(DataElements.FORM_FIELD_EDIT_POPUP));
    } else {
      dispatch(actions.disableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    }
    dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
    dispatch(actions.openElement(DataElements.FORM_FIELD_PANEL));
  };

  const closeFormFieldPopup = () => {
    dispatch(actions.enableElement(DataElements.ANNOTATION_POPUP, PRIORITY_THREE));
    dispatch(actions.closeElement(DataElements.FORM_FIELD_EDIT_POPUP));
    dispatch(actions.closeElement(DataElements.FORM_FIELD_PANEL));
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
      const isWidgetAnnotation = annotation instanceof window.Core.Annotations.WidgetAnnotation;
      const isInFormBuilderMode = getInstanceNode().instance.Core.annotationManager.getFormFieldCreationManager().isInFormFieldCreationMode();

      if (action === 'add' && isWidgetAnnotation && isInFormBuilderMode) {
        setCurrentlyEditingFormAnnotation(annotations[0]);
        openFormFieldPopup();
      } else if (action === 'delete' && isWidgetAnnotation) {
        closeFormFieldPopup();
        setCurrentlyEditingFormAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      if (isRightClickAnnotationPopupEnabled) {
        return;
      }
      const isWidgetAnnotation = annotations[0] instanceof Annotations.WidgetAnnotation;

      if (action === 'selected' && annotations.length && isWidgetAnnotation) {
        setCurrentlyEditingFormAnnotation(annotations[0]);
      }
    };

    const handleToolModeChange = (newTool) => {
      const isInFormBuilderMode = getInstanceNode().instance.Core.annotationManager.getFormFieldCreationManager().isInFormFieldCreationMode();
      const isFormFieldCreateTool = newTool instanceof window.Core.Tools.FormFieldCreateTool;
      if (!isInFormBuilderMode) {
        closeFormFieldPopup();
        setCurrentlyEditingFormAnnotation(null);
      } else if (customizableUI && isFormFieldCreateTool) {
        openFormFieldPopup();
        setCurrentlyEditingFormAnnotation(null);
      }
    };
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.addEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, [currentFormAnnotation, customizableUI]);

  useOnRightClick(
    useCallback((e) => {
      if (!isRightClickAnnotationPopupEnabled) {
        return;
      }
      const isWidgetAnnotation = annotUnderMouse instanceof Annotations.WidgetAnnotation;
      const annotUnderMouse = core.getAnnotationByMouseEvent(e);
      if (annotUnderMouse && annotUnderMouse !== currentFormAnnotation && isWidgetAnnotation) {
        setCurrentlyEditingFormAnnotation(annotUnderMouse);
      }
    }, [currentFormAnnotation, isRightClickAnnotationPopupEnabled])
  );

  return { annotation: currentFormAnnotation };
}