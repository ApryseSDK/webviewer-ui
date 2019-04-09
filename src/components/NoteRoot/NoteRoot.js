import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import NoteContents from 'components/NoteContents';
import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';

import core from 'core';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
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
    noteDateFormat: PropTypes.string,
    iconColor: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    contents: PropTypes.string
  }

  componentDidMount() {
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
  }

  componentWillUnmount() {
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
  }

  onAnnotationChanged = () => {
    const { isNoteExpanded } = this.props;

    if (isNoteExpanded) {
      this.forceUpdate();
    }
  }
  
  deleteNote = () => {
    core.deleteAnnotations([this.props.annotation]);
  }

  renderHeader = () => {
    const { annotation, isNoteExpanded, sortStrategy, openEditing, renderAuthorName, numberOfReplies, noteDateFormat, iconColor } = this.props;
    const color = iconColor && annotation[iconColor].toHexString();
    const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
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

const mapStateToProps = (state, { annotation }) => ({
  sortStrategy: selectors.getSortStrategy(state),
  noteDateFormat: selectors.getNoteDateFormat(state),
  iconColor: selectors.getIconColor(state, mapAnnotationToKey(annotation))
});

export default connect(mapStateToProps)(NoteRoot);