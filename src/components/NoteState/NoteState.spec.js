import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import NoteState from './NoteState';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [(key) => key],
}));

jest.mock('components/ModularComponents/ToggleElementButton', () => function MockToggleElementButton(props) {
  return <button data-testid="note-state-button" data-icon={props.img} disabled={props.disabled} />;
});

jest.mock('components/ModularComponents/NoteStateFlyout/NoteStateFlyout', () => ({
  __esModule: true,
  default: function MockNoteStateFlyout(props) {
    return <div data-testid="note-state-flyout" data-options={props.items?.map((item) => item.option).join(',')} />;
  },
}));

describe('NoteState', () => {
  beforeEach(() => {
    useSelector.mockReturnValue(null);
  });

  it.each([
    ['open', 'icon-annotation-status-none'],
    ['resolved', 'icon-annotation-status-completed'],
  ])('uses the mapped icon for the %s spreadsheet comment state', (state, expectedIcon) => {
    const getStatus = jest.fn(() => 'Accepted');
    const annotation = {
      Id: 'comment-123',
      getStatus,
      getCustomData: (key) => ({
        spreadsheetThreadId: 'thread-123',
        spreadsheetCommentState: state,
      })[key],
    };

    render(<NoteState annotation={annotation} />);

    expect(screen.getByTestId('note-state-button')).toHaveAttribute('data-icon', expectedIcon);
    expect(screen.getByTestId('note-state-flyout')).toHaveAttribute('data-options', 'open,resolved');
    expect(getStatus).not.toHaveBeenCalled();
  });

  it('disables the spreadsheet comment state button in view-only mode', () => {
    useSelector.mockImplementation((selector) => selector({
      viewer: {},
      spreadsheetEditor: { editMode: SpreadsheetEditorEditMode.VIEW_ONLY },
    }));
    const annotation = {
      Id: 'comment-123',
      getCustomData: (key) => ({
        spreadsheetThreadId: 'thread-123',
        spreadsheetCommentState: 'open',
      })[key],
    };

    render(<NoteState annotation={annotation} />);

    expect(screen.getByTestId('note-state-button')).toBeDisabled();
  });
});