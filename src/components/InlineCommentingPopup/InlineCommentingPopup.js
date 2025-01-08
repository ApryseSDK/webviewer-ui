import React, { useState } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import NoteContext from 'components/Note/Context';
import Note from 'components/Note';
import ReplyAttachmentPicker from 'components/NotesPanel/ReplyAttachmentPicker';
import Button from 'components/Button';

import DataElements from 'src/constants/dataElement';

import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';

import './InlineCommentingPopup.scss';

const propTypes = {
  isMobile: PropTypes.bool,
  isUndraggable: PropTypes.bool,
  isNotesPanelClosed: PropTypes.bool,
  popupRef: PropTypes.any,
  position: PropTypes.object,
  closeAndReset: PropTypes.func,
  commentingAnnotation: PropTypes.object,
  contextValue: PropTypes.object,
  annotationForAttachment: PropTypes.string,
  addAttachments: PropTypes.func,
};

const InlineCommentingPopup = ({
  isMobile,
  isUndraggable,
  isNotesPanelClosed,
  popupRef,
  position,
  closeAndReset,
  commentingAnnotation,
  contextValue,
  annotationForAttachment,
  addAttachments,
}) => {
  const [t] = useTranslation();
  const [isExpanded, setExpanded] = useState(false);

  const isTrackedChange = mapAnnotationToKey(commentingAnnotation) === annotationMapKeys.TRACKED_CHANGE;

  const inlineCommentPopup = (
    <div
      className={classNames({
        Popup: true,
        InlineCommentingPopup: true,
        open: isNotesPanelClosed,
        trackedChangePopup: isTrackedChange,
      })}
      ref={popupRef}
      data-element={DataElements.INLINE_COMMENT_POPUP}
      style={{ ...position }}
      onMouseMove={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (isMobile) {
          e.stopPropagation();
          closeAndReset();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          closeAndReset();
        }
      }}
    >
      <div
        className={classNames({
          'inline-comment-container': true,
          'expanded': isExpanded,
        })}
        onMouseDown={(e) => {
          if (isMobile) {
            e.stopPropagation();
          }
        }}
      >
        {isMobile && (
          <div className='inline-comment-header'>
            <Button
              img={isExpanded ? 'icon-chevron-down' : 'icon-chevron-up'}
              className="expand-arrow"
              dataElement={DataElements.INLINE_COMMENT_POPUP_EXPAND_BUTTON}
              onClick={() => setExpanded(!isExpanded)}
            />
            <span className='inline-comment-header-title'>{t('action.comment')}</span>
            <Button
              img={'icon-close'}
              dataElement={DataElements.INLINE_COMMENT_POPUP_CLOSE_BUTTON}
              onClick={closeAndReset}
            />
          </div>
        )}
        <NoteContext.Provider value={contextValue}>
          <Note
            annotation={commentingAnnotation}
            isMultiSelected={false}
            isMultiSelectMode={false}
            handleMultiSelect={() => { }}
          />
          <ReplyAttachmentPicker
            annotationId={annotationForAttachment}
            addAttachments={addAttachments}
          />
        </NoteContext.Provider>
      </div>
    </div>
  );

  return isUndraggable || isTrackedChange ? (
    inlineCommentPopup
  ) : (
    <Draggable cancel=".Button, .cell, svg, select, button, input, .quill, .note-text-preview">{inlineCommentPopup}</Draggable>
  );
};

InlineCommentingPopup.propTypes = propTypes;

export default InlineCommentingPopup;
