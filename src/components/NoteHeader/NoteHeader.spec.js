import React from 'react';
import { render, getByText } from '@testing-library/react';
import NoteHeader from './NoteHeader';
import * as reactRedux from 'react-redux';
import { testProps, testPropsWithAnnotationNumbering } from './NoteHeader.stories';
import NoteContext from '../Note/Context';

const noop = () => { };

const TestNoteHeader = withProviders(NoteHeader);
const notSelectedProps = {
  ...testProps,
  isSelected: false,
};

const context = {
  acceptTrackedChange: noop,
  rejectTrackedChange: noop,
};

const initialState = {
  viewer: {
    disabledElements: {
      unpostedCommentIndicator: { disabled: false },
    },
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
  }
};

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
      render(
        <NoteContext.Provider value={context}>
          <TestNoteHeader {...notSelectedProps} />
        </NoteContext.Provider>
      );
    }).not.toThrow();
  });

  it('When component is selected, it does not render reply counter', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteHeader {...notSelectedProps} />
      </NoteContext.Provider>
    );

    expect(container.querySelector('div.num-replies-counter')).not.toBeInTheDocument();
  });

  it('renders correct author name', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteHeader {...notSelectedProps} />
      </NoteContext.Provider>
    );

    getByText(container, notSelectedProps.annotation.Author);
  });

  it('renders correct annotation number', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteHeader {...testPropsWithAnnotationNumbering} />
      </NoteContext.Provider>
    );

    getByText(container, `#${testPropsWithAnnotationNumbering.annotation.getAssociatedNumber()} -`);
  });
});
