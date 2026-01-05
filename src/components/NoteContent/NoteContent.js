import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';
import classNames from 'classnames';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import isString from 'lodash/isString';

import NoteTextarea from 'components/NoteTextarea';
import NoteContext from 'components/Note/Context';
import NoteHeader from 'components/NoteHeader';
import NoteTextPreview from 'components/NoteTextPreview';
import ReplyAttachmentList from 'components/ReplyAttachmentList';

import mentionsManager from 'helpers/MentionsManager';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import setReactQuillContent from 'helpers/setReactQuillContent';
import { isDarkColorHex, isLightColorHex } from 'helpers/color';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import { isMobile } from 'helpers/device';

import core from 'core';
import { getDataWithKey, mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import Theme from 'constants/theme';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import DataElementWrapper from '../DataElementWrapper';
import { COMMON_COLORS } from 'constants/commonColors';
import getAnnotationReference from 'src/helpers/getAnnotationReference';

import SavedStateIndicator from './SavedStateIndicator';
import './NoteContent.scss';
import { AnnotationCustomEvents, AnnotationSavedState } from './annotationSavedState';
import debounce from 'lodash.debounce';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

dayjs.extend(LocalizedFormat);

const propTypes = {
  annotation: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  setIsEditing: PropTypes.func,
  noteIndex: PropTypes.number,
  isUnread: PropTypes.bool,
  isNonReplyNoteRead: PropTypes.bool,
  onReplyClicked: PropTypes.func,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
  isGroupMember: PropTypes.bool,
};

const NoteContent = ({
  annotation,
  isEditing,
  setIsEditing,
  noteIndex,
  isUnread,
  isNonReplyNoteRead,
  onReplyClicked,
  isMultiSelected,
  isMultiSelectMode,
  handleMultiSelect,
  isGroupMember,
}) => {
  const noteDateFormat = useSelector((state) => selectors.getNoteDateFormat(state));
  const iconColor = useSelector((state) => selectors.getIconColor(state, mapAnnotationToKey(annotation), shallowEqual));
  const isNoteStateDisabled = useSelector((state) => selectors.isElementDisabled(state, 'noteStateFlyout'));
  const language = useSelector((state) => selectors.getCurrentLanguage(state));
  const notesShowLastUpdatedDate = useSelector((state) => selectors.notesShowLastUpdatedDate(state));
  const canCollapseTextPreview = useSelector((state) => selectors.isNotesPanelTextCollapsingEnabled(state));
  const canCollapseReplyPreview = useSelector((state) => selectors.isNotesPanelRepliesCollapsingEnabled(state));
  const activeTheme = useSelector((state) => selectors.getActiveTheme(state));
  const timezone = useSelector((state) => selectors.getTimezone(state));
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

  const {
    isSelected,
    searchInput,
    resize,
    pendingEditTextMap,
    onTopNoteContentClicked,
    sortStrategy,
    showAnnotationNumbering,
    setPendingEditText,
  } = useContext(NoteContext);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const isReply = annotation.isReply();
  const isTrackedChange = mapAnnotationToKey(annotation) === annotationMapKeys.TRACKED_CHANGE;

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    setAttachments(annotation.getAttachments());
  }, [annotation]);

  useEffect(() => {
    const annotationChangedListener = (annotations, action) => {
      if (action === 'modify') {
        annotations.forEach((annot) => {
          if (annot.Id === annotation.Id) {
            setAttachments(annot.getAttachments());
          }
        });
      }
    };
    core.addEventListener('annotationChanged', annotationChangedListener);

    return () => {
      core.removeEventListener('annotationChanged', annotationChangedListener);
    };
  }, [annotation]);

  useDidUpdate(() => {
    if (!isEditing) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
  }, [isEditing]);

  const renderAuthorName = useCallback(
    (annotation) => {
      const name = core.getDisplayAuthor(annotation['Author']);

      return name ? highlightSearchInput(name, searchInput) : t('option.notesPanel.noteContent.noName');
    },
    [searchInput],
  );

  const renderAnnotationReference = useCallback(
    (annotation) => {
      const annotationReference = getAnnotationReference(annotation);
      return highlightSearchInput(annotationReference, searchInput);
    },
    [searchInput, annotation.getPageNumber()],
  );

  const skipAutoLink = annotation.getSkipAutoLink && annotation.getSkipAutoLink();

  const renderContents = useCallback(
    (contents, richTextStyle, fontColor, skipAutoLink) => {
      const autolinkerContent = [];
      if (!skipAutoLink) {
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
            }
          },
        });
      }

      if (!autolinkerContent.length) {
        const highlightResult = highlightSearchInput(contents, searchInput, richTextStyle);
        const shouldCollapseAnnotationText = !isReply && canCollapseTextPreview;
        const shouldCollapseReply = isReply && canCollapseReplyPreview;

        /*
         * Case there is no value on Search input, and the collapse of the text is allowed,
         * just render the value with Text preview component
         */
        if (!searchInput && (shouldCollapseAnnotationText || shouldCollapseReply)) {
          const beforeContent = () => {
            if (!isTrackedChange) {
              return null;
            }
            const text = annotation['TrackedChangeType'] === 1 ? t('officeEditor.added') : t('officeEditor.deleted');
            return <span style={{ color: annotation.FillColor.toString(), fontWeight: 700 }}>{text}</span>;
          };

          return (
            <NoteTextPreview
              linesToBreak={3}
              comment
              renderRichText={renderRichText}
              richTextStyle={richTextStyle}
              resize={resize}
              style={fontColor}
              beforeContent={beforeContent}
            >
              {contents}
            </NoteTextPreview>
          );
        }
        return highlightResult;
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
  let textColor = annotation['TextColor'];

  if (activeTheme === Theme.DARK) {
    if (textColor && isDarkColorHex(textColor.toHexString())) {
      textColor = new window.Core.Annotations.Color(255, 255, 255, 1);
    }

    if (richTextStyle) {
      const sections = Object.keys(richTextStyle);
      sections.forEach((a) => {
        if (richTextStyle[a]['color'] && isDarkColorHex(richTextStyle[a]['color'])) {
          richTextStyle[a]['color'] = COMMON_COLORS['white'];
        }
      });
    }
  } else if (activeTheme === Theme.LIGHT) {
    if (textColor && isLightColorHex(textColor.toHexString())) {
      textColor = new window.Core.Annotations.Color(0, 0, 0, 1);
    }

    if (richTextStyle) {
      const sections = Object.keys(richTextStyle);
      sections.forEach((a) => {
        if (richTextStyle[a]['color'] && isLightColorHex(richTextStyle[a]['color'])) {
          richTextStyle[a]['color'] = COMMON_COLORS['black'];
        }
      });
    }
  }
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
    if (!isGroupMember) {
      if (isReply) {
        onReplyClicked(annotation);
      } else if (!isEditing) {
        // collapse expanded note when top noteContent is clicked if it's not being edited
        onTopNoteContentClicked();
      }
    }
  };

  const handleContentsClicked = (e) => {
    if (window.getSelection()?.toString()) {
      e?.stopPropagation();
    }
  };

  const noteContentClass = classNames({
    NoteContent: true,
    isReply,
    unread: isUnread, // The note content itself is unread or it has unread replies
    clicked: isNonReplyNoteRead, // The top note content is read
    'modular-ui': customizableUI,
  });

  const content = useMemo(() => {
    const contentStyle = {};
    if (textColor) {
      contentStyle.color = textColor.toHexString();
    }

    return (
      <>
        {isEditing && isSelected ? (
          <ContentArea
            annotation={annotation}
            noteIndex={noteIndex}
            setIsEditing={setIsEditing}
            textAreaValue={textAreaValue}
            onTextAreaValueChange={setPendingEditText}
            pendingText={pendingEditTextMap[annotation.Id]}
          />
        ) : (
          contentsToRender && (
            <div className={classNames('container', { 'reply-content': isReply })} onClick={handleContentsClicked}>
              {isReply && attachments.length > 0 && <ReplyAttachmentList files={attachments} isEditing={false} />}
              {renderContents(contentsToRender, richTextStyle, contentStyle, skipAutoLink)}
            </div>
          )
        )}
      </>
    );
  }, [
    annotation,
    isSelected,
    isEditing,
    setIsEditing,
    contents,
    renderContents,
    textAreaValue,
    setPendingEditText,
    attachments,
  ]);

  const text = annotation.getCustomData('trn-annot-preview');
  const textPreview = useMemo(() => {
    if (text === '') {
      return null;
    }

    const highlightSearchResult = highlightSearchInput(text, searchInput);
    const shouldCollapseAnnotationText = !isReply && canCollapseTextPreview;
    // If we have a search result do not use text
    // preview but instead show the entire text
    if (isString(highlightSearchResult) && shouldCollapseAnnotationText) {
      return (
        <DataElementWrapper className="selected-text-preview" dataElement="notesSelectedTextPreview">
          <NoteTextPreview linesToBreak={3}>{`"${highlightSearchResult}"`}</NoteTextPreview>
        </DataElementWrapper>
      );
    }

    return (
      <div className="selected-text-preview" style={{ paddingRight: '12px' }}>
        {highlightSearchResult}
      </div>
    );
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
        activeTheme={activeTheme}
        handleMultiSelect={handleMultiSelect}
        isMultiSelected={isMultiSelected}
        isMultiSelectMode={isMultiSelectMode}
        isGroupMember={isGroupMember}
        showAnnotationNumbering={showAnnotationNumbering}
        timezone={timezone}
        isTrackedChange={isTrackedChange}
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
    core.getDisplayAuthor(annotation['Author']),
    isNoteStateDisabled,
    isEditing,
    noteIndex,
    getLatestActivityDate(annotation),
    sortStrategy,
    handleMultiSelect,
    isMultiSelected,
    isMultiSelectMode,
    isGroupMember,
    timezone,
    isTrackedChange,
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

const ContentArea = ({ annotation, noteIndex, setIsEditing, textAreaValue, onTextAreaValueChange, pendingText }) => {
  const [savedState, setSavedState] = useState(AnnotationSavedState.NONE);

  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      const draftKeys = keys.filter((key) => key.startsWith('annotation_draft_'));
      const oneDayAgo = Date.now() - ONE_DAY_MS;

      draftKeys.forEach((key) => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draft = JSON.parse(stored);
            if (draft.timestamp < oneDayAgo) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Failed to cleanup old drafts:', e);
    }
  }, []);

  useEffect(() => {
    const storageKey = `annotation_draft_${annotation.Id}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const draft = JSON.parse(stored);
        const isRecent = Date.now() - draft.timestamp < ONE_DAY_MS;
        if (isRecent && draft.value && !pendingText) {
          handleChange(draft.value);
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    function handleAnnotationStateChange(event) {
      const { state, annotations } = event.detail || {};
      if (!annotations) {
        return;
      }
      if (annotations.some((a) => a.Id === annotation.Id)) {
        setSavedState(state);

        if (state === AnnotationSavedState.SAVED) {
          try {
            const storageKey = `annotation_draft_${annotation.Id}`;
            localStorage.removeItem(storageKey);
          } catch (e) {
            console.error('Failed to clear localStorage:', e);
          }
        }
      }
    }
    window.addEventListener(AnnotationCustomEvents.ANNOTATION_SAVED_STATE_CHANGED, handleAnnotationStateChange);
    return () => {
      window.removeEventListener(AnnotationCustomEvents.ANNOTATION_SAVED_STATE_CHANGED, handleAnnotationStateChange);
    };
  }, [annotation]);

  const [
    autoFocusNoteOnAnnotationSelection,
    isMentionEnabled,
    isInlineCommentDisabled,
    isInlineCommentOpen,
    isNotesPanelOpen,
    activeDocumentViewerKey,
    isAnyCustomPanelOpen,
  ] = useSelector((state) => [
    selectors.getAutoFocusNoteOnAnnotationSelection(state),
    selectors.getIsMentionEnabled(state),
    selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
    selectors.isElementOpen(state, DataElements.INLINE_COMMENT_POPUP),
    selectors.isElementOpen(state, DataElements.NOTES_PANEL),
    selectors.getActiveDocumentViewerKey(state),
    selectors.isAnyCustomPanelOpen(state),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const isReply = annotation.isReply();
  const { setCurAnnotId, pendingAttachmentMap, deleteAttachment, clearAttachments, addAttachments } =
    useContext(NoteContext);

  const shouldNotFocusOnInput = !isInlineCommentDisabled && isInlineCommentOpen && isMobile();

  const debouncedSetContents = useRef(
    debounce(() => {
      if (textareaRef.current) {
        setContents({ preventDefault: () => {} }, 'change');
      }
    }, 2000),
  ).current;

  useEffect(() => {
    return () => debouncedSetContents.flush();
  }, [debouncedSetContents]);

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (isAnyCustomPanelOpen || ((isNotesPanelOpen || isInlineCommentOpen) && textareaRef.current)) {
      const editor = textareaRef.current.getEditor();
      const isFreeTextAnnnotation = annotation && annotation instanceof window.Core.Annotations.FreeTextAnnotation;
      isFreeTextAnnnotation && editor.setText('');

      /**
       * If there is a pending text we should update the annotation rich text style
       * with this pending text style.
       */
      if (pendingText) {
        setAnnotationRichTextStyle(editor, annotation);
      } else if (editor.getContents()) {
        setTimeout(() => {
          // need setTimeout because textarea seem to rerender and unfocus
          if (isMentionEnabled) {
            textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
            const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

            if (ids.length) {
              editor.setText(plainTextValue);
            }
          }

          if (shouldNotFocusOnInput) {
            return;
          }

          if (autoFocusNoteOnAnnotationSelection) {
            textareaRef.current?.focus();
            const annotRichTextStyle = annotation.getRichTextStyle();
            if (annotRichTextStyle) {
              setReactQuillContent(annotation, editor);
            }
          }
        }, 100);
      }

      const lastNewLineCharacterLength = 1;
      const textLength = editor.getLength() - lastNewLineCharacterLength;

      if (shouldNotFocusOnInput) {
        return;
      }

      setTimeout(() => {
        if (textLength) {
          editor.setSelection(textLength, textLength);
        }
      }, 100);
    }
  }, [isNotesPanelOpen, isInlineCommentOpen, shouldNotFocusOnInput]);

  useEffect(() => {
    if (isReply && pendingAttachments.length === 0) {
      // Load attachments
      const attachments = annotation.getAttachments();
      addAttachments(annotation.Id, attachments);
    }
  }, []);

  const setContents = async (e) => {
    e.preventDefault();

    const editor = textareaRef.current.getEditor();
    textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
    if (typeof textAreaValue === 'string' && textAreaValue.replace(/<br\s*\/?>(\s*)?/gi, '').trim() === '') {
      textAreaValue = '';
    }
    setAnnotationRichTextStyle(editor, annotation);

    const skipAutoLink = annotation.getSkipAutoLink && annotation.getSkipAutoLink();
    if (skipAutoLink) {
      annotation.disableSkipAutoLink();
    }

    if (isMentionEnabled) {
      const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

      // If modified, double check for ids
      const annotMentionData = mentionsManager.extractMentionDataFromAnnot(annotation);
      annotMentionData.mentions.forEach((mention) => {
        if (plainTextValue.includes(mention.value)) {
          ids.push(mention.id);
        }
      });

      annotation.setCustomData(
        'trn-mention',
        JSON.stringify({
          contents: textAreaValue,
          ids,
        }),
      );
      annotation.setContents(plainTextValue ?? '');
    } else {
      annotation.setContents(textAreaValue ?? '');
    }

    await setAnnotationAttachments(annotation, pendingAttachmentMap[annotation.Id]);

    const source = annotation instanceof window.Core.Annotations.FreeTextAnnotation ? 'textChanged' : 'noteChanged';
    core
      .getAnnotationManager(activeDocumentViewerKey)
      .trigger('annotationChanged', [[annotation], 'modify', { source }]);

    if (annotation instanceof window.Core.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }

    if (e && e.type === 'blur') {
      if (textAreaValue !== '') {
        onTextAreaValueChange(undefined, annotation.Id);
      }
      clearAttachments(annotation.Id);
    }
  };

  const handleBlur = (e) => {
    debouncedSetContents.flush();

    setCurAnnotId(undefined);
    setContents(e);

    setTimeout(() => {
      const editorContainer = textareaRef.current?.editor?.container;
      if (editorContainer && editorContainer.contains(document.activeElement)) {
        return;
      }
      setIsEditing(false, noteIndex);
    }, 0);
  };

  const onFocus = () => {
    setCurAnnotId(annotation.Id);
  };

  const contentClassName = classNames('edit-content', { 'reply-content': isReply });
  const pendingAttachments = pendingAttachmentMap[annotation.Id] || [];

  const handleChange = (value) => {
    onTextAreaValueChange(value, annotation.Id);
    setSavedState(AnnotationSavedState.UNSAVED_EDITS);

    try {
      const storageKey = `annotation_draft_${annotation.Id}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          value,
          timestamp: Date.now(),
          annotationId: annotation.Id,
        }),
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    debouncedSetContents();
  };

  return (
    <div className={contentClassName}>
      {isReply && pendingAttachments.length > 0 && (
        <ReplyAttachmentList
          files={pendingAttachments}
          isEditing={true}
          fileDeleted={(file) => deleteAttachment(annotation.Id, file)}
        />
      )}
      <NoteTextarea
        ref={(el) => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={handleChange}
        onSubmit={setContents}
        isReply={isReply}
        onBlur={handleBlur}
        onFocus={onFocus}
      />
      <SavedStateIndicator
        state={savedState}
        labels={{
          saved: t('saveStateIndicator.saved'),
          saving: t('saveStateIndicator.saving'),
          unsaved: t('saveStateIndicator.unsaved'),
          error: t('saveStateIndicator.error'),
        }}
      />
    </div>
  );
};

ContentArea.propTypes = {
  noteIndex: PropTypes.number.isRequired,
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
  pendingText: PropTypes.string,
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
  if (!richTextStyle || !text) {
    return text;
  }

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
