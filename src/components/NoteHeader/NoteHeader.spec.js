import React from 'react';
import { render, getByText } from '@testing-library/react';
import NoteHeader from './NoteHeader';
import * as reactRedux from 'react-redux';
import { testProps, testPropsWithAnnotationNumbering } from './NoteHeader.stories';

const TestNoteHeader = withProviders(NoteHeader);
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
  }
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('NoteHeader Component', () => {
  beforeEach(() => {
    // We mock the redux call to always return "false" for isElementDisabled
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) => callback(initialState));
    // Mock some context items
    jest.spyOn(React, 'useContext').mockReturnValue({
      pendingEditTextMap: {},
      pendingReplyMap: {},
      pendingAttachmentMap: {}
    });
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

  // WISEflow: Test changes to the NoteHeader: Annotation reference and copy, ShareType

  // TODO
});
