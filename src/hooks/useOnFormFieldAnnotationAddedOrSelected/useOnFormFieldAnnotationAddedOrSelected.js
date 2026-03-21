import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import useOnRightClick from '../useOnRightClick';
import useCore from 'hooks/useCore';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRIORITY_TWO } from 'constants/actionPriority';
import { getInstanceNode } from 'helpers/getRootNode';

const { Annotations } = window.Core;

export default function useOnFormFieldAnnotationAddedOrSelected() {
  const { core } = useCore();
  const dispatch = useDispatch();
  const isRightClickAnnotationPopupEnabled = useSelector(
    (state) => selectors.isRightClickAnnotationPopupEnabled(state)
  );

  const { customizableUI = false } = useSelector(
    (state) => selectors.getFeatureFlags(state) || {}
  );

  const [currentFormAnnotation, setCurrentlyEditingFormAnnotation] = useState(null);

  /**
   * Opens form field edit pop up in legacy UI
   * @ignore
   * @remarks
   * legacy UI: uses form field edit pop up.
   * default UI: uses annotation popup and form field panel
   * PRIORITY_TWO to not override user disabled elements
   */
  const openFormFieldPopup = () => {
    if (customizableUI) {
      dispatch(actions.closeElement(DataElements.FORM_FIELD_EDIT_POPUP));
    } else {
      dispatch(actions.disableElement(DataElements.ANNOTATION_POPUP, PRIORITY_TWO));
    }
    dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
    dispatch(actions.openElement(DataElements.FORM_FIELD_PANEL));
  };

  /**
   * Closes form field edit pop up and panel
   * @ignore
   * @remarks
   * legacy UI: uses form field edit pop up.
   * default UI: uses annotation popup and form field panel
   * PRIORITY_TWO to not override user disabled elements
   */
  const closeFormFieldPopup = () => {
    if (!customizableUI) {
      dispatch(actions.enableElement(DataElements.ANNOTATION_POPUP, PRIORITY_TWO));
    }
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
      const isWidgetAnnotation = annotations.length && annotations[0] instanceof Annotations.WidgetAnnotation;

      if (action === 'selected' && isWidgetAnnotation) {
        setCurrentlyEditingFormAnnotation(annotations[0]);
      } else if (action === 'deselected' && isWidgetAnnotation) {
        setCurrentlyEditingFormAnnotation(null);
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
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, [currentFormAnnotation, customizableUI, core]);

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
    }, [currentFormAnnotation, isRightClickAnnotationPopupEnabled, core])
  );

  return { annotation: currentFormAnnotation };
}