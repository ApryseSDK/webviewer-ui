import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyle from 'helpers/getAnnotationStyle';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationPopup.scss';

class AnnotationPopup extends React.PureComponent {
  static propTypes = {
    isNotesPanelDisabled: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isLeftPanelOpen: PropTypes.bool,
    isRightPanelOpen: PropTypes.bool,
    isAnnotationStylePopupDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setIsNoteEditing: PropTypes.func.isRequired,
    setActiveLeftPanel: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.popup = React.createRef();
    this.initialState = {
      annotation: {},
      left: 0,
      top: 0,
      canModify: false,
      isStylePopupOpen: false
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    core.addEventListener('annotationSelected', this.onAnnotationSelected);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const selectedAnAnnotation = Object.keys(this.state.annotation).length !== 0 && prevState.annotation.Id !== this.state.annotation.Id;
    const isStylePopupOpen = !prevState.isStylePopupOpen && this.state.isStylePopupOpen;
    const isContainerShifted = prevProps.isLeftPanelOpen !== this.props.isLeftPanelOpen || prevProps.isRightPanelOpen !== this.props.isRightPanelOpen;

    if (selectedAnAnnotation && !this.props.isDisabled || isStylePopupOpen) {
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
    }

    if (isContainerShifted) {
      this.props.closeElement('annotationPopup');
    }

    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  onAnnotationSelected = (e, annotations, action) => {
    if (action === 'selected' && annotations.length === 1) {
      const annotation = annotations[0];
      this.setState({
        annotation,
        canModify: core.canModify(annotation)
      });
    } else {
      this.props.closeElement('annotationPopup');
      this.setState({ ...this.initialState });
    }
  }

  onAnnotationChanged = (e, annotations, action) => {
    if (action === 'modify' && core.isAnnotationSelected(this.state.annotation)) {
      // Position change
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
      // Style change
      this.forceUpdate();
    }
  }

  onUpdateAnnotationPermission = () => {
    const canModify = this.state.annotation ? core.canModify(this.state.annotation) : false;

    this.setState({ canModify });
  }

  handleWindowResize = () => {
    this.props.closeElement('annotationPopup');
  }

  positionAnnotationPopup = () => {
    const { left, top } = getAnnotationPopupPositionBasedOn(this.state.annotation, this.popup);

    this.setState({ left, top });
  }
  
  commentOnAnnotation = () => {
    if (!this.props.isLeftPanelOpen) {
      this.props.openElement('notesPanel');
      setTimeout(() => {
        this.props.setIsNoteEditing(true);
      }, 400);
    } else {
      this.props.setActiveLeftPanel('notesPanel');
      this.props.setIsNoteEditing(true);
    }

    this.props.closeElement('annotationPopup');
  }

  openStylePopup = () => {
    this.setState({ isStylePopupOpen: true });
  }

  deleteAnnotation = () => {
    core.deleteAnnotations([ this.state.annotation, ...this.state.annotation.getReplies() ]);
    this.props.closeElement('annotationPopup');
  }

  render() {
    const { annotation, left, top, canModify, isStylePopupOpen } = this.state;
    const { isNotesPanelDisabled, isDisabled, isOpen, isAnnotationStylePopupDisabled } = this.props;
    const style = getAnnotationStyle(annotation);
    const hasStyle = Object.keys(style).length > 0;
    const className = getClassName(`Popup AnnotationPopup`, this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} ref={this.popup} data-element="annotationPopup" style={{ left, top }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
        {isStylePopupOpen 
        ? <AnnotationStylePopup annotation={annotation} style={style} isOpen={isOpen} />
        : <React.Fragment>
            {!isNotesPanelDisabled &&
              <ActionButton dataElement="annotationCommentButton" title="action.comment" img="ic_comment_black_24px" onClick={this.commentOnAnnotation} />
            }
            {canModify && hasStyle && !isAnnotationStylePopupDisabled &&
              <ActionButton dataElement="annotationStyleEditButton" title="action.style" img="ic_palette_black_24px" onClick={this.openStylePopup} />
            }
            {canModify &&
              <ActionButton dataElement="annotationDeleteButton" title="action.delete" img="ic_delete_black_24px" onClick={this.deleteAnnotation} />
            }
          </React.Fragment>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isNotesPanelDisabled: selectors.isElementDisabled(state, 'notesPanel'),
  isDisabled: selectors.isElementDisabled(state, 'annotationPopup'),
  isAnnotationStylePopupDisabled: selectors.isElementDisabled(state, 'annotationStylePopup'),
  isOpen: selectors.isElementOpen(state, 'annotationPopup'),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElement: actions.closeElement,
  setIsNoteEditing: actions.setIsNoteEditing,
  setActiveLeftPanel: actions.setActiveLeftPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationPopup);