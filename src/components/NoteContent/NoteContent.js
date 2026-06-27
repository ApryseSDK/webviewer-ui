import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';
import classNames from 'classnames';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import isString from 'lodash/isString';
import escape from 'lodash/escape';
import debounce from 'lodash/debounce';
import NoteTextarea from 'components/NoteTextarea';
import NoteContext from 'components/Note/Context';
import NoteHeader from 'components/NoteHeader';
import NoteTextPreview from 'components/NoteTextPreview';
import ReplyAttachmentList from 'components/ReplyAttachmentList';
import getLinkDestination from 'helpers/getLinkDestination';

import mentionsManager from 'helpers/MentionsManager';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import setReactQuillContent from 'helpers/setReactQuillContent';
import { isDarkColorHex, isLightColorHex } from 'helpers/color';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import { updateOfficeEditorCommentMessage } from 'helpers/officeEditorCommentHelper';
import { isMobile } from 'helpers/device';
import useCore from 'hooks/useCore';
import { getDataWithKey, mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import Theme from 'constants/theme';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import Events from 'constants/events';
import fireEvent from 'helpers/fireEvent';
import DataElementWrapper from '../DataElementWrapper';
import { COMMON_COLORS } from 'constants/commonColors';
import Button from 'components/Button';

import './NoteContent.scss';
import { css } from '@emotion/react';

dayjs.extend(LocalizedFormat);
const propTypes = {
  annotation: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  setIsEditing: PropTypes.func,
  editingKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isUnread: PropTypes.bool,
  isNonReplyNoteRead: PropTypes.bool,
  onReplyClicked: PropTypes.func,
  isMultiSelected: PropTypes.bool,
  isMultiSelectMode: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
  isGroupMember: PropTypes.bool,
  handleNoteClick: PropTypes.func,
};

// Keep edit-session baseline outside component lifecycle so autosave-triggered remounts
// do not lose the pre-autosave value used by Cancel.
// Keys are composite `${documentViewerKey}:${annotationId}` to avoid collisions across viewers.
const editSessionBaselineByAnnotationId = new Map();
const pendingBaselineCleanupTimeoutByAnnotationId = new Map();

const makeBaselineKey = (viewerKey, annotationId) => `${viewerKey}:${annotationId}`;

const clearEditSessionBaseline = (viewerKey, annotationId) => {
  const key = makeBaselineKey(viewerKey, annotationId);
  const pendingCleanupTimeout = pendingBaselineCleanupTimeoutByAnnotationId.get(key);
  if (pendingCleanupTimeout) {
    clearTimeout(pendingCleanupTimeout);
    pendingBaselineCleanupTimeoutByAnnotationId.delete(key);
  }
  editSessionBaselineByAnnotationId.delete(key);
};

const cancelPendingBaselineCleanup = (viewerKey, annotationId) => {
  const key = makeBaselineKey(viewerKey, annotationId);
  const pendingCleanupTimeout = pendingBaselineCleanupTimeoutByAnnotationId.get(key);
  if (pendingCleanupTimeout) {
    clearTimeout(pendingCleanupTimeout);
    pendingBaselineCleanupTimeoutByAnnotationId.delete(key);
  }
};

const scheduleEditSessionBaselineCleanup = (viewerKey, annotationId) => {
  cancelPendingBaselineCleanup(viewerKey, annotationId);
  const key = makeBaselineKey(viewerKey, annotationId);
  // Use a macrotask so an immediate unmount/remount in the same turn can cancel cleanup.
  // This intentionally relies on setTimeout task ordering, not an arbitrary delay.
  const cleanupTimeout = setTimeout(() => {
    pendingBaselineCleanupTimeoutByAnnotationId.delete(key);
    editSessionBaselineByAnnotationId.delete(key);
  }, 0);
  pendingBaselineCleanupTimeoutByAnnotationId.set(key, cleanupTimeout);
};

const clearAllBaselinesForViewer = (viewerKey) => {
  const prefix = `${viewerKey}:`;
  for (const key of pendingBaselineCleanupTimeoutByAnnotationId.keys()) {
    if (key.startsWith(prefix)) {
      clearTimeout(pendingBaselineCleanupTimeoutByAnnotationId.get(key));
      pendingBaselineCleanupTimeoutByAnnotationId.delete(key);
    }
  }
  for (const key of editSessionBaselineByAnnotationId.keys()) {
    if (key.startsWith(prefix)) {
      editSessionBaselineByAnnotationId.delete(key);
    }
  }
};

const NoteContent = ({
  annotation,
  isEditing,
  setIsEditing,
  editingKey,
  isUnread,
  isNonReplyNoteRead,
  onReplyClicked,
  isMultiSelected,
  isMultiSelectMode,
  handleMultiSelect,
  isGroupMember,
  handleNoteClick = () => {},
}) => {

  const { core } = useCore();
  const noteDateFormat = useSelector((state) => selectors.getNoteDateFormat(state));
  const iconColor = useSelector((state) => selectors.getIconColor(state, mapAnnotationToKey(annotation), shallowEqual));
  const isNoteStateDisabled = useSelector((state) => selectors.isElementDisabled(state, 'noteStateFlyout'));
  const language = useSelector((state) => selectors.getCurrentLanguage(state));
  const notesShowLastUpdatedDate = useSelector((state) => selectors.notesShowLastUpdatedDate(state));
  const canCollapseTextPreview = useSelector((state) => selectors.isNotesPanelTextCollapsingEnabled(state));
  const canCollapseReplyPreview = useSelector((state) => selectors.isNotesPanelRepliesCollapsingEnabled(state));
  const activeTheme = useSelector((state) => selectors.getActiveTheme(state));
  const timezone = useSelector((state) => selectors.getTimezone(state));
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const isMentionEnabled = useSelector((state) => selectors.getIsMentionEnabled(state));

  const {
    isSelected,
    searchInput,
    resize,
    pendingEditTextMap,
    onTopNoteContentClicked,
    sortStrategy,
    showAnnotationNumbering,
    setPendingEditText,
    noteFlyoutIdSuffix,
  } = useContext(NoteContext);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const store = useStore();

  const isReply = annotation.isReply();
  const isTrackedChange = mapAnnotationToKey(annotation) === annotationMapKeys.TRACKED_CHANGE;

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const baselineKey = makeBaselineKey(activeDocumentViewerKey, annotation.Id);
    const existingBaseline = editSessionBaselineByAnnotationId.get(baselineKey);
    const existingBaselineIsForCurrentAnnotation = existingBaseline && existingBaseline.annotationId === annotation.Id;
    if (isEditing && (!existingBaseline || !existingBaselineIsForCurrentAnnotation)) {
      const baselineContents = annotation.getContents() || '';
      editSessionBaselineByAnnotationId.set(baselineKey, {
        annotationId: annotation.Id,
        contents: baselineContents,
        mentionData: annotation.getCustomData('trn-mention'),
      });
    }
  }, [isEditing, annotation, activeDocumentViewerKey]);

  useEffect(() => {
    if (!isEditing) {
      clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id);
    }
  }, [annotation.Id, isEditing, activeDocumentViewerKey]);

  useEffect(() => {
    const onDocumentTeardown = () => clearAllBaselinesForViewer(activeDocumentViewerKey);
    core.addEventListener('beforeDocumentLoaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    core.addEventListener('documentUnloaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('beforeDocumentLoaded', onDocumentTeardown, activeDocumentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentTeardown, activeDocumentViewerKey);
    };
  }, [core, activeDocumentViewerKey]);

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

      return name ? (
        highlightSearchInput(name, searchInput)
      ) : (
        t('option.notesPanel.noteContent.noName')
      );
    },
    [searchInput],
  );

  const skipAutoLink = annotation.getSkipAutoLink?.();

  const trackedChangeLabels = {
    1: t('officeEditor.added'),
    2: t('officeEditor.deleted'),
    3: t('officeEditor.formatted'),
  };

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
                  end: offset + match.getMatchedText().length
                });
            }
          }
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

            const text = trackedChangeLabels[annotation['TrackedChangeType']];
            return text && (
              <span
                className="tracked-change-label"
                css={css({ color: annotation.FillColor.toString() })}
              >
                {text}
              </span>
            );
          };

          return (
            <NoteTextPreview
              linesToBreak={3}
              comment
              renderRichText={renderRichText}
              richTextStyle={richTextStyle}
              resize={resize}
              textStyle={fontColor}
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
              {
                highlightSearchInput(
                  contents,
                  searchInput,
                  richTextStyle,
                  strIdx,
                  start
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
                contents,
                searchInput,
                richTextStyle,
                start,
                end
              )
            }
          </a>
        );
        strIdx = end;
      });
      // Ensure any content after the last link is accounted for
      if (strIdx < contents.length - 1) {
        contentToRender.push(highlightSearchInput(
          contents,
          searchInput,
          richTextStyle,
          strIdx
        ));
      }
      return contentToRender;
    },
    [searchInput]
  );

  const icon = isTrackedChange && annotation['TrackedChangeType'] === 3 ?
    'ic-format-page' :
    getDataWithKey(mapAnnotationToKey(annotation)).icon;

  let customData;
  try {
    customData = JSON.parse(annotation.getCustomData('trn-mention'));
  } catch (e) {
    customData = annotation.getCustomData('trn-mention');
  }

  let contents = customData?.contents || annotation.getContents();
  // Mentions are stored as raw markup (e.g. "@[John Doe](id)"). Seed the editor with the
  // plain text ("@John Doe") so the markup isn't briefly shown. Ids and styling are
  // restored on mount/save.
  if (isMentionEnabled) {
    contents = mentionsManager.extractMentionDataFromStr(contents).plainTextValue;
  }
  contents = sanitizeContent(contents);

  // for link annotations we want to get their URL. We are unable to use "getContents" to get that data, need to use "getLinkDestination" instead
  const contentsToRender = annotation instanceof window.Core.Annotations.Link ? getLinkDestination(annotation, store) : annotation.getContents();

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

  const noteContentClass = classNames({
    NoteContent: true,
    isReply,
    unread: isUnread, // The note content itself is unread or it has unread replies
    clicked: isNonReplyNoteRead, // The top note content is read
  });

  const content = useMemo(
    () => {
      const contentStyle = {};
      if (textColor) {
        contentStyle.color = textColor.toHexString();
      }

      return (
        <>
          {(isEditing && isSelected) ? (
            <ContentArea
              annotation={annotation}
              editingKey={editingKey}
              setIsEditing={setIsEditing}
              textAreaValue={textAreaValue}
              onTextAreaValueChange={setPendingEditText}
              pendingText={pendingEditTextMap[annotation.Id]}
              editSessionBaseline={editSessionBaselineByAnnotationId.get(makeBaselineKey(activeDocumentViewerKey, annotation.Id))}
            />
          ) : (
            contentsToRender && (
              <div className={classNames('container', { 'reply-content': isReply })} onClick={handleNoteClick}>
                {isReply && (attachments.length > 0) && (
                  <ReplyAttachmentList
                    files={attachments}
                    isEditing={false}
                  />
                )}
                {renderContents(contentsToRender, richTextStyle, contentStyle, skipAutoLink)}
              </div>
            )
          )}
        </>
      );
    },
    [annotation, isSelected, isEditing, setIsEditing, contents, renderContents, textAreaValue, setPendingEditText, attachments]
  );

  const text = annotation.getCustomData('trn-annot-preview');
  const textPreview = useMemo(
    () => {
      if (text === '') {
        return null;
      }

      const highlightSearchResult = highlightSearchInput(text, searchInput);
      const shouldCollapseAnnotationText = !isReply && canCollapseTextPreview;
      // If we have a search result do not use text
      // preview but instead show the entire text
      if (isString(highlightSearchResult) && shouldCollapseAnnotationText) {
        return (
          <DataElementWrapper
            onClick={handleNoteClick}
            className="selected-text-preview"
            dataElement="notesSelectedTextPreview">
            <NoteTextPreview linesToBreak={3}>
              {`"${highlightSearchResult}"`}
            </NoteTextPreview>
          </DataElementWrapper>
        );
      }
      return (
        <div className="selected-text-preview">
          {highlightSearchResult}
        </div>
      );
    }, [text, searchInput]);

  const header = useMemo(
    () => {
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
          isNoteStateDisabled={isNoteStateDisabled}
          isEditing={isEditing}
          editingKey={editingKey}
          sortStrategy={sortStrategy}
          activeTheme={activeTheme}
          handleMultiSelect={handleMultiSelect}
          isMultiSelected={isMultiSelected}
          isMultiSelectMode={isMultiSelectMode}
          isGroupMember={isGroupMember}
          showAnnotationNumbering={showAnnotationNumbering}
          timezone={timezone}
          isTrackedChange={isTrackedChange}
          flyoutIdSuffix={noteFlyoutIdSuffix}
        />
      );
    }, [icon, iconColor, annotation, language, noteDateFormat, isSelected, setIsEditing, notesShowLastUpdatedDate, isReply, isUnread, renderAuthorName, core.getDisplayAuthor(annotation['Author']), isNoteStateDisabled, isEditing, editingKey, getLatestActivityDate(annotation), sortStrategy, handleMultiSelect, isMultiSelected, isMultiSelectMode, isGroupMember, timezone, isTrackedChange, noteFlyoutIdSuffix]
  );

  return (
    <div className={noteContentClass} onClick={handleNoteContentClicked}>
      {header}
      {textPreview}
      {content}
    </div>
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({
  annotation,
  editingKey,
  setIsEditing,
  textAreaValue,
  onTextAreaValueChange,
  pendingText,
  editSessionBaseline,
}) => {
  const [
    autoFocusNoteOnAnnotationSelectionEnabled,
    isMentionEnabled,
    isInlineCommentDisabled,
    isInlineCommentOpen,
    isNotesPanelOpen,
    activeDocumentViewerKey,
    isAnyCustomPanelOpen,
    isNoteEditingTriggeredByAnnotationPopup,
    autosaveEnabled,
    autosaveInterval,
  ] = useSelector((state) => [
    selectors.getAutoFocusNoteOnAnnotationSelection(state),
    selectors.getIsMentionEnabled(state),
    selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
    selectors.isElementOpen(state, DataElements.INLINE_COMMENT_POPUP),
    selectors.isElementOpen(state, DataElements.NOTES_PANEL),
    selectors.getActiveDocumentViewerKey(state),
    selectors.isAnyCustomPanelOpen(state),
    selectors.getIsNoteEditing(state),
    selectors.getAutosaveEnabled(state),
    selectors.getAutosaveInterval(state),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const isReply = annotation.isReply();
  const {
    setCurAnnotId,
    pendingAttachmentMap,
    deleteAttachment,
    clearAttachments,
    addAttachments,
    isOfficeEditorCommentAnnotation,
    setPendingEditText,
  } = useContext(NoteContext);
  const [localValue, setLocalValue] = useState(textAreaValue || '');
  const editSessionBaselineRef = useRef(editSessionBaseline);
  const syncedAnnotationIdRef = useRef(annotation.Id);

  const shouldNotFocusOnInput = !isInlineCommentDisabled && isInlineCommentOpen && isMobile();
  const autoFocusNoteOnAnnotationSelection =
    autoFocusNoteOnAnnotationSelectionEnabled && (!isOfficeEditorCommentAnnotation || isNoteEditingTriggeredByAnnotationPopup);
  const { core } = useCore();
  const autosaveContextRef = useRef({});
  const isMountedRef = useRef(true);

  useEffect(() => {
    cancelPendingBaselineCleanup(activeDocumentViewerKey, annotation.Id);

    return () => {
      scheduleEditSessionBaselineCleanup(activeDocumentViewerKey, annotation.Id);
    };
  }, [annotation.Id, activeDocumentViewerKey]);

  autosaveContextRef.current = {
    annotation,
    isMentionEnabled,
    isOfficeEditorCommentAnnotation,
    pendingAttachmentMap,
    setIsEditing,
    editingKey,
    setPendingEditText,
    localValue,
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    editSessionBaselineRef.current = editSessionBaseline;
    syncedAnnotationIdRef.current = annotation.Id;
  }, [editingKey, annotation.Id, editSessionBaseline]);

  useEffect(() => {
    // Preserve the first available baseline for this edit session so Cancel can
    // still restore pre-autosave content if the shared map is cleared by remount timing.
    if (!editSessionBaselineRef.current && editSessionBaseline) {
      editSessionBaselineRef.current = editSessionBaseline;
    }
  }, [editSessionBaseline]);

  const syncMentionDataToAnnotation = useCallback((contentValue) => {
    const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(contentValue);

    // If modified, double check for ids
    const annotMentionData = mentionsManager.extractMentionDataFromAnnot(annotation);
    annotMentionData.mentions.forEach((mention) => {
      if (plainTextValue.includes(mention.value)) {
        ids.push(mention.id);
      }
    });

    annotation.setCustomData('trn-mention', JSON.stringify({
      contents: contentValue,
      ids,
    }));
    annotation.setContents(plainTextValue);
  }, [annotation]);

  const stripNewLineFromEndOfText = useCallback((value = '') => {
    const normalizedValue = value;
    if (normalizedValue.length > 1 && normalizedValue.endsWith('\n')) {
      return normalizedValue.slice(0, normalizedValue.length - 1);
    }
    return normalizedValue;
  }, []);

  const getEditorPlainText = useCallback((editor) => {
    if (!editor) {
      return '';
    }

    if (typeof editor.getText === 'function') {
      return stripNewLineFromEndOfText(editor.getText());
    }

    if (typeof editor.getContents === 'function') {
      return stripNewLineFromEndOfText(mentionsManager.getFormattedTextFromDeltas(editor.getContents()));
    }

    return '';
  }, [stripNewLineFromEndOfText]);

  const skipAutoLink = (annotation) => {
    const shouldSkipAutoLink = annotation.getSkipAutoLink?.();
    if (shouldSkipAutoLink) {
      annotation.disableSkipAutoLink();
    }
  };

  const checkOfficeEditorCommentAndUpdate = async (annotation, textAreaValue) => {
    if (isOfficeEditorCommentAnnotation) {
      const didUpdate = await updateOfficeEditorCommentMessage({
        annotation,
        text: textAreaValue,
        core,
      });
      return didUpdate;
    }
    return true;
  };

  const triggerAnnotationChangedForEditor = useCallback(() => {
    const isFreeTextAnnotation = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
    const source = isFreeTextAnnotation ? 'textChanged' : 'noteChanged';
    core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [[annotation], 'modify', { 'source': source }]);

    if (isFreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }
  }, [annotation, core, activeDocumentViewerKey]);
  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (isAnyCustomPanelOpen || (isNotesPanelOpen || isInlineCommentOpen) && textareaRef.current) {
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

          if (shouldNotFocusOnInput || !autoFocusNoteOnAnnotationSelection) {
            return;
          }

          if (autoFocusNoteOnAnnotationSelection) {
            textareaRef.current?.focus();
            const annotRichTextStyle = annotation.getRichTextStyle();
            if (annotRichTextStyle) {
              setReactQuillContent(annotation, editor);
              // Store the styled HTML in localValue so a re-render doesn't re-inject the
              // plain value and wipe the styling.
              setLocalValue(editor.root.innerHTML);
            }
          }
        }, 0);
      }

      const lastNewLineCharacterLength = 1;
      const textLength = editor.getLength() - lastNewLineCharacterLength;

      if (shouldNotFocusOnInput || !autoFocusNoteOnAnnotationSelection) {
        return;
      }

      setTimeout(() => {
        if (textLength) {
          editor.setSelection(textLength, textLength);
        }
      }, 0);
    }
  }, [isNotesPanelOpen, isInlineCommentOpen, shouldNotFocusOnInput, autoFocusNoteOnAnnotationSelection]);

  // Sync editor local state only when switching to a different annotation.
  // Resyncing on every textAreaValue change can create autosave feedback loops.
  useEffect(() => {
    if (syncedAnnotationIdRef.current !== annotation.Id) {
      syncedAnnotationIdRef.current = annotation.Id;
      setLocalValue(textAreaValue || '');
    }
  }, [annotation.Id, textAreaValue]);

  // Debounced autosave on localValue change
  useEffect(() => {
    if (!autosaveEnabled || isOfficeEditorCommentAnnotation) {
      return;
    }
    const autosave = debounce(async () => {
      const {
        annotation,
        isMentionEnabled,
        isOfficeEditorCommentAnnotation,
        pendingAttachmentMap,
        setIsEditing,
        editingKey,
        setPendingEditText,
        localValue,
      } = autosaveContextRef.current;

      // Update annotation as single source of truth, but do NOT close editor
      const editor = textareaRef.current.getEditor();
      let textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
      const editorPlainText = getEditorPlainText(editor);

      const hasTrailingNewlineToRemove = textAreaValue.length > 1 && textAreaValue[textAreaValue.length - 1] === '\n';
      if (hasTrailingNewlineToRemove) {
        textAreaValue = textAreaValue.slice(0, textAreaValue.length - 1);
      }

      const localPlainText = stripNewLineFromEndOfText(localValue);
      const savedPlainText = stripNewLineFromEndOfText(annotation.getContents() || '');
      if (!localPlainText || !editorPlainText || localPlainText === savedPlainText || editorPlainText === savedPlainText) {
        return;
      }

      setAnnotationRichTextStyle(editor, annotation);

      skipAutoLink(annotation);

      const didUpdate = await checkOfficeEditorCommentAndUpdate(annotation, textAreaValue);
      if (!didUpdate) {
        return;
      }

      if (isMentionEnabled && !isOfficeEditorCommentAnnotation) {
        syncMentionDataToAnnotation(textAreaValue);
      } else {
        annotation.setContents(textAreaValue);
      }

      await setAnnotationAttachments(annotation, pendingAttachmentMap[annotation.Id]);
      triggerAnnotationChangedForEditor();
      fireEvent(Events.NOTE_AUTOSAVED, { annotationId: annotation.Id });
      // Keep edit mode during autosave remounts, but never reopen after this editor unmounts.
      if (isMountedRef.current) {
        setIsEditing(true, editingKey);
      }
      setPendingEditText(undefined, annotation.Id);
    }, autosaveInterval);

    autosave();
    return () => autosave.cancel();
  }, [localValue, autosaveEnabled, autosaveInterval, getEditorPlainText, stripNewLineFromEndOfText, syncMentionDataToAnnotation, triggerAnnotationChangedForEditor]);

  useEffect(() => {
    if (isReply && pendingAttachments.length === 0) {
      // Load attachments
      const attachments = annotation.getAttachments();
      addAttachments(annotation.Id, attachments);
    }
  }, []);

  const onTextValueChange = (value, annotationId) => {
    const editor = textareaRef.current?.getEditor?.();
    const inputPlainText = editor ? getEditorPlainText(editor) : stripNewLineFromEndOfText(value);
    const localPlainText = stripNewLineFromEndOfText(localValue);
    const savedPlainText = stripNewLineFromEndOfText(annotation.getContents() || '');

    if (inputPlainText === savedPlainText) {
      return;
    }

    if (inputPlainText === localPlainText) {
      return;
    }
    setLocalValue(value);
    onTextAreaValueChange(value, annotationId);
  };

  const setContents = async (e) => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    const editor = textareaRef.current.getEditor();
    textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
    setAnnotationRichTextStyle(editor, annotation);

    const hasTrailingNewlineToRemove = textAreaValue.length > 1 && textAreaValue[textAreaValue.length - 1] === '\n';
    if (hasTrailingNewlineToRemove) {
      textAreaValue = textAreaValue.slice(0, textAreaValue.length - 1);
    }

    skipAutoLink(annotation);

    const didUpdate = await checkOfficeEditorCommentAndUpdate(annotation, textAreaValue);
    if (!didUpdate) {
      return;
    }

    if (isMentionEnabled && !isOfficeEditorCommentAnnotation) {
      syncMentionDataToAnnotation(textAreaValue);
    } else {
      annotation.setContents(textAreaValue);
    }

    await setAnnotationAttachments(annotation, pendingAttachmentMap[annotation.Id]);

    const source = (annotation instanceof window.Core.Annotations.FreeTextAnnotation)
      ? 'textChanged' : 'noteChanged';
    core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [[annotation], 'modify', { 'source': source }]);

    if (annotation instanceof window.Core.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }

    clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id);
    setIsEditing(false, editingKey);
    // Only set comment to unposted state if it is not empty
    if (textAreaValue !== '') {
      onTextAreaValueChange(undefined, annotation.Id);
    }
    clearAttachments(annotation.Id);
  };

  const onBlur = (e) => {
    if (e.relatedTarget?.getAttribute('data-element')?.includes('annotationCommentButton')) {
      e.target.focus();
      return;
    }
    setCurAnnotId(undefined);
  };

  const onFocus = () => {
    setCurAnnotId(annotation.Id);
  };

  const contentClassName = classNames('edit-content', { 'reply-content': isReply });
  const pendingAttachments = pendingAttachmentMap[annotation.Id] || [];

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
        value={localValue}
        onChange={(value) => onTextValueChange(value, annotation.Id)}
        onSubmit={setContents}
        isReply={isReply}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div className="edit-buttons">
        <Button
          className="cancel-button"
          label={t('action.cancel')}
          onClick={(e) => {
            e.stopPropagation();

            const baselineFromMap = editSessionBaselineByAnnotationId.get(
              makeBaselineKey(activeDocumentViewerKey, annotation.Id),
            );
            const baselineToRestore = baselineFromMap || editSessionBaselineRef.current;

            const valueToRestore = typeof baselineToRestore?.contents === 'string'
              ? baselineToRestore.contents
              : (annotation.getContents() || '');
            const mentionDataToRestore = typeof baselineToRestore?.mentionData === 'string'
              ? baselineToRestore.mentionData
              : (annotation.getCustomData('trn-mention') || '');

            setIsEditing(false, editingKey);
            annotation.setContents(valueToRestore);
            annotation.setCustomData('trn-mention', mentionDataToRestore);
            // Strip any mention markup before seeding the editor so the raw markdown
            // (e.g. "@[John Doe](id)") is not briefly shown while edit mode is closing.
            const editorValueToRestore = isMentionEnabled
              ? mentionsManager.extractMentionDataFromStr(valueToRestore).plainTextValue
              : valueToRestore;
            setLocalValue(editorValueToRestore);
            textareaRef.current?.getEditor()?.setText(editorValueToRestore);
            // Clear pending text
            onTextAreaValueChange(undefined, annotation.Id);
            clearAttachments(annotation.Id);
            clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id);
          }}
        />
        <Button
          className={`save-button${localValue ? '' : ' disabled'}`}
          disabled={!localValue}
          label={t('action.save')}
          onClick={(e) => {
            e.stopPropagation();
            setContents(e);
          }}
        />
      </div>
    </div>
  );
};

ContentArea.propTypes = {
  editingKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
  pendingText: PropTypes.string,
  editSessionBaseline: PropTypes.shape({
    contents: PropTypes.string,
    mentionData: PropTypes.string,
  }),
};

const getRichTextSpan = (text, richTextStyle, key) => {
  const style = {
    fontWeight: richTextStyle['font-weight'],
    fontStyle: richTextStyle['font-style'],
    textDecoration: richTextStyle['text-decoration'],
    color: richTextStyle['color']
  };
  if (style.textDecoration) {
    style.textDecoration = style.textDecoration.replace('word', 'underline');
  }
  return (
    <span css={css({ ...style })} key={key}>{text}</span>
  );
};

const renderRichText = (text, richTextStyle, start) => {
  if (!richTextStyle || !text) {
    return text;
  }

  const styles = {};
  const indices = Object.keys(richTextStyle).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i] - start;
    index = Math.min(Math.max(index, 0), text.length);
    styles[index] = richTextStyle[indices[i]];
    if (index === text.length) {
      break;
    }
  }

  const contentToRender = [];
  const styleIndices = Object.keys(styles).map(Number).sort((a, b) => a - b);
  for (let i = 1; i < styleIndices.length; i++) {
    contentToRender.push(getRichTextSpan(
      text.slice(styleIndices[i - 1], styleIndices[i]),
      styles[styleIndices[i - 1]],
      `richtext_span_${i}`
    ));
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
        {
          renderRichText(
            text.substring(position, position + loweredSearchInput.length),
            richTextStyle,
            start + position)
        }
      </span>
    );
    if (
      // Ensure that we do not try to make an out-of-bounds access
      position + loweredSearchInput.length < loweredText.length
      // Ensure that this is the end of the allFoundPositions array
      && position + loweredSearchInput.length !== allFoundPositions[idx + 1]
    ) {
      contentToRender.push(renderRichText(
        text.substring(position + loweredSearchInput.length, allFoundPositions[idx + 1]),
        richTextStyle,
        start + position + loweredSearchInput.length
      ));
    }
  });
  return contentToRender;
};

/**
 * @ignore
 * Sanitizes the given content to prevent XSS attacks by converting HTML characters
 * into their encoded equivalents.
 *
 * @param {string} content - The content to sanitize.
 * @returns {string} The sanitized content, or the original content if no changes are needed.
 */
function sanitizeContent(content) {
  return content ? escape(content) : content;
}
