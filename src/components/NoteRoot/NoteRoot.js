import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import NoteContents from 'components/NoteContents';
import NotePopup from 'components/NotePopup';
import Icon from 'components/Icon';

import core from 'core';
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
    t: PropTypes.func.isRequired,
    numberOfReplies: PropTypes.number.isRequired,
    noteDateFormat: PropTypes.string,
    iconColor: PropTypes.oneOf([ 'TextColor', 'StrokeColor', 'FillColor' ]),
    contents: PropTypes.string
  }

  deleteNote = () => {
    core.deleteAnnotations([ this.props.annotation ]);
  }

  renderHeader = () => {
    const { annotation, isNoteExpanded, sortStrategy, openEditing, renderAuthorName, numberOfReplies, noteDateFormat, iconColor, icon } = this.props;
    const color = iconColor && annotation[iconColor] && annotation[iconColor].toHexString();

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
    const { t, annotation, renderContents, isEditing, closeEditing, searchInput, contents } = this.props;
    const annotationState = annotation.getStatus();

    return (
      <div className="NoteRoot">
        {this.renderHeader()}
        {annotationState && annotationState !== 'None' &&
          <div className="status">{t('option.status.status')}: {annotationState}</div>
        }
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
  iconColor: selectors.getIconColor(state, annotation.ToolName),
  icon: selectors.getToolButtonIcon(state, annotation.ToolName)
});

export default connect(mapStateToProps)(withTranslation()(NoteRoot));