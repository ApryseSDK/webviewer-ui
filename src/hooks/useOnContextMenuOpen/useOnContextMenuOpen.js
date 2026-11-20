import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { useInstanceCore } from 'hooks/useCore/useCore';
import DataElements from 'constants/dataElement';
import useOnRightClick from 'hooks/useOnRightClick';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import { getSpellingErrorFromAnnotations } from 'helpers/officeEditorSpellcheckHelper';

export default function useOnContextMenuOpen() {
  const core = useInstanceCore();

  const popupItems = useSelector(
    (state) => selectors.getPopupItems(state, DataElements.CONTEXT_MENU_POPUP),
    shallowEqual
  );
  const isRightClickAnnotationPopupEnabled = useSelector(selectors.isRightClickAnnotationPopupEnabled);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const dispatch = useDispatch();

  const [clickPosition, setClickPosition] = useState({ left: 0, top: 0 });
  const [spellingError, setSpellingError] = useState(null);

  // Use this to store isRightClickAnnotationPopupEnabled value to avoid stale closure
  const isRightClickAnnotationPopupEnabledRef = useRef();

  useEffect(() => {
    isRightClickAnnotationPopupEnabledRef.current = isRightClickAnnotationPopupEnabled;
  }, [isRightClickAnnotationPopupEnabled]);

  useOnRightClick(
    useCallback(async (e) => {
      const { pageX: left, pageY: top } = e;
      const annotationsUnderMouse = core.getAnnotationsByMouseEvent(e, activeDocumentViewerKey);
      if (!isRightClickAnnotationPopupEnabledRef.current || !annotationsUnderMouse.length || isOfficeEditorMode()) {
        if (popupItems.length > 0) {
          setClickPosition({ left, top });
          setSpellingError(isOfficeEditorMode() ? getSpellingErrorFromAnnotations(annotationsUnderMouse) : null);
          if (isOfficeEditorMode()) {
            await core.getOfficeEditor().onRightClick(e);
          }
          dispatch(actions.openElement(DataElements.CONTEXT_MENU_POPUP));
        }
      }
    }, [popupItems, activeDocumentViewerKey])
  );

  return {
    clickPosition,
    spellingErrorId: spellingError?.id ?? null,
    misspelledWord: spellingError?.misspelledWord ?? null,
  };
}