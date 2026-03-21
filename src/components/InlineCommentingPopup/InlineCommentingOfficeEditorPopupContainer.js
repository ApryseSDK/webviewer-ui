import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import useCore from 'hooks/useCore';
import { getOverlappingOfficeEditorAnnotations } from 'helpers/inlineCommentingOfficeEditorOverlap';
import DataElements from 'constants/dataElement';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import selectors from 'selectors';

import InlineCommentingPopup from './InlineCommentingPopup';
import InlineCommentingOfficeEditorTabs from './InlineCommentingOfficeEditorTabs';

import './InlineCommentingOfficeEditorPopup.scss';

const propTypes = {
  isMobile: PropTypes.bool,
  isUndraggable: PropTypes.bool,
  isNotesPanelClosed: PropTypes.bool,
  popupRef: PropTypes.any,
  position: PropTypes.object,
  closeAndReset: PropTypes.func,
  commentingAnnotation: PropTypes.object,
  annotationsUnderMouse: PropTypes.arrayOf(PropTypes.object),
  contextValue: PropTypes.object,
  annotationForAttachment: PropTypes.string,
  addAttachments: PropTypes.func,
};

const TAB_KEYS = {
  COMMENT: 'comment',
  CHANGES: 'changes',
};

const InlineCommentingOfficeEditorPopupContainer = ({
  isMobile,
  isUndraggable,
  isNotesPanelClosed,
  popupRef,
  position,
  closeAndReset,
  commentingAnnotation,
  annotationsUnderMouse,
  contextValue,
  annotationForAttachment,
  addAttachments,
}) => {
  const { core } = useCore();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const overlappingOfficeEditorAnnotations = useMemo(() => {
    return getOverlappingOfficeEditorAnnotations({
      commentingAnnotation,
      annotations: core.getAnnotationsList(),
      documentViewerKey: activeDocumentViewerKey,
      annotationsUnderMouse,
      mapAnnotationToKeyFn: mapAnnotationToKey,
    });
  }, [commentingAnnotation, core, activeDocumentViewerKey, annotationsUnderMouse]);

  const annotationKey = commentingAnnotation ? mapAnnotationToKey(commentingAnnotation) : null;
  const isTrackedChange = annotationKey === annotationMapKeys.TRACKED_CHANGE;
  const isOfficeEditorComment = annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;
  let baseActiveTabKey = null;
  if (isTrackedChange) {
    baseActiveTabKey = TAB_KEYS.CHANGES;
  } else if (isOfficeEditorComment) {
    baseActiveTabKey = TAB_KEYS.COMMENT;
  }

  const inlineCommentTabs = useMemo(() => {
    if (!overlappingOfficeEditorAnnotations) {
      return [];
    }

    const tabs = [
      {
        key: TAB_KEYS.COMMENT,
        labelKey: 'officeEditor.comments',
        annotation: overlappingOfficeEditorAnnotations.commentAnnotation,
        dataElement: DataElements.OFFICE_EDITOR_INLINE_COMMENT_POPUP_TAB_COMMENT,
      },
      {
        key: TAB_KEYS.CHANGES,
        labelKey: 'officeEditor.changes',
        annotation: overlappingOfficeEditorAnnotations.trackedChangeAnnotation,
        dataElement: DataElements.OFFICE_EDITOR_INLINE_COMMENT_POPUP_TAB_CHANGES,
      },
    ];

    return tabs;
  }, [overlappingOfficeEditorAnnotations]);

  const activeTabKey = useMemo(() => {
    const fallbackTabKey = inlineCommentTabs[0]?.key ?? null;
    if (!baseActiveTabKey) {
      return fallbackTabKey;
    }

    const hasBaseTab = inlineCommentTabs.some((tab) => tab.key === baseActiveTabKey);
    return hasBaseTab ? baseActiveTabKey : fallbackTabKey;
  }, [baseActiveTabKey, inlineCommentTabs]);

  const handleTabClick = useCallback((tab) => {
    if (!tab?.annotation || tab.annotation === commentingAnnotation) {
      return;
    }

    core.deselectAllAnnotations();
    core.selectAnnotation(tab.annotation);
  }, [commentingAnnotation, core]);

  const renderTabs = useCallback(() => (
    <InlineCommentingOfficeEditorTabs
      tabs={inlineCommentTabs}
      activeTabKey={activeTabKey}
      onTabClick={handleTabClick}
    />
  ), [activeTabKey, handleTabClick, inlineCommentTabs]);

  return (
    <InlineCommentingPopup
      isMobile={isMobile}
      isUndraggable={isUndraggable}
      isNotesPanelClosed={isNotesPanelClosed}
      popupRef={popupRef}
      position={position}
      closeAndReset={closeAndReset}
      commentingAnnotation={commentingAnnotation}
      contextValue={contextValue}
      annotationForAttachment={annotationForAttachment}
      addAttachments={addAttachments}
      isTrackedChange={isTrackedChange}
      containerClassName='InlineCommentingOfficeEditorPopup'
      renderTabs={renderTabs}
    />
  );
};

InlineCommentingOfficeEditorPopupContainer.propTypes = propTypes;

export default InlineCommentingOfficeEditorPopupContainer;
