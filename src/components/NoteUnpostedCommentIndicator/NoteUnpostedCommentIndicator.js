import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';

const NoteUnpostedCommentIndicatorContainer = (props) => {
  const { t } = useTranslation();
  const { annotationId, pendingEditTextMap, pendingReplyMap } = props;
  const [hasUnpostedComment, setHasUnpostedComment] = useState(false);
  const [hasUnpostedReply, setHasUnpostedReply] = useState(false);

  useEffect(() => {
    setHasUnpostedComment(pendingEditTextMap[annotationId]?.length > 0)
    setHasUnpostedReply(pendingReplyMap[annotationId]?.length > 0)
  }, [pendingEditTextMap, pendingReplyMap])

  return (
    hasUnpostedComment || hasUnpostedReply ?
      <div data-element="unpostedCommentIndicator">
        <Tooltip content={t('message.unpostedComment')}>
          <div>
            <Icon glyph={'icon-unposted-comment'} />
          </div>
        </Tooltip>
      </div> :
      null
  );
};

export default NoteUnpostedCommentIndicatorContainer;