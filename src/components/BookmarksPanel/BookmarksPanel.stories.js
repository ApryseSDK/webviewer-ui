import React from 'react';
import BookmarksPanel from './BookmarksPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import '../LeftPanel/LeftPanel.scss';
import App from 'components/App';
import initialState from 'src/redux/initialState';

export default {
  title: 'Components/BookmarksPanel',
  component: BookmarksPanel,
};

const pageLabels = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

export const Basic = () => {
  const initialState = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    }
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={configureStore({ reducer: () => initialState })}>
          <BookmarksPanel />
        </Provider>
      </div>
    </div>
  );
};

export const NoBookmarks = () => {
  const initialState = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      bookmarks: {},
    },
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={configureStore({ reducer: () => initialState })}>
          <BookmarksPanel />
        </Provider>
      </div>
    </div>
  );
};

// Custom panels

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const DEFAULT_NOTES_PANEL_WIDTH = 293;

const MockApp = ({ initialState }) => {
  return (
    <Provider store={configureStore({
      reducer: () => initialState,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}
    >
      <App removeEventHandlers={noop} />
    </Provider>
  );
};



export const CustomBasic = () => {
  const stateWithBookmarksPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'bookmarksPanel',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      panelWidths: { panel: DEFAULT_NOTES_PANEL_WIDTH },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      ...initialState.document,
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    }
  };

  return <MockApp initialState={stateWithBookmarksPanel} />;
};

CustomBasic.parameters = { layout: 'fullscreen' };

export const CustomBasicNoBookmarks = () => {
  const stateWithBookmarksPanelEmpty = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'bookmarksPanel',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    }
  };

  return <MockApp initialState={stateWithBookmarksPanelEmpty} />;
};

CustomBasicNoBookmarks.parameters = { layout: 'fullscreen' };

export const CustomRightSide = () => {
  const stateWithBookmarksPanelOnRight = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'bookmarksPanel',
          location: 'right',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      panelWidths: { panel: DEFAULT_NOTES_PANEL_WIDTH },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      ...initialState.document,
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    }
  };

  return <MockApp initialState={stateWithBookmarksPanelOnRight} />;
};

CustomRightSide.parameters = { layout: 'fullscreen' };

export const CustomRightSideNoBookmarks = () => {
  const stateWithBookmarksPanelOnRightEmpty = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'bookmarksPanel',
          location: 'right',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      pageLabels: pageLabels,
      currentPage: 3,
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    }
  };

  return <MockApp initialState={stateWithBookmarksPanelOnRightEmpty} />;
};

CustomRightSideNoBookmarks.parameters = { layout: 'fullscreen' };