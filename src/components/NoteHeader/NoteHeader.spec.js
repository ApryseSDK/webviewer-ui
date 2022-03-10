import React from 'react';
import { render, getByText } from '@testing-library/react';
import NoteHeader from './NoteHeader';
import * as reactRedux from 'react-redux';
import { Basic, testProps, } from './NoteHeader.stories';
import { createStore } from "redux";

const BasicNoteHeader = withI18n(Basic);
const TestNoteHeader = withProviders(NoteHeader);

describe('NoteHeader Component', () => {
  beforeEach(() => {
    // We mock the redux call to always return "false" for isElementDisabled
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(false);
    // Mock some context items
    jest.spyOn(React, 'useContext').mockReturnValue({ pendingEditTextMap: {}, pendingReplyMap: {} });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<BasicNoteHeader />);
    }).not.toThrow();
  });

  it('When component is selected, it does not render reply counter', () => {
    const notSelectedProps = {
      ...testProps,
      isSelected: false,
    };

    const { container } = render(
      <TestNoteHeader {...notSelectedProps} />
    );

    expect(container.querySelector('div.num-replies-counter')).not.toBeInTheDocument();
  });

  it('renders correct author name', () => {
    const notSelectedProps = {
      ...testProps,
      isSelected: false,
    };

    const { container } = render(
      <TestNoteHeader {...notSelectedProps} />
    );

    getByText(container, notSelectedProps.annotation.Author);
  });
});