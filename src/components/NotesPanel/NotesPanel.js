import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import ListSeparator from 'components/ListSeparator';

import core from 'core';
import selectors from 'selectors';
import { getSortStrategies } from 'constants/sortStrategies';

import './NotesPanel.scss';

const propTypes = {
  isLeftPanelOpen: PropTypes.bool,
  display: PropTypes.string.isRequired,
};

const NotesPanel = ({ isLeftPanelOpen, display }) => {
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
  const [t] = useTranslation();
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
        core.removeEventListener('annotationHidden', _setNotes);
      };
    }
  }, [isLeftPanelOpen]);

  const isNoteVisible = note => {
    let isVisible = note.Listable && !note.Hidden && !note.isGrouped();

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
            visible: hasVisibleNotes,
          })}
        >
          {sortedNotes.map((note, index) => {
            const isVisible = isNoteVisible(note);

            let listSeparator = null;
            if (isVisible) {
              const {
                shouldRenderSeparator,
                getSeparatorContent,
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
                <Note
                  annotation={note}
                  searchInput={searchInput}
                  visible={isVisible}
                />
              </React.Fragment>
            );
          })}
        </div>
        <div
          className={classNames({
            'no-results': true,
            visible: !hasVisibleNotes,
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

export default NotesPanel;
