import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import Events from 'constants/events';
import { AUTO_SAVE_INDICATOR_TIMEOUT } from 'src/constants/autosave';

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
  const [showAutosavedCheckmark, setShowAutosavedCheckmark] = useState(false);

  useEffect(() => {
    setHasUnpostedComment(pendingEditTextMap[annotationId]?.length > 0);
    setHasUnpostedReply(pendingReplyMap[annotationId]?.length > 0);
    setHasUnpostedAttachment(pendingAttachmentMap[annotationId]?.length > 0);
  }, [annotationId, pendingEditTextMap, pendingReplyMap, pendingAttachmentMap]);

  useEffect(() => {
    let hideTimeout;

    const onNoteAutosaved = (event) => {
      if (event?.detail?.annotationId !== annotationId) {
        return;
      }

      setShowAutosavedCheckmark(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setShowAutosavedCheckmark(false);
      }, AUTO_SAVE_INDICATOR_TIMEOUT);
    };

    window.addEventListener(Events.NOTE_AUTOSAVED, onNoteAutosaved);

    return () => {
      clearTimeout(hideTimeout);
      window.removeEventListener(Events.NOTE_AUTOSAVED, onNoteAutosaved);
    };
  }, [annotationId]);

  const hasUnpostedItem = hasUnpostedComment || hasUnpostedReply || hasUnpostedAttachment;

  if (!hasUnpostedItem && !showAutosavedCheckmark) {
    return null;
  }

  return (
    <div data-element="unpostedCommentIndicator">
      <Tooltip content={showAutosavedCheckmark ? t('message.saved') : t('message.unpostedComment')}>
        <div>
          <Icon
            className="type-icon"
            glyph={showAutosavedCheckmark ? 'icon-menu-checkmark' : 'icon-unposted-comment'}
            ariaLabel={ariaLabel}
          />
        </div>
      </Tooltip>
    </div>
  );
};

NoteUnpostedCommentIndicator.propTypes = propTypes;

export default NoteUnpostedCommentIndicator;
