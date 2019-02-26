import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import core from 'core';

import './NoteContents.scss';

class NoteContents extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    renderContents: PropTypes.func.isRequired,
    annotation: PropTypes.object.isRequired,
    closeEditing: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    contents: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      isChanged: false,
      word: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isEditing && this.props.isEditing) {
      this.setState({ word: this.textInput.current.value }, () => {
        this.textInput.current.focus();
        this.onChange();
      });
    }

    if (prevProps.contents !== this.props.contents && this.textInput.current) {
      this.textInput.current.value = this.props.contents;
    }
  }
  
  onChange = () => {
    this.setState({ isChanged: this.textInput.current.value !== this.state.word });    
    this.textInput.current.style.height = '30px';
    this.textInput.current.style.height = (this.textInput.current.scrollHeight + 2) + 'px';
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
      core.setNoteContents(annotation, this.textInput.current.value);
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([ annotation ]);
      }
      closeEditing();
    }
  }

  render() {
    const { isEditing, closeEditing, renderContents, t, contents } = this.props;

    return (
      <div className="NoteContents" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
        {isEditing && 
          <div className={`edit-content ${isEditing ? 'visible' : 'hidden'}`}>
          <textarea 
              ref={this.textInput} 
              onChange={this.onChange} 
              onKeyDown={this.onKeyDown}
              onBlur={closeEditing}         
              defaultValue={contents} 
              placeholder={`${t('action.comment')}...`}
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

export default translate()(NoteContents);