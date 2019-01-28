import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import NoteContents from 'components/NoteContents';
import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';

import core from 'core';
import getAnnotationName from 'helpers/getAnnotationName';
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
    sortStrategy: PropTypes.string.isRequired,
    openEditing: PropTypes.func.isRequired,
    closeEditing: PropTypes.func.isRequired,
    numberOfReplies: PropTypes.number.isRequired,
    contents: PropTypes.string,
    noteDateFormat: PropTypes.string
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
    core.deleteAnnotations([this.props.annotation]);
  }

  renderHeader = () => {
    const { annotation, isNoteExpanded, sortStrategy, openEditing, renderAuthorName, numberOfReplies, noteDateFormat } = this.props;
    const name = getAnnotationName(annotation);
    const icon = getAnnotationIcon(name);
    const color = annotationColorToCss(annotation[getAnnotationColor(name)]);

    return (
      <div className="title">
        <div className="type">
          {icon
          ? <Icon className="icon" glyph={icon} color={color} />
          : annotation.Subject
          }
        </div>
        {renderAuthorName(annotation)}
        {(sortStrategy !== 'time' || isNoteExpanded || numberOfReplies > 0) &&
          <span className="spacer"></span>
        }
        <div className="time">
          {(sortStrategy !== 'time' || isNoteExpanded) &&
            dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)
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
    const { annotation, renderContents, isEditing, closeEditing, searchInput, contents } = this.props;

    return(
      <div className="NoteRoot">
        {this.renderHeader()}
        <NoteContents 
          annotation={annotation} 
          contents={contents}
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
  sortStrategy: selectors.getSortStrategy(state),
  noteDateFormat: selectors.getNoteDateFormat(state)
});

export default connect(mapStateToProps)(NoteRoot);