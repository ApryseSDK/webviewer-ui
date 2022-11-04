import * as eventListeners from 'src/event-listeners';
import hotkeysManager from 'helpers/hotkeysManager';
import core from 'core';

const { ToolNames } = window.Core.Tools;

export default (store, documentViewerKey = 1, skipHotkeys = false) => {
  const { dispatch } = store;
  // TODO Compare: Add event handlers for panels and refactor code for panels
  const onBeforeDocumentLoaded = eventListeners.onBeforeDocumentLoaded(dispatch, documentViewerKey);
  const onCheckStampAnnotationAdded = eventListeners.onCheckStampAnnotationAdded(dispatch, documentViewerKey);
  const onCrossStampAnnotationAdded = eventListeners.onCrossStampAnnotationAdded(dispatch, documentViewerKey);
  const onDisplayModeUpdated = eventListeners.onDisplayModeUpdated(dispatch);
  const onDocumentLoaded = eventListeners.onDocumentLoaded(store, documentViewerKey);
  const onDocumentUnloaded = eventListeners.onDocumentUnloaded(dispatch, documentViewerKey);
  const onFitModeUpdated = eventListeners.onFitModeUpdated(dispatch);
  const onRotationUpdated = eventListeners.onRotationUpdated(dispatch);
  const onToolUpdated = eventListeners.onToolUpdated(dispatch);
  const onToolModeUpdated = eventListeners.onToolModeUpdated(dispatch, store);
  const onZoomUpdated = eventListeners.onZoomUpdated(dispatch, documentViewerKey);
  const onPageNumberUpdated = eventListeners.onPageNumberUpdated(dispatch);
  const onUpdateAnnotationPermission = eventListeners.onUpdateAnnotationPermission(store);
  const onAnnotationChanged = eventListeners.onAnnotationChanged(documentViewerKey);
  const onStampAnnotationAdded = eventListeners.onStampAnnotationAdded(dispatch, documentViewerKey);
  const onSignatureAnnotationAdded = eventListeners.onSignatureAnnotationAdded(documentViewerKey);
  const onStickyAnnotationAdded = eventListeners.onStickyAnnotationAdded(store);
  const onCaretAnnotationAdded = eventListeners.onCaretAnnotationAdded(store);
  const onFullScreenChange = eventListeners.onFullScreenChange(store);
  const onPagesUpdated = eventListeners.onPagesUpdated(dispatch);
  const onLocationSelected = eventListeners.onLocationSelected(store, documentViewerKey);
  const onDotStampAnnotationAdded = eventListeners.onDotStampAnnotationAdded(dispatch, documentViewerKey);
  const onRubberStampAnnotationAdded = eventListeners.onRubberStampAnnotationAdded(documentViewerKey);
  const onReadOnlyModeChanged = eventListeners.onReadOnlyModeChanged(store);
  const onPageComplete = eventListeners.onPageComplete(store, documentViewerKey);
  const onFileAttachmentAnnotationAdded = eventListeners.onFileAttachmentAnnotationAdded();
  const onFileAttachmentDataAvailable = eventListeners.onFileAttachmentDataAvailable();
  const onSignatureSaved = eventListeners.onSignatureSaved(dispatch, store);
  const onSignatureDeleted = eventListeners.onSignatureDeleted(dispatch, store);
  const onHistoryChanged = eventListeners.onHistoryChanged(dispatch, documentViewerKey);
  const onFormFieldCreationModeStarted = eventListeners.onFormFieldCreationModeStarted(dispatch);
  const onFormFieldCreationModeEnded = eventListeners.onFormFieldCreationModeEnded(dispatch, store);
  const onDigitalSignatureAvailable = eventListeners.onDigitalSignatureAvailable(dispatch, documentViewerKey);
  const onImageContentAdded = eventListeners.onImageContentAdded(dispatch);
  const onInitialSaved = eventListeners.onInitialSaved(dispatch, store);
  const onInitialDeleted = eventListeners.onInitialDeleted(dispatch, store);

  return {
    addEventHandlers: () => {
      if (documentViewerKey === 1) {
        core.addEventListener('readOnlyModeChanged', onReadOnlyModeChanged, undefined, documentViewerKey);
        core.addEventListener('formFieldCreationModeEnded', onFormFieldCreationModeEnded);
        core.addEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
        core.addEventListener('toolUpdated', onToolUpdated, undefined, documentViewerKey);
        core.addEventListener('toolModeUpdated', onToolModeUpdated, undefined, documentViewerKey);
        document.addEventListener('fullscreenchange', onFullScreenChange);
        document.addEventListener('mozfullscreenchange', onFullScreenChange);
        document.addEventListener('webkitfullscreenchange', onFullScreenChange);
        document.addEventListener('MSFullscreenChange', onFullScreenChange);
        core.getTool(ToolNames.ADD_IMAGE_CONTENT, documentViewerKey).addEventListener('annotationAdded', onImageContentAdded);
        // -- Tempory divider until panels are ready --
        core.addEventListener('rotationUpdated', onRotationUpdated, undefined, documentViewerKey);
        core.addEventListener('fitModeUpdated', onFitModeUpdated, undefined, documentViewerKey);
        core.addEventListener('pageNumberUpdated', onPageNumberUpdated, undefined, documentViewerKey);
        core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, undefined, documentViewerKey);
        core.getTool('AnnotationCreateSticky', documentViewerKey).addEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky2', documentViewerKey).addEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky3', documentViewerKey).addEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky4', documentViewerKey).addEventListener('annotationAdded', onStickyAnnotationAdded);
        core.addEventListener('pagesUpdated', onPagesUpdated, undefined, documentViewerKey);
        core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('signatureSaved', onSignatureSaved);
        core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('signatureDeleted', onSignatureDeleted);
        core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('initialSaved', onInitialSaved);
        core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('initialDeleted', onInitialDeleted);
        core.getTool('AnnotationCreateMarkInsertText', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText2', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText3', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText4', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText2', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText3', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText4', documentViewerKey).addEventListener('annotationAdded', onCaretAnnotationAdded);
      }
      core.addEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded, undefined, documentViewerKey);
      core.addEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded, undefined, documentViewerKey);
      core.addEventListener('displayModeUpdated', onDisplayModeUpdated, undefined, documentViewerKey);
      core.addEventListener('documentLoaded', onDocumentLoaded, undefined, documentViewerKey);
      core.addEventListener('documentUnloaded', onDocumentUnloaded, undefined, documentViewerKey);
      core.addEventListener('zoomUpdated', onZoomUpdated, undefined, documentViewerKey);
      core.addEventListener('annotationChanged', onAnnotationChanged, undefined, documentViewerKey);
      core.addEventListener('historyChanged', onHistoryChanged, undefined, documentViewerKey);
      core.addEventListener('pageComplete', onPageComplete, undefined, documentViewerKey);
      core.addEventListener('fileAttachmentDataAvailable', onFileAttachmentDataAvailable);
      core.addEventListener('digitalSignatureAvailable', onDigitalSignatureAvailable);
      core.getTool('AnnotationCreateStamp', documentViewerKey).addEventListener('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('locationSelected', onLocationSelected);
      core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('annotationAdded', onSignatureAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_DOT, documentViewerKey).addEventListener('annotationAdded', onDotStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).addEventListener('annotationAdded', onRubberStampAnnotationAdded);
      core.getTool('AnnotationCreateFileAttachment', documentViewerKey).addEventListener('annotationAdded', onFileAttachmentAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CROSS, documentViewerKey).addEventListener('annotationAdded', onCrossStampAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CHECKMARK, documentViewerKey).addEventListener('annotationAdded', onCheckStampAnnotationAdded);
    },
    removeEventHandlers: () => {
      if (documentViewerKey === 1) {
        core.removeEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted, documentViewerKey);
        core.removeEventListener('formFieldCreationModeEnded', onFormFieldCreationModeEnded, documentViewerKey);
        core.removeEventListener('toolUpdated', onToolUpdated, documentViewerKey);
        core.removeEventListener('toolModeUpdated', onToolModeUpdated, documentViewerKey);
        document.removeEventListener('fullscreenchange', onFullScreenChange);
        document.removeEventListener('mozfullscreenchange', onFullScreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
        document.removeEventListener('MSFullscreenChange', onFullScreenChange);
        core.removeEventListener('rotationUpdated', onRotationUpdated, documentViewerKey);
        core.removeEventListener('fitModeUpdated', onFitModeUpdated, documentViewerKey);
        core.removeEventListener('pageNumberUpdated', onPageNumberUpdated, documentViewerKey);
        core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, documentViewerKey);
        core.getTool('AnnotationCreateSticky', documentViewerKey).removeEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky2', documentViewerKey).removeEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky3', documentViewerKey).removeEventListener('annotationAdded', onStickyAnnotationAdded);
        core.getTool('AnnotationCreateSticky4', documentViewerKey).removeEventListener('annotationAdded', onStickyAnnotationAdded);
        core.removeEventListener('pagesUpdated', onPagesUpdated, documentViewerKey);
        core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('signatureSaved', onSignatureSaved);
        core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('signatureDeleted', onSignatureDeleted);
        core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('initialSaved', onInitialSaved);
        core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('initialDeleted', onInitialDeleted);
        core.getTool(ToolNames.ADD_IMAGE_CONTENT, documentViewerKey).removeEventListener('annotationAdded', onImageContentAdded);
        core.getTool('AnnotationCreateMarkInsertText', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText2', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText3', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkInsertText4', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText2', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText3', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
        core.getTool('AnnotationCreateMarkReplaceText4', documentViewerKey).removeEventListener('annotationAdded', onCaretAnnotationAdded);
      }
      core.removeEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded, documentViewerKey);
      core.removeEventListener('displayModeUpdated', onDisplayModeUpdated, documentViewerKey);
      core.removeEventListener('documentLoaded', onDocumentLoaded, documentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded, documentViewerKey);
      core.removeEventListener('zoomUpdated', onZoomUpdated, documentViewerKey);
      core.removeEventListener('annotationChanged', onAnnotationChanged, documentViewerKey);
      core.removeEventListener('pageComplete', onPageComplete, documentViewerKey);
      core.removeEventListener('fileAttachmentDataAvailable', onFileAttachmentDataAvailable, documentViewerKey);
      core.removeEventListener('digitalSignatureAvailable', onDigitalSignatureAvailable, documentViewerKey);
      core.getTool('AnnotationCreateStamp', documentViewerKey).removeEventListener('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('locationSelected', onLocationSelected);
      core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('annotationAdded', onSignatureAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_DOT, documentViewerKey).removeEventListener('annotationAdded', onDotStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).removeEventListener('annotationAdded', onRubberStampAnnotationAdded);
      core.getTool('AnnotationCreateFileAttachment', documentViewerKey).removeEventListener('annotationAdded', onFileAttachmentAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CROSS, documentViewerKey).removeEventListener('annotationAdded', onCrossStampAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CHECKMARK, documentViewerKey).removeEventListener('annotationAdded', onCheckStampAnnotationAdded);
      !skipHotkeys && hotkeysManager.off();
    },
  };
};
