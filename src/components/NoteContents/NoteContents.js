import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import './NoteContents.scss';
import AtMentionsReplyBox from '../AtMentionsReplyBox/AtMentionsReplyBox';

class NoteContents extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    renderContents: PropTypes.func.isRequired,
    annotation: PropTypes.object.isRequired,
    closeEditing: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    contents: PropTypes.string,
    atMentions: PropTypes.arrayOf(PropTypes.object),
    atMentionsCallback: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.replyBox = React.createRef();
    this.state = {
      isChanged: false,
      word: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isEditing && this.props.isEditing) {
      this.replyBox.current.setText(this.props.contents || '');
      this.setState({ word: this.replyBox.current.getText() }, () => {
        this.replyBox.current.focus();
        this.onChange();
      });
    }

    if (prevProps.contents !== this.props.contents && this.replyBox.current) {
      this.replyBox.current.setText(this.props.contents);
    }
  }

  onChange = () => {
    this.setState({ isChanged: this.replyBox.current.getText() !== this.state.word });
  }

  onKeyDown = e => {
    if ((e.metaKey || e.ctrlKey) && e.which === 13) { // (Cmd/Ctrl + Enter)
      this.setContents(e);
    }
  }

  handleNoteContentsClick = e => {
    // we stop propagation when we are editing the contents to
    // prevent note components from receiving this event and collapsing the note
    if (this.props.isEditing) {
      e.stopPropagation();
    }
  }

  setContents = e => {
    e.preventDefault();
    const { annotation, closeEditing } = this.props;

    if (this.state.isChanged) {

      const atMentionedUsers = this.replyBox.current.getAtMentionedItems();
      if (this.props.atMentionsCallback && atMentionedUsers.length > 0) {
        this.props.atMentionsCallback(atMentionedUsers);
      }

      core.setNoteContents(annotation, this.replyBox.current.getText());
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([ annotation ]);
      }
      closeEditing();
    }
  }

  render() {
    const { isEditing, closeEditing, renderContents, t, contents, atMentions } = this.props;

    return (
      <div className="NoteContents" onClick={this.handleNoteContentsClick} onMouseDown={this.handleNoteContentsClick}>
        {isEditing &&
          <div className={`edit-content ${isEditing ? 'visible' : 'hidden'}`}>
            <AtMentionsReplyBox
              ref={this.replyBox}
              onInput={this.onChange}
              onKeyDown={this.onKeyDown}
              onBlur={closeEditing}
              placeholder={`${t('action.comment')}...`}
              atMentions={atMentions}
            />
            <span className="buttons">
              <button className = {this.state.isChanged ? '':'disabled'} onMouseDown={this.setContents}>{t('action.save')}</button>
              <button onMouseDown={closeEditing}>{t('action.cancel')}</button>
            </span>
          </div>
        }
        <div className={`container ${isEditing ? 'hidden' : 'visible'}`}>
          {renderContents(contents)}
        </div>
      </div>

    );
  }
}


const mapStateToProps = state => ({
  atMentions: selectors.getAtMentions(state),
  atMentionsCallback: selectors.getAtMentionsCallback(state),
});


export default connect(mapStateToProps, null)(translate()(NoteContents));