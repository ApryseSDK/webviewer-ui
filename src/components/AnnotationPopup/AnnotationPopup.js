import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
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
    triggerNoteEditing: PropTypes.func.isRequired,
    setActiveLeftPanel: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.popup = React.createRef();
    this.initialState = {
      firstAnnotation: null,
      left: 0,
      top: 0,
      isStylePopupOpen: false,
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    core.addEventListener('mouseLeftUp', this.onMouseLeftUp);
    core.addEventListener('annotationSelected', this.onAnnotationSelected);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener(
      'updateAnnotationPermission',
      this.onUpdateAnnotationPermission,
    );
    core.addEventListener('documentUnloaded', this.onDocumentUnloaded);
    window.addEventListener('resize', this.close);
  }

  componentDidUpdate(prevProps, prevState) {
    const isAnnotationSelected =
      !prevState.firstAnnotation && this.state.firstAnnotation;
    const isStylePopupOpen =
      !prevState.isStylePopupOpen && this.state.isStylePopupOpen;
    const isContainerShifted =
      prevProps.isLeftPanelOpen !== this.props.isLeftPanelOpen ||
      prevProps.isRightPanelOpen !== this.props.isRightPanelOpen;

    if ((isAnnotationSelected && !this.props.isDisabled) || isStylePopupOpen) {
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
    }

    if (isContainerShifted) {
      // closing because we can't correctly reposition the popup on panel transition
      this.props.closeElement('annotationPopup');
    }
  }

  componentWillUnmount() {
    core.removeEventListener('mouseLeftUp', this.onMouseLeftUp);
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener(
      'updateAnnotationPermission',
      this.onUpdateAnnotationPermission,
    );
    core.removeEventListener('documentUnloaded', this.onDocumentUnloaded);
    window.removeEventListener('resize', this.close);
  }

  close = () => {
    this.props.closeElement('annotationPopup');
    this.setState({ ...this.initialState });
  };

  onMouseLeftUp = (e, mouseEvent) => {
    const { firstAnnotation } = this.state;
    if (firstAnnotation) {
      const annot = core.getAnnotationManager().getAnnotationByMouseEvent(mouseEvent);

      if (annot === firstAnnotation && !this.props.isDisabled) {
        this.positionAnnotationPopup();
        this.props.openElement('annotationPopup');
      }
    }
  };

  onDocumentUnloaded = () => {
    this.close();
  };

  handleClickOutside = e => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel) {
      this.props.closeElement('annotationPopup');
    }
  };

  onAnnotationSelected = (e, annotations, action) => {
    if (action === 'selected') {
      if (annotations.length > 0) {
        const firstAnnotation = annotations[0];
        this.setState({
          firstAnnotation,
        });
      }
    } else {
      this.close();
    }
  };

  onAnnotationChanged = (e, annotations, action) => {
    if (
      action === 'modify' &&
      core.isAnnotationSelected(this.state.firstAnnotation) &&
      !this.props.isDisabled
    ) {
      // Position change
      this.positionAnnotationPopup();
      this.props.openElement('annotationPopup');
      // Style change
      this.forceUpdate();
    }
  };

  onUpdateAnnotationPermission = () => {
    this.forceUpdate();
  };

  positionAnnotationPopup = () => {
    const { left, top } = getAnnotationPopupPositionBasedOn(
      this.state.firstAnnotation,
      this.popup,
    );

    this.setState({ left, top });
  };

  commentOnAnnotation = () => {
    const { firstAnnotation } = this.state;

    if (firstAnnotation instanceof window.Annotations.FreeTextAnnotation) {
      core
        .getAnnotationManager()
        .trigger('annotationDoubleClicked', firstAnnotation);
    } else if (!this.props.isLeftPanelOpen) {
      this.props.openElement('notesPanel');
      setTimeout(() => {
        this.props.triggerNoteEditing();
      }, 400);
    } else {
      this.props.setActiveLeftPanel('notesPanel');
      this.props.triggerNoteEditing();
    }

    this.props.closeElement('annotationPopup');
  };

  openStylePopup = () => {
    this.setState({ isStylePopupOpen: true });
  };

  deleteAnnotations = () => {
    core.deleteAnnotations(core.getSelectedAnnotations());
    this.props.closeElement('annotationPopup');
  };

  redactAnnotation = () => {
    this.props.applyRedactions(this.state.firstAnnotation);
    this.props.closeElement('annotationPopup');
  };

  groupAnnotations = () => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = core.getSelectedAnnotations();
    const primaryAnnotation = selectedAnnotations.find(
      selectedAnnotation => !selectedAnnotation.InReplyTo,
    );
    annotManager.groupAnnotations(primaryAnnotation, selectedAnnotations);
  };

  ungroupAnnotations = () => {
    const annotManager = core.getAnnotationManager();
    const selectedAnnotations = core.getSelectedAnnotations();
    annotManager.ungroupAnnotations(selectedAnnotations);
    this.forceUpdate();
  };

  render() {
    const { firstAnnotation, left, top, isStylePopupOpen } = this.state;
    const {
      isNotesPanelDisabled,
      isDisabled,
      isOpen,
      isAnnotationStylePopupDisabled,
    } = this.props;

    if (isDisabled || !firstAnnotation) {
      return null;
    }

    const style = getAnnotationStyles(firstAnnotation);
    const hasStyle = Object.keys(style).length > 0;
    const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
    const canModify = core.canModify(firstAnnotation);

    const selectedAnnotations = core.getSelectedAnnotations();
    const numberOfSelectedAnnotations = selectedAnnotations.length;
    const annotManager = core.getAnnotationManager();
    const numberOfGroups = annotManager.getNumberOfGroups(selectedAnnotations);
    const canGroup = numberOfGroups > 1;
    const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
    const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

    return (
      <div
        className={classNames({
          Popup: true,
          AnnotationPopup: true,
          open: isOpen,
          closed: !isOpen,
          stylePopupOpen: isStylePopupOpen,
        })}
        ref={this.popup}
        data-element="annotationPopup"
        style={{ left, top }}
      >
        {isStylePopupOpen ? (
          <AnnotationStylePopup
            annotation={firstAnnotation}
            style={style}
            isOpen={isOpen}
          />
        ) : (
        <>
          {!isNotesPanelDisabled && !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationCommentButton"
              title="action.comment"
              img="ic_comment_black_24px"
              onClick={this.commentOnAnnotation}
            />
          )}
          {canModify &&
            hasStyle &&
            !isAnnotationStylePopupDisabled &&
            !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationStyleEditButton"
              title="action.style"
              img="ic_palette_black_24px"
              onClick={this.openStylePopup}
            />
          )}
          {redactionEnabled && !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationRedactButton"
              title="action.apply"
              img="ic_check_black_24px"
              onClick={this.redactAnnotation}
            />
          )}
          {canModify && (
            <ActionButton
              dataElement="annotationDeleteButton"
              title="action.delete"
              img="ic_delete_black_24px"
              onClick={this.deleteAnnotations}
            />
          )}
          {canGroup && (
            <ActionButton
              dataElement="annotationGroupButton"
              title="action.group"
              img="ic_group_24px"
              onClick={this.groupAnnotations}
            />
          )}
          {canUngroup && (
            <ActionButton
              dataElement="annotationUngroupButton"
              title="action.ungroup"
              img="ic_ungroup_24px"
              onClick={this.ungroupAnnotations}
            />
          )}
        </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isNotesPanelDisabled: selectors.isElementDisabled(state, 'notesPanel'),
  isDisabled: selectors.isElementDisabled(state, 'annotationPopup'),
  isAnnotationStylePopupDisabled: selectors.isElementDisabled(
    state,
    'annotationStylePopup',
  ),
  isOpen: selectors.isElementOpen(state, 'annotationPopup'),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
});

const mapDispatchToProps = {
  applyRedactions,
  openElement: actions.openElement,
  closeElement: actions.closeElement,
  triggerNoteEditing: actions.triggerNoteEditing,
  setActiveLeftPanel: actions.setActiveLeftPanel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(AnnotationPopup));
