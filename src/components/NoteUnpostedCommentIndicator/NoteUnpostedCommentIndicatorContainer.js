import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import NoteContext from 'components/Note/Context';
import NoteUnpostedCommentIndicator from './NoteUnpostedCommentIndicator';

const NoteUnpostedCommentIndicatorContainer = ({ annotationId }) => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'unpostedCommentIndicator'));
  const { pendingEditTextMap, pendingReplyMap, pendingAttachmentMap } = React.useContext(NoteContext);

  if (isDisabled) {
    return null;
  }
  return (
    <NoteUnpostedCommentIndicator
      annotationId={annotationId}
      pendingEditTextMap={pendingEditTextMap}
      pendingReplyMap={pendingReplyMap}
      pendingAttachmentMap={pendingAttachmentMap}
    />);
};

export default NoteUnpostedCommentIndicatorContainer;