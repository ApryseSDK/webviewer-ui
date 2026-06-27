import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropArea from './DropArea';
import loadDocument from 'helpers/loadDocument';

const mockDispatch = jest.fn();
let mockState;

jest.mock('helpers/loadDocument', () => jest.fn());

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('selectors', () => ({
  __esModule: true,
  default: {
    getCustomMultiViewerAcceptedFileFormats: (state) => state.viewer.customMultiViewerAcceptedFileFormats,
    getIsMultiTab: (state) => state.viewer.isMultiTab,
    getTabManager: (state) => state.viewer.TabManager,
    getActiveTab: (state) => state.viewer.activeTab,
    getTabs: (state) => state.viewer.tabs,
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

describe('MultiViewer DropArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      viewer: {
        customMultiViewerAcceptedFileFormats: null,
        isMultiTab: false,
        TabManager: null,
        activeTab: 1,
        tabs: [],
      },
    };
    window.Core = {
      SupportedFileFormats: {
        CLIENT: ['pdf'],
        SERVER: ['pdf'],
      },
    };
  });

  it('loads document into target viewer in single-tab mode on drop', () => {
    const file = new File(['content'], 'single.pdf', { type: 'application/pdf' });
    const { container } = render(<DropArea documentViewerKey={2} />);

    fireEvent.drop(container.querySelector('.DropArea'), {
      dataTransfer: { files: [file] },
    });

    expect(loadDocument).toHaveBeenCalledWith(mockDispatch, file, {}, 2);
  });

  it('updates secondary document on drop in multi-tab mode for viewer 2', () => {
    const updateTab = jest.fn();
    mockState.viewer = {
      ...mockState.viewer,
      isMultiTab: true,
      activeTab: 9,
      TabManager: { updateTab },
    };
    const file = new File(['content'], 'secondary.pdf', { type: 'application/pdf' });
    const { container } = render(<DropArea documentViewerKey={2} />);

    fireEvent.drop(container.querySelector('.DropArea'), {
      dataTransfer: { files: [file] },
    });

    expect(updateTab).toHaveBeenCalledWith(9, {
      document2: {
        src: file,
        options: {},
      },
    });
    expect(loadDocument).not.toHaveBeenCalled();
  });

  it('updates tab from file input selection in multi-tab mode for viewer 1', () => {
    const updateTab = jest.fn();
    mockState.viewer = {
      ...mockState.viewer,
      isMultiTab: true,
      activeTab: 3,
      TabManager: { updateTab },
    };
    const file = new File(['content'], 'primary.pdf', { type: 'application/pdf' });

    const { container } = render(<DropArea documentViewerKey={1} />);
    const fileInput = container.querySelector('input[type="file"]');
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(updateTab).toHaveBeenCalledWith(3, {
      src: file,
      options: {},
      isMultiViewer: true,
    });
  });
});
