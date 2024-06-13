import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import debounce from 'lodash/debounce';
import useOnRightClick from 'hooks/useOnRightClick';
import { isMac } from 'helpers/device';
import getGroupedLinkAnnotations from 'helpers/getGroupedLinkAnnotations';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import DataElements from 'constants/dataElement';

const { ToolNames } = window.Core.Tools;
const { Annotations } = window.Core;

export default function useOnAnnotationPopupOpen() {
  const [
    popupItems,
    isRightClickAnnotationPopupEnabled,
    isNotesPanelOpen,
    isScaleOverlayContainerOpen,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.getPopupItems(state, DataElements.ANNOTATION_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.isElementOpen(state, DataElements.SCALE_OVERLAY_CONTAINER),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  // focusedAnnotation is selectedAnnotation by default and right-clicked annotation (even when there're multiple annotations selected) when API is on
  const [focusedAnnotation, setFocusedAnnotation] = useState(null);
  const [selectedMultipleAnnotations, setSelectedMultipleAnnotations] = useState(false);
  const [canModify, setCanModify] = useState(false);
  const [focusedAnnotationStyle, setFocusedAnnotationStyle] = useState(null);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isDatePickerMount, setDatePickerMount] = useState(false);
  const [hasAssociatedLink, setHasAssociatedLink] = useState(true);
  const [includesFormFieldAnnotation, setIncludesFormFieldAnnotation] = useState(false);
  const [stylePopupRepositionFlag, setStylePopupRepositionFlag] = useState(false);

  // calling this function will always rerender this component
  // because the position state always has a new object reference
  const openPopup = () => {
    if (popupItems.length > 0) {
      dispatch(actions.openElement(DataElements.ANNOTATION_POPUP));
    }
  };

  const closePopup = () => {
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    setFocusedAnnotation(null);
    setSelectedMultipleAnnotations(false);
    setCanModify(false);
    setIsStylePopupOpen(false);
    setDatePickerOpen(false);
    setDatePickerMount(false);
    setHasAssociatedLink(false);
    setIncludesFormFieldAnnotation(false);
  };

  const canAnnotationBeModified = (annotation) => {
    const isSignedByAppearance = annotation instanceof Annotations.SignatureWidgetAnnotation && annotation.isSignedByAppearance();
    return core.canModify(annotation) && !isSignedByAppearance;
  };

  const groupedLinkAnnotations = (annotation) => getGroupedLinkAnnotations(annotation);

  const isInContentEditFocusMode = (annotation) => {
    // for annotations that are placeholders of content edit, when they are focused, the popup will not open
    const contentEditManager = core.getContentEditManager();
    return annotation.isInContentEditFocusMode(contentEditManager);
  };

  useEffect(() => {
    if (focusedAnnotation) {
      setFocusedAnnotationStyle(getAnnotationStyles(focusedAnnotation));
      if (!isInContentEditFocusMode(focusedAnnotation)) {
        openPopup();
        dispatch(actions.openElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE));
      }
    }
    // stylePopupRepositionFlag is needed here in order to re-open the popup on scroll
  }, [focusedAnnotation, stylePopupRepositionFlag]);

  useEffect(() => {
    if (focusedAnnotation) {
      setHasAssociatedLink(!!groupedLinkAnnotations(focusedAnnotation).length);
    }
  }, [focusedAnnotation, groupedLinkAnnotations]);

  // Use this to store isRightClickAnnotationPopupEnabled value to avoid stale closure
  const isRightClickAnnotationPopupEnabledRef = useRef();

  useEffect(() => {
    isRightClickAnnotationPopupEnabledRef.current = isRightClickAnnotationPopupEnabled;
  }, [isRightClickAnnotationPopupEnabled]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (annotations.length === 0 || annotations[0].ToolName === ToolNames.CROP || annotations[0].ToolName === ToolNames.SNIPPING) {
        return;
      }

      if (action === 'selected') {
        if (!isRightClickAnnotationPopupEnabledRef.current) {
          setFocusedAnnotation(annotations[0]);
        }

        setSelectedMultipleAnnotations(annotations.length > 1);
        setIncludesFormFieldAnnotation(annotations.some((annotation) => annotation.isFormFieldPlaceholder()));
        setCanModify(canAnnotationBeModified(annotations[0]));

        if (isNotesPanelOpen) {
          setTimeout(() => dispatch(actions.openElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE)), 300);
        }

        const isAnnotationSelectedWithDatePickerOpen = annotations[0] === focusedAnnotation && isDatePickerOpen;
        if (isAnnotationSelectedWithDatePickerOpen) {
          closePopup();
        }
      }

      const actionOnOtherAnnotation = focusedAnnotation && !annotations.includes(focusedAnnotation);
      if (action === 'deselected' && !actionOnOtherAnnotation) {
        closePopup();
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
    core.addEventListener('documentUnloaded', closePopup, null, activeDocumentViewerKey);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
      core.removeEventListener('documentUnloaded', closePopup, null, activeDocumentViewerKey);
    };
  }, [focusedAnnotation, isNotesPanelOpen, isDatePickerOpen, activeDocumentViewerKey]);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      if (!core.isAnnotationSelected(focusedAnnotation)) {
        return;
      }

      if (action === 'modify') {
        setFocusedAnnotationStyle(getAnnotationStyles(annotations[0]));
        if (!isScaleOverlayContainerOpen) {
          openPopup();
        }
      }

      const hasLinkAnnotation = annotations.some((annotation) => annotation instanceof Annotations.Link);
      if (!hasLinkAnnotation) {
        return;
      }
      if (action === 'add') {
        setHasAssociatedLink(true);
      }
      if (action === 'delete') {
        setHasAssociatedLink(false);
      }
    };

    const onUpdateAnnotationPermission = () => {
      if (focusedAnnotation) {
        setCanModify(canAnnotationBeModified(focusedAnnotation));
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged, null, activeDocumentViewerKey);
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, null, activeDocumentViewerKey);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged, null, activeDocumentViewerKey);
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, null, activeDocumentViewerKey);
    };
  }, [canModify, focusedAnnotation, isScaleOverlayContainerOpen, activeDocumentViewerKey]);

  useEffect(() => {
    const onMouseLeftUp = (e) => {
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      if (focusedAnnotation) {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e, activeDocumentViewerKey);

        const shouldShowPopup =
          !isRightClickAnnotationPopupEnabledRef.current
          && annotUnderMouse === focusedAnnotation
          && !isInContentEditFocusMode(focusedAnnotation);
        if (shouldShowPopup) {
          openPopup();
        }

        // clicking on full page redactions again should close the stylePopup if it is already open
        if (focusedAnnotation['redactionType'] === 'fullPage' && isStylePopupOpen) {
          setIsStylePopupOpen(false);
        }
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp, null, activeDocumentViewerKey);
    return () => core.removeEventListener('mouseLeftUp', onMouseLeftUp, null, activeDocumentViewerKey);
  }, [focusedAnnotation, isStylePopupOpen, activeDocumentViewerKey]);

  useEffect(() => {
    const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);
    const onScroll = debounce(() => {
      setStylePopupRepositionFlag((flag) => !flag);
    }, 100);

    scrollViewElement?.addEventListener('scroll', onScroll, null, activeDocumentViewerKey);
    return () => scrollViewElement?.removeEventListener('scroll', onScroll, null, activeDocumentViewerKey);
  }, [activeDocumentViewerKey]);

  useOnRightClick(
    useCallback((e) => {
      if (!isRightClickAnnotationPopupEnabledRef.current) {
        return;
      }

      const annotUnderMouse = core.getAnnotationByMouseEvent(e, activeDocumentViewerKey);
      if (annotUnderMouse && annotUnderMouse.ToolName !== ToolNames.CROP) {
        if (e.ctrlKey && isMac) {
          return;
        }

        if (annotUnderMouse !== focusedAnnotation) {
          if (!core.isAnnotationSelected(annotUnderMouse, activeDocumentViewerKey)) {
            core.deselectAllAnnotations();
          }
          core.selectAnnotation(annotUnderMouse, activeDocumentViewerKey);
          setFocusedAnnotation(annotUnderMouse);
        }
        if (annotUnderMouse === focusedAnnotation && !isInContentEditFocusMode(annotUnderMouse)) {
          openPopup();
        }
      } else {
        closePopup();
      }
    }, [focusedAnnotation, activeDocumentViewerKey])
  );

  return {
    focusedAnnotation,
    selectedMultipleAnnotations,
    canModify,
    focusedAnnotationStyle,
    isStylePopupOpen,
    setIsStylePopupOpen,
    isDatePickerOpen,
    setDatePickerOpen,
    isDatePickerMount,
    setDatePickerMount,
    hasAssociatedLink,
    includesFormFieldAnnotation,
    stylePopupRepositionFlag,
    setStylePopupRepositionFlag,
    closePopup,
  };
}