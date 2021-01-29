import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import NotePopupContainer from './NotePopupContainer';


function NotePopupRedux(props) {
  const [notePopupId] = useSelector(state => [selectors.getNotePopupId(state)], shallowEqual);
  const dispatch = useDispatch();

  const closePopup = React.useCallback(function closePopup() {
    dispatch(actions.setNotePopupId(''));
  }, [dispatch]);

  const openPopup = React.useCallback(function openPopup(id) {
    dispatch(actions.setNotePopupId(id));
  }, [dispatch]);

  const reduxProps = {
    notePopupId,
    closePopup,
    openPopup
  };

  return (
    <NotePopupContainer {...props} {...reduxProps} />
  );
}

export default NotePopupRedux;
