import React from 'react';
import TabPanel from './TabPanel';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const noop = () => {
};

const mockDocumentViewer = {
  getPageSearchResults: () => [],
  addEventListener: noop,
  removeEventListener: noop,
};

jest.mock('core', () => ({
  setBookmarkIconShortcutVisibility: noop,
  setBookmarkShortcutToggleOnFunction: noop,
  setBookmarkShortcutToggleOffFunction: noop,
  setUserBookmarks: noop,
  addEventListener: noop,
  removeEventListener: noop,
  getDocument: noop,
  getDocumentViewer: () => mockDocumentViewer,
  getTool: () => ({
    clearOutlineDestination: noop,
  }),
  getToolMode: () => 'AnnotationEdit',
  getToolModeMap: () => ({
    AnnotationEdit: 'AnnotationEdit',
  }),
  isFullPDFEnabled: noop,
  setToolMode: noop,
  getDocumentViewers: () => [mockDocumentViewer],
  clearSearchResults: noop,
  getSelectedAnnotations: () => [],
  getAnnotationsList: () => [],
}));

describe('TabPanel', () => {
  const mockInitialState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          'dataElement': 'stylePanel',
          'render': 'stylePanel',
          'location': 'left'
        },
        {
          'dataElement': 'thumbnailsPanel',
          'render': 'thumbnailsPanel',
          'location': 'left'
        },
        {
          'dataElement': 'outlinePanel',
          'render': 'outlinesPanel',
          'location': 'left'
        },
        {
          'dataElement': 'bookmarkPanel',
          'render': 'bookmarksPanel',
          'location': 'left'
        },
        {
          'dataElement': 'layersPanel',
          'render': 'layersPanel',
          'location': 'left'
        },
        {
          'dataElement': 'signatureListPanel',
          'render': 'signatureListPanel',
          'location': 'left'
        },
        {
          'dataElement': 'fileAttachmentPanel',
          'render': 'fileAttachmentPanel',
          'location': 'left'
        },
        {
          'dataElement': 'rubberStampPanel',
          'render': 'rubberStampPanel',
          'location': 'left'
        },
        {
          'dataElement': 'textEditingPanel',
          'render': 'textEditingPanel',
          'location': 'right'
        },
        {
          'dataElement': 'signaturePanel',
          'render': 'signaturePanel',
          'location': 'left'
        },
        {
          'dataElement': 'portfolioPanel',
          'render': 'portfolioPanel',
          'location': 'left'
        },
        {
          'render': 'tabPanel',
          'dataElement': 'customLeftPanel',
          'panelsList': [
            {
              'render': 'thumbnailsPanel'
            },
            {
              'render': 'outlinePanel'
            },
            {
              'render': 'bookmarkPanel'
            },
            {
              'render': 'layersPanel'
            },
            {
              'render': 'signaturePanel'
            },
            {
              'render': 'fileAttachmentPanel'
            },
            {
              'render': 'stylePanel'
            },
            {
              'render': 'searchPanel'
            },
            {
              'render': 'notesPanel'
            },
            {
              'render': 'portfolioPanel'
            },
          ],
          'location': 'left'
        },
        {
          'dataElement': 'notesPanel',
          'render': 'notesPanel',
          'location': 'right'
        },
        {
          'dataElement': 'searchPanel',
          'render': 'searchPanel',
          'location': 'right'
        },
        {
          'dataElement': 'redactionPanel',
          'render': 'redactionPanel',
          'location': 'right'
        }
      ],
      activeCustomPanel: 'layersPanel',
    }
  };

  const createStore = (preloadedState) => {
    return configureStore({
      reducer: rootReducer,
      preloadedState: preloadedState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    });
  };

  const panelsToCheck = [
    { name: 'Thumbnails', className: 'ThumbnailsPanel' },
    { name: 'Outlines', className: 'OutlinesPanel' },
    { name: 'Bookmarks', className: 'BookmarksPanel' },
    { name: 'Layers', className: 'LayersPanel' },
    { name: 'Style', className: 'StylePanel' },
    { name: 'Search', className: 'SearchPanel' },
    { name: 'Comments', className: 'NotesPanel' },
    { name: 'Signatures', className: 'SignaturePanel' },
    { name: 'Attachments', className: 'fileAttachmentPanel' },
  ];

  const TabPanelWithRedux = ({ initialState }) => (
    <Provider store={createStore(initialState)}>
      <TabPanel dataElement='customLeftPanel' />
    </Provider>
  );

  it('correctly renders all the tabs', () => {
    expect(() => {
      render(<TabPanelWithRedux initialState={mockInitialState} />);
    }).not.toThrow();
    // get all buttons
    for (const panel of panelsToCheck) {
      screen.getByRole('button', { name: panel.name });
    }
  });
  it('should render each panel when clicked', () => {
    const { container } = render(<TabPanelWithRedux initialState={mockInitialState}/>);
    for (const panel of panelsToCheck) {
      const button = screen.getByRole('button', { name: panel.name });
      button.click();
      expect(container.querySelector(`.${panel.className}`)).toBeInTheDocument();
    }
  });
});