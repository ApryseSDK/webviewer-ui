import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import NoteTextPreview from '../NoteTextPreview/NoteTextPreview';

const RedactionTextPreviewContainer = (props) => {
  const [redactionPanelWidth] = useSelector(
    (state) => [
      selectors.getRedactionPanelWidth(state),
    ],
    shallowEqual,
  );

  return (
    <NoteTextPreview {...props} panelWidth={redactionPanelWidth} comment />
  );
};

export default RedactionTextPreviewContainer;