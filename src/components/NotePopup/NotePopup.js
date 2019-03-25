import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Icon from 'components/Icon';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './NotePopup.scss';

class NotePopup extends React.Component {
  static propTypes = {
    annotation: PropTypes.object.isRequired,
    notePopupId: PropTypes.string.isRequired,
    isNoteExpanded: PropTypes.bool.isRequired,
    setNotePopupId: PropTypes.func.isRequired,
    openEditing: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    isEditDisabled: PropTypes.bool,
    isDeleteDisabled: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = { 
      canModify: core.canModify(props.annotation)
    };
  }

  componentDidMount() {
    core.addEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
  }

  componentWillUnmount() {
    core.removeEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
  }

  onUpdateAnnotationPermission = () => {
    this.setState({
      canModify: core.canModify(this.props.annotation)
    });
  }

  togglePopup = () => {
    const { notePopupId, annotation, setNotePopupId } = this.props;
    const isOpen = notePopupId === annotation.Id;

    if (isOpen) {
      this.closePopup();
    } else {
      setNotePopupId(annotation.Id);
    }
  }

  closePopup = () => {
    this.props.setNotePopupId('');
  }

  openEdit = () => {
    this.props.openEditing();
  }

  render() {
    const { canModify } = this.state;
    const { t, isNoteExpanded, notePopupId, annotation, onDelete, isDisabled, isEditDisabled, isDeleteDisabled } = this.props;
    const isOpen = notePopupId === annotation.Id;
    const className = getClassName('modify', { isOpen });

    if (!canModify || !isNoteExpanded || isDisabled) {
      return null;
    }

    return(
      <div className="NotePopup" data-element="notePopup" onClick={e => e.stopPropagation()}>
        <div className="overflow" onClick={this.togglePopup}>
          <Icon glyph="ic_overflow_black_24px" />
        </div>
        <div className={className} onClick={this.closePopup}>
          {!isEditDisabled &&
            <div data-element="notePopupEdit" onClick={this.openEdit}>{t('action.edit')}</div>
          }
          {!isDeleteDisabled &&
            <div data-element="notePopupDelete" onClick={onDelete}>{t('action.delete')}</div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notePopupId: selectors.getNotePopupId(state),
  isDisabled: selectors.isElementDisabled(state, 'notePopup'),
  isEditDisabled: selectors.isElementDisabled(state, 'notePopupEdit'),
  isDeleteDisabled: selectors.isElementDisabled(state, 'notePopupDelete'),
});

const mapDispatchToProps = {
  setNotePopupId: actions.setNotePopupId
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(NotePopup));