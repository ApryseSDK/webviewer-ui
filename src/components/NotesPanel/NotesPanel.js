import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import Measure from 'react-measure';
import { CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import NoteContext from 'components/Note/Context';
import ListSeparator from 'components/ListSeparator';

import core from 'core';
import selectors from 'selectors';
import { getSortStrategies } from 'constants/sortStrategies';

import './NotesPanel.scss';

const propTypes = {
  display: PropTypes.string.isRequired,
};

const cache = new CellMeasurerCache({ defaultHeight: 80, fixedWidth: true });

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
  // use a map here instead of an array to achieve an O(1) time complexity for looking up
  // if a note is selected
  const [selectedNoteIds, setSelectedNoteIds] = useState({});
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [t] = useTranslation();
  const listRef = useRef();

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
      core.addEventListener('annotationChanged', _setNotes);
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
    if (singleSelectedNoteIndex !== -1 && listRef.current) {
      listRef.current.scrollToRow(singleSelectedNoteIndex);
    }
  }, [selectedNoteIds]);

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

  const rowRenderer = (notes, { index, key, parent, style }) => {
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

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        width={dimension.width}
      >
        <div style={style}>
          {listSeparator}
          <NoteContext.Provider
            value={{
              searchInput,
              isSelected: selectedNoteIds[currNote.Id],
              resize: () => {
                if (listRef.current) {
                  cache.clear(index);
                  listRef.current.recomputeRowHeights(index);
                }
              },
              isContentEditable:
                core.canModify(currNote) && !currNote.getContents(),
            }}
          >
            <Note annotation={currNote} />
          </NoteContext.Provider>
        </div>
      </CellMeasurer>
    );
  };

  let child;
  if (notes.length === 0) {
    child = <div className="no-annotations">{t('message.noAnnotations')}</div>;
  } else {
    let notesToRender = getSortStrategies()[sortStrategy].getSortedNotes(notes);
    notesToRender = notesToRender.filter(filterNote);

    // keep track of the index of the single selected note in the sorted and filtered list
    // in order to scroll it into view in this render effect
    const ids = Object.keys(selectedNoteIds);
    if (ids.length === 1) {
      singleSelectedNoteIndex = notesToRender.findIndex(
        note => note.Id === ids[0],
      );
    }

    child = (
      <>
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
        ) : (
          <List
            deferredMeasurementCache={cache}
            height={dimension.height}
            width={dimension.width}
            overscanRowCount={1}
            ref={listRef}
            rowCount={notesToRender.length}
            rowHeight={cache.rowHeight}
            rowRenderer={arg => rowRenderer(notesToRender, arg)}
            style={{ outline: 'none' }}
          />
        )}
      </>
    );
  }

  return isDisabled ? null : (
    <Measure bounds onResize={({ bounds }) => setDimension(bounds)}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="Panel NotesPanel"
          style={{ display }}
          data-element="notesPanel"
          onClick={core.deselectAllAnnotations}
          onScroll={e => e.stopPropagation()}
        >
          {child}
        </div>
      )}
    </Measure>
  );
};

NotesPanel.propTypes = propTypes;

export default NotesPanel;
