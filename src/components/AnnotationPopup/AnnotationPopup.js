import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import getClassName from 'helpers/getClassName';
import applyRedactions from 'helpers/applyRedactions';
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
    applyRedactions: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setIsNoteEditing: PropTypes.func.isRequired,
    setActiveLeftPanel: PropTypes.func.isRequired,
    serverURL: PropTypes.string
  }

  constructor() {
    super();
    this.popup = React.createRef();
    this.initialState = {
      firstAnnotation: {},
      left: 0,
      top: 0,
      isStylePopupOpen: false,
      isMouseLeftDown: false,
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    core.addEventListener('mouseLeftUp', this.onMouseLeftUp);
    core.addEventListener('mouseLeftDown', this.onMouseLeftDown);
    core.addEventListener('annotationSelected', this.onAnnotationSelected);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isMouseLeftDown } = this.state;

    const isAnnotationSelected = Object.keys(this.state.firstAnnotation).length !== 0;
    const isClosingAnnotationPopup = this.props.isOpen === false && this.props.isOpen !== prevProps.isOpen;
    const isStylePopupOpen = !prevState.isStylePopupOpen && this.state.isStylePopupOpen;
    const isContainerShifted = prevProps.isLeftPanelOpen !== this.props.isLeftPanelOpen || prevProps.isRightPanelOpen !== this.props.isRightPanelOpen;

    if (isAnnotationSelected && !isMouseLeftDown && !isContainerShifted && !isClosingAnnotationPopup && !this.props.isDisabled || isStylePopupOpen) {
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
    }

    if (isContainerShifted) { //closing because we can't correctly reposition the popup on panel transition
      this.props.closeElement('annotationPopup');
    }
  }

  componentWillUnmount() {
    core.removeEventListener('mouseLeftUp', this.onMouseLeftUp);
    core.removeEventListener('mouseLeftDown', this.onMouseLeftDown);
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener('updateAnnotationPermission', this.onUpdateAnnotationPermission);
    core.removeEventListener('documentUnloaded', this.onDocumentUnloaded);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  close = () => {
    this.props.closeElement('annotationPopup');
    this.setState({ ...this.initialState });
  }

  onMouseLeftUp = () => {
    this.setState({ isMouseLeftDown:false });
  }

  onMouseLeftDown = () => {
    this.setState({ isMouseLeftDown:true });
  }

  onDocumentUnloaded = () => {
    this.close();
  }

  onAnnotationSelected = (e, annotations, action) => {
    if (action === 'selected') {
      if (annotations.length > 0) {
        const firstAnnotation = annotations[0];
        this.setState({
          firstAnnotation
        });
      }
    } else {
      this.close();
    }
  }

  onAnnotationChanged = (e, annotations, action) => {
    if (action === 'modify' && core.isAnnotationSelected(this.state.firstAnnotation) && !this.props.isDisabled) {
      // Position change
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
      // Style change
      this.forceUpdate();
    }
  }

  onUpdateAnnotationPermission = () => {
    this.forceUpdate();
  }

  handleWindowResize = () => {
    this.props.closeElement('annotationPopup');
  }

  positionAnnotationPopup = () => {
    const { left, top } = getAnnotationPopupPositionBasedOn(this.state.firstAnnotation, this.popup);

    this.setState({ left, top });
  }

  commentOnAnnotation = () => {
    if (this.state.firstAnnotation instanceof Annotations.FreeTextAnnotation) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', this.state.firstAnnotation);
    } else if (!this.props.isLeftPanelOpen) {
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

  deleteAnnotations = () => {
    core.deleteAnnotations(core.getSelectedAnnotations());
    this.props.closeElement('annotationPopup');
  }

  redactAnnotation = () => {
    this.props.applyRedactions(this.state.firstAnnotation);
    this.props.closeElement('annotationPopup');
  }

  groupAnnotations = () => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = core.getSelectedAnnotations();
    const primaryAnnotation = selectedAnnotations.find(
      selectedAnnotation => !selectedAnnotation.InReplyTo
    );
    annotManager.groupAnnotations(primaryAnnotation, selectedAnnotations);
  }

  ungroupAnnotations = () => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = core.getSelectedAnnotations();
    annotManager.ungroupAnnotations(selectedAnnotations);
    this.forceUpdate();
  }

  render() {
    const { firstAnnotation, left, top, isStylePopupOpen } = this.state;
    const { isNotesPanelDisabled, isDisabled, isOpen, isAnnotationStylePopupDisabled } = this.props;
    const style = getAnnotationStyles(firstAnnotation);
    const hasStyle = Object.keys(style).length > 0;
    const className = getClassName(`Popup AnnotationPopup`, this.props);
    const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
    const canModify = core.canModify(firstAnnotation);
    if (isDisabled) {
      return null;
    }

    const selectedAnnotations = core.getSelectedAnnotations();
    const numberOfSelectedAnnotations = selectedAnnotations.length;
    const annotManager = core.getAnnotationManager();
    const numberOfGroups = annotManager.getNumberOfGroups(selectedAnnotations);
    const canGroup = numberOfGroups > 1;
    const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
    const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

    return (
      <div className={className} ref={this.popup} data-element="annotationPopup" style={{ left, top }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
        {isStylePopupOpen
          ? <AnnotationStylePopup annotation={firstAnnotation} style={style} isOpen={isOpen} />
          : <>
            {!isNotesPanelDisabled && !multipleAnnotationsSelected &&
              <ActionButton dataElement="annotationCommentButton" title="action.comment" img="ic_comment_black_24px" onClick={this.commentOnAnnotation} />
            }
            {canModify && hasStyle && !isAnnotationStylePopupDisabled && !multipleAnnotationsSelected &&
              <ActionButton dataElement="annotationStyleEditButton" title="action.style" img="ic_palette_black_24px" onClick={this.openStylePopup} />
            }
            {redactionEnabled && !multipleAnnotationsSelected &&
              <ActionButton dataElement="annotationRedactButton" title="action.apply" img="ic_check_black_24px" onClick={this.redactAnnotation} />
            }
            {canModify &&
              <ActionButton dataElement="annotationDeleteButton" title="action.delete" img="ic_delete_black_24px" onClick={this.deleteAnnotations} />
            }
            {canGroup &&
              <ActionButton dataElement="annotationGroupButton" title="action.group" img="ic_group_24px" onClick={this.groupAnnotations} />
            }
            {canUngroup &&
              <ActionButton dataElement="annotationUngroupButton" title="action.ungroup" img="ic_ungroup_24px" onClick={this.ungroupAnnotations} />
            }
          </>
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
  serverURL: selectors.getServerUrl(state),
});

const mapDispatchToProps = {
  applyRedactions,
  openElement: actions.openElement,
  closeElement: actions.closeElement,
  setIsNoteEditing: actions.setIsNoteEditing,
  setActiveLeftPanel: actions.setActiveLeftPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationPopup);
