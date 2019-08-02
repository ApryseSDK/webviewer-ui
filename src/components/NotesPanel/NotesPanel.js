import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import ListSeparator from 'components/ListSeparator';
import NoteContext from 'components/Note/Context';

import core from 'core';
import selectors from 'selectors';
import { getSortStrategies } from 'constants/sortStrategies';

import './NotesPanel.scss';

const propTypes = {
  isDisabled: PropTypes.bool,
  isLeftPanelOpen: PropTypes.bool,
  display: PropTypes.string.isRequired,
  sortStrategy: PropTypes.string.isRequired,
  pageLabels: PropTypes.array.isRequired,
  customNoteFilter: PropTypes.func,
  t: PropTypes.func.isRequired
};

const NotesPanel = ({
  isDisabled,
  isLeftPanelOpen,
  display,
  sortStrategy,
  pageLabels,
  customNoteFilter,
  t
}) => {
  const [notes, setNotes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const isFirstTimeOpenRef = useRef(true);

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
    if (isLeftPanelOpen && isFirstTimeOpenRef.current) {
      isFirstTimeOpenRef.current = false;

      const _setNotes = () => {
        setNotes(core.getAnnotationsList().filter(annot => !annot.isReply()));
      };

      core.addEventListener('annotationChanged', _setNotes);
      core.addEventListener('annotationHidden', _setNotes);
      _setNotes();

      return () => {
        core.removeEventListener('annotationChanged', _setNotes);
        core.removeEventListener('annotationHidden', _setNotes);
      };
    }
  }, [isLeftPanelOpen]);

  const isNoteVisible = note => {
    let isVisible = note.Listable && !note.Hidden;

    if (customNoteFilter) {
      isVisible = isVisible && customNoteFilter(note);
    }

    if (searchInput) {
      const replies = note.getReplies();
      // reply is also a kind of annotation
      // https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#createAnnotationReply__anchor
      const noteAndReplies = [note, ...replies];

      isVisible =
        isVisible &&
        noteAndReplies.some(note => {
          const content = note.getContents();
          const authorName = core.getDisplayAuthor(note);

          return (
            isInputIn(content, searchInput) ||
            isInputIn(authorName, searchInput)
          );
        });
    }

    return isVisible;
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

  let child;
  if (notes.length === 0) {
    child = <div className="no-annotations">{t('message.noAnnotations')}</div>;
  } else {
    const sortedNotes = getSortStrategies()[sortStrategy].getSortedNotes(notes);
    const hasVisibleNotes = sortedNotes.some(isNoteVisible);
    let prevVisibleNoteIndex = -1;

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
        <div
          className={classNames({
            'notes-wrapper': true,
            visible: hasVisibleNotes
          })}
        >
          {sortedNotes.map((note, index) => {
            const isVisible = isNoteVisible(note);

            let listSeparator = null;
            if (isVisible) {
              const {
                shouldRenderSeparator,
                getSeparatorContent
              } = getSortStrategies()[sortStrategy];
              const prevNote =
                prevVisibleNoteIndex === -1
                  ? null
                  : sortedNotes[prevVisibleNoteIndex];

              prevVisibleNoteIndex = index;

              if (
                shouldRenderSeparator &&
                getSeparatorContent &&
                (!prevNote || shouldRenderSeparator(prevNote, note))
              ) {
                listSeparator = (
                  <ListSeparator
                    renderContent={() =>
                      getSeparatorContent(prevNote, note, { pageLabels })
                    }
                  />
                );
              }
            }

            return (
              <React.Fragment key={note.Id}>
                {listSeparator}
                <NoteContext.Provider
                  value={{
                    note,
                    searchInput
                  }}
                >
                  <Note visible={isVisible} />
                </NoteContext.Provider>
              </React.Fragment>
            );
          })}
        </div>
        <div
          className={classNames({
            'no-results': true,
            visible: !hasVisibleNotes
          })}
        >
          {t('message.noResults')}
        </div>
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

const mapStatesToProps = state => ({
  sortStrategy: selectors.getSortStrategy(state),
  isDisabled: selectors.isElementDisabled(state, 'notesPanel'),
  pageLabels: selectors.getPageLabels(state),
  customNoteFilter: selectors.getCustomNoteFilter(state)
});

export default connect(mapStatesToProps)(translate()(NotesPanel));
