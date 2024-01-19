import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import useOnRightClick from 'hooks/useOnRightClick';
import { isMobile as isMobileCSS, isMobileDevice } from 'helpers/device';
import { isOfficeEditorMode } from 'helpers/officeEditor';

export default function useOnContextMenuOpen() {
  const [
    popupItems,
    isRightClickAnnotationPopupEnabled,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.getPopupItems(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [clickPosition, setClickPosition] = useState({ left: 0, top: 0 });

  // if right click menu is not turned on, on tablet + phone, ContextMenuPopup won't be available
  // if it's on, on tablet + phone, it will be available without being draggable
  const isMobile = !!isMobileDevice || isMobileCSS();

  // Use this to store isRightClickAnnotationPopupEnabled value to avoid stale closure
  const isRightClickAnnotationPopupEnabledRef = useRef();

  useEffect(() => {
    isRightClickAnnotationPopupEnabledRef.current = isRightClickAnnotationPopupEnabled;
  }, [isRightClickAnnotationPopupEnabled]);

  useOnRightClick(
    useCallback(async (e) => {
      const { pageX: left, pageY: top } = e;
      const annotationUnderMouse = core.getAnnotationByMouseEvent(e, activeDocumentViewerKey);
      if ((!isRightClickAnnotationPopupEnabledRef.current && !isMobile) || (isRightClickAnnotationPopupEnabledRef.current && !annotationUnderMouse)) {
        if (popupItems.length > 0) {
          setClickPosition({ left, top });
          if (isOfficeEditorMode()) {
            await core.getOfficeEditor().onRightClick(e);
          }
          dispatch(actions.openElement(DataElements.CONTEXT_MENU_POPUP));
        }
      }
    }, [popupItems, activeDocumentViewerKey])
  );

  return { clickPosition };
}