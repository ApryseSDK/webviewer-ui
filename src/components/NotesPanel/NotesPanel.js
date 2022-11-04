import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import VirtualizedList from 'components/NotesPanel/VirtualizedList';
import NormalList from 'components/NotesPanel/NormalList';
import Note from 'components/Note';
import Icon from 'components/Icon';
import NoteContext from 'components/Note/Context';
import ListSeparator from 'components/ListSeparator';
import MultiSelectControls from 'components/NotesPanel/MultiSelectControls';
import CustomElement from 'components/CustomElement';
import NotesPanelHeader from 'components/NotesPanelHeader';

import core from 'core';
import { getSortStrategies } from 'constants/sortStrategies';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import { isIE } from 'helpers/device';
import ReplyAttachmentPicker from './ReplyAttachmentPicker';

import './NotesPanel.scss';

const NotesPanel = ({ currentLeftPanelWidth }) => {
  const [
    sortStrategy,
    isOpen,
    isDisabled,
    pageLabels,
    customNoteFilter,
    currentNotesPanelWidth,
    notesInLeftPanel,
    isDocumentReadOnly,
    showAnnotationNumbering,
    enableNotesPanelVirtualizedList,
    isInDesktopOnlyMode,
    customEmptyPanel
  ] = useSelector(
    (state) => [
      selectors.getSortStrategy(state),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.getPageLabels(state),
      selectors.getCustomNoteFilter(state),
      selectors.getNotesPanelWidth(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isDocumentReadOnly(state),
      selectors.isAnnotationNumberingEnabled(state),
      selectors.getEnableNotesPanelVirtualizedList(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.getNotesPanelCustomEmptyPanel(state)
    ],
    shallowEqual,
  );
  const currentWidth = currentLeftPanelWidth || currentNotesPanelWidth;

  const dispatch = useDispatch();

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const [notes, setNotes] = useState([]);
  const [isMultiSelectedMap, setIsMultiSelectedMap] = useState({});
  const [multiSelectedAnnotations, setMultiSelectedAnnotations] = useState([]);
  const [isMultiSelectMode, setMultiSelectMode] = useState(false);
  const [showMultiReply, setShowMultiReply] = useState(false);
  const [showMultiState, setShowMultiState] = useState(false);
  const [showMultiStyle, setShowMultiStyle] = useState(false);

  const [curAnnotId, setCurAnnotId] = useState(undefined);

  // the object will be in a shape of { [note.Id]: true }
  // use a map here instead of an array to achieve an O(1) time complexity for checking if a note is selected
  const [selectedNoteIds, setSelectedNoteIds] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [scrollToSelectedAnnot, setScrollToSelectedAnnot] = useState(false);
  const [t] = useTranslation();
  const listRef = useRef();
  // a ref that is used to keep track of the current scroll position
  // when the number of notesToRender goes over/below the threshold, we will unmount the current list and mount the other one
  // this will result in losing the scroll position and we will use this ref to recover
  const scrollTopRef = useRef(0);
  const VIRTUALIZATION_THRESHOLD = enableNotesPanelVirtualizedList ? (isIE ? 25 : 100) : Infinity;

  useEffect(() => {
    const onDocumentUnloaded = () => {
      setNotes([]);
      setSelectedNoteIds({});
      setSearchInput('');
    };
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    return () => core.removeEventListener('documentUnloaded', onDocumentUnloaded);
  }, []);

  useEffect(() => {
    const onAnnotationNumberingUpdated = (isEnabled) => {
      dispatch(actions.setAnnotationNumbering(isEnabled));
    };

    core.addEventListener('annotationNumberingUpdated', onAnnotationNumberingUpdated);

    return () => {
      core.removeEventListener('annotationNumberingUpdated', onAnnotationNumberingUpdated);
    };
  }, []);

  useEffect(() => {
    const _setNotes = () => {
      setNotes(
        core
          .getAnnotationsList()
          .filter((annot) => annot.Listable && !annot.isReply() && !annot.Hidden && !annot.isGrouped() && annot.ToolName !== window.Core.Tools.ToolNames.CROP && !annot.isContentEditPlaceholder()),
      );
    };

    core.addEventListener('annotationChanged', _setNotes);
    core.addEventListener('annotationHidden', _setNotes);
    core.addEventListener('updateAnnotationPermission', _setNotes);

    _setNotes();

    return () => {
      core.removeEventListener('annotationChanged', _setNotes);
      core.removeEventListener('annotationHidden', _setNotes);
      core.removeEventListener('updateAnnotationPermission', _setNotes);
    };
  }, []);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      const ids = {};

      core.getSelectedAnnotations().forEach((annot) => {
        ids[annot.Id] = true;
      });
      if (isOpen || notesInLeftPanel) {
        setSelectedNoteIds(ids);
        setScrollToSelectedAnnot(true);
      }

      const selectedAnnotations = core.getSelectedAnnotations();
      if (action === 'selected' && selectedAnnotations.length > 1) {
        setMultiSelectMode(true);
        const _isMultiSelectedMap = { ...isMultiSelectedMap };
        selectedAnnotations.forEach((selectedAnnot) => {
          _isMultiSelectedMap[selectedAnnot.Id] = selectedAnnot;
        });
        setIsMultiSelectedMap(_isMultiSelectedMap);
      }
    };
    onAnnotationSelected();

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => core.removeEventListener('annotationSelected', onAnnotationSelected);
  }, [isOpen, notesInLeftPanel, isMultiSelectMode, isMultiSelectedMap]);

  let singleSelectedNoteIndex = -1;

  const handleScroll = (scrollTop) => {
    if (scrollTop) {
      scrollTopRef.current = scrollTop;
    }
    dispatch(actions.closeElement('annotationNoteConnectorLine'));
  };

  const filterNotesWithSearch = (note) => {
    const content = note.getContents();
    const authorName = core.getDisplayAuthor(note['Author']);
    const annotationPreview = note.getCustomData('trn-annot-preview');

    // didn't use regex here because the search input may form an invalid regex, e.g. *
    return (
      content?.toLowerCase().includes(searchInput.toLowerCase()) ||
      authorName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      annotationPreview?.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const filterNote = (note) => {
    let shouldRender = true;

    if (customNoteFilter) {
      shouldRender = shouldRender && customNoteFilter(note);
    }

    if (searchInput) {
      const replies = note.getReplies();
      // reply is also a kind of annotation
      // https://www.pdftron.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
      const noteAndReplies = [note, ...replies];

      shouldRender =
        shouldRender &&
        noteAndReplies.some(filterNotesWithSearch);
    }
    return shouldRender;
  };

  const notesToRender = getSortStrategies()[sortStrategy].getSortedNotes(notes)
    .filter(filterNote);

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
    return searchInput && notesToRender.filter((note) => {
      return note.getReplies().some(filterNotesWithSearch);
    }).some((replies) => replies.Id === currNote.Id);
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
      [annotationID]: [...(map[annotationID] || []), ...attachments]
    }));
  };
  const clearAttachments = (annotationID) => {
    setPendingAttachmentMap((map) => ({
      ...map,
      [annotationID]: []
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
          [annotationID]: [...attachmentList]
        }));
      }
    }
  };

  useEffect(() => {
    setMultiSelectedAnnotations(Object.values(isMultiSelectedMap));
  }, [isMultiSelectedMap]);

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
    // when we are virtualizing the notes, all of them will be absolutely positioned
    // this function needs to be called by a Note component whenever its height changes
    // to clear the cache(used by react-virtualized) and recompute the height so that each note
    // can have the correct position
    resize = () => { },
  ) => {
    let listSeparator = null;
    const { shouldRenderSeparator, getSeparatorContent } = getSortStrategies()[sortStrategy];
    const prevNote = index === 0 ? null : notes[index - 1];
    const currNote = notes[index];

    if (shouldRenderSeparator && getSeparatorContent && (!prevNote || shouldRenderSeparator(prevNote, currNote))) {
      listSeparator = <ListSeparator renderContent={() => getSeparatorContent(prevNote, currNote, { pageLabels })} />;
    }

    // Collapse an expanded note when the top non-reply NoteContent is clicked
    const handleNoteClicked = () => {
      if (!isMultiSelectMode && selectedNoteIds[currNote.Id]) {
        setSelectedNoteIds((currIds) => {
          const clone = { ...currIds };
          delete clone[currNote.Id];
          return clone;
        });
        core.deselectAnnotation(currNote);
      }
    };

    // can potentially optimize this a bit since a new reference will cause consumers to rerender
    const contextValue = {
      searchInput,
      resize,
      isSelected: selectedNoteIds[currNote.Id],
      isContentEditable: core.canModifyContents(currNote) && !currNote.getContents(),
      pendingEditTextMap,
      setPendingEditText,
      pendingReplyMap,
      setPendingReply,
      isDocumentReadOnly,
      isNotePanelOpen: isOpen || notesInLeftPanel,
      onTopNoteContentClicked: handleNoteClicked,
      isExpandedFromSearch: onlyReplyContainsSearchInput(currNote),
      scrollToSelectedAnnot,
      sortStrategy,
      showAnnotationNumbering,
      setCurAnnotId,
      pendingAttachmentMap,
      clearAttachments,
      deleteAttachment,
      addAttachments
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
            annotation={currNote}
            isMultiSelected={!!isMultiSelectedMap[currNote.Id]}
            isMultiSelectMode={isMultiSelectMode}
            handleMultiSelect={(checked) => {
              if (checked) {
                const _isMultiSelectedMap = { ...isMultiSelectedMap };
                const groupAnnots = core.getGroupAnnotations(currNote);
                groupAnnots.forEach((groupAnnot) => {
                  _isMultiSelectedMap[groupAnnot.Id] = groupAnnot;
                });
                setIsMultiSelectedMap(_isMultiSelectedMap);
              } else {
                const _isMultiSelectedMap = { ...isMultiSelectedMap };
                const groupAnnots = core.getGroupAnnotations(currNote);
                groupAnnots.forEach((groupAnnot) => {
                  delete _isMultiSelectedMap[groupAnnot.Id];
                });
                setIsMultiSelectedMap(_isMultiSelectedMap);
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
      <div className="msg">{t('message.noResults')}</div>
    </div>
  );

  const NoAnnotationsGlyph = (customEmptyPanel && customEmptyPanel.icon) ? customEmptyPanel.icon : 'illustration - empty state - outlines';
  const NoAnnotationsMessage = (customEmptyPanel && customEmptyPanel.message) ? customEmptyPanel.message : t('message.noAnnotations');
  const NoAnnotationsReadOnlyMessage = (customEmptyPanel && customEmptyPanel.readOnlyMessage) ? customEmptyPanel.readOnlyMessage : t('message.noAnnotationsReadOnly');
  const shouldRenderNoAnnotationsIcon = (customEmptyPanel && !customEmptyPanel.hideIcon) || !customEmptyPanel;
  const shouldRenderCustomEmptyPanel = (customEmptyPanel && customEmptyPanel.render);

  const NoAnnotations = (
    <div className="no-annotations">
      {shouldRenderCustomEmptyPanel ?
        <CustomElement render={customEmptyPanel.render} /> :
        <>
          {shouldRenderNoAnnotationsIcon &&
            <div>
              <Icon className="empty-icon" glyph={NoAnnotationsGlyph} />
            </div>
          }
          <div className="msg">{isDocumentReadOnly ? NoAnnotationsReadOnlyMessage : NoAnnotationsMessage}</div>
        </>
      }
    </div>
  );

  const MultiSelectPlaceHolder = (
    <div className="multi-select-place-holder" />
  );

  const MultiReplyPlaceHolder = (
    <div className="multi-reply-place-holder" />
  );

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
      singleSelectedNoteIndex = notesToRender.findIndex((note) => note.Id === existingSelectedNotes[0].Id);
    }
  }

  let style = {};
  if ((isInDesktopOnlyMode || !isMobile)) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  const showNotePanel = !isDisabled && (isOpen || notesInLeftPanel);
  return (!showNotePanel ? null : (
    <div
      className="notes-panel-container"
    >
      <div
        className={classNames({
          Panel: true,
          NotesPanel: true
        })}
        style={style}
        data-element="notesPanel"
        onMouseUp={() => core.deselectAllAnnotations}
      >
        {(!isInDesktopOnlyMode && isMobile) && !notesInLeftPanel &&
        <div
          className="close-container"
        >
          <div
            className="close-icon-container"
            onClick={() => {
              dispatch(actions.closeElements(['notesPanel']));
            }}
          >
            <Icon
              glyph="ic_close_black_24px"
              className="close-icon"
            />
          </div>
        </div>}
        <React.Fragment>
          <NotesPanelHeader
            notes={notesToRender}
            disableFilterAnnotation={notes.length === 0}
            setSearchInputHandler={setSearchInput}
            isMultiSelectMode={isMultiSelectMode}
            toggleMultiSelectMode={toggleMultiSelectMode}
          />
          {notesToRender.length === 0 ? (notes.length === 0 ? NoAnnotations : NoResults) : notesToRender.length <= VIRTUALIZATION_THRESHOLD ? (
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
          {isMultiSelectMode
            ? (showMultiReply ? MultiReplyPlaceHolder : MultiSelectPlaceHolder)
            : null}
        </React.Fragment>
      </div>
      {isMultiSelectMode &&
        <MultiSelectControls
          showMultiReply={showMultiReply}
          setShowMultiReply={setShowMultiReply}
          showMultiState={showMultiState}
          setShowMultiState={setShowMultiState}
          showMultiStyle={showMultiStyle}
          setShowMultiStyle={setShowMultiStyle}
          setMultiSelectMode={setMultiSelectMode}
          isMultiSelectedMap={isMultiSelectedMap}
          setIsMultiSelectedMap={setIsMultiSelectedMap}
          multiSelectedAnnotations={multiSelectedAnnotations}
        />
      }
      <ReplyAttachmentPicker
        annotationId={curAnnotId}
        addAttachments={addAttachments}
      />
    </div>
  ));
};

export default NotesPanel;
