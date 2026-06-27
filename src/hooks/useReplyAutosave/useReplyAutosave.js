import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import debounce from 'lodash/debounce';
import mentionsManager from 'helpers/MentionsManager';
import setAnnotationRichTextStyle from 'helpers/setAnnotationRichTextStyle';
import { setAnnotationAttachments } from 'helpers/ReplyAttachmentManager';
import { setReplyDraftForExport, clearReplyDraftForExport, clearAllReplyDraftsForExport } from 'helpers/replyDraftExportStore';
import { markAutosaveDraftReply, clearAutosaveDraftReply } from 'helpers/autosaveDraftReply';
import { OFFICE_EDITOR_COMMENT_KEY } from 'src/constants/officeEditor';
import useCore from 'hooks/useCore';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import NoteContext from 'components/Note/Context';
import { AUTOSAVE_DRAFT_REPLY_SOURCE, AUTOSAVE_DRAFT_REPLY_COMMIT_SOURCE } from 'constants/autosave';
import { BEFORE_FILE_DOWNLOAD, AFTER_FILE_DOWNLOAD } from 'constants/downloads';

// Module-level map persists drafts across remounts. Keyed as `${documentViewerKey}:${annotationId}`.
export const replyDraftByAnnotationId = new Map();

const makeDraftKey = (viewerKey, annotationId) => `${viewerKey}:${annotationId}`;

const clearAllDraftsForViewer = (viewerKey) => {
  const prefix = `${viewerKey}:`;
  for (const key of replyDraftByAnnotationId.keys()) {
    if (key.startsWith(prefix)) {
      replyDraftByAnnotationId.delete(key);
    }
  }
};

const useReplyAutosave = ({
  annotation,
  textareaRef,
}) => {
  const [localReplyValue, setLocalReplyValue] = useState('');
  const [showAutosaved, setShowAutosaved] = useState(false);

  const { core } = useCore();

  const autosaveReplyAnnotationRef = useRef(null);
  const autosaveReplyAttachedToParentRef = useRef(false);
  const autosaveReplyAddedToManagerRef = useRef(false);
  const isSubmitClickRef = useRef(false);
  const isCommittingAutosaveRef = useRef(false);
  const committedAutosaveSignatureRef = useRef('');
  const commitAutosavedReplyRef = useRef(null);
  const shouldSkipCommitOnUnmountRef = useRef(false);
  const isMountedRef = useRef(true);

  const autosaveEnabled = useSelector(selectors.getAutosaveEnabled);
  const autosaveInterval = useSelector(selectors.getAutosaveInterval);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isMentionEnabled = useSelector(selectors.getIsMentionEnabled);

  const {
    isOfficeEditorCommentAnnotation,
    setPendingReply,
    pendingReplyMap,
    pendingAttachmentMap,
    clearAttachments,
  } = useContext(NoteContext) || {};
  const pendingReplyMapRef = useRef(pendingReplyMap || {});
  pendingReplyMapRef.current = pendingReplyMap || {};

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetDraftReplyTracking = useCallback(() => {
    autosaveReplyAnnotationRef.current = null;
    autosaveReplyAttachedToParentRef.current = false;
    autosaveReplyAddedToManagerRef.current = false;
    committedAutosaveSignatureRef.current = '';
  }, []);

  const clearStoredDraft = useCallback((annotationId, documentViewerKey) => {
    replyDraftByAnnotationId.delete(makeDraftKey(documentViewerKey, annotationId));
    clearReplyDraftForExport(documentViewerKey, annotationId);
  }, []);

  // Restore draft on mount / annotation change (skip for Office Editor comments)
  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    resetDraftReplyTracking();
    shouldSkipCommitOnUnmountRef.current = false;

    const savedContent = replyDraftByAnnotationId.get(makeDraftKey(activeDocumentViewerKey, annotation.Id));
    const pendingReplyContent = pendingReplyMapRef.current?.[annotation.Id] || '';
    const restoredContent = (autosaveEnabled && savedContent) ? savedContent : pendingReplyContent;
    if (restoredContent) {
      setLocalReplyValue(restoredContent);
      const timeout = setTimeout(() => {
        const editor = textareaRef.current?.getEditor?.();
        if (!editor) {
          return;
        }
        editor.setText(restoredContent);
        const textLength = Math.max(editor.getLength() - 1, 0);
        editor.setSelection(textLength, 0);
      }, 0);
      return () => clearTimeout(timeout);
    } else {
      setLocalReplyValue('');
    }
  }, [annotation.Id, activeDocumentViewerKey, autosaveEnabled, resetDraftReplyTracking, textareaRef, isOfficeEditorCommentAnnotation]);

  // Skip download flow handling for Office Editor comments
  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    const onBeforeFileDownload = (event) => {
      if (event?.detail?.documentViewerKey === activeDocumentViewerKey) {
        shouldSkipCommitOnUnmountRef.current = true;
      }
    };
    const onAfterFileDownload = (event) => {
      if (event?.detail?.documentViewerKey === activeDocumentViewerKey) {
        shouldSkipCommitOnUnmountRef.current = false;
      }
    };
    window.addEventListener(BEFORE_FILE_DOWNLOAD, onBeforeFileDownload);
    window.addEventListener(AFTER_FILE_DOWNLOAD, onAfterFileDownload);
    return () => {
      window.removeEventListener(BEFORE_FILE_DOWNLOAD, onBeforeFileDownload);
      window.removeEventListener(AFTER_FILE_DOWNLOAD, onAfterFileDownload);
    };
  }, [activeDocumentViewerKey, isOfficeEditorCommentAnnotation]);

  // Clear draft when the document is reloaded or unloaded (skip for Office Editor comments)
  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    const onDocumentTeardown = () => {
      shouldSkipCommitOnUnmountRef.current = true;
      clearAllDraftsForViewer(activeDocumentViewerKey);
      clearAllReplyDraftsForExport(activeDocumentViewerKey);
      resetDraftReplyTracking();
    };
    core.addEventListener('beforeDocumentLoaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    core.addEventListener('documentUnloaded', onDocumentTeardown, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('beforeDocumentLoaded', onDocumentTeardown, activeDocumentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentTeardown, activeDocumentViewerKey);
    };
  }, [core, activeDocumentViewerKey, annotation.Id, clearStoredDraft, resetDraftReplyTracking, isOfficeEditorCommentAnnotation]);

  const getResolvedOfficeEditorCommentId = useCallback(() => {
    const officeEditorCommentId = annotation.getCustomData(OFFICE_EDITOR_COMMENT_KEY);
    const resolvedCommentId = Number.parseInt(officeEditorCommentId, 10);
    return Number.isNaN(resolvedCommentId) ? null : resolvedCommentId;
  }, [annotation]);

  // Builds and styles a new reply annotation for the commit path.
  const createCommittedReplyAnnotation = useCallback((draftText) => {
    const editor = textareaRef.current?.getEditor();
    const replyAnnotation = isMentionEnabled
      ? mentionsManager.createMentionReply(annotation, draftText)
      : core.createAnnotationReply(annotation, draftText);
    if (editor) {
      setAnnotationRichTextStyle(editor, replyAnnotation);
    }
    return replyAnnotation;
  }, [annotation, isMentionEnabled, core, textareaRef]);

  const commitOfficeEditorAutosavedReply = useCallback(async (draftText) => {
    const resolvedCommentId = getResolvedOfficeEditorCommentId();
    if (resolvedCommentId === null) {
      return;
    }
    await core.getOfficeEditor().getCommentManager().addCommentReply(resolvedCommentId, draftText);
  }, [getResolvedOfficeEditorCommentId]);

  const attachDraftReply = useCallback((replyAnnotation) => {
    if (!autosaveReplyAttachedToParentRef.current) {
      annotation.addReply(replyAnnotation);
      autosaveReplyAttachedToParentRef.current = true;
    }

    if (!autosaveReplyAddedToManagerRef.current) {
      core.getAnnotationManager(activeDocumentViewerKey).addAnnotations([replyAnnotation], {
        imported: false,
        autoFocus: false,
        source: AUTOSAVE_DRAFT_REPLY_SOURCE,
      });
      autosaveReplyAddedToManagerRef.current = true;
    }
  }, [core]);

  const detachDraftReply = useCallback(() => {
    const replyAnnotation = autosaveReplyAnnotationRef.current;

    if (!replyAnnotation) {
      return;
    }

    if (autosaveReplyAttachedToParentRef.current) {
      const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
      const isReplyInManager = autosaveReplyAddedToManagerRef.current || annotationManager.hasAnnotation(replyAnnotation);

      if (isReplyInManager) {
        annotationManager.deleteAnnotations([replyAnnotation], {
          imported: true,
          force: true,
          source: AUTOSAVE_DRAFT_REPLY_SOURCE,
        });
        autosaveReplyAddedToManagerRef.current = false;
      } else {
        // If the draft reply is parent-only, detach it directly from the parent.
        annotation.deleteReply(replyAnnotation);
      }
      autosaveReplyAttachedToParentRef.current = false;
    }
  }, [core]);

  const commitAutosavedReply = useCallback(async () => {
    if (!autosaveEnabled || isCommittingAutosaveRef.current || isSubmitClickRef.current) {
      return;
    }
    const draftText = (replyDraftByAnnotationId.get(makeDraftKey(activeDocumentViewerKey, annotation.Id)) || '').trim();
    if (!draftText) {
      return;
    }
    const signature = `${activeDocumentViewerKey}:${annotation.Id}:${draftText}`;
    if (committedAutosaveSignatureRef.current === signature) {
      return;
    }
    committedAutosaveSignatureRef.current = signature;
    isCommittingAutosaveRef.current = true;
    try {
      if (isOfficeEditorCommentAnnotation) {
        await commitOfficeEditorAutosavedReply(draftText);
      } else if (autosaveReplyAttachedToParentRef.current && autosaveReplyAnnotationRef.current) {
        clearAutosaveDraftReply(autosaveReplyAnnotationRef.current);
        if (autosaveReplyAddedToManagerRef.current) {
          core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [[autosaveReplyAnnotationRef.current], 'modify', { source: AUTOSAVE_DRAFT_REPLY_COMMIT_SOURCE }]);
        } else {
          core.addAnnotations([autosaveReplyAnnotationRef.current], activeDocumentViewerKey);
          autosaveReplyAddedToManagerRef.current = true;
        }
        await setAnnotationAttachments(autosaveReplyAnnotationRef.current, pendingAttachmentMap[annotation.Id]);
      } else {
        const replyAnnotation = createCommittedReplyAnnotation(draftText);
        await setAnnotationAttachments(replyAnnotation, pendingAttachmentMap[annotation.Id]);
        if (isMentionEnabled) {
          core.addAnnotations([replyAnnotation], activeDocumentViewerKey);
        } else {
          core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [[replyAnnotation], 'modify', {}]);
        }
      }
      clearStoredDraft(annotation.Id, activeDocumentViewerKey);
      setPendingReply('', annotation.Id);
      clearAttachments(annotation.Id);
      resetDraftReplyTracking();
      if (isMountedRef.current) {
        setShowAutosaved(false);
      }
    } catch (error) {
      committedAutosaveSignatureRef.current = '';
      throw error;
    } finally {
      isCommittingAutosaveRef.current = false;
    }
  }, [
    autosaveEnabled,
    activeDocumentViewerKey,
    annotation.Id,
    isOfficeEditorCommentAnnotation,
    isMentionEnabled,
    pendingAttachmentMap,
    setPendingReply,
    clearAttachments,
    commitOfficeEditorAutosavedReply,
    createCommittedReplyAnnotation,
    clearStoredDraft,
    core,
    resetDraftReplyTracking,
  ]);

  // Only set up commit-on-unmount for non-office comments
  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    commitAutosavedReplyRef.current = commitAutosavedReply;
  }, [commitAutosavedReply, isOfficeEditorCommentAnnotation]);

  useEffect(() => {
    if (isOfficeEditorCommentAnnotation) {
      return;
    }
    return () => {
      if (!shouldSkipCommitOnUnmountRef.current) {
        const commitAutosavedReplyOnUnmount = commitAutosavedReplyRef.current;
        if (commitAutosavedReplyOnUnmount) {
          commitAutosavedReplyOnUnmount().catch((error) => {
            console.error('Failed to commit autosaved reply during unmount.', error);
          });
        }
      }
    };
  }, [isOfficeEditorCommentAnnotation]);

  // Debounced autosave triggered by each keystroke (skip for Office Editor comments)
  useEffect(() => {
    if (!autosaveEnabled || isOfficeEditorCommentAnnotation) {
      return;
    }
    const autosave = debounce(async () => {
      const editor = textareaRef.current?.getEditor?.();
      const plainText = editor ? editor.getText() : localReplyValue;
      const currentDraftText = replyDraftByAnnotationId.get(makeDraftKey(activeDocumentViewerKey, annotation.Id)) || '';
      if (plainText === currentDraftText) {
        return;
      }

      const replyText = editor
        ? mentionsManager.getFormattedTextFromDeltas(editor.getContents())
        : localReplyValue;
      if (!replyText.trim()) {
        detachDraftReply();
        clearStoredDraft(annotation.Id, activeDocumentViewerKey);
        resetDraftReplyTracking();
        return;
      }

      replyDraftByAnnotationId.set(makeDraftKey(activeDocumentViewerKey, annotation.Id), replyText);
      committedAutosaveSignatureRef.current = '';

      let replyAnnotation = autosaveReplyAnnotationRef.current;
      if (!replyAnnotation) {
        replyAnnotation = new window.Core.Annotations.StickyAnnotation();
        replyAnnotation['InReplyTo'] = annotation.Id;
        replyAnnotation['X'] = annotation.X;
        replyAnnotation['Y'] = annotation.Y;
        replyAnnotation['PageNumber'] = annotation.PageNumber;
        replyAnnotation['Author'] = core.getCurrentUser();
        markAutosaveDraftReply(replyAnnotation);
        autosaveReplyAnnotationRef.current = replyAnnotation;
      }

      if (isMentionEnabled) {
        const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(replyText);
        replyAnnotation.setContents(plainTextValue || '');
        replyAnnotation.setCustomData('trn-mention', JSON.stringify({ contents: replyText, ids }));
        setReplyDraftForExport(activeDocumentViewerKey, annotation.Id, {
          replyText,
          plainTextValue: plainTextValue || '',
          isMentionEnabled: true,
          ids,
        });
      } else {
        replyAnnotation.setContents(replyText);
        replyAnnotation.setCustomData('trn-mention', '');
        setReplyDraftForExport(activeDocumentViewerKey, annotation.Id, {
          replyText,
          plainTextValue: replyText,
          isMentionEnabled: false,
          ids: [],
        });
      }

      if (editor) {
        setAnnotationRichTextStyle(editor, replyAnnotation);
      }
      attachDraftReply(replyAnnotation);
      setShowAutosaved(true);
      setPendingReply('', annotation.Id);
    }, autosaveInterval);

    autosave();
    return () => autosave.cancel();
  }, [localReplyValue, autosaveEnabled, autosaveInterval, attachDraftReply, clearStoredDraft, detachDraftReply, resetDraftReplyTracking, isOfficeEditorCommentAnnotation]);

  // Hide the "Saved" indicator after a short delay.
  useEffect(() => {
    if (showAutosaved) {
      const timeout = setTimeout(() => setShowAutosaved(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showAutosaved]);

  // Called by postReply after a successful submission to clear all draft state.
  const clearDraft = useCallback(() => {
    detachDraftReply();
    clearStoredDraft(annotation.Id, activeDocumentViewerKey);
    resetDraftReplyTracking();
    setShowAutosaved(false);
    setLocalReplyValue('');
  }, [annotation.Id, activeDocumentViewerKey, clearStoredDraft, detachDraftReply, resetDraftReplyTracking]);

  return {
    localReplyValue,
    setLocalReplyValue,
    showAutosaved,
    isSubmitClickRef,
    clearDraft,
  };
};

export default useReplyAutosave;
