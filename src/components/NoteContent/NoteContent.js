import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';
import classNames from 'classnames';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import NoteTextarea from 'components/NoteTextarea';
import NoteContext from 'components/Note/Context';

import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import { getDataWithKey, mapAnnotationToKey } from 'constants/map';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './NoteContent.scss';
import NoteHeader from 'components/NoteHeader';
import NoteTextPreview from 'src/components/NoteTextPreview';
import isString from 'lodash/isString';
import getAnnotationReference from 'src/helpers/getAnnotationReference';

dayjs.extend(LocalizedFormat);

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteContent = ({
  annotation,
  isEditing,
  setIsEditing,
  noteIndex,
  onTextChange,
  isUnread,
  isNonReplyNoteRead,
  onReplyClicked,
}) => {
  const [noteDateFormat, iconColor, isNoteStateDisabled, language, notesShowLastUpdatedDate] = useSelector(
    state => [
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
      selectors.isElementDisabled(state, 'notePopupState'),
      selectors.getCurrentLanguage(state),
      selectors.notesShowLastUpdatedDate(state),
    ],
    shallowEqual,
  );
  const { isSelected, searchInput, resize, pendingEditTextMap, onTopNoteContentClicked, sortStrategy } =
    useContext(NoteContext);

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

      return name ? highlightSearchInput(name, searchInput) : t('option.notesPanel.noteContent.noName');
    },
    [searchInput],
  );

  const renderAnnotationReference = useCallback(
    annotation => {
      const annotationReference = getAnnotationReference(annotation);
      return highlightSearchInput(annotationReference, searchInput);
    },
    [searchInput, annotation.getPageNumber()],
  );

  const renderContents = useCallback(
    (contents, richTextStyle) => {
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
                end: offset + match.getMatchedText().length,
              });
              return;
          }
        },
      });
      if (!autolinkerContent.length) {
        const highlightResult = highlightSearchInput(contents, searchInput, richTextStyle);
        if (isString(highlightResult)) {
          // Only support preview for pure text contents
          return (
            <NoteTextPreview linesToBreak={3} comment>
              {highlightResult}
            </NoteTextPreview>
          );
        } else {
          return highlightResult;
        }
      }
      const contentToRender = [];
      let strIdx = 0;
      // Iterate through each case detected by Autolinker, wrap all content
      // before the current link in a span tag, and wrap the current link
      // in our own anchor tag
      autolinkerContent.forEach((anchorData, forIdx) => {
        const { start, end, href } = anchorData;
        if (strIdx < start) {
          contentToRender.push(
            <span key={`span_${forIdx}`}>
              {highlightSearchInput(contents, searchInput, richTextStyle, strIdx, start)}
            </span>,
          );
        }
        contentToRender.push(
          <a href={href} target="_blank" rel="noopener noreferrer" key={`a_${forIdx}`}>
            {highlightSearchInput(contents, searchInput, richTextStyle, start, end)}
          </a>,
        );
        strIdx = end;
      });
      // Ensure any content after the last link is accounted for
      if (strIdx < contents.length - 1) {
        contentToRender.push(highlightSearchInput(contents, searchInput, richTextStyle, strIdx));
      }
      return contentToRender;
    },
    [searchInput],
  );

  const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
  let customData;
  try {
    customData = JSON.parse(annotation.getCustomData('trn-mention'));
  } catch (e) {
    customData = annotation.getCustomData('trn-mention');
  }
  const contents = customData?.contents || annotation.getContents();
  const contentsToRender = annotation.getContents();
  const richTextStyle = annotation.getRichTextStyle();
  const textColor = annotation['TextColor'];
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

  const content = useMemo(() => {
    const contentStyle = {};
    if (textColor) {
      contentStyle.color = textColor.toHexString();
    }

    return (
      <React.Fragment>
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
            <div
              className={classNames('container', { 'reply-content': isReply })}
              onClick={handleContentsClicked}
              style={contentStyle}
            >
              {renderContents(contentsToRender, richTextStyle)}
            </div>
          )
        )}
      </React.Fragment>
    );
  }, [annotation, isSelected, isEditing, setIsEditing, contents, renderContents, textAreaValue, onTextChange]);

  const text = annotation.getCustomData('trn-annot-preview');
  const textPreview = useMemo(() => {
    if (text === '') {
      return null;
    }

    const highlightSearchResult = highlightSearchInput(text, searchInput);
    // If we have a search result do not use text
    // preview but instead show the entire text
    if (isString(highlightSearchResult)) {
      return (
        <div className="selected-text-preview">
          <NoteTextPreview linesToBreak={3}>{`"${highlightSearchResult}"`}</NoteTextPreview>
        </div>
      );
    } else {
      return (
        <div className="selected-text-preview" style={{ paddingRight: '12px' }}>
          {highlightSearchResult}
        </div>
      );
    }
  }, [text, searchInput]);

  const header = useMemo(() => {
    return (
      <NoteHeader
        icon={icon}
        iconColor={iconColor}
        annotation={annotation}
        language={language}
        noteDateFormat={noteDateFormat}
        isSelected={isSelected}
        setIsEditing={setIsEditing}
        notesShowLastUpdatedDate={notesShowLastUpdatedDate}
        isReply={isReply}
        isUnread={isUnread}
        renderAuthorName={renderAuthorName}
        renderAnnotationReference={renderAnnotationReference}
        isNoteStateDisabled={isNoteStateDisabled}
        isEditing={isEditing}
        noteIndex={noteIndex}
        sortStrategy={sortStrategy}
      />
    );
  }, [
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
    getLatestActivityDate(annotation),
    sortStrategy,
  ]);

  return (
    <div className={noteContentClass} onClick={handleNoteContentClicked}>
      {header}
      {/* {textPreview} */}
      {content}
    </div>
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({ annotation, noteIndex, setIsEditing, textAreaValue, onTextAreaValueChange }) => {
  const [autoFocusNoteOnAnnotationSelection, isMentionEnabled, isNotesPanelOpen] = useSelector(state => [
    selectors.getAutoFocusNoteOnAnnotationSelection(state),
    selectors.getIsMentionEnabled(state),
    selectors.isElementOpen(state, 'notesPanel'),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const isReply = annotation.isReply();

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (isNotesPanelOpen && textareaRef.current) {
      setTimeout(() => {
        const selectedAnnotations = core.getSelectedAnnotations();
        // need setTimeout because textarea seem to rerender and unfocus
        // Only focus text area if there is only one annotation selected
        if (
          selectedAnnotations.length === 1 &&
          textareaRef &&
          textareaRef.current &&
          autoFocusNoteOnAnnotationSelection
        ) {
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

      annotation.setCustomData(
        'trn-mention',
        JSON.stringify({
          contents: textAreaValue,
          ids,
        }),
      );
      core.setNoteContents(annotation, plainTextValue ?? '');
    } else {
      core.setNoteContents(annotation, textAreaValue ?? '');
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

  const contentClassName = classNames('edit-content', { 'reply-content': isReply });
  return (
    <div className={contentClassName}>
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
        {annotation.getContents() !== undefined && (
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
        )}
        <button
          className={`save-button`}
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

const getRichTextSpan = (text, richTextStyle, key) => {
  const style = {
    fontWeight: richTextStyle['font-weight'],
    fontStyle: richTextStyle['font-style'],
    textDecoration: richTextStyle['text-decoration'],
    color: richTextStyle['color'],
  };
  if (style.textDecoration) {
    style.textDecoration = style.textDecoration.replace('word', 'underline');
  }
  return (
    <span style={style} key={key}>
      {text}
    </span>
  );
};

const renderRichText = (text, richTextStyle, start) => {
  if (!richTextStyle || !text) return text;

  const styles = {};
  const indices = Object.keys(richTextStyle)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i] - start;
    index = Math.min(Math.max(index, 0), text.length);
    styles[index] = richTextStyle[indices[i]];
    if (index === text.length) {
      break;
    }
  }

  const contentToRender = [];
  const styleIndices = Object.keys(styles)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = 1; i < styleIndices.length; i++) {
    contentToRender.push(
      getRichTextSpan(
        text.slice(styleIndices[i - 1], styleIndices[i]),
        styles[styleIndices[i - 1]],
        `richtext_span_${i}`,
      ),
    );
  }

  return contentToRender;
};

const highlightSearchInput = (fullText, searchInput, richTextStyle, start = 0, end = fullText.length) => {
  const text = fullText.slice(start, end);
  const loweredText = text.toLowerCase();
  const loweredSearchInput = searchInput.toLowerCase();
  if (richTextStyle) {
    richTextStyle['0'] = richTextStyle['0'] || {};
    richTextStyle[fullText.length] = richTextStyle[fullText.length] || {};
  }
  let lastFoundInstance = loweredText.indexOf(loweredSearchInput);
  if (!loweredSearchInput.trim() || lastFoundInstance === -1) {
    return renderRichText(text, richTextStyle, start);
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
      contentToRender.push(renderRichText(text.substring(0, position), richTextStyle, start));
    }
    contentToRender.push(
      <span className="highlight" key={`highlight_span_${idx}`}>
        {renderRichText(
          text.substring(position, position + loweredSearchInput.length),
          richTextStyle,
          start + position,
        )}
      </span>,
    );
    if (
      // Ensure that we do not try to make an out-of-bounds access
      position + loweredSearchInput.length < loweredText.length &&
      // Ensure that this is the end of the allFoundPositions array
      position + loweredSearchInput.length !== allFoundPositions[idx + 1]
    ) {
      contentToRender.push(
        renderRichText(
          text.substring(position + loweredSearchInput.length, allFoundPositions[idx + 1]),
          richTextStyle,
          start + position + loweredSearchInput.length,
        ),
      );
    }
  });
  return contentToRender;
};
