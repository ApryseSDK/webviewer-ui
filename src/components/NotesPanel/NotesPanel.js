import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import VirtualizedList from 'components/NotesPanel/VirtualizedList';
import NormalList from 'components/NotesPanel/NormalList';
import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import Icon from 'components/Icon';
import NoteContext from 'components/Note/Context';
import ListSeparator from 'components/ListSeparator';
import Button from 'components/Button';

import core from 'core';
import { getSortStrategies } from 'constants/sortStrategies';
import Events from 'constants/events';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import { isIE } from 'helpers/device';
import fireEvent from 'helpers/fireEvent';
import { debounce } from 'lodash';
import './NotesPanel.scss';
import getAnnotationReference from 'helpers/getAnnotationReference';

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
    enableNotesPanelVirtualizedList,
    isInDesktopOnlyMode,
  ] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.getPageLabels(state),
      selectors.getCustomNoteFilter(state),
      selectors.getNotesPanelWidth(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isDocumentReadOnly(state),
      selectors.getEnableNotesPanelVirtualizedList(state),
      selectors.isInDesktopOnlyMode(state),
    ],
    shallowEqual,
  );
  const currentWidth = currentLeftPanelWidth || currentNotesPanelWidth;

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const [notes, setNotes] = useState([]);

  const [filterEnabled, setFilterEnabled] = useState(false);

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
    const _setNotes = () => {
      setNotes(
        core
          .getAnnotationsList()
          .filter(
            annot =>
              annot.Listable &&
              !annot.isReply() &&
              !annot.Hidden &&
              !annot.isGrouped() &&
              annot.ToolName !== window.Core.Tools.ToolNames.CROP &&
              !annot.isContentEditPlaceholder(),
          ),
      );
    };

    const toggleFilterStyle = e => {
      const { types, authors, colors, shareTypes } = e.detail;
      if (types.length > 0 || authors.length > 0 || colors.length > 0 || shareTypes.length > 0) {
        setFilterEnabled(true);
      } else {
        setFilterEnabled(false);
      }
    };

    core.addEventListener('annotationChanged', _setNotes);
    core.addEventListener('annotationHidden', _setNotes);
    core.addEventListener('updateAnnotationPermission', _setNotes);
    window.addEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);

    _setNotes();

    return () => {
      core.removeEventListener('annotationChanged', _setNotes);
      core.removeEventListener('annotationHidden', _setNotes);
      core.removeEventListener('updateAnnotationPermission', _setNotes);
      window.removeEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);
    };
  }, []);

  useEffect(() => {
    const onAnnotationSelected = () => {
      const ids = {};

      core.getSelectedAnnotations().forEach(annot => {
        ids[annot.Id] = true;
      });
      if (isOpen) {
        setSelectedNoteIds(ids);
        setScrollToSelectedAnnot(true);
      }
    };
    onAnnotationSelected();

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => core.removeEventListener('annotationSelected', onAnnotationSelected);
  }, [isOpen]);

  let singleSelectedNoteIndex = -1;

  const handleScroll = scrollTop => {
    if (scrollTop) {
      scrollTopRef.current = scrollTop;
    }
    dispatch(actions.closeElement('annotationNoteConnectorLine'));
  };

  const filterNotesWithSearch = note => {
    const content = note.getContents();
    const authorName = core.getDisplayAuthor(note['Author']);
    const annotationPreview = note.getCustomData('trn-annot-preview');
    
    /** CUSTOM WISEFLOW */
    const reference = getAnnotationReference(note);

    // didn't use regex here because the search input may form an invalid regex, e.g. *
    return (
      content?.toLowerCase().includes(searchInput.toLowerCase()) ||
      authorName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      annotationPreview?.toLowerCase().includes(searchInput.toLowerCase()) ||
      reference?.toLowerCase().includes(searchInput.toLowerCase()) // CUSTOM WISEFLOW
    );
  };

  const filterNote = note => {
    let shouldRender = true;

    if (customNoteFilter) {
      shouldRender = shouldRender && customNoteFilter(note);
    }

    if (searchInput) {
      const replies = note.getReplies();
      // reply is also a kind of annotation
      // https://www.pdftron.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
      const noteAndReplies = [note, ...replies];

      shouldRender = shouldRender && noteAndReplies.some(filterNotesWithSearch);
    }
    return shouldRender;
  };

  const notesToRender = getSortStrategies()[sortStrategy].getSortedNotes(notes).filter(filterNote);

  useEffect(() => {
    if (Object.keys(selectedNoteIds).length && singleSelectedNoteIndex !== -1) {
      setTimeout(() => {
        // wait for the previous selected annotation to resize() after closing before scrolling to the newly selected one
        listRef.current?.scrollToRow(singleSelectedNoteIndex);
      }, 0);
    }
  }, [selectedNoteIds]);

  //expand a reply note when search content is match
  const onlyReplyContainsSearchInput = currNote => {
    if (Object.keys(selectedNoteIds).length) {
      return false;
    }
    return (
      searchInput &&
      notesToRender
        .filter(note => {
          return note.getReplies().some(filterNotesWithSearch);
        })
        .some(replies => replies.Id === currNote.Id)
    );
  };

  const handleInputChange = e => {
    _handleInputChange(e.target.value);
  };

  const _handleInputChange = debounce(value => {
    // this function is used to solve the issue with using synthetic event asynchronously.
    // https://reactjs.org/docs/events.html#event-pooling
    core.deselectAllAnnotations();

    setSearchInput(value);
  }, 500);

  const [pendingEditTextMap, setPendingEditTextMap] = useState({});
  const setPendingEditText = useCallback(
    (pendingText, annotationID) => {
      setPendingEditTextMap(map => ({
        ...map,
        [annotationID]: pendingText,
      }));
    },
    [setPendingEditTextMap],
  );

  // CUSTOM WISEFLOW unpostedAnnotationChanged event

  // debounced callback to fire unpostedAnnotationsChanged event
  const onUnpostedAnnotationChanged = useCallback(
    debounce(pendingEditTextMap => {
      const unpostedAnnotationsCount = Object.values(pendingEditTextMap).reduce((count, pendingText) => {
        if (pendingText !== undefined) {
          return count + 1;
        }
        return count;
      }, 0);
      fireEvent('unpostedAnnotationsChanged', { pendingEditTextMap, unpostedAnnotationsCount });
    }, 200),
    [],
  );

  // Throw event on changed to pendingEditTextMap
  useEffect(() => onUnpostedAnnotationChanged(pendingEditTextMap), [pendingEditTextMap]);

  // CUSTOM WISEFLOW end

  const [pendingReplyMap, setPendingReplyMap] = useState({});
  const setPendingReply = useCallback(
    (pendingReply, annotationID) => {
      setPendingReplyMap(map => ({
        ...map,
        [annotationID]: pendingReply,
      }));
    },
    [setPendingReplyMap],
  );

  const renderChild = (
    notes,
    index,
    // when we are virtualizing the notes, all of them will be absolutely positioned
    // this function needs to be called by a Note component whenever its height changes
    // to clear the cache(used by react-virtualized) and recompute the height so that each note
    // can have the correct position
    resize = () => {},
  ) => {
    let listSeparator = null;
    const { shouldRenderSeparator, getSeparatorContent } = getSortStrategies()[sortStrategy];
    const prevNote = index === 0 ? null : notes[index - 1];
    const currNote = notes[index];

    if (shouldRenderSeparator && getSeparatorContent && (!prevNote || shouldRenderSeparator(prevNote, currNote))) {
      listSeparator = <ListSeparator renderContent={() => getSeparatorContent(prevNote, currNote, { pageLabels })} />;
    }

    //Collapse an expanded note when the top non-reply NoteContent is clicked
    const handleNoteClicked = () => {
      if (selectedNoteIds[currNote.Id]) {
        setSelectedNoteIds(currIds => {
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
      isNotePanelOpen: isOpen,
      onTopNoteContentClicked: handleNoteClicked,
      isExpandedFromSearch: onlyReplyContainsSearchInput(currNote),
      scrollToSelectedAnnot,
      sortStrategy,
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

  const NoAnnotations = (
    <div className="no-annotations">
      <div>
        <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
      </div>
      <div className="msg">{isDocumentReadOnly ? t('message.noAnnotationsReadOnly') : t('message.noAnnotations')}</div>
    </div>
  );

  // keep track of the index of the single selected note in the sorted and filtered list
  // in order to scroll it into view in this render effect
  const ids = Object.keys(selectedNoteIds);
  if (ids.length === 1) {
    singleSelectedNoteIndex = notesToRender.findIndex(note => note.Id === ids[0]);
  } else if (ids.length) {
    // when selecting annotations that are grouped together, scroll to parent annotation that is in "notesToRender"
    // selectedNoteIds will have every ID in the group, while only the parent is in notesToRender
    const existingSelectedNotes = notesToRender.filter(note => selectedNoteIds[note.Id]);

    if (existingSelectedNotes.length) {
      singleSelectedNoteIndex = notesToRender.findIndex(note => note.Id === existingSelectedNotes[0].Id);
    }
  }

  let style = {};
  if (isInDesktopOnlyMode || !isMobile) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  return isDisabled || !isOpen ? null : (
    <div
      className={classNames({
        Panel: true,
        NotesPanel: true,
      })}
      style={style}
      data-element="notesPanel"
      onMouseUp={() => core.deselectAllAnnotations}
    >
      {!isInDesktopOnlyMode && isMobile && !notesInLeftPanel && (
        <div className="close-container">
          <div
            className="close-icon-container"
            onClick={() => {
              dispatch(actions.closeElements(['notesPanel']));
            }}
          >
            <Icon glyph="ic_close_black_24px" className="close-icon" />
          </div>
        </div>
      )}
      <React.Fragment>
        <div className="header">
          <div className="input-container">
            <input
              type="text"
              placeholder={t('message.searchCommentsPlaceholder')}
              aria-label={t('message.searchCommentsPlaceholder')}
              onChange={handleInputChange}
              ref={inputRef}
              id="NotesPanel__input"
            />
          </div>
          <div className="comments-counter">
            <span className="main-comment">{t('component.notesPanel')}</span> {`(${notesToRender.length})`}
          </div>
          <div className="sort-row">
            <div className="sort-container">
              <div className="label">{`${t('message.sortBy')}:`}</div>
              <Dropdown
                dataElement="notesOrderDropdown"
                disabled={notesToRender.length === 0}
                items={Object.keys(getSortStrategies())}
                translationPrefix="option.notesOrder"
                currentSelectionKey={sortStrategy}
                onClickItem={sortStrategy => {
                  dispatch(actions.setNotesPanelSortStrategy(sortStrategy));
                }}
              />
            </div>
            <Button
              dataElement="filterAnnotationButton"
              className={classNames({
                filterAnnotationButton: true,
                active: filterEnabled,
              })}
              disabled={notes.length === 0}
              img="icon-comments-filter"
              onClick={() => dispatch(actions.openElement('filterModal'))}
              title={t('component.filter')}
            />
          </div>
        </div>
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
      </React.Fragment>
    </div>
  );
};

export default NotesPanel;
