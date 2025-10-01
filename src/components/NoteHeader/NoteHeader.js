import React from 'react';
import PropTypes from 'prop-types';

import NotePopup from 'components/NotePopup';
import NoteState from 'components/NoteState';
import Icon from 'components/Icon';
import NoteUnpostedCommentIndicator from 'components/NoteUnpostedCommentIndicator';
import Choice from 'components/Choice';
import Button from 'components/Button';

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
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const { Annotations } = window.Core;

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
  isTrackedChange: PropTypes.bool,
};

/**
 * Determines the majority text color in a rich text annotation.
 *
 * Given a richTextStyle object mapping character positions to style objects,
 * the total text length, and a default color, this function calculates which color
 * covers the largest portion of the text. If the non-rich text portion is larger
 * than the rich text portions, the default color is returned. Otherwise, the color
 * with the largest coverage is returned.
 *
 * @param {Object} richTextStyle - An object where keys are character positions and values are style objects containing a `color` property.
 * @param {number} textLength - The total length of the text.
 * @param {string} color - The default color to use if no rich text color is dominant.
 * @returns {string} The color that covers the majority of the text.
 * @ignore
 */
function getMajorityTextColor(richTextStyle, textLength, color) {
  let resultColor = '';
  let totalRichTextLength = 0;
  let richTextLocations = [];
  let richTextColorLengths = [];
  Object.keys(richTextStyle)
    .forEach((key) => {
      richTextLocations.push(key);
    });

  Object.keys(richTextStyle).forEach((key) => {
    if (richTextStyle[key].color) {
      let length = 0;
      const location = parseInt(key, 10);
      const nextLocation = richTextLocations[richTextLocations.indexOf(key) + 1];
      if (nextLocation) {
        length = nextLocation - location;
      } else {
        length = textLength - location;
      }
      richTextColorLengths.push({ color: richTextStyle[key].color, textLength: length });
      totalRichTextLength += length;
    }
  });

  const nonRichTextLength = textLength - totalRichTextLength;
  if (nonRichTextLength > totalRichTextLength) {
    return color;
  }

  let highestTextLength = 0;
  richTextColorLengths.forEach((item) => {
    if (item.textLength > nonRichTextLength && item.textLength > highestTextLength) {
      resultColor = item.color;
      highestTextLength = item.textLength;
    }
  });

  if (resultColor === '') {
    return color;
  }

  return resultColor;
}

/**
 * Determines the color to use for the comment box header, considering its icon color and rich text style.
 *
 * If the annotation contains rich text styles, the function analyzes the styles to select the most representative color.
 * - If there is only one rich text style and it covers more than half of the text, its color is used.
 * - If there are multiple rich text styles, the majority color is determined by `getMajorityTextColor`.
 * - Otherwise, the annotation's icon color is used.
 *
 * @param {Object} annotation - The annotation object containing color and rich text style information.
 * @param {string} iconColor - The property name for the icon color in the annotation object.
 * @returns {string|undefined} The determined color as a hex string, or undefined if not found.
 * @ignore
 */
function getColorFromAnnotation(annotation, iconColor) {
  let color = annotation[iconColor]?.toHexString?.();

  const isFreeText = annotation instanceof Annotations.FreeTextAnnotation;
  if (isFreeText) {
    // If the annotation has rich text style, we need to determine the color based on the rich text style
    const richTextStyle = annotation.getRichTextStyle();

    if (richTextStyle) {
      const numberOfRichTextStyles = Object.keys(richTextStyle).length;
      const textLength = annotation.getContents().length;
      const isSingleColorRichText = numberOfRichTextStyles === 1 && richTextStyle[0] && richTextStyle[0].color;
      if (isSingleColorRichText) {
        const richTextLength = textLength - Object.keys(richTextStyle)[0];
        color = richTextLength / textLength > 0.5 ? richTextStyle[0].color : color;
      } else if (numberOfRichTextStyles > 1) {
        color = getMajorityTextColor(richTextStyle, textLength, color);
      }
    }
  }

  return color;
}

/**
 * Returns a color from the common colors palette based on the active theme and the provided color.
 *
 * If the active theme is DARK and the color is a dark hex color, returns white.
 * If the active theme is LIGHT and the color is a light hex color, returns black.
 *
 * @param {Theme} activeTheme - The current theme (e.g., Theme.DARK or Theme.LIGHT).
 * @param {string} color - The hex color string to evaluate.
 * @returns {string|undefined} The selected color from COMMON_COLORS, or undefined if no condition matches.
 * @ignore
 */
function getColorFromTheme(activeTheme, color) {
  if (activeTheme === Theme.DARK && color && isDarkColorHex(color)) {
    return COMMON_COLORS['white'];
  } else if (activeTheme === Theme.LIGHT && color && isLightColorHex(color)) {
    return COMMON_COLORS['black'];
  }
}

/**
 * Returns the creation date of an annotation in the specified timezone.
 *
 * Depending on the sort strategy and settings, it either returns the latest activity date
 * or the original creation date of the annotation. If a timezone is provided, the date is
 * converted to that timezone.
 *
 * @param {string} sortStrategy - The strategy used for sorting notes (e.g., by modified or created date).
 * @param {boolean} notesShowLastUpdatedDate - Whether to show the last updated date for notes.
 * @param {Object} annotation - The annotation object containing date information.
 * @param {string} [timezone] - The IANA timezone string (e.g., 'America/New_York').
 * @returns {Date} The date created or last updated, optionally converted to the specified timezone.
 * @ignore
 */
function getDateCreatedInTimezone(sortStrategy, notesShowLastUpdatedDate, annotation, timezone) {
  const dateCreated = (
    sortStrategy === NotesPanelSortStrategy.MODIFIED_DATE ||
    (notesShowLastUpdatedDate && sortStrategy !== NotesPanelSortStrategy.CREATED_DATE)) ?
    getLatestActivityDate(annotation) : annotation.DateCreated;

  if (timezone && dateCreated) {
    const datetimeStr = dateCreated.toLocaleString('en-US', { timeZone: timezone });
    return new Date(datetimeStr);
  }

  return dateCreated;
}

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
    timezone,
    isTrackedChange,
  } = props;

  const [t] = useTranslation();
  const isViewOnly = useSelector(selectors.isViewOnly);

  let date = getDateCreatedInTimezone(sortStrategy, notesShowLastUpdatedDate, annotation, timezone);
  const noteDateAndTime = date ? dayjs(date).locale(language).format(noteDateFormat) : t('option.notesPanel.noteContent.noDate');

  const numberOfReplies = annotation.getReplies().length;

  let color = getColorFromAnnotation(annotation, iconColor);
  if (color === '') {
    color = getColorFromTheme(activeTheme, color);
  }
  const fillColor = getColor(annotation.FillColor);

  const annotationAssociatedNumber = annotation.getAssociatedNumber();
  const annotationDisplayedAssociatedNumber = `#${annotationAssociatedNumber} - `;

  const authorAndDateClass = classNames('author-and-date', { isReply });
  const noteHeaderClass = classNames('NoteHeader', { parent: !isReply && !isGroupMember });

  const acceptTrackedChange = (trackedChangeAnnot) => {
    const trackedChangeId = trackedChangeAnnot.getCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY);
    core.getOfficeEditor().acceptTrackedChange(trackedChangeId);
  };
  const rejectTrackedChange = (trackedChangeAnnot) => {
    const trackedChangeId = trackedChangeAnnot.getCustomData(OFFICE_EDITOR_TRACKED_CHANGE_KEY);
    core.getOfficeEditor().rejectTrackedChange(trackedChangeId);
  };

  const showNotePopup = !isViewOnly && !isEditing && isSelected && !isMultiSelectMode && !isGroupMember && !isTrackedChange;

  return (
    <div className={noteHeaderClass}>
      {!isReply &&
        <div className="type-icon-container">
          {isUnread &&
            <div className="unread-notification"></div>
          }
          <Icon className="type-icon" glyph={icon} color={color} fillColor={fillColor} />
        </div>
      }
      <div className={authorAndDateClass}>
        <div className="author-and-overflow">
          <div className="author-and-time">
            <div className="author">
              {showAnnotationNumbering && annotationAssociatedNumber !== undefined &&
                <span className="annotation-number">{annotationDisplayedAssociatedNumber}</span>
              }
              {renderAuthorName(annotation)}
            </div>
            <div className="date-and-num-replies">
              <div className="date-and-time">
                {noteDateAndTime}
                {isGroupMember && ` (Page ${annotation.PageNumber})`}
              </div>
              {numberOfReplies > 0 && !isSelected &&
                <div className="num-replies-container">
                  <Icon className="num-reply-icon" glyph='icon-chat-bubble' />
                  <div className="num-replies">{numberOfReplies}</div>
                </div>}
            </div>
          </div>
          <div className="state-and-overflow">
            {isMultiSelectMode && !isGroupMember && !isReply &&
              <Choice
                id={`note-multi-select-toggle_${annotation.Id}`}
                aria-label={`${renderAuthorName(annotation)} ${t('option.notesPanel.toggleMultiSelect')}`}
                checked={isMultiSelected}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMultiSelect(!isMultiSelected);
                }}
              />
            }
            <NoteUnpostedCommentIndicator
              annotationId={annotation.Id}
              ariaLabel={`Unposted Comment, ${renderAuthorName(annotation)}, ${noteDateAndTime}`}
            />
            {!isNoteStateDisabled && !isReply && !isMultiSelectMode && !isGroupMember && !isTrackedChange &&
              <NoteState
                annotation={annotation}
                isSelected={isSelected}
              />
            }
            {showNotePopup &&
              <NotePopup
                noteIndex={noteIndex}
                annotation={annotation}
                setIsEditing={setIsEditing}
                isReply={isReply}
              />
            }
            {isSelected && isTrackedChange && !isMultiSelectMode &&
              <>
                <Button
                  title={t('officeEditor.accept')}
                  img={'icon-menu-checkmark'}
                  className="tracked-change-icon-wrapper accept"
                  onClick={() => acceptTrackedChange(annotation)}
                  iconClassName="tracked-change-icon"
                />
                <Button
                  title={t('officeEditor.reject')}
                  img={'icon-close'}
                  className="tracked-change-icon-wrapper reject"
                  onClick={() => rejectTrackedChange(annotation)}
                  iconClassName="tracked-change-icon"
                />
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

NoteHeader.propTypes = propTypes;

export default NoteHeader;
