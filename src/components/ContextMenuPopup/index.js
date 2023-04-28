import React from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import DataElements from 'src/constants/dataElement';

import ContextMenuPopup from './ContextMenuPopup';

export default function ContextMenuPopupContainer() {
  const dispatch = useDispatch();
  const closeElements = () => dispatch(
    actions.closeElements([
      DataElements.ANNOTATION_POPUP,
      DataElements.TEXT_POPUP,
      DataElements.INLINE_COMMENT_POPUP,
    ])
  );

  return (
    <ContextMenuPopup closeElements={closeElements} />
  );
}