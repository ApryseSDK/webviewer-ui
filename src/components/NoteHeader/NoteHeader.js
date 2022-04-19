import React, { useState } from 'react';
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
import core from 'core';

import './NoteHeader.scss';
import Tooltip from '../Tooltip';
import AnnotationStylePopupStories from '../AnnotationStylePopup/AnnotationStylePopup.stories';

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
  isUnread: PropTypes.bool,
  renderAuthorName: PropTypes.func,
  isNoteStateDisabled: PropTypes.bool,
  isEditing: PropTypes.bool,
  noteIndex: PropTypes.number,
  sortStrategy: PropTypes.string,
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
  } = props;

  const [t] = useTranslation();
  const [copyTooltip, setCopyTooltip] = useState(t('action.copyText'));
  const date =
    sortStrategy === NotesPanelSortStrategy.MODIFIED_DATE ||
    (notesShowLastUpdatedDate && sortStrategy !== NotesPanelSortStrategy.CREATED_DATE)
      ? getLatestActivityDate(annotation)
      : annotation.DateCreated;
  const numberOfReplies = annotation.getReplies().length;
  const color = annotation[iconColor]?.toHexString?.();
  const fillColor = getColor(annotation.FillColor);

  const authorAndDateClass = classNames('author-and-date', { isReply });
  const noteHeaderClass = classNames('NoteHeader', { parent: !isReply });

  const pageNumber = annotation.getPageNumber();
  const annotationList = core.getAnnotationsList();
  const annotNumber =
    annotationList?.filter(annot => annot.TD === pageNumber)?.findIndex(annot => annot.xy === annotation.Id) + 1;

  const handleCopyAnnotId = () => {
    navigator.clipboard.writeText(`Page ${pageNumber}, annotation ${annotNumber}`);
    setCopyTooltip(t('action.copied'));
    setTimeout(() => {
      setCopyTooltip(t('action.copyText'));
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
      <div className={authorAndDateClass}>
        <div className="author-and-overflow">
          <div className="author-and-time">
            <div className="author">{renderAuthorName(annotation)}</div>
            <div className="date-and-num-replies">
              <div className="date-and-time">
                {date ? dayjs(date).locale(language).format(noteDateFormat) : t('option.notesPanel.noteContent.noDate')}
              </div>
              {numberOfReplies > 0 && !isSelected && (
                <div className="num-replies-container">
                  <Icon className="num-reply-icon" glyph={'icon-chat-bubble'} />
                  <div className="num-replies">{numberOfReplies}</div>
                </div>
              )}
            </div>
            <div className="annotId">
              <span>
                Page {pageNumber} , Annotation {annotNumber}
              </span>
              <Tooltip content={copyTooltip}>
                <div onClick={() => handleCopyAnnotId()}>
                  <Icon glyph="icon-header-page-manipulation-page-transition-reader" />
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="state-and-overflow">
            <NoteUnpostedCommentIndicator annotationId={annotation.Id} />
            {!isNoteStateDisabled && !isReply && <NoteState annotation={annotation} isSelected={isSelected} />}
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
