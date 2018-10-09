import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import NoteContents from 'components/NoteContents';
import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';

import core from 'core';
import getAnnotationType from 'helpers/getAnnotationType';
import getAnnotationIcon from 'helpers/getAnnotationIcon';
import annotationColorToCss from 'helpers/annotationColorToCss';
import getAnnotationColor from 'helpers/getAnnotationColor';
import selectors from 'selectors';

import './NoteRoot.scss';

class NoteRoot extends React.Component {
  static propTypes = {
    annotation: PropTypes.object.isRequired,
    searchInput: PropTypes.string,
    renderAuthorName: PropTypes.func.isRequired,
    renderContents: PropTypes.func.isRequired,
    isNoteExpanded: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    sortNotesBy: PropTypes.string.isRequired,
    openEditing: PropTypes.func.isRequired,
    closeEditing: PropTypes.func.isRequired,
    numberOfReplies: PropTypes.number.isRequired
  }

  constructor(props) { 
    super(props);
  }

  componentDidMount() {
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
  }

  componentWillUnmount() {
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
  }

  onAnnotationChanged = () => {
    if (this.props.isNoteExpanded) {
      this.forceUpdate();
    }
  }
  
  deleteNote = () => {
    const { annotation } = this.props;

    core.deleteAnnotations([ ...annotation.getReplies(), annotation ]);
  }

  renderHeader = () => {
    const { annotation, isNoteExpanded, sortNotesBy, openEditing, renderAuthorName, numberOfReplies } = this.props;
    const type = getAnnotationType(annotation);
    const icon = getAnnotationIcon(type);
    const color = annotationColorToCss(annotation[getAnnotationColor(type)]);

    return (
      <div className="title">
        <div className="type">
          {icon
          ? <Icon className="icon" glyph={icon} color={color} />
          : annotation.Subject
          }
        </div>
        {renderAuthorName(annotation)}
        {(sortNotesBy !== 'time' || isNoteExpanded || numberOfReplies > 0) &&
          <span className="spacer"></span>
        }
        <div className="time">
          {(sortNotesBy !== 'time' || isNoteExpanded) &&
            dayjs(annotation.DateCreated || new Date()).format('MMM D, h:mma')
          }
          {numberOfReplies > 0 &&
            ` (${numberOfReplies})`
          }
        </div>
        <NotePopup 
          annotation={annotation} 
          isNoteExpanded={isNoteExpanded} 
          openEditing={openEditing} 
          onDelete={this.deleteNote} 
        />
      </div>
    );
  }

  render() {
    const { annotation, renderContents, isEditing, closeEditing, searchInput } = this.props;

    return(
      <div className="NoteRoot">
        {this.renderHeader()}
        <NoteContents 
          annotation={annotation} 
          searchInput={searchInput} 
          renderContents={renderContents} 
          isEditing={isEditing} 
          closeEditing={closeEditing} 
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sortNotesBy: selectors.getSortNotesBy(state)
});

export default connect(mapStateToProps)(NoteRoot);