import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import Note from 'components/Note';
import ListSeparator from 'components/ListSeparator';

import core from 'core';
import sortMap from 'constants/sortMap';
import selectors from 'selectors';

import './NotesPanel.scss';

class NotesPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    display: PropTypes.string.isRequired,
    sortNotesBy: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }
  
  constructor() {
    super();
    this.state = {
      notesToRender: [], 
      searchInput: ''
    };
    this.visibleNoteIds = new Set();
    this.rootAnnotations = [];
    this.updatePanelOnInput = _.debounce(this.updatePanelOnInput.bind(this), 500);
  }

  componentDidMount() {
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener('annotationHidden', this.onAnnotationChanged);
  }

  componentWillUnmount() {
    core.removeEventListener('documentUnloaded', this.onDocumentUnloaded);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener('annotationHidden', this.onAnnotationChanged);
  }

  onDocumentUnloaded = () => {
    this.visibleNoteIds.clear();
    this.setState({ notesToRender: [] });
  }

  onAnnotationChanged = () => {
    this.rootAnnotations = this.getRootAnnotations();  
    const notesToRender = this.filterAnnotations(this.rootAnnotations, this.state.searchInput);
    
    this.setVisibleNoteIds(notesToRender);
    this.setState({ notesToRender });
  }

  getRootAnnotations = () => core.getAnnotationsList().filter(annotation => annotation.Listable && !annotation.isReply() && !annotation.Hidden);

  handleInputChange = e => {
    const searchInput = e.target.value;

    this.updatePanelOnInput(searchInput);
  }

  updatePanelOnInput = searchInput => {
    let notesToRender;

    core.deselectAllAnnotations();
    if (searchInput.trim()) {
      notesToRender = this.filterAnnotations(this.rootAnnotations, searchInput);
      core.selectAnnotations(notesToRender); 
    } else {
      notesToRender = this.rootAnnotations;
    }

    this.setVisibleNoteIds(notesToRender);
    this.setState({ notesToRender, searchInput });
  }

  filterAnnotations = (annotations, searchInput) => {
    return annotations.filter(rootAnnotation => {
      const replies = rootAnnotation.getReplies();
      // reply is also a kind of annotation
      // https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#createAnnotationReply__anchor
      const annotations = [ rootAnnotation, ...replies ];

      return annotations.some(annotation => {
        const content = annotation.getContents();
        const authorName = core.getDisplayAuthor(annotation);

        return this.isInputIn(content, searchInput) || this.isInputIn(authorName, searchInput);
      });
    });
  }

  isInputIn = (string, searchInput) => {
    if (!string) {
      return false;
    }

    return string.search(new RegExp(searchInput, 'i')) !== -1;
  }

  setVisibleNoteIds = visibleNotes => {
    this.visibleNoteIds.clear();

    visibleNotes.forEach(note => {
      this.visibleNoteIds.add(note.Id);
    });
  }

  getPrevNote = (sortedNotes, currNote) => {
    const sortedVisibleNotes = sortedNotes.filter(note => this.isVisibleNote(note));
    const sortedVisibleNoteIds = sortedVisibleNotes.map(note => note.Id);
    const indexOfCurrNote = sortedVisibleNoteIds.indexOf(currNote.Id);

    return indexOfCurrNote === 0 ? sortedVisibleNotes[indexOfCurrNote] : sortedVisibleNotes[indexOfCurrNote - 1]; 
  }
  
  isVisibleNote = note => this.visibleNoteIds.has(note.Id)

  renderNotesPanelContent = () => {
    const {notesToRender} = this.state;

    return(
      <React.Fragment>
        <div className={`notes-wrapper ${notesToRender.length ? 'visible' : 'hidden'}`}>
          {this.renderNotes(sortMap[this.props.sortNotesBy].getSortedNotes(this.rootAnnotations))}
        </div>
        <div className={`no-results ${notesToRender.length ? 'hidden' : 'visible'}`}>
          {this.props.t('message.noResults')}
        </div>
      </React.Fragment>
    );
  }

  renderNotes = notes => {
    return(
      notes.map(note => {
        return (
          <React.Fragment key={note.Id}>
            {this.renderListSeparator(notes, note)}
            <Note visible={this.isVisibleNote(note)} annotation={note} searchInput={this.state.searchInput} />
          </React.Fragment>
        );
      })
    );
  }

  renderListSeparator = (notes, currNote) => {
    const { shouldRenderSeparator, getSeparatorContent } = sortMap[this.props.sortNotesBy];
    const prevNote = this.getPrevNote(notes, currNote);
    const isFirstNote = prevNote === currNote;

    if (
      this.isVisibleNote(currNote) &&
      shouldRenderSeparator && 
      getSeparatorContent &&
      (isFirstNote || shouldRenderSeparator(prevNote, currNote))
    ) {
      return <ListSeparator renderContent={() => getSeparatorContent(prevNote, currNote)} />;
    }

    return null;
  }

  render() {
    const { isDisabled, display, t } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div className="Panel NotesPanel" style={{ display }} data-element="notesPanel" onClick={() => core.deselectAllAnnotations()}>
        {this.rootAnnotations.length === 0 
        ? <div className="no-annotations">{t('message.noAnnotations')}</div>
        : <React.Fragment>
            <div className="header">
              <input 
                type="text" 
                placeholder={t('message.searchPlaceholder')}
                onChange={this.handleInputChange} 
              />
              <Dropdown items={Object.keys(sortMap)} />
            </div>
            {this.renderNotesPanelContent()}
          </React.Fragment>
        }
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  sortNotesBy: selectors.getSortNotesBy(state),
  isDisabled: selectors.isElementDisabled(state, 'notesPanel'),
});

export default connect(mapStatesToProps)(translate()(NotesPanel));
