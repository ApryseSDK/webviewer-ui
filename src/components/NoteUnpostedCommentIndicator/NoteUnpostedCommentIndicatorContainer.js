import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import NoteContext from 'components/Note/Context';
import NoteUnpostedCommentIndicator from './NoteUnpostedCommentIndicator'

const NoteUnpostedCommentIndicatorContainer = ({ annotationId }) => {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'unpostedCommentIndicator'));
  const { pendingEditTextMap, pendingReplyMap } = React.useContext(NoteContext);

  if (isDisabled) {
    return null;
  } else {
    return (
      <NoteUnpostedCommentIndicator
        annotationId={annotationId}
        pendingEditTextMap={pendingEditTextMap}
        pendingReplyMap={pendingReplyMap}
      />);
  }
};

export default NoteUnpostedCommentIndicatorContainer;