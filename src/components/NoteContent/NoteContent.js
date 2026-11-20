import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import classNames from 'classnames';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import debounce from 'lodash/debounce';
import NoteTextarea from 'components/NoteTextarea';
import NoteContext from 'components/Note/Context';
import NoteHeader from 'components/NoteHeader';
import ReplyAttachmentList from 'components/ReplyAttachmentList';
import getLinkDestination from 'helpers/getLinkDestination';

import mentionsManager from 'helpers/MentionsManager';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import setReactQuillContent from 'helpers/setReactQuillContent';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import { updateOfficeEditorCommentMessage } from 'helpers/officeEditorCommentHelper';
import updateSpreadsheetEditorCommentMessage from 'src/helpers/spreadsheetEditor/updateSpreadsheetEditorCommentMessage';
import { isMobile } from 'helpers/device';
import {
  getEditorContent, getPendingEditorValue, stripQuillTrailingNewline,
  hasCommentText, getEditorPlainText, syncMentionDataToAnnotation, resetSkipAutoLink,
} from './NoteContentHelpers';
import { highlightSearchInput, renderNoteContents, renderSelectedTextPreview, adjustTextForTheme } from './NoteContentPresentation';
import { getEditSessionBaseline, clearEditSessionBaseline } from './NoteContentEditSession';
import useCore from 'hooks/useCore';
import { useCurrentRef } from 'hooks/useCurrentRef';
import useNoteEditSession from 'hooks/useNoteEditSession';
import { getDataWithKey, mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import Events from 'constants/events';
import fireEvent from 'helpers/fireEvent';
import Button from 'components/Button';

import './NoteContent.scss';

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
  handleNoteClick: handleNoteClickProp = () => {},
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
  const instanceId = useSelector((state) => selectors.getInstanceId(state));
  const isMentionEnabled = useSelector((state) => selectors.getIsMentionEnabled(state));

  const {
    isSelected,
    searchInput,
    resize: resizeProp,
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

  // Parents recreate these callbacks on every render. Keep stable wrappers so the
  // memoized content below only rebuilds when the note's own inputs change.
  // They are stable for the component's lifetime, so memos don't list them.
  const handleNoteClickRef = useCurrentRef(handleNoteClickProp);
  const resizeRef = useCurrentRef(resizeProp);
  const handleNoteClick = useCallback((e) => handleNoteClickRef.current(e), []);
  const resize = useCallback(() => resizeRef.current(), []);

  const [attachments, setAttachments] = useState([]);
  // Keep this on NoteContent: selecting another thread unmounts ContentArea,
  // but does not start a new edit session for this comment or reply.
  const officeEditorHasAutoFocusedRef = useRef(false);
  useLayoutEffect(() => {
    if (!isEditing) {
      officeEditorHasAutoFocusedRef.current = false;
    }
  }, [isEditing]);

  useNoteEditSession({ annotation, isEditing, isSelected, activeDocumentViewerKey, instanceId });

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

  const trackedChangeLabels = useMemo(() => ({
    1: t('officeEditor.added'),
    2: t('officeEditor.deleted'),
    3: t('officeEditor.formatted'),
  }), [t]);

  const renderContents = useCallback(
    (contents, richTextStyle, fontColor, skipAutoLink) => renderNoteContents({
      contents, richTextStyle, fontColor, skipAutoLink, searchInput, isReply,
      canCollapseTextPreview, canCollapseReplyPreview, isTrackedChange,
      trackedChangeLabels, annotation, resize,
    }),
    [searchInput, canCollapseTextPreview, canCollapseReplyPreview, trackedChangeLabels, annotation]
  );

  const icon = isTrackedChange && annotation['TrackedChangeType'] === 3 ?
    'ic-format-page' :
    getDataWithKey(mapAnnotationToKey(annotation)).icon;

  const contents = getEditorContent(annotation, isMentionEnabled);

  // for link annotations we want to get their URL. We are unable to use "getContents" to get that data, need to use "getLinkDestination" instead
  const contentsToRender = annotation instanceof window.Core.Annotations.Link ? getLinkDestination(annotation, store) : annotation.getContents();

  // This is the text placeholder passed to the ContentArea
  // It ensures that if we try and edit, we get the right placeholder
  // depending on whether the comment has been saved to the annotation or not
  const textAreaValue = getPendingEditorValue(contents, pendingEditTextMap, annotation.Id);
  const pendingText = pendingEditTextMap[annotation.Id];

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
      const richTextStyle = annotation.getRichTextStyle();
      const { textColor } = adjustTextForTheme(annotation['TextColor'], richTextStyle, activeTheme, window.Core.Annotations.Color);
      const contentStyle = {};
      if (textColor) {
        contentStyle.color = textColor.toHexString();
      }

      return (
        <>
          {(isEditing && isSelected) ? (
            <ContentArea
              annotation={annotation}
              officeEditorHasAutoFocusedRef={officeEditorHasAutoFocusedRef}
              editingKey={editingKey}
              setIsEditing={setIsEditing}
              textAreaValue={textAreaValue}
              onTextAreaValueChange={setPendingEditText}
              pendingText={pendingText}
              editSessionBaseline={getEditSessionBaseline(activeDocumentViewerKey, annotation.Id, instanceId)}
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
    [
      annotation, isSelected, isEditing, setIsEditing, contentsToRender, renderContents, textAreaValue,
      setPendingEditText, pendingText, attachments, activeTheme, skipAutoLink,
    ]
  );

  const text = annotation.getCustomData('trn-annot-preview');
  const textPreview = useMemo(
    () => renderSelectedTextPreview(text, searchInput, isReply, canCollapseTextPreview, handleNoteClick),
    [text, searchInput, isReply, canCollapseTextPreview]
  );

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
  officeEditorHasAutoFocusedRef,
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
  const instanceId = useSelector((state) => selectors.getInstanceId(state));
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
    isSpreadsheetEditorCommentAnnotation,
    setPendingEditText,
  } = useContext(NoteContext);
  const isSpreadsheetComment = isSpreadsheetEditorCommentAnnotation
    || mapAnnotationToKey(annotation) === annotationMapKeys.SPREADSHEET_EDITOR_COMMENT;
  const [localValue, setLocalValue] = useState(textAreaValue || '');
  const hasCommentContent = hasCommentText(localValue);
  const editSessionBaselineRef = useRef(editSessionBaseline);
  const syncedAnnotationIdRef = useRef(annotation.Id);

  const shouldNotFocusOnInput = !isInlineCommentDisabled && isInlineCommentOpen && isMobile();
  const autoFocusNoteOnAnnotationSelection =
    autoFocusNoteOnAnnotationSelectionEnabled &&
    (isOfficeEditorCommentAnnotation || !isSpreadsheetEditorCommentAnnotation || isNoteEditingTriggeredByAnnotationPopup);
  const { core } = useCore();
  const autosaveContextRef = useRef({});
  const isMountedRef = useRef(true);
  const pendingAutosaveRef = useRef(null);
  const editorRef = useRef(null);
  const isAutosaveCancelledRef = useRef(false);

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

  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      pendingAutosaveRef.current?.flush();
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

  const checkOfficeEditorCommentAndUpdate = (annotation, textAreaValue) => {
    return updateOfficeEditorCommentMessage({
      annotation,
      text: textAreaValue,
      core,
    });
  };

  const checkSpreadsheetEditorCommentAndUpdate = (annotation, textAreaValue) => {
    return updateSpreadsheetEditorCommentMessage({
      annotation,
      text: textAreaValue,
      core,
    });
  };

  const checkCommentAndUpdate = async (annotation, textAreaValue) => {
    if (isOfficeEditorCommentAnnotation) {
      return checkOfficeEditorCommentAndUpdate(annotation, textAreaValue);
    }
    if (isSpreadsheetComment) {
      return checkSpreadsheetEditorCommentAndUpdate(annotation, textAreaValue);
    }
    return true;
  };

  const triggerAnnotationChangedForEditor = useCallback(() => {
    const isFreeTextAnnotation = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
    const source = isFreeTextAnnotation ? 'textChanged' : 'noteChanged';
    const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
    const changedAnnotations = [annotation];
    if (isSpreadsheetComment && annotation.isReply()) {
      const rootAnnotation = annotationManager.getRootAnnotation(annotation);
      if (rootAnnotation && rootAnnotation !== annotation) {
        changedAnnotations.push(rootAnnotation);
      }
    }
    annotationManager.trigger('annotationChanged', [changedAnnotations, 'modify', { 'source': source }]);

    if (isFreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }
  }, [annotation, core, activeDocumentViewerKey, isSpreadsheetComment]);
  useEffect(() => {
    let contentTimeout;
    let selectionTimeout;
    const shouldAutoFocus = !shouldNotFocusOnInput && autoFocusNoteOnAnnotationSelection &&
      (!isOfficeEditorCommentAnnotation || !officeEditorHasAutoFocusedRef.current);
    const markAutoFocused = () => {
      if (isOfficeEditorCommentAnnotation) {
        officeEditorHasAutoFocusedRef.current = true;
      }
    };
    // on initial mount, focus the last character of the textarea
    if ((isAnyCustomPanelOpen || isNotesPanelOpen || isInlineCommentOpen) && textareaRef.current) {
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
        contentTimeout = setTimeout(() => {
          // need setTimeout because textarea seem to rerender and unfocus
          if (isMentionEnabled) {
            textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
            const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

            if (ids.length) {
              editor.setText(plainTextValue);
            }
          }

          if (!shouldAutoFocus) {
            return;
          }

          markAutoFocused();
          textareaRef.current?.focus();
          const annotRichTextStyle = annotation.getRichTextStyle();
          if (annotRichTextStyle) {
            setReactQuillContent(annotation, editor);
            // Store the styled HTML in localValue so a re-render doesn't re-inject the
            // plain value and wipe the styling.
            setLocalValue(editor.root.innerHTML);
          }
        }, 0);
      }

      const lastNewLineCharacterLength = 1;
      const textLength = editor.getLength() - lastNewLineCharacterLength;

      if (shouldAutoFocus) {
        selectionTimeout = setTimeout(() => {
          markAutoFocused();
          if (textLength) {
            editor.setSelection(textLength, textLength);
          }
        }, 0);
      }
    }
    return () => {
      clearTimeout(contentTimeout);
      clearTimeout(selectionTimeout);
    };
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
      if (isAutosaveCancelledRef.current) {
        return;
      }
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
      const editor = textareaRef.current?.getEditor?.() || editorRef.current;
      if (!editor) {
        return;
      }
      let textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
      const editorPlainText = getEditorPlainText(editor);

      const hasTrailingNewlineToRemove = textAreaValue.length > 1 && textAreaValue[textAreaValue.length - 1] === '\n';
      if (hasTrailingNewlineToRemove) {
        textAreaValue = textAreaValue.slice(0, textAreaValue.length - 1);
      }

      const localPlainText = stripQuillTrailingNewline(localValue);
      const savedPlainText = stripQuillTrailingNewline(annotation.getContents() || '');
      if (!localPlainText || !editorPlainText || localPlainText === savedPlainText || editorPlainText === savedPlainText) {
        return;
      }

      setAnnotationRichTextStyle(editor, annotation);

      resetSkipAutoLink(annotation);

      const didUpdate = await checkCommentAndUpdate(annotation, textAreaValue);
      if (!didUpdate) {
        return;
      }

      if (isSpreadsheetComment) {
        setLocalValue(annotation.getContents() || '');
      } else if (isMentionEnabled && !isOfficeEditorCommentAnnotation) {
        syncMentionDataToAnnotation(annotation, textAreaValue);
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

    editorRef.current = textareaRef.current?.getEditor?.() || editorRef.current;
    pendingAutosaveRef.current = autosave;
    autosave();
    return () => autosave.cancel();
  }, [localValue, autosaveEnabled, autosaveInterval, stripQuillTrailingNewline, triggerAnnotationChangedForEditor]);

  useEffect(() => {
    if (isReply && pendingAttachments.length === 0) {
      // Load attachments
      const attachments = annotation.getAttachments();
      addAttachments(annotation.Id, attachments);
    }
  }, []);

  const onTextValueChange = (value, annotationId) => {
    // Quill compares the controlled value as HTML, not plain text. Even a
    // normalization-only change must be reflected here; otherwise a later
    // render rewrites the editor and restores its previous selection.
    setLocalValue(value);
    const editor = textareaRef.current?.getEditor?.();
    const inputPlainText = editor ? getEditorPlainText(editor) : stripQuillTrailingNewline(value);
    const localPlainText = stripQuillTrailingNewline(localValue);
    const savedPlainText = stripQuillTrailingNewline(annotation.getContents() || '');

    if (inputPlainText === savedPlainText) {
      return;
    }

    if (inputPlainText === localPlainText) {
      return;
    }
    isAutosaveCancelledRef.current = false;
    onTextAreaValueChange(value, annotationId);
  };

  const setContents = async (e) => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    const editor = textareaRef.current.getEditor();
    textAreaValue = mentionsManager.getFormattedTextFromDeltas(editor.getContents());
    textAreaValue = stripQuillTrailingNewline(textAreaValue);
    if (!textAreaValue.trim()) {
      return;
    }
    setAnnotationRichTextStyle(editor, annotation);

    resetSkipAutoLink(annotation);

    const didUpdate = await checkCommentAndUpdate(annotation, textAreaValue);
    if (!didUpdate) {
      return;
    }

    if (isSpreadsheetComment) {
      // The Spreadsheet Editor API owns normalization such as message truncation.
    } else if (isMentionEnabled && !isOfficeEditorCommentAnnotation) {
      syncMentionDataToAnnotation(annotation, textAreaValue);
    } else {
      annotation.setContents(textAreaValue);
    }

    await setAnnotationAttachments(annotation, pendingAttachmentMap[annotation.Id]);

    triggerAnnotationChangedForEditor();

    clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id, instanceId);
    setIsEditing(false, editingKey);
    // Only set comment to unposted state if it is not empty
    if (textAreaValue !== '') {
      onTextAreaValueChange(undefined, annotation.Id);
    }
    clearAttachments(annotation.Id);
  };

  const onBlur = (e) => {
    const relatedTargetDataElement = e.relatedTarget?.getAttribute('data-element');
    const isSpreadsheetEditorAddCommentButton = relatedTargetDataElement === DataElements.SPREADSHEET_EDITOR_COMMENT_ADD_NEW_BUTTON;
    if (relatedTargetDataElement?.includes('annotationCommentButton') || isSpreadsheetEditorAddCommentButton) {
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

            // Drop any in-flight autosave so the cancelled edit is not written back
            // by the debounce or by the flush that runs when this editor unmounts.
            isAutosaveCancelledRef.current = true;
            pendingAutosaveRef.current?.cancel();

            const baselineFromStore = getEditSessionBaseline(activeDocumentViewerKey, annotation.Id, instanceId);
            const baselineToRestore = baselineFromStore || editSessionBaselineRef.current;

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
            clearEditSessionBaseline(activeDocumentViewerKey, annotation.Id, instanceId);
          }}
        />
        <Button
          className={`save-button${hasCommentContent ? '' : ' disabled'}`}
          disabled={!hasCommentContent}
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
