import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import NoteTextPreview from './NoteTextPreview';


function NoteTextPreviewContainer(props) {
  const [notePanelWidth] = useSelector(
    state => [
      selectors.getNotesPanelWidth(state),
    ],
    shallowEqual,
  );

  return (
    <NoteTextPreview {...props} notePanelWidth={notePanelWidth} />
  )
};

export default NoteTextPreviewContainer;