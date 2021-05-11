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

const AnnotationCustomData = {
  LINK_ID: 'trn-link-id',
};

const AnnotationPopup = () => {
  const [
    isDisabled,
    isOpen,
    isNotesPanelDisabled,
    isAnnotationStylePopupDisabled,
    popupItems,
    isNotesPanelOpen,
  ] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'annotationPopup'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationStylePopup'),
      selectors.getPopupItems(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'notesPanel'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  // first annotation in the array when there're multiple annotations selected
  const [firstAnnotation, setFirstAnnotation] = useState(null);
  const [canModify, setCanModify] = useState(false);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
  const [hasAssociatedLink, setHasAssociatedLink] = useState(false);
  const isEditingWidgets = useWidgetEditing();
  const popupRef = useRef();
  const [includesFormFieldAnnotation, setIncludesFormFieldAnnotation] = useState(false);

  useOnClickOutside(popupRef, e => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);

    const warningModal = document.querySelector('.WarningModal.open .container');
    const colorPicker = document.querySelector('.ColorPickerModal.open');

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel && !warningModal && !colorPicker) {
      dispatch(actions.closeElement('annotationPopup'));
    }
  });

  const getAssociatedLinkedAnnotations = annotation => {
    const rawCustomData = annotation.getCustomData(AnnotationCustomData.LINK_ID);
    let customData = [];
    if (rawCustomData) {
      customData = JSON.parse(rawCustomData);
    }
    return Array.isArray(customData) ? customData : [];
  };

  useEffect(() => {
    if (firstAnnotation) {
      const linkAnnotations = getAssociatedLinkedAnnotations(firstAnnotation);
      setHasAssociatedLink(linkAnnotations.length);
    }
  }, [firstAnnotation]);

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
      if (!core.isAnnotationSelected(firstAnnotation)) {
        return;
      }
      if (action === 'modify') {
        setPopupPositionAndShow();
      }
      const hasLinkAnnotation = annotations.some(annotation => annotation instanceof Annotations.Link);
      if (!hasLinkAnnotation) {
        return;
      }
      if (action === 'add') {
        setHasAssociatedLink(true);
      }
      if (action === 'delete') {
        setHasAssociatedLink(false);
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
      setIncludesFormFieldAnnotation(false);
      setCanModify(false);
      setIsStylePopupOpen(false);
    };

    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length) {
        setFirstAnnotation(annotations[0]);
        setIncludesFormFieldAnnotation(annotations.some(annotation => annotation.isFormFieldPlaceholder()));
        setCanModify(core.canModify(annotations[0]));
        if (isNotesPanelOpen) {
          setTimeout(() => dispatch(actions.openElement('annotationNoteConnectorLine')), 300);
        }
      } else {
        const actionOnOtherAnnotation = firstAnnotation && annotations && !annotations.includes(firstAnnotation);
        if (action === 'deselected' && actionOnOtherAnnotation) {
          return;
        } else {
          closeAndReset();
        }
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('documentUnloaded', closeAndReset);
    window.addEventListener('resize', closeAndReset);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('documentUnloaded', closeAndReset);
      window.removeEventListener('resize', closeAndReset);
    };
  }, [dispatch, isNotesPanelOpen, firstAnnotation]);

  if (isDisabled || !firstAnnotation) {
    return null;
  }

  const style = getAnnotationStyles(firstAnnotation);
  const hasStyle = Object.keys(style).length > 0;
  const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
  const selectedAnnotations = core.getSelectedAnnotations();
  const primaryAnnotation = selectedAnnotations.find(selectedAnnotation => !selectedAnnotation.InReplyTo);
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

  const isFreeTextAnnot = firstAnnotation instanceof window.Annotations.FreeTextAnnotation;
  const isFreeTextAndCanEdit =
    isFreeTextAnnot && core.getAnnotationManager().useFreeTextEditing() && core.canModifyContents(firstAnnotation);

  const commentOnAnnotation = () => {
    if (isFreeTextAndCanEdit) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', firstAnnotation);
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

  const toolNames = window.Tools.ToolNames;
  const toolsWithNoStyling = [
    toolNames.CROP,
    toolNames.RADIO_FORM_FIELD,
    toolNames.CHECK_BOX_FIELD,
  ];

  const toolsThatCantHaveLinks = [
    toolNames.CROP,
    toolNames.SIGNATURE,
    toolNames.REDACTION,
    toolNames.STICKY,
    toolNames.STICKY2,
    toolNames.STICKY3,
    toolNames.STICKY4,
  ];

  const showCommentButton = !isNotesPanelDisabled &&
    !multipleAnnotationsSelected &&
    !isEditingWidgets &&
    firstAnnotation.ToolName !== toolNames.CROP &&
    !includesFormFieldAnnotation;

  const showEditStyleButton = canModify &&
    hasStyle &&
    !isAnnotationStylePopupDisabled &&
    !isEditingWidgets &&
    (!multipleAnnotationsSelected || canUngroup) &&
    !toolsWithNoStyling.includes(firstAnnotation.ToolName);

  const showRedactionButton = redactionEnabled &&
    !multipleAnnotationsSelected &&
    !includesFormFieldAnnotation;

  const showGroupButton = canGroup &&
    !isEditingWidgets &&
    !includesFormFieldAnnotation;

  const showCalibrateButton = canModify &&
    firstAnnotation.Measure &&
    firstAnnotation instanceof Annotations.LineAnnotation;

  const showFileDownloadButton = firstAnnotation instanceof window.Annotations.FileAttachmentAnnotation;

  const showLinkButton =
    !toolsThatCantHaveLinks.includes(firstAnnotation.ToolName) &&
    !isEditingWidgets &&
    !includesFormFieldAnnotation;

  const annotationPopup = (
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
        <AnnotationStylePopup annotation={firstAnnotation} style={style} isOpen={isOpen} />
      ) : (
        <CustomizablePopup dataElement="annotationPopup">
          {showCommentButton && (
            <ActionButton
              dataElement="annotationCommentButton"
              title="action.comment"
              img="icon-header-chat-line"
              onClick={commentOnAnnotation}
            />
          )}
          {showEditStyleButton && (
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
          {showRedactionButton && (
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
          {showGroupButton && (
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
          {includesFormFieldAnnotation && (
            <ActionButton
              title="action.formFieldEdit"
              img="icon-edit-form-field"
              onClick={() => {
                dispatch(actions.closeElement('annotationPopup'));
                dispatch(actions.openElement('formFieldEditPopup'));
              }}
              dataElement="formFieldEditButton"
            />
          )
          }
          {canModify && (
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
          {showCalibrateButton && (
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
          {showLinkButton && (
            <ActionButton
              title="tool.Link"
              img={hasAssociatedLink ? 'icon-tool-unlink' : 'icon-tool-link'}
              onClick={
                hasAssociatedLink
                  ? () => {
                    const annotManager = core.getAnnotationManager();
                    selectedAnnotations.forEach(annot => {
                      const linkAnnotations = getAssociatedLinkedAnnotations(annot);
                      linkAnnotations.forEach(annotId => {
                        const linkAnnot = annotManager.getAnnotationById(annotId);
                        annotManager.deleteAnnotation(linkAnnot, null, true);
                      });
                      annot.deleteCustomData(AnnotationCustomData.LINK_ID);
                      if (annot instanceof Annotations.TextHighlightAnnotation && annot.Opacity === 0) {
                        annotManager.deleteAnnotation(annot);
                      }
                    });
                  }
                  : () => dispatch(actions.openElement('linkModal'))
              }
              dataElement="linkButton"
            />
          )}
          {showFileDownloadButton &&
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
    </div>
  );

  return isIE || isMobile() ? (
    annotationPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button">{annotationPopup}</Draggable>
  );
};

export default AnnotationPopup;