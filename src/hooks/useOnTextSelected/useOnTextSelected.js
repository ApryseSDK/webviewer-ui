import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnTextSelected() {
  const [
    popupItems,
    activeDocumentViewerKey,
  ] = useSelector(
    (state) => [
      selectors.getPopupItems(state, DataElements.TEXT_POPUP),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [selectedTextQuads, setSelectedTextQuads] = useState([]);

  useEffect(() => {
    const textSelectTool = core.getTool('TextSelect', activeDocumentViewerKey);
    const onSelectionComplete = (startQuad, allQuads) => {
      if (popupItems.length > 0) {
        setSelectedTextQuads(allQuads);
        dispatch(actions.openElement(DataElements.TEXT_POPUP));
      }
    };

    textSelectTool.addEventListener('selectionComplete', onSelectionComplete);
    return () => textSelectTool.removeEventListener('selectionComplete', onSelectionComplete);
  }, [popupItems, activeDocumentViewerKey]);

  return { selectedTextQuads };
}