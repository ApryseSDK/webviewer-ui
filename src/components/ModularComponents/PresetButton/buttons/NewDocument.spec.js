import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NewDocumentButton from './NewDocument';
import loadDocument from 'helpers/loadDocument';

const mockDispatch = jest.fn();
let mockState;

jest.mock('helpers/loadDocument', () => jest.fn());

jest.mock('helpers/officeEditor', () => ({
  isOfficeEditorMode: jest.fn(() => true),
}));

jest.mock('selectors', () => ({
  __esModule: true,
  default: {
    getIsMultiTab: (state) => state.viewer.isMultiTab,
    getTabManager: (state) => state.viewer.TabManager,
    getActiveTab: (state) => state.viewer.activeTab,
    getTabs: (state) => state.viewer.tabs,
    isMultiViewerMode: (state) => state.viewer.isMultiViewerMode,
    isElementDisabled: () => false,
    getFeatureFlags: () => ({}),
    getCustomElementOverrides: () => ({}),
    getActiveDocumentViewerKey: () => 1,
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));


describe('NewDocument button', () => {
  const getNewDocumentButton = () => screen.getByRole('button', { name: /new document/i });

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      viewer: {
        isMultiTab: false,
        TabManager: null,
        activeTab: 0,
        tabs: [],
        isMultiViewerMode: false,
      },
    };
  });

  it('loads a new document directly', () => {
    render(<NewDocumentButton />);
    fireEvent.click(getNewDocumentButton());

    expect(loadDocument).toHaveBeenCalledWith(
      mockDispatch,
      null,
      {
        filename: 'Untitled.docx',
        enableOfficeEditing: true,
      }
    );
  });
});
