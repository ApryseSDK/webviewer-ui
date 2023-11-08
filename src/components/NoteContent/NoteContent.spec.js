import React from 'react';
import { render } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { testProps, testPropsWithSkipAutoLink } from './NoteContent.stories';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';

const TestNoteContent = withProviders(NoteContent);
const notSelectedProps = {
  ...testProps,
  isSelected: false,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
    colorMap: {
      '1': '#E44234'
    }
  }
};

const context = {
  pendingEditTextMap: { /* mocked values */ },
  pendingReplyMap: { /* mocked values */ },
  pendingAttachmentMap: { /* mocked values */ },
  isSelected: true, // Change to true if needed
  searchInput: 'mockedSearchInput',
};

jest.mock('core');

describe('NoteContent Component', () => {
  beforeEach(() => {
    // We mock the redux call to always return "false" for isElementDisabled
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) => callback(initialState));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(
        <NoteContext.Provider value={context}>
          <TestNoteContent {...notSelectedProps}/>
        </NoteContext.Provider>
      );
    }).not.toThrow();
  });

  it('Should generate an <a> tag if a link is identified', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteContent {...notSelectedProps}/>
      </NoteContext.Provider>
    );

    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('Should not throw any errors when the annotation has SkipURLIdentification set to true', () => {
    expect(() => {
      render(
        <NoteContext.Provider value={context}>
          <TestNoteContent {...testPropsWithSkipAutoLink}/>
        </NoteContext.Provider>
      );
    });
  });

  it('Should not generate an <a> tag if the annotation has SkipURLIdentification set to true', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteContent {...testPropsWithSkipAutoLink}/>
      </NoteContext.Provider>
    );

    expect(container.querySelector('a')).not.toBeInTheDocument();
  });
});
