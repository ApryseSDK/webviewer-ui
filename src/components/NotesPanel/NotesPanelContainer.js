import React, { useEffect, useState, useCallback } from 'react';
/* eslint-disable custom/use-core-hook-in-components */
import core from 'core';
import NotesPanel from './NotesPanel';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import NotesPanelErrorBoundary from './NotesPanelErrorBoundary';

const getPanelDataElement = ({ parentDataElement, dataElement }) => parentDataElement || dataElement || DataElements.NOTES_PANEL;

function NotesPanelContainer(props) {
  const { isCustomPanelOpen, parentDataElement = undefined, dataElement } = props;
  const panelDataElement = getPanelDataElement({ parentDataElement, dataElement });
  const [
    isOpen,
    notesInLeftPanel,
    isNotesPanelMultiSelectEnabled,
    isMultiViewerMode,
    activeDocumentViewerKey,
    isOfficeEditorMode,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, panelDataElement),
      selectors.getNotesInLeftPanel(state),
      selectors.getIsNotesPanelMultiSelectEnabled(state),
      selectors.isMultiViewerMode(state),
      selectors.getActiveDocumentViewerKey(state),
      selectors.getIsOfficeEditorMode(state),
    ],
    shallowEqual,
  );
  const [searchInput, setSearchInput] = useState('');
  const [isMultiSelectMode, setMultiSelectMode] = useState(false);
  const [scrollToSelectedAnnot, setScrollToSelectedAnnot] = useState(false);

  const [noteMap, setNoteMap] = useState({ 1: [], 2: [] });
  const setNotes = useCallback((notes, documentViewerKey = activeDocumentViewerKey) => {
    noteMap[documentViewerKey] = notes;
    setNoteMap({ ...noteMap });
  }, [activeDocumentViewerKey, noteMap[1], noteMap[2], setNoteMap]);
  const notes = noteMap[activeDocumentViewerKey] || noteMap[1];

  // the object will be in a shape of { [note.Id]: true }
  // use a map here instead of an array to achieve an O(1) time complexity for checking if a note is selected
  const [selectedNoteIdsMap, setSelectedNoteIdsMap] = useState({ 1: {}, 2: {}, });
  const setSelectedNoteIds = useCallback((selectedNoteIds, documentViewerKey = activeDocumentViewerKey) => {
    selectedNoteIdsMap[documentViewerKey] = selectedNoteIds;
    setSelectedNoteIdsMap({ ...selectedNoteIdsMap });
  }, [activeDocumentViewerKey, selectedNoteIdsMap[1], selectedNoteIdsMap[2], setSelectedNoteIdsMap]);
  const selectedNoteIds = selectedNoteIdsMap[activeDocumentViewerKey] || selectedNoteIdsMap[1];

  const [multiSelectedViewerMap, setMultiSelectedViewerMap] = useState({ 1: {}, 2: {}, });
  const setMultiSelectedMap = useCallback((isMultiSelected, documentViewerKey = activeDocumentViewerKey) => {
    multiSelectedViewerMap[documentViewerKey] = isMultiSelected;
    setMultiSelectedViewerMap({ ...multiSelectedViewerMap });
  }, [activeDocumentViewerKey, multiSelectedViewerMap[1], multiSelectedViewerMap[2], setMultiSelectedViewerMap]);
  const multiSelectedMap = multiSelectedViewerMap[activeDocumentViewerKey] || multiSelectedViewerMap[1];

  const isValidAnnotation = (annot) => {
    const annotationManager = core.getAnnotationManager();
    const formFieldCreationManager = annotationManager.getFormFieldCreationManager();
    const isWidgetAnnotation = annot instanceof window.Core.Annotations.WidgetAnnotation;

    const isListableAnnotation = annot.Listable && !isWidgetAnnotation;
    const isInFormCreationMode = isWidgetAnnotation && formFieldCreationManager.isInFormFieldCreationMode();
    const annotationKey = mapAnnotationToKey(annot);
    const isOfficeEditorComment = dataElement === DataElements.OFFICE_EDITOR_COMMENT_PANEL && annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;
    const isTrackedChange = dataElement === DataElements.OFFICE_EDITOR_REVIEW_PANEL && annotationKey === annotationMapKeys.TRACKED_CHANGE;
    const isValidForOfficeEditor = !isOfficeEditorMode || isOfficeEditorComment || isTrackedChange;

    return (
      (isListableAnnotation || isInFormCreationMode) &&
      !annot.isReply() &&
      !annot.Hidden &&
      !annot.isGrouped() &&
      annot.ToolName !== window.Core.Tools.ToolNames.CROP &&
      !annot.isContentEditPlaceholder() &&
      isValidForOfficeEditor
    );
  };

  useEffect(() => {
    const onDocumentUnloaded = (documentViewerKey = activeDocumentViewerKey) => () => {
      setNotes([], documentViewerKey);
      setSelectedNoteIds({});
      setSearchInput('');
    };
    const _setNotes = (documentViewerKey = activeDocumentViewerKey) => () => {
      const selectedAnnotations = core.getSelectedAnnotations(documentViewerKey);
      const groupedAnnots = getGroupedAnnots(selectedAnnotations);
      const shouldDisplayMultiSelect = (selectedAnnotations.length > 1 && groupedAnnots.length !== selectedAnnotations.length) || isMultiSelectMode;

      if (isNotesPanelMultiSelectEnabled && shouldDisplayMultiSelect) {
        setMultiSelectMode(true);
        selectedAnnotations.forEach((selectedAnnot) => {
          multiSelectedMap[selectedAnnot.Id] = selectedAnnot;
        });
        setMultiSelectedMap({ ...multiSelectedMap }, documentViewerKey);
      }

      if (isMultiSelectMode && groupedAnnots.length === selectedAnnotations.length) {
        setMultiSelectMode(false);
      }

      setNotes(
        core
          .getAnnotationsList(documentViewerKey)
          .filter(isValidAnnotation),
        documentViewerKey,
      );
    };

    const setDocumentUnloaded1 = onDocumentUnloaded(1);
    core.addEventListener('documentUnloaded', setDocumentUnloaded1);
    const setNotes1 = _setNotes(1);
    core.addEventListener('annotationChanged', setNotes1);
    core.addEventListener('annotationHidden', setNotes1);
    core.addEventListener('updateAnnotationPermission', setNotes1);
    setNotes1();

    let setDocumentUnloaded2;
    let setNotes2;
    if (isMultiViewerMode) {
      setDocumentUnloaded2 = onDocumentUnloaded(2);
      core.addEventListener('documentUnloaded', setDocumentUnloaded2, undefined, 2);
      setNotes2 = _setNotes(2);
      core.addEventListener('annotationChanged', setNotes2, undefined, 2);
      core.addEventListener('annotationHidden', setNotes2, undefined, 2);
      core.addEventListener('updateAnnotationPermission', setNotes2, undefined, 2);
      setNotes2();
    }

    return () => {
      if (isMultiViewerMode) {
        core.removeEventListener('documentUnloaded', setDocumentUnloaded2, 2);
        core.removeEventListener('annotationChanged', setNotes2, 2);
        core.removeEventListener('annotationHidden', setNotes2, 2);
        core.removeEventListener('updateAnnotationPermission', setNotes2, 2);
      }
      core.removeEventListener('documentUnloaded', setDocumentUnloaded1);
      core.removeEventListener('annotationChanged', setNotes1);
      core.removeEventListener('annotationHidden', setNotes1);
      core.removeEventListener('updateAnnotationPermission', setNotes1);
    };
  }, [isMultiViewerMode, isOfficeEditorMode]);

  useEffect(() => {
    const onAnnotationSelected = (documentViewerKey = activeDocumentViewerKey) => (annotations, action) => {
      const selectedAnnotations = core.getSelectedAnnotations(documentViewerKey);
      const ids = {};
      selectedAnnotations.forEach((annot) => {
        ids[annot.Id] = true;
      });
      if (isCustomPanelOpen || isOpen || notesInLeftPanel) {
        setSelectedNoteIds(ids, documentViewerKey);
        setScrollToSelectedAnnot(true);
      }
      const groupedAnnots = getGroupedAnnots(selectedAnnotations);
      const shouldDisplayMultiSelect = (selectedAnnotations.length > 1 && groupedAnnots.length !== selectedAnnotations.length) || isMultiSelectMode;

      if (isNotesPanelMultiSelectEnabled
        && action === 'selected'
        && shouldDisplayMultiSelect) {
        setMultiSelectMode(true);
        selectedAnnotations.forEach((selectedAnnot) => {
          multiSelectedMap[selectedAnnot.Id] = selectedAnnot;
        });
        setMultiSelectedMap({ ...multiSelectedMap }, documentViewerKey);
      } else if (action === 'deselected') {
        annotations.forEach((a) => {
          delete multiSelectedMap[a.Id];
        });
        setMultiSelectedMap({ ...multiSelectedMap }, documentViewerKey);
      }
    };
    const onAnnotationSelected1 = onAnnotationSelected(1);
    onAnnotationSelected1();
    core.addEventListener('annotationSelected', onAnnotationSelected1);
    let onAnnotationSelected2;
    if (isMultiViewerMode) {
      onAnnotationSelected2 = onAnnotationSelected(2);
      onAnnotationSelected2();
      core.addEventListener('annotationSelected', onAnnotationSelected2, undefined, 2);
    }
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected1);
      if (isMultiViewerMode) {
        core.removeEventListener('annotationSelected', onAnnotationSelected2, 2);
      }
    };
  }, [isCustomPanelOpen, isOpen, notesInLeftPanel, isMultiSelectMode, multiSelectedMap, isNotesPanelMultiSelectEnabled, isMultiViewerMode]);

  // Exit multi-select mode when multi-select is disabled via API
  useEffect(() => {
    if (!isNotesPanelMultiSelectEnabled && isMultiSelectMode) {
      setMultiSelectMode(false);
      core.getAnnotationManager().deselectAnnotations(core.getSelectedAnnotations(), activeDocumentViewerKey);
    }
  }, [isNotesPanelMultiSelectEnabled]);

  function getGroupedAnnots(selectedAnnotations) {
    const mainAnnot = selectedAnnotations.find((annot) => annot.isGrouped());
    const groupedAnnots = [];

    // check if all selected annots are grouped annotations
    if (mainAnnot) {
      selectedAnnotations.forEach((annot) => {
        if (mainAnnot['InReplyTo'] === annot['InReplyTo']
          || mainAnnot['InReplyTo'] === annot['Id']) {
          groupedAnnots.push(annot);
        }
      });
    }
    return groupedAnnots;
  }

  const passProps = {
    notes,
    selectedNoteIds,
    setSelectedNoteIds,
    searchInput,
    setSearchInput,
    isMultiSelectMode,
    setMultiSelectMode,
    multiSelectedMap,
    setMultiSelectedMap,
    scrollToSelectedAnnot,
    setScrollToSelectedAnnot,
  };

  return <NotesPanel {...props} {...passProps} />;
}

function NotesPanelWrapper(props) {
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const panelDataElement = getPanelDataElement(props);
  const boundaryResetKey = `${activeDocumentViewerKey}-${panelDataElement}`;

  return (
    <MultiViewerWrapper wrapOnlyInMultiViewerMode>
      <NotesPanelErrorBoundary
        resetKey={boundaryResetKey}
      >
        <NotesPanelContainer {...props}/>
      </NotesPanelErrorBoundary>
    </MultiViewerWrapper>
  );
}

export default NotesPanelWrapper;
