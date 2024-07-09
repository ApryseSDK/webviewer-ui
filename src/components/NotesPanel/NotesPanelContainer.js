import React, { useEffect, useState, useCallback } from 'react';
import core from 'core';
import NotesPanel from './NotesPanel';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';

function NotesPanelContainer(props) {
  const { isCustomPanelOpen, parentDataElement = undefined, dataElement } = props;
  const [
    isOpen,
    notesInLeftPanel,
    isNotesPanelMultiSelectEnabled,
    isMultiViewerMode,
    activeDocumentViewerKey,
    isOfficeEditorMode,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, parentDataElement || dataElement || DataElements.NOTES_PANEL),
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

  const [isMultiSelectedViewerMap, setIsMultiSelectedViewerMap] = useState({ 1: {}, 2: {}, });
  const setIsMultiSelectedMap = useCallback((isMultiSelected, documentViewerKey = activeDocumentViewerKey) => {
    isMultiSelectedViewerMap[documentViewerKey] = isMultiSelected;
    setIsMultiSelectedViewerMap({ ...isMultiSelectedViewerMap });
  }, [activeDocumentViewerKey, isMultiSelectedViewerMap[1], isMultiSelectedViewerMap[2], setIsMultiSelectedViewerMap]);
  const isMultiSelectedMap = isMultiSelectedViewerMap[activeDocumentViewerKey] || isMultiSelectedViewerMap[1];

  useEffect(() => {
    const onDocumentUnloaded = (documentViewerKey = activeDocumentViewerKey) => () => {
      setNotes([], documentViewerKey);
      setSelectedNoteIds({});
      setSearchInput('');
    };
    const _setNotes = (documentViewerKey = activeDocumentViewerKey) => () => {
      const selectedAnnotations = core.getSelectedAnnotations(documentViewerKey);
      const groupedAnnots = getGroupedAnnots(selectedAnnotations);

      if (isMultiSelectMode && groupedAnnots.length === selectedAnnotations.length) {
        setMultiSelectMode(false);
      }

      setNotes(
        core
          .getAnnotationsList(documentViewerKey)
          .filter(
            (annot) => annot.Listable &&
              !annot.isReply() &&
              !annot.Hidden &&
              !annot.isGrouped() &&
              annot.ToolName !== window.Core.Tools.ToolNames.CROP &&
              !annot.isContentEditPlaceholder() &&
              (!isOfficeEditorMode || mapAnnotationToKey(annot) === annotationMapKeys.TRACKED_CHANGE),
          ),
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
          isMultiSelectedMap[selectedAnnot.Id] = selectedAnnot;
        });
        setIsMultiSelectedMap({ ...isMultiSelectedMap }, documentViewerKey);
      } else if (action === 'deselected') {
        annotations.forEach((a) => {
          delete isMultiSelectedMap[a.Id];
        });
        setIsMultiSelectedMap({ ...isMultiSelectedMap }, documentViewerKey);
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
  }, [isCustomPanelOpen, isOpen, notesInLeftPanel, isMultiSelectMode, isMultiSelectedMap, isNotesPanelMultiSelectEnabled, isMultiViewerMode]);

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
    isMultiSelectedMap,
    setIsMultiSelectedMap,
    scrollToSelectedAnnot,
    setScrollToSelectedAnnot,
  };

  // We wrap the element in a div so the tooltip works properly
  return (
    <NotesPanel {...props} {...passProps} />
  );
}

export default NotesPanelContainer;
