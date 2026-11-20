import React from 'react';
import { render } from '@testing-library/react';
import InlineCommentingSpreadsheetEditorPopupContainer from './InlineCommentingSpreadsheetEditorPopupContainer';
import InlineCommentingPopup from './InlineCommentingPopup';

jest.mock('./InlineCommentingPopup', () => jest.fn(() => null));

describe('InlineCommentingSpreadsheetEditorPopupContainer', () => {
  const baseProps = {
    isMobile: false,
    isUndraggable: false,
    isNotesPanelClosed: false,
    popupRef: { current: null },
    position: { top: 0, left: 0 },
    closeAndReset: jest.fn(),
    contextValue: {},
    commentingAnnotation: { Id: 'sse-annot-1' },
    annotationForAttachment: undefined,
    addAttachments: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders InlineCommentingPopup with the spreadsheet specific containerClassName', () => {
    render(<InlineCommentingSpreadsheetEditorPopupContainer {...baseProps} />);

    expect(InlineCommentingPopup).toHaveBeenCalledWith(
      expect.objectContaining({
        commentingAnnotation: baseProps.commentingAnnotation,
        containerClassName: 'InlineCommentingSpreadsheetEditorPopup',
      }),
      expect.anything(),
    );
  });

  it('forwards all required popup props to InlineCommentingPopup', () => {
    render(<InlineCommentingSpreadsheetEditorPopupContainer {...baseProps} />);

    const callArgs = InlineCommentingPopup.mock.calls[0][0];
    expect(callArgs.isMobile).toBe(baseProps.isMobile);
    expect(callArgs.isUndraggable).toBe(baseProps.isUndraggable);
    expect(callArgs.isNotesPanelClosed).toBe(baseProps.isNotesPanelClosed);
    expect(callArgs.popupRef).toBe(baseProps.popupRef);
    expect(callArgs.closeAndReset).toBe(baseProps.closeAndReset);
    expect(callArgs.contextValue).toBe(baseProps.contextValue);
  });

  it('should leave placement to the stylesheet instead of applying the computed position', () => {
    render(<InlineCommentingSpreadsheetEditorPopupContainer {...baseProps} position={{ top: 240, left: 12 }} />);

    expect(InlineCommentingPopup.mock.calls[0][0].position).toBeNull();
  });
});
