import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import VirtualizedList from 'components/NotesPanel/VirtualizedList';
import NormalList from 'components/NotesPanel/NormalList';
import Note from 'components/Note';
import Icon from 'components/Icon';
import NoteContext from 'components/Note/Context';
import ListSeparator from 'components/ListSeparator';
import MultiSelectControls from 'components/MultiSelectControls';
import CustomElement from 'components/CustomElement';
import NotesPanelHeader from 'components/NotesPanelHeader';
import Choice from 'components/Choice';
/* eslint-disable custom/use-core-hook-in-components */
import core from 'core';
import DataElements from 'constants/dataElement';
import getNotesPanelSortStrategy from 'helpers/getNotesPanelSortStrategy';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { SpreadsheetEditorEditMode, SPREADSHEET_SHEET_NAME_KEY, SPREADSHEET_SHEET_INDEX_KEY, SPREADSHEET_ROW_KEY, SPREADSHEET_COLUMN_KEY, SPREADSHEET_THREAD_ID_KEY } from 'constants/spreadsheetEditor';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import getNotesPanelConfig from 'helpers/getNotesPanelConfig';
import actions from 'actions';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import { isIE } from 'helpers/device';
import findExistingSpreadsheetCommentAtCell from 'helpers/findExistingSpreadsheetCommentAtCell';
import useSpreadsheetActiveSheetIndex from 'hooks/useSpreadsheetActiveSheetIndex';
import ReplyAttachmentPicker from './ReplyAttachmentPicker';
import CommentPanelFooter from './CommentPanelFooter';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';

import './NotesPanel.scss';

const NotesPanel = ({
  parentDataElement,
  dataElement = DataElements.NOTES_PANEL,
  notes,
  selectedNoteIds,
  setSelectedNoteIds,
  scrollToSelectedAnnot,
  setScrollToSelectedAnnot,
  searchInput,
  setSearchInput,
  isMultiSelectMode,
  setMultiSelectMode,
  multiSelectedMap,
  setMultiSelectedMap,
  isCustomPanel,
  isCustomPanelOpen,
  isLeftSide,
  currentLeftPanelWidth,
}) => {
  const sortStrategy = useSelector(selectors.getSortStrategy);
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.NOTES_PANEL));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.NOTES_PANEL));
  const pageLabels = useSelector(selectors.getPageLabels, shallowEqual);
  const customNoteFilter = useSelector(selectors.getCustomNoteFilter, shallowEqual);
  const internalNoteFilter = useSelector(selectors.getInternalNoteFilter, shallowEqual);
  const currentNotesPanelWidth = useSelector((state) => parentDataElement ? selectors.getPanelWidth(state, parentDataElement) : selectors.getNotesPanelWidth(state), shallowEqual);
  const notesInLeftPanel = useSelector(selectors.getNotesInLeftPanel);
  const isDocumentReadOnly = useSelector(selectors.isDocumentReadOnly);
  const showAnnotationNumbering = useSelector(selectors.isAnnotationNumberingEnabled);
  const enableNotesPanelVirtualizedList = useSelector(selectors.getEnableNotesPanelVirtualizedList);
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const customEmptyPanel = useSelector(selectors.getNotesPanelCustomEmptyPanel, shallowEqual);
  const isNotesPanelMultiSelectEnabled = useSelector(selectors.getIsNotesPanelMultiSelectEnabled);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isOfficeEditorMode = useSelector(selectors.getIsOfficeEditorMode);
  const isSpreadsheetEditorMode = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const officeEditorEditMode = useSelector(selectors.getOfficeEditorEditMode);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const activeCellRangeTopLeftRow = useSelector(selectors.getActiveCellRangeTopLeftRow);
  const activeCellRangeTopLeftColumn = useSelector(selectors.getActiveCellRangeTopLeftColumn);
  const notesPanelConfig = getNotesPanelConfig(dataElement);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const currentWidth = currentLeftPanelWidth || currentNotesPanelWidth;
  const isMobile = isMobileSize();

  const activeSheetIndex = useSpreadsheetActiveSheetIndex(isSpreadsheetEditorMode);

  const [multiSelectedAnnotations, setMultiSelectedAnnotations] = useState([]);
  const [showMultiReply, setShowMultiReply] = useState(false);
  const [showMultiState, setShowMultiState] = useState(false);
  const [showMultiStyle, setShowMultiStyle] = useState(false);
  const [curAnnotId, setCurAnnotId] = useState(undefined);

  const listRef = useRef();
  // a ref that is used to keep track of the current scroll position
  // when the number of notesToRender goes over/below the threshold, we will unmount the current list and mount the other one
  // this will result in losing the scroll position and we will use this ref to recover
  const scrollTopRef = useRef(0);
  const VIRTUALIZATION_THRESHOLD = enableNotesPanelVirtualizedList ? (isIE ? 25 : 100) : Infinity;

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        setCurAnnotId(annotations[0].Id);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  let singleSelectedNoteIndex = -1;

  const handleScroll = (scrollTop) => {
    if (scrollTop) {
      scrollTopRef.current = scrollTop;
    }
    dispatch(actions.closeElement('annotationNoteConnectorLine'));
  };

  const noteMatchesSearchNumber = (note, searchedNumber) => {
    const annotationNumber = note.getCustomData('trn-associated-number', activeDocumentViewerKey);

    if (
      annotationNumber === null ||
      annotationNumber === undefined ||
      (typeof annotationNumber === 'string' && annotationNumber.trim() === '')
    ) {
      return false;
    }

    const parsedAnnotationNumber = Number(annotationNumber);

    return !Number.isNaN(parsedAnnotationNumber) && parsedAnnotationNumber === searchedNumber;
  };

  const prioritizeNotesBySearchedNumber = (notes) => {
    if (!showAnnotationNumbering) {
      return notes;
    }

    const normalizedSearchInput = String(searchInput ?? '').trim();
    if (normalizedSearchInput === '') {
      return notes;
    }

    const searchedNumber = Number(normalizedSearchInput);
    if (Number.isNaN(searchedNumber)) {
      return notes;
    }

    const matched = [];
    const unmatched = [];

    for (const note of notes) {
      (noteMatchesSearchNumber(note, searchedNumber) ? matched : unmatched).push(note);
    }

    return [...matched, ...unmatched];
  };

  const filterNotesWithSearch = (note) => {
    const content = note.getContents();
    const authorName = core.getDisplayAuthor(note['Author']);
    const annotationPreview = note.getCustomData('trn-annot-preview');
    const annotationNumber = note.getCustomData('trn-associated-number', activeDocumentViewerKey);
    const annotationNumberText = annotationNumber === null || annotationNumber === undefined ? '' : String(annotationNumber);

    // didn't use regex here because the search input may form an invalid regex, e.g. *
    return (
      content?.toLowerCase().includes(searchInput.toLowerCase()) ||
      authorName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      annotationPreview?.toLowerCase().includes(searchInput.toLowerCase()) ||
      annotationNumberText.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const filterNote = (note) => {
    let shouldRender = true;

    if (customNoteFilter) {
      shouldRender = shouldRender && customNoteFilter(note);
    }

    if (internalNoteFilter) {
      shouldRender = shouldRender && internalNoteFilter(note);
    }

    if (searchInput) {
      const replies = note.getReplies();
      // reply is also a kind of annotation
      // https://docs.apryse.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
      const noteAndReplies = [note, ...replies];

      shouldRender = shouldRender && noteAndReplies.some(filterNotesWithSearch);
    }
    return shouldRender;
  };

  const activeSortStrategy = getNotesPanelSortStrategy(sortStrategy);
  const sortOptions = { pageLabels, t, documentViewerKey: activeDocumentViewerKey };
  const filteredSortedNotes = activeSortStrategy.getSortedNotes(notes, sortOptions).filter(filterNote);
  if (isSpreadsheetEditorMode) {
    // Spreadsheet comments are sorted top-to-bottom, left-to-right within a sheet,
    // using the numeric row/column indices the annotation already carries (no need to
    // re-derive them from the display cell string, e.g. "A1").
    filteredSortedNotes.sort((a, b) => {
      const sheetIndexA = Number.parseInt(a.getCustomData(SPREADSHEET_SHEET_INDEX_KEY), 10) || 0;
      const sheetIndexB = Number.parseInt(b.getCustomData(SPREADSHEET_SHEET_INDEX_KEY), 10) || 0;

      if (sheetIndexA !== sheetIndexB) {
        return sheetIndexA - sheetIndexB;
      }

      const rowA = Number.parseInt(a.getCustomData(SPREADSHEET_ROW_KEY), 10) || 0;
      const rowB = Number.parseInt(b.getCustomData(SPREADSHEET_ROW_KEY), 10) || 0;

      if (rowA !== rowB) {
        return rowA - rowB;
      }

      const columnA = Number.parseInt(a.getCustomData(SPREADSHEET_COLUMN_KEY), 10) || 0;
      const columnB = Number.parseInt(b.getCustomData(SPREADSHEET_COLUMN_KEY), 10) || 0;

      return columnA - columnB;
    });
  }
  const notesToRender = prioritizeNotesBySearchedNumber(filteredSortedNotes);

  // The existing comment thread's root note at the cell that would receive a new comment
  // (the top-left cell of the current selection, whether it's a single cell or a
  // multi-cell range), if any. Used so "Add Comment" replies to the existing thread
  // instead of creating a second, competing comment on the same cell.
  // Memoized since its dependencies (notes, active sheet/cell) change far less often than
  // the component re-renders (e.g. typing in the search box shouldn't recompute this).
  const existingCommentAtSelectedCell = useMemo(() => {
    if (!isSpreadsheetEditorMode) {
      return null;
    }

    return findExistingSpreadsheetCommentAtCell({
      notes,
      activeSheetIndex,
      topLeftRow: activeCellRangeTopLeftRow,
      topLeftColumn: activeCellRangeTopLeftColumn,
    });
  }, [isSpreadsheetEditorMode, notes, activeSheetIndex, activeCellRangeTopLeftRow, activeCellRangeTopLeftColumn]);

  useEffect(() => {
    if (Object.keys(selectedNoteIds).length && singleSelectedNoteIndex !== -1) {
      setTimeout(() => {
        // wait for the previous selected annotation to resize() after closing before scrolling to the newly selected one
        listRef.current?.scrollToRow(singleSelectedNoteIndex);
      }, 0);
    }
  }, [selectedNoteIds]);

  // expand a reply note when search content is match
  const onlyReplyContainsSearchInput = (currNote) => {
    if (Object.keys(selectedNoteIds).length) {
      return false;
    }
    return (
      searchInput &&
      notesToRender
        .filter((note) => {
          return note.getReplies().some(filterNotesWithSearch);
        })
        .some((replies) => replies.Id === currNote.Id)
    );
  };

  const [pendingEditTextMap, setPendingEditTextMap] = useState({});
  const setPendingEditText = useCallback(
    (pendingText, annotationID) => {
      setPendingEditTextMap((map) => ({
        ...map,
        [annotationID]: pendingText,
      }));
    },
    [setPendingEditTextMap],
  );

  const [pendingReplyMap, setPendingReplyMap] = useState({});
  const setPendingReply = useCallback(
    (pendingReply, annotationID) => {
      setPendingReplyMap((map) => ({
        ...map,
        [annotationID]: pendingReply,
      }));
    },
    [setPendingReplyMap],
  );

  const [pendingAttachmentMap, setPendingAttachmentMap] = useState({});
  const addAttachments = (annotationID, attachments) => {
    setPendingAttachmentMap((map) => ({
      ...map,
      [annotationID]: [...(map[annotationID] || []), ...attachments],
    }));
  };
  const clearAttachments = (annotationID) => {
    setPendingAttachmentMap((map) => ({
      ...map,
      [annotationID]: [],
    }));
  };
  const deleteAttachment = (annotationID, attachment) => {
    const attachmentList = pendingAttachmentMap[annotationID];
    if (attachmentList?.length > 0) {
      const index = attachmentList.indexOf(attachment);
      if (index > -1) {
        attachmentList.splice(index, 1);
        setPendingAttachmentMap((map) => ({
          ...map,
          [annotationID]: [...attachmentList],
        }));
      }
    }
  };

  useEffect(() => {
    setMultiSelectedAnnotations(Object.values(multiSelectedMap));
    if (curAnnotId === undefined) {
      const ids = Object.keys(multiSelectedMap);
      setCurAnnotId(ids[0]);
    }
  }, [multiSelectedMap]);

  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      setMultiSelectMode(false);
    } else {
      setMultiSelectMode(true);
    }
  };

  const renderChild = (
    notes,
    index,
    // when we are virtualizing the notes, all of them will be absolutely positioned this function needs to be called by a Note component whenever its height changes
    // to clear the cache(used by react-virtualized) and recompute the height so that each note
    // can have the correct position
    resize = () => { },
  ) => {
    let listSeparator = null;
    const { shouldRenderSeparator, getSeparatorContent } = activeSortStrategy;
    const prevNote = index === 0 ? null : notes[index - 1];
    const currNote = notes[index];

    if (isSpreadsheetEditorMode) {
      const prevSheetIndex = prevNote ? prevNote.getCustomData(SPREADSHEET_SHEET_INDEX_KEY) : null;
      const currSheetIndex = currNote.getCustomData(SPREADSHEET_SHEET_INDEX_KEY);
      if (!prevNote || prevSheetIndex !== currSheetIndex) {
        const sheetName = currNote.getCustomData(SPREADSHEET_SHEET_NAME_KEY);
        if (sheetName) {
          listSeparator = <ListSeparator renderContent={() => sheetName} />;
        }
      }
    } else if (shouldRenderSeparator && getSeparatorContent && (!prevNote || shouldRenderSeparator(prevNote, currNote, sortOptions, activeDocumentViewerKey))) {
      listSeparator = <ListSeparator renderContent={() => getSeparatorContent(prevNote, currNote, sortOptions, activeDocumentViewerKey)} />;
    }

    // Collapse an expanded note when the top non-reply NoteContent is clicked
    const handleNoteClicked = () => {
      if (!isMultiSelectMode && selectedNoteIds[currNote.Id]) {
        setSelectedNoteIds((currIds) => {
          const clone = { ...currIds };
          delete clone[currNote.Id];
          return clone;
        });
        core.deselectAnnotation(currNote, activeDocumentViewerKey);
      }
    };

    // can potentially optimize this a bit since a new reference will cause consumers to rerender
    const contextValue = {
      searchInput,
      resize,
      isSelected: selectedNoteIds[currNote.Id],
      isContentEditable: core.canModifyContents(currNote, activeDocumentViewerKey) && !currNote.getContents(),
      isOfficeEditorCommentAnnotation: mapAnnotationToKey(currNote) === annotationMapKeys.OFFICE_EDITOR_COMMENT,
      isSpreadsheetEditorCommentAnnotation: isSpreadsheetEditorMode && !!currNote.getCustomData(SPREADSHEET_THREAD_ID_KEY),
      pendingEditTextMap,
      setPendingEditText,
      pendingReplyMap,
      setPendingReply,
      isDocumentReadOnly,
      onTopNoteContentClicked: handleNoteClicked,
      isExpandedFromSearch: onlyReplyContainsSearchInput(currNote),
      scrollToSelectedAnnot,
      sortStrategy,
      showAnnotationNumbering,
      setCurAnnotId,
      pendingAttachmentMap,
      clearAttachments,
      deleteAttachment,
      addAttachments,
      documentViewerKey: activeDocumentViewerKey,
    };

    if (index === singleSelectedNoteIndex) {
      setTimeout(() => {
        setScrollToSelectedAnnot(false);
        // open the 'annotationNoteConnectorLine' since the note it's pointing to is being rendered
        dispatch(actions.openElement('annotationNoteConnectorLine'));
      }, 0);
    }

    return (
      // unfortunately we need to use an actual div instead of React.Fragment here so that we can pass the correct index to scrollToRow
      // if this is a fragment then the listSeparator is rendered as a separate child, which means
      // singleSelectedNoteIndex might not be the index of the selected note among all the child elements of the notes panel
      <div role="listitem" className="note-wrapper">
        {listSeparator}
        <NoteContext.Provider value={contextValue}>
          <Note
            isCustomPanelOpen={isCustomPanelOpen}
            shouldHideConnectorLine={isLeftSide}
            annotation={currNote}
            isMultiSelected={!!multiSelectedMap[currNote.Id]}
            isMultiSelectMode={isMultiSelectMode}
            isMultiSelectEnabled={isNotesPanelMultiSelectEnabled}
            isInNotesPanel
            handleMultiSelect={(checked) => {
              if (checked) {
                const _multiSelectedMap = { ...multiSelectedMap };
                const groupAnnots = core.getGroupAnnotations(currNote, activeDocumentViewerKey);
                groupAnnots.forEach((groupAnnot) => {
                  _multiSelectedMap[groupAnnot.Id] = groupAnnot;
                });
                setMultiSelectedMap(_multiSelectedMap);
                core.selectAnnotations(groupAnnots, activeDocumentViewerKey);
              } else {
                const _multiSelectedMap = { ...multiSelectedMap };
                const groupAnnots = core.getGroupAnnotations(currNote, activeDocumentViewerKey);
                groupAnnots.forEach((groupAnnot) => {
                  delete _multiSelectedMap[groupAnnot.Id];
                });
                setMultiSelectedMap(_multiSelectedMap);
                core.deselectAnnotations([currNote, ...groupAnnots], activeDocumentViewerKey);
              }
            }}
          />
        </NoteContext.Provider>
      </div>
    );
  };

  const NoResults = (
    <div className="no-results">
      <div>
        <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
      </div>
      <p className="msg no-margin">{t('message.noResults')}</p>
    </div>
  );

  const ariaLiveResultsContainer = () => {
    const message = t(notesPanelConfig.title);
    return (
      <p aria-live="assertive" className='visually-hidden'>
        {notesToRender.length > 0 ? `${message} ${notesToRender.length}` : t('message.noResults')}
      </p>
    );
  };

  const NoAnnotationsGlyph = customEmptyPanel?.icon ?
    customEmptyPanel.icon :
    notesPanelConfig.icon;
  const NoAnnotationsMessage = customEmptyPanel?.message ?
    customEmptyPanel.message :
    t(notesPanelConfig.noAnnotation);
  const NoAnnotationsReadOnlyMessage =
    customEmptyPanel && customEmptyPanel.readOnlyMessage
      ? customEmptyPanel.readOnlyMessage
      : t('message.noAnnotationsReadOnly');
  const shouldRenderNoAnnotationsIcon = (customEmptyPanel && !customEmptyPanel.hideIcon) || !customEmptyPanel;
  const shouldRenderCustomEmptyPanel = customEmptyPanel && customEmptyPanel.render;

  const NoAnnotations = (
    <div className="no-annotations">
      {shouldRenderCustomEmptyPanel ? (
        <CustomElement render={customEmptyPanel.render} />
      ) : (
        <>
          {shouldRenderNoAnnotationsIcon && (
            <div>
              <Icon className="empty-icon" glyph={NoAnnotationsGlyph} />
            </div>
          )}
          <div className="msg">{isDocumentReadOnly ? NoAnnotationsReadOnlyMessage : NoAnnotationsMessage}</div>
        </>
      )}
    </div>
  );

  const MultiSelectPlaceHolder = <div className="multi-select-place-holder" />;

  const MultiReplyPlaceHolder = <div className="multi-reply-place-holder" />;

  // keep track of the index of the single selected note in the sorted and filtered list
  // in order to scroll it into view in this render effect
  const ids = Object.keys(selectedNoteIds);
  if (ids.length === 1) {
    singleSelectedNoteIndex = notesToRender.findIndex((note) => note.Id === ids[0]);
  } else if (ids.length) {
    // when selecting annotations that are grouped together, scroll to parent annotation that is in "notesToRender"
    // selectedNoteIds will have every ID in the group, while only the parent is in notesToRender
    const existingSelectedNotes = notesToRender.filter((note) => selectedNoteIds[note.Id]);

    if (existingSelectedNotes.length) {
      singleSelectedNoteIndex = notesToRender.findIndex((note) => note.Id === curAnnotId);
    }
  }

  const panelWidthVars = !isCustomPanel && (isInDesktopOnlyMode || !isMobile)
    ? css({ '--panel-width': currentWidth ? `${currentWidth}px` : '100%' })
    : css({});


  const showNotePanel = !isDisabled && (isOpen || notesInLeftPanel || isCustomPanel);
  const showPlaceHolder = isMultiSelectMode && !isDocumentReadOnly;
  const placeHolder = showMultiReply ? MultiReplyPlaceHolder : MultiSelectPlaceHolder;
  const showMultiSelectControls = isMultiSelectMode && !isDocumentReadOnly;

  const showOfficeEditorFooter = isOfficeEditorMode && !isMultiSelectMode;
  const showSpreadsheetEditorFooter = isSpreadsheetEditorMode && !isMultiSelectMode;
  const showReviewPanelFooter =
    showOfficeEditorFooter
    && dataElement === DataElements.OFFICE_EDITOR_REVIEW_PANEL
    && notesToRender.length > 0;
  const isOfficeEditorViewOnly = officeEditorEditMode === OfficeEditorEditMode.VIEW_ONLY || officeEditorEditMode === OfficeEditorEditMode.PREVIEW;
  const isSpreadsheetEditorViewOnly = isSpreadsheetEditorMode && spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
  const showCommentPanelFooter =
    (showOfficeEditorFooter
    && !core.getIsReadOnly(activeDocumentViewerKey)
    && !isOfficeEditorViewOnly
    && dataElement === DataElements.OFFICE_EDITOR_COMMENT_PANEL)
    || (showSpreadsheetEditorFooter && !isSpreadsheetEditorViewOnly && dataElement === DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL);

  return !showNotePanel ? null : (
    <div
      className={classNames({
        'notes-panel-container': true,
        'office-editor': isOfficeEditorMode,
      })}
    >
      <div
        className={classNames({
          Panel: true,
          NotesPanel: true,
        })}
        css={panelWidthVars}
        data-element="notesPanel"
        onMouseUp={() => core.deselectAllAnnotations}
      >
        {!isInDesktopOnlyMode && isMobile && !notesInLeftPanel && (
          <div className="close-container">
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements([DataElements.NOTES_PANEL]));
              }}
            >
              <Icon glyph="ic_close_black_24px" className="close-icon" />
            </div>
          </div>
        )}
        <>
          <NotesPanelHeader
            parentDataElement={dataElement}
            notes={notesToRender}
            disableFilterAnnotation={notes.length === 0}
            setSearchInputHandler={setSearchInput}
            isMultiSelectMode={isMultiSelectMode}
            toggleMultiSelectMode={toggleMultiSelectMode}
            isMultiSelectEnabled={isNotesPanelMultiSelectEnabled}
          />
          {notesToRender.length === 0 ? (
            notes.length === 0 ? (
              NoAnnotations
            ) : (
              NoResults
            )
          ) : notesToRender.length <= VIRTUALIZATION_THRESHOLD ? (
            <NormalList
              ref={listRef}
              notes={notesToRender}
              onScroll={handleScroll}
              initialScrollTop={scrollTopRef.current}
            >
              {renderChild}
            </NormalList>
          ) : (
            <VirtualizedList
              ref={listRef}
              notes={notesToRender}
              sortStrategy={sortStrategy}
              onScroll={handleScroll}
              initialScrollTop={scrollTopRef.current}
              selectedIndex={singleSelectedNoteIndex}
            >
              {renderChild}
            </VirtualizedList>
          )}
          {/* These two placeholders need to exist so that MultiSelectControls can
          be overlayed with position absolute and extend into the right panel while
          still being able to not have any notes cut off */}
          {showPlaceHolder ? placeHolder : null}
          {showReviewPanelFooter && (
            <div className='comment-panel-footer'>
              <div className='divider' />
              <Choice
                isSwitch
                checked={officeEditorEditMode === OfficeEditorEditMode.PREVIEW}
                label={t('officeEditor.previewAllChanges')}
                onChange={(e) => core.getOfficeEditor().setEditMode(e.target.checked ? OfficeEditorEditMode.PREVIEW : OfficeEditorEditMode.REVIEWING)}
              />
            </div>
          )}
          {showCommentPanelFooter && (
            <CommentPanelFooter
              dataElement={dataElement}
              existingCommentAtSelectedCell={existingCommentAtSelectedCell}
            />
          )}
        </>
      </div>
      {showMultiSelectControls && (
        <MultiSelectControls
          showMultiReply={showMultiReply}
          setShowMultiReply={setShowMultiReply}
          showMultiState={showMultiState}
          setShowMultiState={setShowMultiState}
          showMultiStyle={showMultiStyle}
          setShowMultiStyle={setShowMultiStyle}
          setMultiSelectMode={setMultiSelectMode}
          multiSelectedMap={multiSelectedMap}
          setMultiSelectedMap={setMultiSelectedMap}
          multiSelectedAnnotations={multiSelectedAnnotations}
        />
      )}
      <ReplyAttachmentPicker annotationId={curAnnotId} addAttachments={addAttachments} />
      {ariaLiveResultsContainer()}
    </div>
  );
};

NotesPanel.propTypes = {
  parentDataElement: PropTypes.string,
  dataElement: PropTypes.string,
  notes: PropTypes.array,
  selectedNoteIds: PropTypes.object,
  setSelectedNoteIds: PropTypes.func,
  scrollToSelectedAnnot: PropTypes.bool,
  setScrollToSelectedAnnot: PropTypes.func,
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func,
  isMultiSelectMode: PropTypes.bool,
  setMultiSelectMode: PropTypes.func,
  multiSelectedMap: PropTypes.object,
  setMultiSelectedMap: PropTypes.func,
  isCustomPanel: PropTypes.bool,
  isCustomPanelOpen: PropTypes.bool,
  isLeftSide: PropTypes.bool,
  currentLeftPanelWidth: PropTypes.number,
};

export default NotesPanel;
