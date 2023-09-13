import { useCallback, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';

import useOnRightClick from 'hooks/useOnRightClick';

import { isMobile as isMobileCSS, isMobileDevice } from 'helpers/device';

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

  useOnRightClick(
    useCallback((e) => {
      const { pageX: left, pageY: top } = e;

      const annotationUnderMouse = core.getAnnotationByMouseEvent(e, activeDocumentViewerKey);
      if ((!isRightClickAnnotationPopupEnabled && !isMobile) || (isRightClickAnnotationPopupEnabled && !annotationUnderMouse)) {
        if (popupItems.length > 0) {
          setClickPosition({ left, top });
          dispatch(actions.openElement(DataElements.CONTEXT_MENU_POPUP));
        }
      }
    }, [popupItems, isRightClickAnnotationPopupEnabled, activeDocumentViewerKey])
  );

  return { clickPosition };
}