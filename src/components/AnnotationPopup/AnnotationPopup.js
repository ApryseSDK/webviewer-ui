import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import applyRedactions from 'helpers/applyRedactions';
import useOnClickOutside from 'hooks/useOnClickOutside';
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
  ] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'annotationPopup'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationStylePopup'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementOpen(state, 'searchPanel'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  // first annotation in the array when there're multiple annotations selected
  const [firstAnnotation, setFirstAnnotation] = useState(null);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
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
      if (popupRef.current) {
        setPosition(
          getAnnotationPopupPositionBasedOn(firstAnnotation, popupRef),
        );

        dispatch(actions.openElement('annotationPopup'));
      }
    };

    if (firstAnnotation || isStylePopupOpen) {
      setPopupPositionAndShow();
    }

    const onMouseLeftUp = e => {
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
        // number of buttons may changed due to "canModify"
        // so we need to reposition this component
        setPopupPositionAndShow();
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener(
      'updateAnnotationPermission',
      onUpdateAnnotationPermission,
    );
    return () => {
      core.removeEventListener('mouseLeftUp', onMouseLeftUp);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener(
        'updateAnnotationPermission',
        onUpdateAnnotationPermission,
      );
    };
  }, [dispatch, firstAnnotation, isStylePopupOpen]);

  useEffect(() => {
    const closeAndReset = () => {
      dispatch(actions.closeElement('annotationPopup'));
      setPosition({ left: 0, top: 0 });
      setFirstAnnotation(null);
      setIsStylePopupOpen(false);
    };

    const isContainerShifted = isLeftPanelOpen || isRightPanelOpen;
    if (isContainerShifted) {
      closeAndReset();
    }

    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length) {
        setFirstAnnotation(annotations[0]);
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
  }, [dispatch, isLeftPanelOpen, isRightPanelOpen]);

  if (isDisabled || !firstAnnotation) {
    return null;
  }

  const style = getAnnotationStyles(firstAnnotation);
  const hasStyle = Object.keys(style).length > 0;
  const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
  const selectedAnnotations = core.getSelectedAnnotations();
  const primaryAnnotation = selectedAnnotations.find(
    selectedAnnotation => !selectedAnnotation.InReplyTo,
  );
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canModify = core.canModify(firstAnnotation);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

  const commentOnAnnotation = () => {
    if (firstAnnotation instanceof window.Annotations.FreeTextAnnotation) {
      core
        .getAnnotationManager()
        .trigger('annotationDoubleClicked', firstAnnotation);
    } else if (!isLeftPanelOpen) {
      dispatch(actions.openElement('notesPanel'));
      // wait for the notes panel to be fully opened before focusing
      setTimeout(() => {
        dispatch(actions.triggerNoteEditing());
      }, 400);
    } else {
      dispatch(actions.setActiveLeftPanel('notesPanel'));
      dispatch(actions.triggerNoteEditing());
    }

    dispatch(actions.closeElement('annotationPopup'));
  };

  return (
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
        <>
          {!isNotesPanelDisabled && !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationCommentButton"
              title="action.comment"
              img="ic_comment_black_24px"
              onClick={commentOnAnnotation}
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
              onClick={() => setIsStylePopupOpen(true)}
            />
          )}
          {redactionEnabled && !multipleAnnotationsSelected && (
            <ActionButton
              dataElement="annotationRedactButton"
              title="action.apply"
              img="ic_check_black_24px"
              onClick={() => {
                applyRedactions(firstAnnotation);
                dispatch(actions.closeElement('annotationPopup'));
              }}
            />
          )}
          {canGroup && (
            <ActionButton
              dataElement="annotationGroupButton"
              title="action.group"
              img="ic_group_24px"
              onClick={() =>
                core.groupAnnotations(primaryAnnotation, selectedAnnotations)
              }
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
          {canModify && (
            <ActionButton
              dataElement="annotationDeleteButton"
              title="action.delete"
              img="ic_delete_black_24px"
              onClick={() => {
                core.deleteAnnotations(core.getSelectedAnnotations());
                dispatch(actions.closeElement('annotationPopup'));
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AnnotationPopup;
