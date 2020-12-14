import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import core from 'core';
import selectors from 'selectors';

import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteState = ({ annotation, isSelected }) => {
  const [
    isStateDisabled,
    isStateAcceptedDisabled,
    isStateRejectedDisabled,
    isStateCompletedDisabled,
    isStateCancelledDisabled,
    isStateNoneDisabled,
    isStateMarkedDisabled,
    isStateUnmarkedDisabled,
  ] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'notePopupState'),
      selectors.isElementDisabled(state, 'notePopupStateAccepted'),
      selectors.isElementDisabled(state, 'notePopupStateRejected'),
      selectors.isElementDisabled(state, 'notePopupStateCompleted'),
      selectors.isElementDisabled(state, 'notePopupStateCancelled'),
      selectors.isElementDisabled(state, 'notePopupStateNone'),
      selectors.isElementDisabled(state, 'notePopupStateMarked'),
      selectors.isElementDisabled(state, 'notePopupStateUnmarked'),
    ],
    shallowEqual,
  );
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    closePopup();
  });

  const togglePopup = e => {
    e.stopPropagation();
    if (isOpen) {
      closePopup();
    } else {
      setIsOpen(true);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleStateUpdate = state => {
    const stateAnnot = createStateAnnot(annotation, state);

    annotation.addReply(stateAnnot);

    const annotManager = core.getAnnotationManager();
    annotManager.addAnnotation(stateAnnot);
    annotManager.trigger('addReply', [stateAnnot, annotation, annotManager.getRootAnnotation(annotation)]);
  };

  const createStateAnnot = (annotation, state) => {
    // TODO: the code below is copied from annotManager.updateAnnotationState in WebViewer to work around the issue
    // in https://github.com/PDFTron/webviewer-ui/issues/620
    // the implement before wasn't causing any actual issues, but it was confusing and unnecessary to trigger two annotationChanged events when a status is set
    // A proper fix should be done once https://trello.com/c/zWlkygNb/1023-consider-adding-a-setlocalizationhandler-to-corecontrols is implemented
    // at that time, we could use the translation handler(t) internally in updateAnnotationState before setting the contents, and use that function instead in this component

    const stateAnnot = new Annotations.StickyAnnotation();

    stateAnnot['InReplyTo'] = annotation['Id'];
    stateAnnot['X'] = annotation['X'];
    stateAnnot['Y'] = annotation['Y'];
    stateAnnot['PageNumber'] = annotation['PageNumber'];
    stateAnnot['Subject'] = 'Sticky Note';
    stateAnnot['Author'] = core.getCurrentUser();
    stateAnnot['State'] = state;
    stateAnnot['StateModel'] = state === 'Marked' || state === 'Unmarked' ? 'Marked' : 'Review';
    stateAnnot['Hidden'] = true;

    const displayAuthor = core.getDisplayAuthor(stateAnnot);
    const stateMessage = t(`option.state.${state.toLowerCase()}`);
    const contents = `${stateMessage} ${t('option.state.setBy')} ${displayAuthor}`;
    stateAnnot.setContents(contents);

    return stateAnnot;
  };

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const isReply = annotation.isReply();

  if ((annotationState === '' || annotationState === 'None') && !isSelected) {
    return null;
  }

  return (isStateDisabled && isReply) ? null : (
    <DataElementWrapper
      className="NoteState"
      dataElement="noteState"
      onClick={togglePopup}
    >
      <div className="overflow">
        <Icon glyph={icon} />
      </div>
      {isOpen && (
        <div ref={popupRef} className="options" onClick={closePopup}>
            <div data-element="notePopupState">
              {!isStateAcceptedDisabled ? <div
                data-element="notePopupStateAccepted"
                className="option"
                onClick={() => handleStateUpdate('Accepted')}
              >
                <Icon glyph="icon-annotation-status-accepted" />
                {t('option.state.accepted')}
              </div> : null }
              {!isStateRejectedDisabled ? <div
                data-element="notePopupStateRejected"
                className="option"
                onClick={() => handleStateUpdate('Rejected')}
              >
                <Icon glyph="icon-annotation-status-rejected" />
                {t('option.state.rejected')}
              </div> : null }
              {!isStateCancelledDisabled ? <div
                data-element="notePopupStateCancelled"
                className="option"
                onClick={() => handleStateUpdate('Cancelled')}
              >
                <Icon glyph="icon-annotation-status-cancelled" />
                {t('option.state.cancelled')}
              </div> : null }
              {!isStateCompletedDisabled ? <div
                data-element="notePopupStateCompleted"
                className="option"
                onClick={() => handleStateUpdate('Completed')}
              >
                <Icon glyph="icon-annotation-status-completed" />
                {t('option.state.completed')}
              </div> : null }
              {!isStateNoneDisabled ? <div
                data-element="notePopupStateNone"
                className="option"
                onClick={() => handleStateUpdate('None')}
              >
                <Icon glyph="icon-annotation-status-none" />
                {t('option.state.none')}
              </div> : null }
              {!isStateMarkedDisabled ? <div
                data-element="notePopupStateMarked"
                className="option"
                onClick={() => handleStateUpdate('Marked')}
              >
                <Icon glyph="icon-annotation-status-marked" />
                {t('option.state.marked')}
              </div> : null }
              {!isStateUnmarkedDisabled ? <div
                data-element="notePopupStateUnmarked"
                className="option"
                onClick={() => handleStateUpdate('Unmarked')}
              >
                <Icon glyph="icon-annotation-status-unmarked" />
                {t('option.state.unmarked')}
              </div> : null }
            </div>
        </div>
      )}
    </DataElementWrapper>
  );
};

NoteState.propTypes = propTypes;

export default NoteState;
