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
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      isChanged: false,
      word: ""
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isEditing && this.props.isEditing) {
      this.setState({ word: this.textInput.current.value }, () => {
        this.textInput.current.focus();
        this.onChange();
      });
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

  setContents = e => {
    e.preventDefault();
    if (this.state.isChanged) {
      core.setNoteContents(this.props.annotation, this.textInput.current.value);
      if (this.props.annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([ this.props.annotation ]);
      }
      this.props.closeEditing();
    }
  }

  render() {
    const { isEditing, closeEditing, annotation, renderContents, t } = this.props;
    const contents = annotation.getContents();

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