import React from 'react';
import PropTypes from 'prop-types';
import NotePopup from 'components/NotePopup';
import NoteState from 'components/NoteState';
import Icon from 'components/Icon';
import NoteUnpostedCommentIndicator from 'components/NoteUnpostedCommentIndicator';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import { isDarkColorHex } from 'helpers/color';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { NotesPanelSortStrategy } from 'constants/sortStrategies';
import Theme from 'constants/theme';
import Choice from 'components/Choice';
import Avatar from 'react-avatar';
import './NoteHeader.scss';
import TimeAgo from 'javascript-time-ago';
import ReactTimeAgo from 'react-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

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
  activeTheme: PropTypes.string,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
  isGroupMember: PropTypes.bool,
  showAnnotationNumbering: PropTypes.bool,
  completedState: PropTypes.bool,
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
    activeTheme,
    isMultiSelected,
    isMultiSelectMode,
    handleMultiSelect,
    isGroupMember,
    showAnnotationNumbering,
    completedState,
  } = props;

  const [t] = useTranslation();
  const date =
    sortStrategy === NotesPanelSortStrategy.MODIFIED_DATE ||
    (notesShowLastUpdatedDate && sortStrategy !== NotesPanelSortStrategy.CREATED_DATE)
      ? getLatestActivityDate(annotation)
      : annotation.DateCreated;
  const numberOfReplies = annotation.getReplies().length;
  let color = annotation[iconColor]?.toHexString?.();

  if (activeTheme === Theme.DARK && color && isDarkColorHex(color)) {
    color = '#FFFFFF';
  }

  const annotationAssociatedNumber = annotation.getAssociatedNumber();
  const annotationDisplayedAssociatedNumber = `#${annotationAssociatedNumber} - `;

  const authorAndDateClass = classNames('author-and-date', { isReply });
  const noteHeaderClass = classNames('NoteHeader', { parent: !isReply && !isGroupMember });
  return (
    <div className={noteHeaderClass}>
      {!isReply && (
        <div className="type-icon-container">
          {isUnread && <div className="unread-notification"></div>}
          {annotation.Color !== '' ? (
            <Avatar name={annotation.Author} size="40" className="profile-pic" />
          ) : (
            <img className="profile-pic" width={40} height={40} src={annotation.Color} />
          )}
        </div>
      )}
      <div className={authorAndDateClass}>
        <div className="author-and-overflow">
          <div className="author-and-time">
            <div className="author">
              {showAnnotationNumbering && annotationAssociatedNumber !== undefined && (
                <span className="annotation-number">{annotationDisplayedAssociatedNumber}</span>
              )}
              {renderAuthorName(annotation)}
            </div>
            <div className="date-and-num-replies">
              <div className="date-and-time">
                <ReactTimeAgo date={date} locale="en-US" />
                {isGroupMember && ` (Page ${annotation.PageNumber})`}
              </div>
              {numberOfReplies > 0 && !isSelected && (
                <div className="num-replies-container">
                  <Icon className="num-reply-icon" glyph={'icon-chat-bubble'} />
                  <div className="num-replies">{numberOfReplies}</div>
                </div>
              )}
            </div>
          </div>
          <div className="state-and-overflow">
            {isMultiSelectMode && !isGroupMember && !isReply && (
              <Choice
                id={`note-multi-select-toggle_${annotation.Id}`}
                checked={isMultiSelected}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMultiSelect(!isMultiSelected);
                }}
              />
            )}
            {/* <NoteUnpostedCommentIndicator annotationId={annotation.Id} /> */}
            {!isNoteStateDisabled &&
              !completedState &&
              !isReply &&
              !isMultiSelectMode &&
              !isGroupMember &&
              isSelected && <NoteState annotation={annotation} isSelected={isSelected} />}
            {!isEditing && isSelected && !isMultiSelectMode && !isGroupMember && (
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
