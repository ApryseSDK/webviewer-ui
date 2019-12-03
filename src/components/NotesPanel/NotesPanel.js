import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import VirtualizedList from 'components/NotesPanel/VirtualizedList';
import NormalList from 'components/NotesPanel/NormalList';
import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import NoteContext from 'components/Note/Context';
import ListSeparator from 'components/ListSeparator';

import core from 'core';
import { getSortStrategies } from 'constants/sortStrategies';
import selectors from 'selectors';

import './NotesPanel.scss';

const propTypes = {
  display: PropTypes.string.isRequired,
};

const NotesPanel = ({ display }) => {
  const [sortStrategy, isDisabled, pageLabels, customNoteFilter] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.getPageLabels(state),
      selectors.getCustomNoteFilter(state),
    ],
    shallowEqual,
  );
  const [notes, setNotes] = useState([]);
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
  const VIRTUALIZATION_THRESHOLD = 300;

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

  // this effect should be removed once the next version of react-virtualized includes
  // the fix for https://github.com/bvaughn/react-virtualized/issues/1375.
  // we are doing this because we want to maintain the scroll position when we switch between panels
  // currently we are unmounting this component when we clicked other panel tabs
  // when the fix is out, we don't need to unmount this component anymore, and thus we don't call scrollToPosition whenever this panel is displaying
  useEffect(() => {
    if (display === 'flex' && listRef.current && scrollTopRef.current) {
      listRef.current.scrollToPosition(scrollTopRef.current);
    }
  }, [display]);

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

          return (
            isInputIn(content, searchInput) ||
            isInputIn(authorName, searchInput)
          );
        });
    }

    return shouldRender;
  };

  const isInputIn = (string, searchInput) => {
    if (!string) {
      return false;
    }

    return string.search(new RegExp(searchInput, 'i')) !== -1;
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
      <React.Fragment>
        {listSeparator}
        <NoteContext.Provider value={contextValue}>
          <Note annotation={currNote} />
        </NoteContext.Provider>
      </React.Fragment>
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

  // when either of the other two panel tabs is clicked, the "display" prop will become "none"
  // like other two panels, we should set the display style of the div to props.display
  // but if we do this, sometimes a maximum updates errors will be thrown from react-virtualized if we click the other two panels
  // it looks like the issue is reported here: https://github.com/bvaughn/react-virtualized/issues/1375
  // the PR for fixing this issue has been merged but not yet released so as a workaround we are unmounting
  // the whole component when props.display === 'none'
  // this should be changed back after the fixed is released in the next version of react-virtualized
  return isDisabled || display === 'none' ? null : (
    <div
      className="Panel NotesPanel"
      data-element="notesPanel"
      onMouseDown={core.deselectAllAnnotations}
    >
      {notes.length === 0 ? (
        <div className="no-annotations">{t('message.noAnnotations')}</div>
      ) : (
        <React.Fragment>
          <div className="header">
            <input
              type="text"
              placeholder={t('message.searchPlaceholder')}
              onChange={handleInputChange}
            />
            <Dropdown items={Object.keys(getSortStrategies())} />
          </div>
          {notesToRender.length === 0 ? (
            <div className="no-results">{t('message.noResults')}</div>
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
  );
};

NotesPanel.propTypes = propTypes;

export default NotesPanel;
