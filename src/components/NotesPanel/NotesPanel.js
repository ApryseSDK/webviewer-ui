import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  AutoSizer,
} from 'react-virtualized';
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
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [t] = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const listRef = useRef();

  useEffect(() => {
    const onDocumentUnloaded = () => {
      setNotes([]);
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
              !annot.isReply() &&
              annot.Listable &&
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
      setSelectedNoteIds(
        core.getSelectedAnnotations().map(annotation => annotation.Id),
      );
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () =>
      core.removeEventListener('annotationSelected', onAnnotationSelected);
  });

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

  const resize = index => {
    if (listRef.current) {
      cache.clear(index);
      listRef.current.recomputeRowHeights(index);
    }
  };

  const scrollToView = index => {
    if (listRef.current) {
      listRef.current.scrollToRow(index);
      console.log('here');
    }
  };

  const rowRenderer = (notes, width, { index, key, parent, style }) => {
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
        width={width}
      >
        <div style={style}>
          {listSeparator}
          <NoteContext.Provider
            value={{
              searchInput,
              isSelected: selectedNoteIds.includes(currNote.Id),
              resize: () => resize(index),
              scrollToView: () => scrollToView(index),
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
          <AutoSizer>
            {({ height, width }) => (
              <List
                deferredMeasurementCache={cache}
                height={height}
                width={width}
                overscanRowCount={1}
                ref={listRef}
                rowCount={notesToRender.length}
                rowHeight={cache.rowHeight}
                rowRenderer={arg => rowRenderer(notesToRender, width, arg)}
              />
            )}
          </AutoSizer>
        )}
      </>
    );
  }

  return isDisabled ? null : (
    <div
      className="Panel NotesPanel"
      style={{ display }}
      data-element="notesPanel"
      onClick={core.deselectAllAnnotations}
      onScroll={e => e.stopPropagation()}
    >
      {child}
    </div>
  );
};

NotesPanel.propTypes = propTypes;

export default NotesPanel;
