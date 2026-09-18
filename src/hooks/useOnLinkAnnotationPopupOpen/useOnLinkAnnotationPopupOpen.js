import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import getLinkDestination from 'helpers/getLinkDestination';
import { getShadowRootFromNode } from 'helpers/getRootNode';
import core from 'core';
import DataElements from 'constants/dataElement';
import _debounce from 'lodash/debounce';

const MAX_DELAY = 600;

const LINK_POPUP_SELECTOR = `[data-element="${DataElements.LINK_ANNOTATION_POPUP}"]`;
// Real gap is 5px; a few extra px in case the mouse skips past it when moving fast.
const LINK_POPUP_HOVER_BRIDGE = 8;

// Mouse move events fire for the whole document, including when the cursor is over the popup
// Ignore the link underneath the popup to keep the popup from jumping
const isCursorOverLinkPopup = (event, store, activeDocumentViewerKey) => {
  if (event.target?.closest?.(LINK_POPUP_SELECTOR)) {
    return true;
  }
  // Skip expensive DOM query + layout read when the popup is not open
  if (!selectors.isElementOpen(store.getState(), DataElements.LINK_ANNOTATION_POPUP)) {
    return false;
  }
  const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);
  const instanceRoot = getShadowRootFromNode(scrollViewElement) || document;
  const popupElement = instanceRoot.querySelector(`${LINK_POPUP_SELECTOR}.open`);
  if (!popupElement) {
    return false;
  }
  const { left, right, top, bottom } = popupElement.getBoundingClientRect();
  return (
    event.clientX >= left &&
    event.clientX <= right &&
    event.clientY >= top - LINK_POPUP_HOVER_BRIDGE &&
    event.clientY <= bottom + LINK_POPUP_HOVER_BRIDGE
  );
};

export default function useOnLinkAnnotationPopupOpen() {
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [isEnterComponent, setIsEnterComponent] = useState(false);
  const store = useStore();

  const hidePopup = useCallback(_debounce(() => {
    setAnnotation(null);
    setIsEnterComponent(false);
    dispatch(actions.closeElement(DataElements.LINK_ANNOTATION_POPUP));
  }, MAX_DELAY), []);

  const handleOnMouseEnter = () => {
    hidePopup.cancel();
    if (!isEnterComponent) {
      setIsEnterComponent(true);
    }
  };

  const handleOnMouseLeave = () => {
    setIsEnterComponent(false);
    hidePopup();
  };
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));

  useEffect(() => {
    const onMouseHover = (e) => {
      if (e.buttons !== 0) {
        return;
      }
      // Keep the popup open while the cursor moves into it instead of switching to the link
      // rendered underneath the popup
      if (isCursorOverLinkPopup(e, store, activeDocumentViewerKey)) {
        hidePopup.cancel();
        return;
      }
      const annotations = core.getAnnotationManager(activeDocumentViewerKey).getAnnotationsByMouseEvent(e, true);
      const linkAnnot = annotations.find((annot) => annot instanceof window.Core.Annotations.Link);
      const contents = getLinkDestination(linkAnnot, store) || '';

      if (contents) {
        setAnnotation(linkAnnot);
        dispatch(actions.openElement(DataElements.LINK_ANNOTATION_POPUP));
      } else if (!isEnterComponent) {
        hidePopup();
        return;
      }
      hidePopup.cancel();
    };

    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
      hidePopup.cancel();
    };
  }, [annotation, dispatch, hidePopup, isEnterComponent, activeDocumentViewerKey]);

  return { annotation, handleOnMouseEnter, handleOnMouseLeave };
}
