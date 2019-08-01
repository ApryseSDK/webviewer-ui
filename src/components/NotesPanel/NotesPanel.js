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
    display: PropTypes.string.isRequired,
    sortStrategy: PropTypes.string.isRequired,
    pageLabels: PropTypes.array.isRequired,
    customNoteFilter: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  // http://localhost:3000/#d=https://pdftron.s3.amazonaws.com/downloads/pl/test/PlansEJ.pdf&a=1

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      searchInput: ''
    };
    this.rootAnnotations = [];
    this._handleInputChange = _.debounce(
      this._handleInputChange.bind(this),
      500
    );
    this.onAnnotationChanged = _.debounce(
      this.onAnnotationChanged.bind(this),
      500
    );
  }

  componentDidMount() {
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener('annotationHidden', this.onAnnotationChanged);
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customNoteFilter !== this.props.customNoteFilter) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    core.removeEventListener('documentUnloaded', this.onDocumentUnloaded);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener('annotationHidden', this.onAnnotationChanged);
  }

  onDocumentUnloaded = () => {
    this.visibleNoteIds.clear();
    this.rootAnnotations = [];
    this.setState({ visibleNotes: [] });
  };

  onAnnotationChanged = () => {
    const sortedAnnotationsList = getSortStrategies()[
      this.props.sortStrategy
    ].getSortedNotes(core.getAnnotationsList());
    const notes = sortedAnnotationsList.filter(annot => !annot.isReply());

    this.setState({ notes });
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

  renderNotesPanelContent = notes => {
    const hasVisibleNotes = notes.some(this.isNoteVisible);

    return (
      <>
        <div
          className={classNames({
            'notes-wrapper': true,
            visible: hasVisibleNotes
          })}
        >
          {this.renderNotes(notes)}
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
  };

  renderNotes = notes => {
    return notes.map((note, index) => {
      const isVisible = this.isNoteVisible(note);

      return (
        <React.Fragment key={note.Id}>
          {isVisible && this.renderListSeparator(notes, note, index)}
          <Note
            visible={isVisible}
            annotation={note}
            replies={note.getReplies()}
            searchInput={this.state.searchInput}
            rootContents={note.getContents()}
          />
        </React.Fragment>
      );
    });
  };

  renderListSeparator = (notes, currNote, index) => {
    const { sortStrategy, pageLabels } = this.props;
    const { shouldRenderSeparator, getSeparatorContent } = getSortStrategies()[
      sortStrategy
    ];
    const prevNote =
      this.prevVisibleNoteIndex === -1
        ? null
        : notes[this.prevVisibleNoteIndex];

    this.prevVisibleNoteIndex = index;

    if (
      shouldRenderSeparator &&
      getSeparatorContent &&
      (!prevNote || shouldRenderSeparator(prevNote, currNote))
    ) {
      return (
        <ListSeparator
          renderContent={() =>
            getSeparatorContent(prevNote, currNote, { pageLabels })
          }
        />
      );
    }

    return null;
  };

  render() {
    this.prevVisibleNoteIndex = -1;

    const { isDisabled, display, t } = this.props;
    const { notes } = this.state;

    return isDisabled ? null : (
      <div
        className="Panel NotesPanel"
        style={{ display }}
        data-element="notesPanel"
        onClick={core.deselectAllAnnotations}
        onScroll={e => e.stopPropagation()}
      >
        {notes.length === 0 ? (
          <div className="no-annotations">{t('message.noAnnotations')}</div>
        ) : (
          <>
            <div className="header">
              <input
                type="text"
                placeholder={t('message.searchPlaceholder')}
                onChange={this.handleInputChange}
              />
              <Dropdown items={Object.keys(getSortStrategies())} />
            </div>
            {this.renderNotesPanelContent(notes)}
          </>
        )}
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  sortStrategy: selectors.getSortStrategy(state),
  isDisabled: selectors.isElementDisabled(state, 'notesPanel'),
  pageLabels: selectors.getPageLabels(state),
  pageRotation: selectors.getRotation(state),
  customNoteFilter: selectors.getCustomNoteFilter(state)
});

export default connect(mapStatesToProps)(translate()(NotesPanel));
