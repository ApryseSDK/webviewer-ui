import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';

const propTypes = {
  annotationId: PropTypes.string,
  ariaLabel: PropTypes.string,
  pendingEditTextMap: PropTypes.object,
  pendingReplyMap: PropTypes.object,
  pendingAttachmentMap: PropTypes.object,
};

const NoteUnpostedCommentIndicator = ({ annotationId, ariaLabel, pendingEditTextMap, pendingReplyMap, pendingAttachmentMap }) => {
  const { t } = useTranslation();
  const [hasUnpostedComment, setHasUnpostedComment] = useState(false);
  const [hasUnpostedReply, setHasUnpostedReply] = useState(false);
  const [hasUnpostedAttachment, setHasUnpostedAttachment] = useState(false);

  useEffect(() => {
    setHasUnpostedComment(pendingEditTextMap[annotationId]?.length > 0);
    setHasUnpostedReply(pendingReplyMap[annotationId]?.length > 0);
    setHasUnpostedAttachment(pendingAttachmentMap[annotationId]?.length > 0);
  }, [pendingEditTextMap, pendingReplyMap, pendingAttachmentMap]);

  return (
    (hasUnpostedComment || hasUnpostedReply || hasUnpostedAttachment) ?
      <div data-element="unpostedCommentIndicator">
        <Tooltip content={t('message.unpostedComment')}>
          <div>
            <Icon className="type-icon" glyph={'icon-unposted-comment'} ariaLabel={ariaLabel}/>
          </div>
        </Tooltip>
      </div> :
      null
  );
};

NoteUnpostedCommentIndicator.propTypes = propTypes;

export default NoteUnpostedCommentIndicator;
