import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import NoteContext from 'components/Note/Context';
import NoteUnpostedCommentIndicator from './NoteUnpostedCommentIndicator';
import PropTypes from 'prop-types';

const propTypes = {
  annotationId: PropTypes.string,
  ariaLabel: PropTypes.string,
};

const NoteUnpostedCommentIndicatorContainer = ({ annotationId, ariaLabel }) => {
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'unpostedCommentIndicator'));
  const { pendingEditTextMap, pendingReplyMap, pendingAttachmentMap } = React.useContext(NoteContext);

  if (isDisabled) {
    return null;
  }
  return (
    <NoteUnpostedCommentIndicator
      annotationId={annotationId}
      ariaLabel={ariaLabel}
      pendingEditTextMap={pendingEditTextMap}
      pendingReplyMap={pendingReplyMap}
      pendingAttachmentMap={pendingAttachmentMap}
    />);
};

NoteUnpostedCommentIndicatorContainer.propTypes = propTypes;

export default NoteUnpostedCommentIndicatorContainer;