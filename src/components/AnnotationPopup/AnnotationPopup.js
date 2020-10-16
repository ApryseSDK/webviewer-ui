import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';
import CustomizablePopup from 'components/CustomizablePopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import applyRedactions from 'helpers/applyRedactions';
import { isMobile, isIE } from 'helpers/device';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useWidgetEditing from 'hooks/useWidgetEditing';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationPopup.scss';

const AnnotationPopup = () => {
  const [
    isDisabled,
    isOpen,
    isNotesPanelDisabled,
    isAnnotationStylePopupDisabled,
    // can probably use mutation observer
    isLeftPanelOpen,
    isRightPanelOpen,
    popupItems,
    isNotesPanelOpen,
  ] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'annotationPopup'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationStylePopup'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementOpen(state, 'searchPanel'),
      selectors.getPopupItems(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'notesPanel'),
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  // first annotation in the array when there're multiple annotations selected
  const [firstAnnotation, setFirstAnnotation] = useState(null);
  const [canModify, setCanModify] = useState(false);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
  const isEditingWidgets = useWidgetEditing();
  const popupRef = useRef();

  useOnClickOutside(popupRef, e => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel) {
      dispatch(actions.closeElement('annotationPopup'));
    }
  });

  useEffect(() => {
    // calling this function will always rerender this component
    // because the position state always has a new object reference
    const setPopupPositionAndShow = () => {
      if (popupRef.current && popupItems.length > 0) {
        setPosition(getAnnotationPopupPositionBasedOn(firstAnnotation, popupRef));
        dispatch(actions.openElement('annotationPopup'));
      }
    };

    if (firstAnnotation || isStylePopupOpen) {
      setPopupPositionAndShow();
    }

    const onMouseLeftUp = e => {
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      if (firstAnnotation) {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e);

        if (annotUnderMouse === firstAnnotation) {
          setPopupPositionAndShow();
        }
      }
    };

    const onAnnotationChanged = (annotations, action) => {
      if (action === 'modify' && core.isAnnotationSelected(firstAnnotation)) {
        setPopupPositionAndShow();
      }
    };

    const onUpdateAnnotationPermission = () => {
      if (firstAnnotation) {
        setCanModify(core.canModify(firstAnnotation));
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => {
      core.removeEventListener('mouseLeftUp', onMouseLeftUp);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    };
  }, [dispatch, canModify, firstAnnotation, isStylePopupOpen, popupItems]);

  useEffect(() => {
    const closeAndReset = () => {
      dispatch(actions.closeElement('annotationPopup'));
      setPosition({ left: 0, top: 0 });
      setFirstAnnotation(null);
      setCanModify(false);
      setIsStylePopupOpen(false);
    };

    const isContainerShifted = isLeftPanelOpen || isRightPanelOpen;
    if (isContainerShifted) {
      // closing because we can't correctly reposition the popup on panel transition
      closeAndReset();
    }

    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length) {
        setFirstAnnotation(annotations[0]);
        setCanModify(core.canModify(annotations[0]));
        if (isNotesPanelOpen) {
          setTimeout(() => dispatch(actions.openElement('annotationNoteConnectorLine')), 300);
        }
      } else {
        closeAndReset();
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('documentUnloaded', closeAndReset);
    window.addEventListener('resize', closeAndReset);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('documentUnloaded', closeAndReset);
      window.addEventListener('resize', closeAndReset);
    };
  }, [dispatch, isLeftPanelOpen, isRightPanelOpen, isNotesPanelOpen]);

  if (isDisabled || !firstAnnotation) {
    return null;
  }

  const style = getAnnotationStyles(firstAnnotation);
  const hasStyle = Object.keys(style).length > 0;
  const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
  const selectedAnnotations = core.getSelectedAnnotations();
  const primaryAnnotation = selectedAnnotations.find(
    selectedAnnotation => !selectedAnnotation.InReplyTo
  );
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

  const isFreeTextAndCanEdit = firstAnnotation instanceof window.Annotations.FreeTextAnnotation && core.getAnnotationManager().useFreeTextEditing();

  const commentOnAnnotation = () => {
    if (isFreeTextAndCanEdit) {
      core
        .getAnnotationManager()
        .trigger('annotationDoubleClicked', firstAnnotation);
    } else {
      dispatch(actions.openElement('notesPanel'));
      dispatch(actions.closeElement('searchPanel'));
      dispatch(actions.triggerNoteEditing());
    }
    dispatch(actions.closeElement('annotationPopup'));
  };

  const downloadFileAttachment = annot => {
    // no need to check that annot is of type file annot as the check is done in the JSX
    // trigger the annotationDoubleClicked event so that it will download the file
    core.getAnnotationManager().trigger('annotationDoubleClicked', annot);
  };

  const isLinkAnnotation = annot => {
    let linkAnnotation = false;
    const annotManager = core.getAnnotationManager();
    const groupedAnnots = annotManager.getGroupAnnotations(annot);

    if (groupedAnnots.length > 1) {
      groupedAnnots.forEach(groupAnnot => {
        if (groupAnnot instanceof Annotations.Link) {
          linkAnnotation = true;
        }
      });
    }

    return linkAnnotation;
  };

  const annotationPopup =
    <div
      className={classNames({
        Popup: true,
        AnnotationPopup: true,
        open: isOpen,
        closed: !isOpen,
        stylePopupOpen: isStylePopupOpen,
      })}
      ref={popupRef}
      data-element="annotationPopup"
      style={{ ...position }}
    >
      {isStylePopupOpen ? (
        <AnnotationStylePopup
          annotation={firstAnnotation}
          style={style}
          isOpen={isOpen}
        />
      ) : (
        <CustomizablePopup dataElement="annotationPopup">
          {!isNotesPanelDisabled &&
            !multipleAnnotationsSelected &&
            !isEditingWidgets &&
            firstAnnotation.ToolName !== 'CropPage' && (
            <ActionButton
              dataElement="annotationCommentButton"
              title="action.comment"
              img="icon-header-chat-line"
              onClick={commentOnAnnotation}
            />
          )}
          {canModify &&
            hasStyle &&
            !isAnnotationStylePopupDisabled &&
            !isEditingWidgets &&
            (!multipleAnnotationsSelected || canUngroup) &&
            firstAnnotation.ToolName !== 'CropPage' && (
            <ActionButton
              dataElement="annotationStyleEditButton"
              title="action.style"
              img="icon-menu-style-line"
              onClick={() => setIsStylePopupOpen(true)}
            />
          )}
          {firstAnnotation.ToolName === 'CropPage' && (
            <ActionButton
              dataElement="annotationCropButton"
              title="action.apply"
              img="ic_check_black_24px"
              onClick={() => {
                core.getTool('CropPage').applyCrop();
                dispatch(actions.closeElement('annotationPopup'));
              }}
            />
          )}
          {redactionEnabled && !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationRedactButton"
              title="action.apply"
              img="ic_check_black_24px"
              onClick={() => {
                dispatch(applyRedactions(firstAnnotation));
                dispatch(actions.closeElement('annotationPopup'));
              }}
            />
          )}
          {canGroup && !isEditingWidgets && (
            <ActionButton
              dataElement="annotationGroupButton"
              title="action.group"
              img="ic_group_24px"
              onClick={() => core.groupAnnotations(primaryAnnotation, selectedAnnotations)}
            />
          )}
          {canUngroup && (
            <ActionButton
              dataElement="annotationUngroupButton"
              title="action.ungroup"
              img="ic_ungroup_24px"
              onClick={() => core.ungroupAnnotations(selectedAnnotations)}
            />
          )}
          {canModify && !firstAnnotation.NoDelete && (
            <ActionButton
              dataElement="annotationDeleteButton"
              title="action.delete"
              img="icon-delete-line"
              onClick={() => {
                core.deleteAnnotations(core.getSelectedAnnotations());
                dispatch(actions.closeElement('annotationPopup'));
              }}
            />
          )}
          {canModify &&
            firstAnnotation.Measure &&
            firstAnnotation instanceof Annotations.LineAnnotation && (
            <ActionButton
              dataElement="calibrateButton"
              title="action.calibrate"
              img="calibrate"
              onClick={() => {
                dispatch(actions.closeElement('annotationPopup'));
                dispatch(actions.openElement('calibrationModal'));
              }}
            />
          )}
          {!([
            'CropPage',
            'AnnotationCreateSignature',
            'AnnotationCreateRedaction',
            'AnnotationCreateSticky'
          ].includes(firstAnnotation.ToolName)) && !isEditingWidgets && (
            <ActionButton
              title="tool.Link"
              img={isLinkAnnotation(firstAnnotation) ? 'icon-tool-unlink' : 'icon-tool-link'}
              onClick={
                isLinkAnnotation(firstAnnotation)
                  ? () => {
                    const annotManager = core.getAnnotationManager();
                    selectedAnnotations.forEach(annot => {
                      if (annot instanceof Annotations.TextHighlightAnnotation && annot.Opacity === 0) {
                        annotManager.deleteAnnotation(annot);
                      } else {
                        const groupedAnnots = annotManager.getGroupAnnotations(annot);
                        groupedAnnots.forEach(groupAnnot => {
                          if (groupAnnot instanceof Annotations.Link) {
                            annotManager.ungroupAnnotations([groupAnnot]);
                            annotManager.deleteAnnotation(groupAnnot);
                          }
                        });
                      }
                    });
                  }
                  : () => dispatch(actions.openElement('linkModal'))
              }
              dataElement="linkButton"
            />
          )}
          {
            firstAnnotation instanceof window.Annotations.FileAttachmentAnnotation &&
            (
              <ActionButton
                title="action.fileAttachmentDownload"
                img="icon-download"
                onClick={() => downloadFileAttachment(firstAnnotation)}
                dataElement="fileAttachmentDownload"
              />
            )
          }
        </CustomizablePopup>
      )}
    </div>;

  return (
    isIE || isMobile() ?
      annotationPopup
      :
      <Draggable cancel=".Button, .cell, .sliders-container svg">
        {annotationPopup}
      </Draggable>
  );
};

export default AnnotationPopup;
