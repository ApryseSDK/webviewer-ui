import React from 'react';
import { render, getByText, screen } from '@testing-library/react';
import NoteHeader from './NoteHeader';
import NoteContext from '../Note/Context';
import * as reactRedux from 'react-redux';
import { testProps, testPropsWithAnnotationNumbering, testPropsSpreadsheetComment } from './NoteHeader.stories';
import useCore from 'hooks/useCore';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

const NoteHeaderWithProviders = withProviders(NoteHeader);
const noteContextValue = {
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {},
};

const TestNoteHeader = (props) => (
  <NoteContext.Provider value={noteContextValue}>
    <NoteHeaderWithProviders {...props} />
  </NoteContext.Provider>
);

const notSelectedProps = {
  ...testProps,
  isSelected: false,
};

const initialState = {
  viewer: {
    disabledElements: {
      unpostedCommentIndicator: { disabled: false },
    },
    openElements: {},
    flyoutMap: {},
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
  },
  officeEditor: {
    editMode: 'editing',
  },
};

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('NoteHeader Component', () => {
  let getEditorMock;
  let getExistingEditorMock;

  beforeEach(() => {
    jest.clearAllMocks();
    initialState.viewer.isSpreadsheetEditorModeEnabled = false;
    getEditorMock = jest.fn().mockReturnValue(null);
    getExistingEditorMock = jest.fn().mockReturnValue(null);

    useCore.mockReturnValue({
      core: {
        getAnnotationManager: jest.fn().mockReturnValue({
          getEditBoxManager: jest.fn().mockReturnValue({
            getEditor: getEditorMock,
            getExistingEditor: getExistingEditorMock,
          }),
        }),
      },
    });
    // We mock the redux call to always return "false" for isElementDisabled
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) => callback(initialState));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestNoteHeader {...notSelectedProps} />);
    }).not.toThrow();
  });

  it('When component is selected, it does not render reply counter', () => {
    const { container } = render(
      <TestNoteHeader {...notSelectedProps} />
    );

    expect(container.querySelector('div.num-replies-counter')).not.toBeInTheDocument();
  });

  it('renders correct author name', () => {
    const { container } = render(
      <TestNoteHeader {...notSelectedProps} />
    );

    getByText(container, notSelectedProps.annotation.Author);
  });

  it('renders correct annotation number', () => {
    const { container } = render(
      <TestNoteHeader {...testPropsWithAnnotationNumbering} />
    );

    getByText(container, `#${testPropsWithAnnotationNumbering.annotation.getAssociatedNumber()} -`);
  });

  it('uses getExistingEditor and does not call getEditor when reading freetext display color', () => {
    const freeTextAnnotation = Object.create(window.Core.Annotations.FreeTextAnnotation.prototype);
    Object.assign(freeTextAnnotation, notSelectedProps.annotation);

    render(
      <TestNoteHeader
        {...notSelectedProps}
        annotation={freeTextAnnotation}
      />
    );

    expect(getExistingEditorMock).toHaveBeenCalledWith(freeTextAnnotation);
    expect(getEditorMock).not.toHaveBeenCalled();
  });

  describe('spreadsheet comment behavior', () => {
    beforeEach(() => {
      initialState.viewer.isSpreadsheetEditorModeEnabled = true;
    });

    it('does not render status button for spreadsheet comments', () => {
      const { container } = render(
        <TestNoteHeader
          {...notSelectedProps}
          annotation={testPropsSpreadsheetComment.annotation}
        />
      );
      expect(screen.queryByRole('button', { name: getTranslatedText('option.notesOrder.status') })).not.toBeInTheDocument();
    });

    it('renders status button for non-spreadsheet comments', () => {
      const { container } = render(
        <TestNoteHeader {...notSelectedProps} />
      );
      expect(screen.getByRole('button', { name: getTranslatedText('option.notesOrder.status') })).toBeInTheDocument();
    });

    it('adds spreadsheet-type-icon class to icon for spreadsheet comments', () => {
      const { container } = render(
        <TestNoteHeader
          {...notSelectedProps}
          annotation={testPropsSpreadsheetComment.annotation}
        />
      );
      expect(container.querySelector('.spreadsheet-type-icon')).toBeInTheDocument();
    });

    it('does not add spreadsheet-type-icon class for non-spreadsheet annotations', () => {
      const { container } = render(
        <TestNoteHeader {...notSelectedProps} />
      );
      expect(container.querySelector('.spreadsheet-type-icon')).not.toBeInTheDocument();
    });
  });
});
