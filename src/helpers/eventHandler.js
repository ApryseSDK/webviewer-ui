import * as eventListeners from 'src/event-listeners';
import hotkeysManager from 'helpers/hotkeysManager';
import core from 'core';
import Events from 'constants/events';

const { ToolNames } = window.Core.Tools;

export default (store, documentViewerKey = 1, skipHotkeys = false) => {
  const { dispatch } = store;
  // TODO Compare: Add event handlers for panels and refactor code for panels
  const onBeforeDocumentLoaded = eventListeners.onBeforeDocumentLoaded(dispatch, documentViewerKey);
  const onCheckStampAnnotationAdded = eventListeners.onCheckStampAnnotationAdded(dispatch, documentViewerKey);
  const onCrossStampAnnotationAdded = eventListeners.onCrossStampAnnotationAdded(dispatch, documentViewerKey);
  const onDisplayModeUpdated = eventListeners.onDisplayModeUpdated(dispatch);
  const onDocumentLoaded = eventListeners.onDocumentLoaded(store, documentViewerKey);
  const enableRedactionElements = eventListeners.enableRedactionElements(dispatch);
  const addPageLabelsToRedux = eventListeners.addPageLabelsToRedux(store, documentViewerKey);
  const handlePasswordModal = eventListeners.handlePasswordModal(dispatch, documentViewerKey);
  const showProgressModal = eventListeners.showProgressModal(dispatch);
  const setPrintHandler = eventListeners.setPrintHandler(store, documentViewerKey);
  const toggleAnnotations = eventListeners.toggleAnnotations();
  const setServerProperties = eventListeners.setServerProperties();
  const checkDocumentForTools = eventListeners.checkDocumentForTools(dispatch);
  const updateOutlines = eventListeners.updateOutlines(dispatch, documentViewerKey);
  const updatePortfolioAndLayers = eventListeners.updatePortfolioAndLayers(store);
  const configureOfficeEditor = eventListeners.configureOfficeEditor(store);
  const onDocumentUnloaded = eventListeners.onDocumentUnloaded(dispatch, store, documentViewerKey);
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
  const onRubberStampAnnotationAdded = eventListeners.onRubberStampAnnotationAdded(documentViewerKey, dispatch, store);
  const onRubberStampsUpdated = eventListeners.onRubberStampsUpdated(dispatch);
  const onReadOnlyModeChanged = eventListeners.onReadOnlyModeChanged(dispatch, store);
  const onPageComplete = eventListeners.onPageComplete(store, documentViewerKey);
  const onFileAttachmentAnnotationAdded = eventListeners.onFileAttachmentAnnotationAdded();
  const onFileAttachmentDataAvailable = eventListeners.onFileAttachmentDataAvailable();
  const onSignatureSaved = eventListeners.onSignatureSaved(dispatch, store);
  const onSignatureDeleted = eventListeners.onSignatureDeleted(dispatch, store);
  const onHistoryChanged = eventListeners.onHistoryChanged(dispatch, documentViewerKey);
  const onFormFieldCreationModeStarted = eventListeners.onFormFieldCreationModeStarted(dispatch, store, hotkeysManager);
  const onFormFieldCreationModeEnded = eventListeners.onFormFieldCreationModeEnded(dispatch, store, hotkeysManager);
  const onDigitalSignatureAvailable = eventListeners.onDigitalSignatureAvailable(dispatch, documentViewerKey);
  const onImageContentAdded = eventListeners.onImageContentAdded(dispatch);
  const onInitialSaved = eventListeners.onInitialSaved(dispatch, store);
  const onInitialDeleted = eventListeners.onInitialDeleted(dispatch, store);
  const onContentEditModeStarted = eventListeners.onContentEditModeStarted(dispatch, store);
  const onContentEditModeEnded = eventListeners.onContentEditModeEnded(dispatch, store);
  const onContentBoxEditStarted = eventListeners.onContentBoxEditStarted(dispatch, hotkeysManager);
  const onContentBoxEditEnded = eventListeners.onContentBoxEditEnded(hotkeysManager);
  const onContentEditDocumentDigitalSigned = eventListeners.onContentEditDocumentDigitalSigned(dispatch);
  const onContentEditPasswordRequired = eventListeners.onContentEditPasswordRequired(dispatch, store);
  const onCompareAnnotationsLoaded = eventListeners.onCompareAnnotationsLoaded(dispatch, store);
  const onAccessibleReadingOrderModeStarted = eventListeners.onAccessibleReadingOrderModeStarted(dispatch, store);
  const onAccessibleReadingOrderModeReady = eventListeners.onAccessibleReadingOrderModeReady(dispatch, store);
  const onAccessibleReadingOrderModeEnded = eventListeners.onAccessibleReadingOrderModeEnded(dispatch, store);
  const onAccessibleReadingOrderModeNoStructure = eventListeners.onAccessibleReadingOrderModeNoStructure(dispatch, store);
  const onUserBookmarksChanged = eventListeners.onUserBookmarksChanged(dispatch);
  const onSpreadsheetEditorSelectionChanged = eventListeners.onSpreadsheetEditorSelectionChanged(dispatch);
  const onSpreadsheetEditorEditModeChanged = eventListeners.onSpreadsheetEditorEditModeChanged(dispatch);
  const openSpreadsheetEditorLoadingModal = eventListeners.openSpreadsheetEditorLoadingModal(dispatch);
  const closeSpreadsheetEditorLoadingModal = eventListeners.closeSpreadsheetEditorLoadingModal(dispatch, store);
  const onWidgetHighlightingChanged = eventListeners.onWidgetHighlightingChanged(dispatch, store);
  const onSelectedRangeStyleChanged = eventListeners.onSelectedRangeStyleChanged(dispatch);

  return {
    addEventHandlers: () => {
      if (documentViewerKey === 1) {
        core.addEventListener('documentLoaded', enableRedactionElements, { once: true }, documentViewerKey);
        core.addEventListener('documentLoaded', addPageLabelsToRedux, undefined, documentViewerKey);
        core.addEventListener('documentLoaded', checkDocumentForTools, undefined, documentViewerKey);
        core.addEventListener('documentLoaded', updateOutlines, undefined, documentViewerKey);
        core.addEventListener('documentLoaded', updatePortfolioAndLayers, undefined, documentViewerKey);
        core.addEventListener('documentLoaded', configureOfficeEditor, undefined, documentViewerKey);
        core.addEventListener('readOnlyModeChanged', onReadOnlyModeChanged, undefined, documentViewerKey);
        core.addEventListener('formFieldCreationModeEnded', onFormFieldCreationModeEnded);
        core.addEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted);
        core.addEventListener('contentEditModeStarted', onContentEditModeStarted);
        core.addEventListener('contentEditDocumentDigitallySigned', onContentEditDocumentDigitalSigned);
        core.addEventListener('contentEditModeEnded', onContentEditModeEnded);
        core.addEventListener('contentBoxEditStarted', onContentBoxEditStarted);
        core.addEventListener('contentBoxEditEnded', onContentBoxEditEnded);
        core.addEventListener('contentEditPasswordRequired', onContentEditPasswordRequired);
        core.addEventListener('toolUpdated', onToolUpdated, undefined, documentViewerKey);
        core.addEventListener('toolModeUpdated', onToolModeUpdated, undefined, documentViewerKey);
        core.addEventListener('accessibleReadingOrderModeStarted', onAccessibleReadingOrderModeStarted);
        core.addEventListener('accessibleReadingOrderModeReady', onAccessibleReadingOrderModeReady);
        core.addEventListener('accessibleReadingOrderModeEnded', onAccessibleReadingOrderModeEnded);
        core.addEventListener('accessibleReadingOrderModeNoStructure', onAccessibleReadingOrderModeNoStructure);
        core.addEventListener('selectionChanged', onSpreadsheetEditorSelectionChanged);
        core.addEventListener('selectedRangeStyleChanged', onSelectedRangeStyleChanged);
        core.addEventListener('spreadsheetEditorEditModeChanged', onSpreadsheetEditorEditModeChanged);
        core.addEventListener('spreadsheetEditorLoaded', openSpreadsheetEditorLoadingModal);
        core.addEventListener('spreadsheetEditorReady', closeSpreadsheetEditorLoadingModal);
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
        core.addEventListener(Events.COMPARE_ANNOTATIONS_LOADED, onCompareAnnotationsLoaded, undefined, documentViewerKey);
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
      core.addEventListener('documentLoaded', handlePasswordModal, undefined, documentViewerKey);
      core.addEventListener('documentLoaded', showProgressModal, undefined, documentViewerKey);
      core.addEventListener('documentLoaded', setPrintHandler, undefined, documentViewerKey);
      core.addEventListener('documentLoaded', toggleAnnotations, undefined, documentViewerKey);
      core.addEventListener('documentLoaded', setServerProperties, undefined, documentViewerKey);
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
      core.addEventListener('userBookmarksChanged', onUserBookmarksChanged);
      core.addEventListener('widgetHighlightingChanged', onWidgetHighlightingChanged, undefined, documentViewerKey);
      core.getTool('AnnotationCreateStamp', documentViewerKey).addEventListener('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('locationSelected', onLocationSelected);
      core.getTool('AnnotationCreateSignature', documentViewerKey).addEventListener('annotationAdded', onSignatureAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_DOT, documentViewerKey).addEventListener('annotationAdded', onDotStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).addEventListener('annotationAdded', onRubberStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).addEventListener('stampsUpdated', onRubberStampsUpdated);
      core.getTool('AnnotationCreateFileAttachment', documentViewerKey).addEventListener('annotationAdded', onFileAttachmentAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CROSS, documentViewerKey).addEventListener('annotationAdded', onCrossStampAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CHECKMARK, documentViewerKey).addEventListener('annotationAdded', onCheckStampAnnotationAdded);
    },
    removeEventHandlers: () => {
      if (documentViewerKey === 1) {
        core.removeEventListener('documentLoaded', enableRedactionElements, documentViewerKey);
        core.removeEventListener('documentLoaded', addPageLabelsToRedux, documentViewerKey);
        core.removeEventListener('documentLoaded', checkDocumentForTools, documentViewerKey);
        core.removeEventListener('documentLoaded', updateOutlines, documentViewerKey);
        core.removeEventListener('documentLoaded', updatePortfolioAndLayers, documentViewerKey);
        core.removeEventListener('documentLoaded', configureOfficeEditor, documentViewerKey);
        core.removeEventListener('formFieldCreationModeStarted', onFormFieldCreationModeStarted, documentViewerKey);
        core.removeEventListener('formFieldCreationModeEnded', onFormFieldCreationModeEnded, documentViewerKey);
        core.removeEventListener('contentEditModeStarted', onContentEditModeStarted);
        core.removeEventListener('contentEditDocumentDigitallySigned', onContentEditDocumentDigitalSigned);
        core.removeEventListener('contentEditModeEnded', onContentEditModeEnded);
        core.removeEventListener('contentBoxEditStarted', onContentBoxEditStarted);
        core.removeEventListener('contentBoxEditEnded', onContentBoxEditEnded);
        core.removeEventListener('contentEditPasswordRequired', onContentEditPasswordRequired);
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
        core.removeEventListener(Events.COMPARE_ANNOTATIONS_LOADED, onCompareAnnotationsLoaded, documentViewerKey);
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
        core.removeEventListener('selectionChanged', onSpreadsheetEditorSelectionChanged);
        core.removeEventListener('selectedRangeStyleChanged', onSelectedRangeStyleChanged);
        core.removeEventListener('spreadsheetEditorEditModeChanged', onSpreadsheetEditorEditModeChanged);
        core.removeEventListener('spreadsheetEditorLoaded', openSpreadsheetEditorLoadingModal);
        core.removeEventListener('spreadsheetEditorReady', closeSpreadsheetEditorLoadingModal);
      }
      core.removeEventListener('documentLoaded', handlePasswordModal, documentViewerKey);
      core.removeEventListener('documentLoaded', showProgressModal, documentViewerKey);
      core.removeEventListener('documentLoaded', setPrintHandler, documentViewerKey);
      core.removeEventListener('documentLoaded', toggleAnnotations, documentViewerKey);
      core.removeEventListener('documentLoaded', setServerProperties, documentViewerKey);
      core.removeEventListener('beforeDocumentLoaded', onBeforeDocumentLoaded, documentViewerKey);
      core.removeEventListener('displayModeUpdated', onDisplayModeUpdated, documentViewerKey);
      core.removeEventListener('documentLoaded', onDocumentLoaded, documentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded, documentViewerKey);
      core.removeEventListener('zoomUpdated', onZoomUpdated, documentViewerKey);
      core.removeEventListener('annotationChanged', onAnnotationChanged, documentViewerKey);
      core.removeEventListener('pageComplete', onPageComplete, documentViewerKey);
      core.removeEventListener('fileAttachmentDataAvailable', onFileAttachmentDataAvailable, documentViewerKey);
      core.removeEventListener('digitalSignatureAvailable', onDigitalSignatureAvailable, documentViewerKey);
      core.removeEventListener('userBookmarksChanged', onUserBookmarksChanged, documentViewerKey);
      core.removeEventListener('widgetHighlightingChanged', onWidgetHighlightingChanged, documentViewerKey);
      core.getTool('AnnotationCreateStamp', documentViewerKey).removeEventListener('annotationAdded', onStampAnnotationAdded);
      core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('locationSelected', onLocationSelected);
      core.getTool('AnnotationCreateSignature', documentViewerKey).removeEventListener('annotationAdded', onSignatureAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_DOT, documentViewerKey).removeEventListener('annotationAdded', onDotStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).removeEventListener('annotationAdded', onRubberStampAnnotationAdded);
      core.getTool('AnnotationCreateRubberStamp', documentViewerKey).removeEventListener('stampsUpdated', onRubberStampsUpdated);
      core.getTool('AnnotationCreateFileAttachment', documentViewerKey).removeEventListener('annotationAdded', onFileAttachmentAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CROSS, documentViewerKey).removeEventListener('annotationAdded', onCrossStampAnnotationAdded);
      core.getTool(ToolNames.FORM_FILL_CHECKMARK, documentViewerKey).removeEventListener('annotationAdded', onCheckStampAnnotationAdded);
      !skipHotkeys && hotkeysManager.off();
    },
  };
};
