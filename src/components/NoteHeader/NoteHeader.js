import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import NotePopup from 'components/NotePopup';
import NoteState from 'components/NoteState';
import Icon from 'components/Icon';
import NoteUnpostedCommentIndicator from 'components/NoteUnpostedCommentIndicator';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import getColor from 'helpers/getColor';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { NotesPanelSortStrategy } from 'constants/sortStrategies';
import getAnnotationReference from 'src/helpers/getAnnotationReference';
import getWiseflowCustomValues from 'helpers/getWiseflowCustomValues';

import './NoteHeader.scss';
import Tooltip from '../Tooltip';

const propTypes = {
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  color: PropTypes.string,
  fillColor: PropTypes.string,
  annotation: PropTypes.object,
  language: PropTypes.string,
  noteDateFormat: PropTypes.string,
  isSelected: PropTypes.bool,
  setIsEditing: PropTypes.func,
  notesShowLastUpdatedDate: PropTypes.bool,
  isReply: PropTypes.bool,
  isUnread: PropTypes.bool,
  renderAuthorName: PropTypes.func,
  isNoteStateDisabled: PropTypes.bool,
  isEditing: PropTypes.bool,
  noteIndex: PropTypes.number,
  sortStrategy: PropTypes.string,
  renderAnnotationReference: PropTypes.func,
};

function NoteHeader(props) {
  const {
    icon,
    iconColor,
    annotation,
    language,
    noteDateFormat,
    isSelected,
    setIsEditing,
    notesShowLastUpdatedDate,
    isReply,
    isUnread,
    renderAuthorName,
    isNoteStateDisabled,
    isEditing,
    noteIndex,
    sortStrategy,
    // CUSTOM WISEFLOW
    renderAnnotationReference,
  } = props;

  const [t] = useTranslation();
  const date =
    sortStrategy === NotesPanelSortStrategy.MODIFIED_DATE ||
    (notesShowLastUpdatedDate && sortStrategy !== NotesPanelSortStrategy.CREATED_DATE)
      ? getLatestActivityDate(annotation)
      : annotation.DateCreated;
  const color = annotation[iconColor]?.toHexString?.();
  const fillColor = getColor(annotation.FillColor);

  const showShareType = getWiseflowCustomValues().showShareType;

  const authorAndDateClass = classNames('author-and-date', { isReply });
  const noteHeaderClass = classNames('NoteHeader', { parent: !isReply });

  const pageNumber = annotation.getPageNumber();

  // CUSTOM WISEFLOW: get hash of the annotation information
  const annotationReference = useMemo(() => {
    return getAnnotationReference(annotation);
  }, [annotation, pageNumber]);

  const [copied, setCopied] = useState(false);

  const copyTooltipText = `${t('option.notesPanel.noteHeader.copyReferenceButton')} ${annotationReference}`;

  const handleCopyAnnotId = e => {
    e.stopPropagation();
    navigator.clipboard.writeText(annotationReference);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className={noteHeaderClass}>
      {!isReply && (
        <div className="type-icon-container">
          {isUnread && <div className="unread-notification"></div>}
          <Icon className="type-icon" glyph={icon} color={color} fillColor={fillColor} />
        </div>
      )}
      <div className={authorAndDateClass} style={{ paddingBottom: '6px' }}>
        <div className="author-and-overflow">
          <div className="author-and-time">
            <div className="author">{renderAuthorName(annotation)}</div>
            <div className="date-and-num-replies">
              <div className="date-and-time">
                {date ? dayjs(date).locale(language).format(noteDateFormat) : t('option.notesPanel.noteContent.noDate')}
              </div>
            </div>
            <div className="annotId">
              <span>
                {t('annotation.reference')}: {renderAnnotationReference(annotation)}
              </span>
              <Tooltip content={copied ? t('action.copied') : copyTooltipText} showOnKeyboardFocus>
                <button onClick={handleCopyAnnotId} className={'copy-reference-button'} aria-label={copyTooltipText}>
                  <Icon glyph="icon-header-page-manipulation-page-transition-reader" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="state-and-overflow">
            <NoteUnpostedCommentIndicator annotationId={annotation.Id} />
            {!isNoteStateDisabled && showShareType && !isReply && (
              <NoteState annotation={annotation} isSelected={isSelected} noteIndex={noteIndex} />
            )}
            {!isEditing && isSelected && (
              <NotePopup noteIndex={noteIndex} annotation={annotation} setIsEditing={setIsEditing} isReply={isReply} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

NoteHeader.propTypes = propTypes;

export default NoteHeader;
