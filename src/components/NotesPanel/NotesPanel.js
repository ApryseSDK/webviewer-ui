import React, { useState, useRef, useEffect } from 'react';
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
import ResizeBar from 'components/ResizeBar';

import core from 'core';
import { getSortStrategies } from 'constants/sortStrategies';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './NotesPanel.scss';

const NotesPanel = () => {
  const [
    sortStrategy,
    isOpen,
    pageLabels,
    customNoteFilter,
  ] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.getPageLabels(state),
      selectors.getCustomNoteFilter(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );


  const [notes, setNotes] = useState([]);
  const [width, setWidth] = useState(293);

  // the object will be in a shape of { [note.Id]: true }
  // use a map here instead of an array to achieve an O(1) time complexity for checking if a note is selected
  const [selectedNoteIds, setSelectedNoteIds] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [t] = useTranslation();
  const listRef = useRef();
  // a ref that is used to keep track of the current scroll position
  // when the number of notesToRender goes over/below the threshold, we will unmount the current list and mount the other one
  // this will result in losing the scroll position and we will use this ref to recover
  const scrollTopRef = useRef(0);
  const VIRTUALIZATION_THRESHOLD = 100;

  useEffect(() => {
    const onDocumentUnloaded = () => {
      setNotes([]);
      setSelectedNoteIds({});
      setSearchInput('');
    };
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    return () =>
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
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
              !annot.isGrouped(),
          ),
      );
    };

    core.addEventListener('annotationChanged', _setNotes);
    core.addEventListener('annotationHidden', _setNotes);

    _setNotes();

    return () => {
      core.removeEventListener('annotationChanged', _setNotes);
      core.removeEventListener('annotationHidden', _setNotes);
    };
  }, []);

  useEffect(() => {
    const onAnnotationSelected = () => {
      const ids = {};

      core.getSelectedAnnotations().forEach(annot => {
        ids[annot.Id] = true;
      });
      setSelectedNoteIds(ids);
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () =>
      core.removeEventListener('annotationSelected', onAnnotationSelected);
  }, []);

  let singleSelectedNoteIndex = -1;
  useEffect(() => {
    if (Object.keys(selectedNoteIds).length && singleSelectedNoteIndex !== -1) {
      listRef.current?.scrollToRow(singleSelectedNoteIndex);
    }
    // we only want this effect to happen when we select some notes
    // eslint-disable-next-line
  }, [selectedNoteIds]);

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(['searchPanel', 'searchOverlay']));
    }
  }, [dispatch, isOpen]);

  const handleScroll = scrollTop => {
    if (scrollTop) {
      scrollTopRef.current = scrollTop;
    }
  };

  const filterNote = note => {
    let shouldRender = true;

    if (customNoteFilter) {
      shouldRender = shouldRender && customNoteFilter(note);
    }

    if (searchInput) {
      const replies = note.getReplies();
      // reply is also a kind of annotation
      // https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#createAnnotationReply__anchor
      const noteAndReplies = [note, ...replies];

      shouldRender =
        shouldRender &&
        noteAndReplies.some(note => {
          const content = note.getContents();
          const authorName = core.getDisplayAuthor(note);

          // didn't use regex here because the search input may form an invalid regex, e.g. *
          return (
            content?.toLowerCase().includes(searchInput.toLowerCase()) ||
            authorName?.toLowerCase().includes(searchInput.toLowerCase())
          );
        });
    }

    return shouldRender;
  };

  const handleInputChange = e => {
    _handleInputChange(e.target.value);
  };

  const _handleInputChange = _.debounce(value => {
    // this function is used to solve the issue with using synthetic event asynchronously.
    // https://reactjs.org/docs/events.html#event-pooling
    core.deselectAllAnnotations();

    setSearchInput(value);
  }, 500);

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
    const { shouldRenderSeparator, getSeparatorContent } = getSortStrategies()[
      sortStrategy
    ];
    const prevNote = index === 0 ? null : notes[index - 1];
    const currNote = notes[index];

    if (
      shouldRenderSeparator &&
      getSeparatorContent &&
      (!prevNote || shouldRenderSeparator(prevNote, currNote))
    ) {
      listSeparator = (
        <ListSeparator
          renderContent={() =>
            getSeparatorContent(prevNote, currNote, { pageLabels })
          }
        />
      );
    }

    // can potentially optimize this a bit since a new reference will cause consumers to rerender
    const contextValue = {
      searchInput,
      resize,
      isSelected: selectedNoteIds[currNote.Id],
      isContentEditable: core.canModify(currNote) && !currNote.getContents(),
    };

    return (
      // unfortunately we need to use an actual div instead of React.Fragment here so that we can pass the correct index to scrollToRow
      // if this is a fragment then the listSeparator is rendered as a separate child, which means
      // singleSelectedNoteIndex might not be the index of the selected note among all the child elements of the notes panel
      <div className="note-wrapper">
        {listSeparator}
        <NoteContext.Provider value={contextValue}>
          <Note annotation={currNote} />
        </NoteContext.Provider>
      </div>
    );
  };

  const notesToRender = getSortStrategies()
    [sortStrategy].getSortedNotes(notes)
    .filter(filterNote);

  // keep track of the index of the single selected note in the sorted and filtered list
  // in order to scroll it into view in this render effect
  const ids = Object.keys(selectedNoteIds);
  if (ids.length === 1) {
    singleSelectedNoteIndex = notesToRender.findIndex(
      note => note.Id === ids[0],
    );
  }

  let style = {};
  if (!isMobile) {
    style = { width: `${width}px` };
  }

  return (
    <div
      className="notes-panel-container"
      style={style}
    >
      {!isMobile &&
        <ResizeBar
          minWidth={215}
          onResize={_width => {
            setWidth(_width);
          }}
          leftDirection
        />}
      <div
        className={classNames({
          Panel: true,
          NotesPanel: true,
        })}
        data-element="notesPanel"
        onClick={core.deselectAllAnnotations}
      >
        {notes.length === 0 ? (
          <div className="no-annotations">{t('message.noAnnotations')}</div>
        ) : (
          <React.Fragment>
            <div className="header">
              <div className="input-container">
                <input
                  type="text"
                  placeholder={t('message.searchCommentsPlaceholder')}
                  onChange={handleInputChange}
                />
              </div>
              <div className="divider" />
              <div className="sort-row">
                <div className="sort-container">
                  <div className="label">{`Sort by:`}</div>
                  <Dropdown items={Object.keys(getSortStrategies())} />
                </div>
              </div>
            </div>
            {notesToRender.length === 0 ? (
              <div className="no-results">
                <div>
                  <Icon
                    className="empty-icon"
                    glyph="illustration - empty state - outlines"
                  />
                </div>
                <div className="msg">
                  {t('message.noResults')}
                </div>
              </div>
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
                onScroll={handleScroll}
                initialScrollTop={scrollTopRef.current}
              >
                {renderChild}
              </VirtualizedList>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
