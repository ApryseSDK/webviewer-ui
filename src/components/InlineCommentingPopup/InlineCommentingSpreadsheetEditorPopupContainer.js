import React from 'react';
import PropTypes from 'prop-types';

import InlineCommentingPopup from './InlineCommentingPopup';

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

const InlineCommentingSpreadsheetEditorPopupContainer = (props) => (
  <InlineCommentingPopup
    {...props}
    // WVR-12108: the computed position is ignored for now; the stylesheet places the popup at a fixed spot.
    position={null}
    containerClassName="InlineCommentingSpreadsheetEditorPopup"
  />
);

InlineCommentingSpreadsheetEditorPopupContainer.propTypes = propTypes;

export default InlineCommentingSpreadsheetEditorPopupContainer;
