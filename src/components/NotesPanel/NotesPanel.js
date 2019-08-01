import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import ListSeparator from 'components/ListSeparator';

import core from 'core';
import selectors from 'selectors';
import { getSortStrategies } from 'constants/sortStrategies';

import './NotesPanel.scss';

class NotesPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isLeftPanelOpen: PropTypes.bool,
    display: PropTypes.string.isRequired,
    sortStrategy: PropTypes.string.isRequired,
    pageLabels: PropTypes.array.isRequired,
    customNoteFilter: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  // http://localhost:3000/#d=https://pdftron.s3.amazonaws.com/downloads/pl/test/PlansEJ.pdf&a=1

  constructor(props) {
    super(props);
    this.initialState = {
      notes: [],
      searchInput: ''
    };
    this.state = this.initialState;
    this._handleInputChange = _.debounce(
      this._handleInputChange.bind(this),
      500
    );
    this.isFirstTimeOpen = false;
  }

  componentDidMount() {
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
  }

  componentDidUpdate(prevProps) {
    if (
      !prevProps.isLeftPanelOpen &&
      this.props.isLeftPanelOpen &&
      !this.isFirstTimeOpen
    ) {
      this.isFirstTimeOpen = true;
      this.setNotes();

      core.addEventListener('annotationChanged', this.setNotes);
      core.addEventListener('annotationHidden', this.setNotes);
    }
  }

  componentWillUnmount() {
    core.removeEventListener('documentUnloaded', this.onDocumentUnloaded);
    core.removeEventListener('annotationChanged', this.setNotes);
    core.removeEventListener('annotationHidden', this.setNotes);
  }

  onDocumentUnloaded = () => {
    this.setState(this.initialState);
  };

  setNotes = () => {
    this.setState({
      notes: core.getAnnotationsList().filter(annot => !annot.isReply())
    });
  };

  handleInputChange = e => {
    this._handleInputChange(e.target.value);
  };

  _handleInputChange = value => {
    // this function is used to solve the issue with using synthetic event asynchronously.
    // https://reactjs.org/docs/events.html#event-pooling
    core.deselectAllAnnotations();

    this.setState({
      searchInput: value
    });
  };

  isNoteVisible = note => {
    const { searchInput } = this.state;
    const { customNoteFilter } = this.props;
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
            this.isInputIn(content, searchInput) ||
            this.isInputIn(authorName, searchInput)
          );
        });
    }

    return isVisible;
  };

  isInputIn = (string, searchInput) => {
    if (!string) {
      return false;
    }

    return string.search(new RegExp(searchInput, 'i')) !== -1;
  };

  render() {
    const { isDisabled, display, t, sortStrategy, pageLabels } = this.props;
    const { notes } = this.state;

    let child;
    if (notes.length === 0) {
      child = (
        <div className="no-annotations">{t('message.noAnnotations')}</div>
      );
    } else {
      const sortedNotes = getSortStrategies()[sortStrategy].getSortedNotes(
        notes
      );
      const hasVisibleNotes = sortedNotes.some(this.isNoteVisible);
      let prevVisibleNoteIndex = -1;

      child = (
        <>
          <div className="header">
            <input
              type="text"
              placeholder={t('message.searchPlaceholder')}
              onChange={this.handleInputChange}
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
              const isVisible = this.isNoteVisible(note);

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
                  <Note
                    visible={isVisible}
                    annotation={note}
                    replies={note.getReplies()}
                    searchInput={this.state.searchInput}
                    rootContents={note.getContents()}
                  />
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
            {this.props.t('message.noResults')}
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
  }
}

const mapStatesToProps = state => ({
  sortStrategy: selectors.getSortStrategy(state),
  isDisabled: selectors.isElementDisabled(state, 'notesPanel'),
  pageLabels: selectors.getPageLabels(state),
  customNoteFilter: selectors.getCustomNoteFilter(state)
});

export default connect(mapStatesToProps)(translate()(NotesPanel));
