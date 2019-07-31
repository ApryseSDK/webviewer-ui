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
import getLatestActivityDate from 'helpers/getLatestActivityDate';

import './NotesPanel.scss';

class NotesPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    display: PropTypes.string.isRequired,
    sortStrategy: PropTypes.string.isRequired,
    pageLabels: PropTypes.array.isRequired,
    customNoteFilter: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      searchInput: '',
    };
    this.rootAnnotations = [];
    this.updatePanelOnInput = _.debounce(
      this.updatePanelOnInput.bind(this),
      500
    );
    // this.onAnnotationChanged = _.debounce(
    //   this.onAnnotationChanged.bind(this),
    //   500
    // );
  }

  componentDidMount() {
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
    core.addEventListener('documentLoaded', this.renderNotes123);
  }

  renderNotes123 = () => {
    console.log('here1');
    window.docViewer.getAnnotationsLoadedPromise().then(() => {
      console.log('here2');
      const sortedAnnotationsList = getSortStrategies()[
        this.props.sortStrategy
      ].getSortedNotes(core.getAnnotationsList());
  
      const notes = [];
  
      for (let i = 0; i < sortedAnnotationsList.length; i++) {
        const annot = sortedAnnotationsList[i];
  
        // if (!annot.Hidden && annot.Listable) {
        //   annot._ui_isVisible = true;
        // }
  
        if (!annot.isReply()) {
          notes.push(annot);
        }
      }
  
      this.setState({
        notes,
      });

      core.addEventListener('annotationChanged', this.onAnnotationChanged);
      core.addEventListener('annotationHidden', this.onAnnotationChanged);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customNoteFilter !== this.props.customNoteFilter) {
      const visibleNotes = this.filterAnnotations(
        this.rootAnnotations,
        this.state.searchInput
      );
      this.setState({ visibleNotes });
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

    const notes = [];

    for (let i = 0; i < sortedAnnotationsList.length; i++) {
      const annot = sortedAnnotationsList[i];

      // if (!annot.Hidden && annot.Listable) {
      //   annot._ui_isVisible = true;
      // }

      if (!annot.isReply()) {
        notes.push(annot);
      }
    }

    this.setState({
      notes,
    });
  };

  handleInputChange = e => {
    const searchInput = e.target.value;

    this.updatePanelOnInput(searchInput);
  };

  updatePanelOnInput = searchInput => {
    core.deselectAllAnnotations();
    const notesToRender = this.filterAnnotations(
      this.rootAnnotations,
      searchInput
    );

    if (searchInput.trim()) {
      core.selectAnnotations(notesToRender);
    }

    this.setVisibleNoteIds(notesToRender);
    this.setState({ notesToRender, searchInput });
  };

  filterAnnotations = (annotations, searchInput) => {
    const { customNoteFilter } = this.props;
    let filteredAnnotations = annotations;

    if (customNoteFilter) {
      filteredAnnotations = filteredAnnotations.filter(customNoteFilter);
    }

    if (searchInput.trim()) {
      filteredAnnotations = filteredAnnotations.filter(rootAnnotation =>
        this.filterNoteBasedOnInput(rootAnnotation, searchInput)
      );
    }

    return filteredAnnotations;
  };

  filterNoteBasedOnInput = (rootAnnotation, searchInput) => {
    const replies = rootAnnotation.getReplies();
    // reply is also a kind of annotation
    // https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#createAnnotationReply__anchor
    const annotations = [rootAnnotation, ...replies];

    return annotations.some(annotation => {
      const content = annotation.getContents();
      const authorName = core.getDisplayAuthor(annotation);

      return (
        this.isInputIn(content, searchInput) ||
        this.isInputIn(authorName, searchInput)
      );
    });
  };

  isInputIn = (string, searchInput) => {
    if (!string) {
      return false;
    }

    return string.search(new RegExp(searchInput, 'i')) !== -1;
  };

  isNoteVisible = note => note.Listable && !note.Hidden;

  renderNotesPanelContent = notes => {
    const hasVisibleNotes = notes.some(this.isNoteVisible);

    return (
      <React.Fragment>
        <div
          className={classNames({
            'notes-wrapper': true,
            visible: hasVisibleNotes,
          })}
        >
          {this.renderNotes(notes)}
        </div>
        <div
          className={classNames({
            'no-results': true,
            visible: !hasVisibleNotes,
          })}
        >
          {this.props.t('message.noResults')}
        </div>
      </React.Fragment>
    );
  };

  renderNotes = notes => {
    return notes.map((note, index) => {
      const isVisible = this.isNoteVisible(note);

      return (
        <div key={note.Id}>
          {isVisible && this.renderListSeparator(notes, note, index)}
          <Note
            visible={isVisible}
            annotation={note}
            replies={note.getReplies()}
            searchInput={this.state.searchInput}
            rootContents={note.getContents()}
          />
        </div>
        // <React.Fragment key={note.Id + getLatestActivityDate(note)}>
        // </React.Fragment>
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

    if (isDisabled) {
      return null;
    }

    return (
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
          <React.Fragment>
            <div className="header">
              <input
                type="text"
                placeholder={t('message.searchPlaceholder')}
                onChange={this.handleInputChange}
              />
              <Dropdown items={Object.keys(getSortStrategies())} />
            </div>
            {this.renderNotesPanelContent(notes)}
          </React.Fragment>
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
  customNoteFilter: selectors.getCustomNoteFilter(state),
});

export default connect(mapStatesToProps)(translate()(NotesPanel));
