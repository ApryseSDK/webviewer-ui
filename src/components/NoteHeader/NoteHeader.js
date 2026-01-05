import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import NoteShareType from 'components/NoteShareType';
import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';
import Choice from 'components/Choice';
import Tooltip from 'components/Tooltip';

import getLatestActivityDate from 'helpers/getLatestActivityDate';
import getColor from 'helpers/getColor';
import { isDarkColorHex, isLightColorHex } from 'helpers/color';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import core from 'core';
import { NotesPanelSortStrategy } from 'constants/sortStrategies';
import Theme from 'constants/theme';
import { OFFICE_EDITOR_TRACKED_CHANGE_KEY } from 'constants/officeEditor';
import { COMMON_COLORS } from 'constants/commonColors';

import './NoteHeader.scss';
import getAnnotationReference from 'src/helpers/getAnnotationReference';
import getWiseflowCustomValues from 'helpers/getWiseflowCustomValues';

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
  activeTheme: PropTypes.string,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
  isGroupMember: PropTypes.bool,
  showAnnotationNumbering: PropTypes.bool,
  isTrackedChange: PropTypes.bool,
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
    renderAnnotationReference,
    activeTheme,
    isMultiSelected,
    isMultiSelectMode,
    handleMultiSelect,
    isGroupMember,
    showAnnotationNumbering,
    timezone,
    isTrackedChange,
  } = props;

  const [t] = useTranslation();

  let date;
  const dateCreated =
    sortStrategy === NotesPanelSortStrategy.MODIFIED_DATE ||
    (notesShowLastUpdatedDate && sortStrategy !== NotesPanelSortStrategy.CREATED_DATE)
      ? getLatestActivityDate(annotation)
      : annotation.DateCreated;
  if (timezone && dateCreated) {
    const datetimeStr = dateCreated.toLocaleString('en-US', { timeZone: timezone });
    date = new Date(datetimeStr);
  } else {
    date = dateCreated;
  }

  // const numberOfReplies = annotation.getReplies().length;
  let color = annotation[iconColor]?.toHexString?.();

  if (activeTheme === Theme.DARK && color && isDarkColorHex(color)) {
    color = COMMON_COLORS['white'];
  } else if (activeTheme === Theme.LIGHT && color && isLightColorHex(color)) {
    color = COMMON_COLORS['black'];
  }

  const fillColor = getColor(annotation.FillColor);
  const annotationAssociatedNumber = annotation.getAssociatedNumber();
  const annotationDisplayedAssociatedNumber = `#${annotationAssociatedNumber} - `;

  const showShareType = getWiseflowCustomValues().showShareType;

  const authorAndDateClass = classNames('author-and-date', { isReply });
  const noteHeaderClass = classNames('NoteHeader', { parent: !isReply && !isGroupMember });

  const acceptTrackedChange = trackedChangeAnnot => {
    const trackedChangeId = trackedChangeAnnot.getCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY);
    core.getOfficeEditor().acceptTrackedChange(trackedChangeId);
  };
  const rejectTrackedChange = trackedChangeAnnot => {
    const trackedChangeId = trackedChangeAnnot.getCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY);
    core.getOfficeEditor().rejectTrackedChange(trackedChangeId);
  };

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
            <div className="author">
              {showAnnotationNumbering && annotationAssociatedNumber !== undefined && (
                <span className="annotation-number">{annotationDisplayedAssociatedNumber}</span>
              )}
              {renderAuthorName(annotation)}
            </div>
            <div className="date-and-num-replies">
              <div className="date-and-time">
                {date ? dayjs(date).locale(language).format(noteDateFormat) : t('option.notesPanel.noteContent.noDate')}
                {isGroupMember && ` (Page ${annotation.PageNumber})`}
              </div>
            </div>
          </div>

          <div className="state-and-overflow">
            {isMultiSelectMode && !isGroupMember && !isReply && (
              <Choice
                id={`note-multi-select-toggle_${annotation.Id}`}
                aria-label={`${renderAuthorName(annotation)} ${t('option.notesPanel.toggleMultiSelect')}`}
                checked={isMultiSelected}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMultiSelect(!isMultiSelected);
                }}
              />
            )}

            {/* WISEflow: Note share type menu */}
            {!isNoteStateDisabled &&
              !isReply &&
              !isMultiSelectMode &&
              !isGroupMember &&
              !isTrackedChange &&
              showShareType && <NoteShareType annotation={annotation} />}

            {!isEditing && isSelected && !isMultiSelectMode && !isGroupMember && !isTrackedChange && (
              <NotePopup noteIndex={noteIndex} annotation={annotation} setIsEditing={setIsEditing} isReply={isReply} />
            )}

            {isSelected && isTrackedChange && !isMultiSelectMode && (
              <>
                <Tooltip content={t('officeEditor.accept')}>
                  <div className="tracked-change-icon-wrapper accept" onClick={() => acceptTrackedChange(annotation)}>
                    <Icon className="tracked-change-icon" glyph="icon-menu-checkmark" />
                  </div>
                </Tooltip>
                <Tooltip content={t('officeEditor.reject')}>
                  <div className="tracked-change-icon-wrapper reject" onClick={() => rejectTrackedChange(annotation)}>
                    <Icon className="tracked-change-icon" glyph="icon-close" />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        </div>
        <div className="annot-id">
          <span>{renderAnnotationReference(annotation)}</span>
          <Tooltip content={copied ? t('action.copied') : copyTooltipText} hideOnClick={false}>
            <button onClick={handleCopyAnnotId} className={'copy-reference-button'} aria-label={copyTooltipText}>
              <Icon glyph="icon-header-page-manipulation-page-transition-reader" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

NoteHeader.propTypes = propTypes;

export default NoteHeader;
