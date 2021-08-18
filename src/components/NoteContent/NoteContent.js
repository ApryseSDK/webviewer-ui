import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';
import classNames from 'classnames';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import NoteTextarea from 'components/NoteTextarea';
import NotePopup from 'components/NotePopup';
import NoteState from 'components/NoteState';
import NoteContext from 'components/Note/Context';
import Icon from 'components/Icon';
import NoteUnpostedCommentIndicator from 'components/NoteUnpostedCommentIndicator';

import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import { getDataWithKey, mapAnnotationToKey } from 'constants/map';
import getColor from 'helpers/getColor';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './NoteContent.scss';
import getLatestActivityDate from "helpers/getLatestActivityDate";

dayjs.extend(LocalizedFormat);

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteContent = ({ annotation, isEditing, setIsEditing, noteIndex, onTextChange, isUnread, isNonReplyNoteRead, onReplyClicked, }) => {
  const [
    noteDateFormat,
    iconColor,
    isStateDisabled,
    language,
    notesShowLastUpdatedDate
  ] = useSelector(
    state => [
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
      selectors.isElementDisabled(state, 'notePopupState'),
      selectors.getCurrentLanguage(state),
      selectors.notesShowLastUpdatedDate(state),
    ],
    shallowEqual,
  );

  const { isSelected, searchInput, resize, pendingEditTextMap, onTopNoteContentClicked } = useContext(
    NoteContext,
  );

  const dispatch = useDispatch();
  const isReply = annotation.isReply();

  const [t] = useTranslation();

  useDidUpdate(() => {
    if (!isEditing) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
  }, [isEditing]);

  const renderAuthorName = useCallback(
    annotation => {
      const name = core.getDisplayAuthor(annotation['Author']);

      return name ? (
        highlightSearchInput(name, searchInput)
      ) : (
        t('option.notesPanel.noteContent.noName')
      );
    },
    [searchInput],
  );

  const renderContents = useCallback(
    contents => {
      const autolinkerContent = [];
      Autolinker.link(contents, {
        stripPrefix: false,
        stripTrailingSlash: false,
        replaceFn(match) {
          const href = match.getAnchorHref();
          const anchorText = match.getAnchorText();
          const offset = match.getOffset();
          switch (match.getType()) {
            case 'url':
            case 'email':
            case 'phone':
              autolinkerContent.push({
                href,
                text: anchorText,
                start: offset,
                end: offset + anchorText.length,
              });
              return;
          }
        },
      });
      if (!autolinkerContent.length) {
        return highlightSearchInput(contents, searchInput);
      }
      const contentToRender = [];
      let strIdx = 0;
      // Iterate through each case detected by Autolinker, wrap all content
      // before the current link in a span tag, and wrap the current link
      // in our own anchor tag
      autolinkerContent.forEach((anchorData, forIdx) => {
        const { start, end, href, text } = anchorData;
        if (strIdx < start) {
          contentToRender.push(
            <span key={`span_${forIdx}`}>
              {
                highlightSearchInput(
                  contents.slice(strIdx, start),
                  searchInput,
                )
              }
            </span>
          );
        }
        contentToRender.push(
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            key={`a_${forIdx}`}
          >
            {
              highlightSearchInput(
                text,
                searchInput,
              )
            }
          </a>
        );
        strIdx = end;
      });
      // Ensure any content after the last link is accounted for
      if (strIdx < contents.length - 1) {
        contentToRender.push(highlightSearchInput(contents.slice(strIdx), searchInput));
      }
      return contentToRender;
    },
    [searchInput],
  );

  const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
  const color = annotation[iconColor]?.toHexString?.();
  const fillColor = getColor(annotation.FillColor);
  let customData;
  try {
    customData = JSON.parse(annotation.getCustomData('trn-mention'));
  } catch (e) {
    customData = annotation.getCustomData('trn-mention');
  }
  const contents = customData?.contents || annotation.getContents();
  const contentsToRender = annotation.getContents();
  const numberOfReplies = annotation.getReplies().length;
  const formatNumberOfReplies = Math.min(numberOfReplies, 9);
  // This is the text placeholder passed to the ContentArea
  // It ensures that if we try and edit, we get the right placeholder
  // depending on whether the comment has been saved to the annotation or not
  const thereIsNoUnpostedEdit = typeof pendingEditTextMap[annotation.Id] === 'undefined';
  let textAreaValue;
  if (contents && thereIsNoUnpostedEdit) {
    textAreaValue = contents;
  } else {
    textAreaValue = pendingEditTextMap[annotation.Id];
  }

  const handleNoteContentClicked = () => {
    if (isReply) {
      onReplyClicked(annotation);
    } else if (!isEditing) {
      //collapse expanded note when top noteContent is clicked if it's not being edited
      onTopNoteContentClicked();
    }
  };

  const handleContentsClicked = e => {
    if (window.getSelection()?.toString()) {
      e?.stopPropagation();
      return;
    }
  };

  const noteContentClass = classNames({
    NoteContent: true,
    isReply,
    unread: isUnread, //The note content itself is unread or it has unread replies
    clicked: isNonReplyNoteRead, //The top note content is read
  });

  const date = notesShowLastUpdatedDate ? getLatestActivityDate(annotation) : annotation.DateCreated;

  const header = useMemo(
    () => {
      return (
        <React.Fragment>
          {!isReply &&
            <div className="type-icon-container">
              {isUnread &&
                <div className="unread-notification"></div>
              }
              <Icon className="type-icon" glyph={icon} color={color} fillColor={fillColor} />
            </div>
          }
          <div className="author-and-date">
            <div className="author-and-overflow">
              <div className="author-and-time">
                {renderAuthorName(annotation)}
                <div className="date-and-num-replies">
                  <div className="date-and-time">
                    {date ? dayjs(date).locale(language).format(noteDateFormat) : t('option.notesPanel.noteContent.noDate')}
                  </div>
                  {numberOfReplies > 0 &&
                    <div className="num-replies-container">
                      <Icon className="num-reply-icon" glyph={"icon-chat-bubble"} />
                      <div className="num-replies">{numberOfReplies}</div>
                    </div>}
                </div>
              </div>
              <div className="state-and-overflow">
                <NoteUnpostedCommentIndicator annotationId={annotation.Id} />
                {!isStateDisabled && !isReply &&
                  <NoteState
                    annotation={annotation}
                    isSelected={isSelected}
                  />
                }
                {!isEditing && isSelected &&
                  <NotePopup
                    noteIndex={noteIndex}
                    annotation={annotation}
                    setIsEditing={setIsEditing}
                  />}
              </div>
            </div>
            {isEditing && isSelected ? (
              <ContentArea
                annotation={annotation}
                noteIndex={noteIndex}
                setIsEditing={setIsEditing}
                textAreaValue={textAreaValue}
                onTextAreaValueChange={onTextChange}
              />
            ) : (
              contentsToRender && (
                <div className="container" onClick={handleContentsClicked}>{renderContents(contentsToRender)}</div>
              )
            )}
          </div>
        </React.Fragment>
      );
    },
    [isReply, numberOfReplies, formatNumberOfReplies, icon, color, renderAuthorName, annotation, noteDateFormat, isStateDisabled, isSelected, isEditing, setIsEditing, contents, renderContents, textAreaValue, onTextChange, language, isUnread, date]
  );

  return useMemo(
    () => (
      <div className={noteContentClass} onClick={handleNoteContentClicked}>
        {header}
      </div>
    ),
    [header],
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({
  annotation,
  noteIndex,
  setIsEditing,
  textAreaValue,
  onTextAreaValueChange,
}) => {
  const [isMentionEnabled, isNotesPanelOpen] = useSelector(state => [
    selectors.getIsMentionEnabled(state),
    selectors.isElementOpen(state, 'notesPanel'),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (isNotesPanelOpen && textareaRef.current) {
      setTimeout(() => {
        // need setTimeout because textarea seem to rerender and unfocus
        if (textareaRef && textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);

      if (textareaRef && textareaRef.current) {
        const textLength = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(textLength, textLength);
      }
    }
  }, [isNotesPanelOpen]);

  const setContents = e => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    if (isMentionEnabled) {
      const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

      annotation.setCustomData('trn-mention', JSON.stringify({
        contents: textAreaValue,
        ids,
      }));
      core.setNoteContents(annotation, plainTextValue);
    } else {
      core.setNoteContents(annotation, textAreaValue);
    }

    if (annotation instanceof window.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }

    setIsEditing(false, noteIndex);
    // Only set comment to unposted state if it is not empty
    if (textAreaValue !== '') {
      onTextAreaValueChange(undefined, annotation.Id);
    }
  };

  return (
    <div className="edit-content">
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={value => onTextAreaValueChange(value, annotation.Id)}
        onSubmit={setContents}
        placeholder={`${t('action.comment')}...`}
        aria-label={`${t('action.comment')}...`}
      />
      <div className="edit-buttons">
        <button
          className="cancel-button"
          onClick={e => {
            e.stopPropagation();
            setIsEditing(false, noteIndex);
            // Clear pending text
            onTextAreaValueChange(undefined, annotation.Id);
          }}
        >
          {t('action.cancel')}
        </button>
        <button
          className={`save-button${!textAreaValue ? ' disabled' : ''}`}
          disabled={!textAreaValue}
          onClick={e => {
            e.stopPropagation();
            setContents(e);
          }}
        >
          {t('action.save')}
        </button>
      </div>
    </div>
  );
};

ContentArea.propTypes = {
  noteIndex: PropTypes.number.isRequired,
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
};

const highlightSearchInput = (text, searchInput) => {
  const loweredText = text.toLowerCase();
  const loweredSearchInput = searchInput.toLowerCase();
  let lastFoundInstance = loweredText.indexOf(loweredSearchInput);
  if (!loweredSearchInput.trim() || lastFoundInstance === -1) {
    return text;
  }
  const contentToRender = [];
  const allFoundPositions = [lastFoundInstance];
  // Escape all RegExp special characters
  const regexSafeSearchInput = loweredSearchInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(`(${regexSafeSearchInput})`, 'gi').test(loweredText)) {
    while (lastFoundInstance !== -1) {
      lastFoundInstance = loweredText.indexOf(loweredSearchInput, lastFoundInstance + loweredSearchInput.length);
      if (lastFoundInstance !== -1) {
        allFoundPositions.push(lastFoundInstance);
      }
    }
  }
  allFoundPositions.forEach((position, idx) => {
    // Account for any content at the beginning of the string before the first
    // instance of the searchInput
    if (idx === 0 && position !== 0) {
      contentToRender.push(text.substring(0, position));
    }
    contentToRender.push(
      <span className="highlight" key={`highlight_span_${idx}`}>
        {text.substring(position, position + loweredSearchInput.length)}
      </span>
    );
    if (
      // Ensure that we do not try to make an out-of-bounds access
      position + loweredSearchInput.length < loweredText.length
      // Ensure that this is the end of the allFoundPositions array
      && position + loweredSearchInput.length !== allFoundPositions[idx+1]
    ) {
      contentToRender.push(
        text.substring(position + loweredSearchInput.length, allFoundPositions[idx+1])
      );
    }
  });
  return contentToRender;
};
