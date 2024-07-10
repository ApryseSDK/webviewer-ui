import React from 'react';
import BookmarksPanel from './BookmarksPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import '../LeftPanel/LeftPanel.scss';
import initialState from 'src/redux/initialState';
import { MockApp } from 'helpers/storybookHelper';

export default {
  title: 'Components/BookmarksPanel',
  component: BookmarksPanel,
  parameters: {
    customizableUI: true,
  },
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
      activeCustomRibbon: 'toolbarGroup-Annotate',
    },
    document: {
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    },
    featureFlags: {
      customizableUI: true,
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
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': 'AnnotationCreateTextHighlight',
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-View',
    },
    document: {
      bookmarks: {},
    },
    featureFlags: {
      customizableUI: true,
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
const DEFAULT_NOTES_PANEL_WIDTH = 293;

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
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'bookmarksPanel': { disabled: false, priority: 3 },
        'bookmarksPanelButton': { disabled: false, priority: 3 },
      },
      pageLabels: pageLabels,
      currentPage: 3,
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': 'AnnotationCreateTextHighlight',
        'annotateToolsGroupedItems': 'AnnotationCreateTextHighlight',
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateTextHighlight',
        group: ['annotateGroupedItems', 'annotateToolsGroupedItems'],
      },
      activeToolName: 'AnnotationCreateTextHighlight',
    },
    document: {
      ...initialState.document,
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanel} />;
};

CustomBasic.parameters = { layout: 'fullscreen', customizableUI: true };

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
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'bookmarksPanel': { disabled: false, priority: 3 },
        'bookmarksPanelButton': { disabled: false, priority: 3 },
      },
      pageLabels: pageLabels,
      currentPage: 3,
      activeCustomRibbon: 'toolbarGroup-View',
      lastPickedToolAndGroup: {
        tool: 'AnnotationEdit',
        group: ['groupedLeftPanelItems'],
      },
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanelEmpty} />;
};

CustomBasicNoBookmarks.parameters = { layout: 'fullscreen', customizableUI: true };

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
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'bookmarksPanel': { disabled: false, priority: 3 },
        'bookmarksPanelButton': { disabled: false, priority: 3 },
      },
      pageLabels: pageLabels,
      currentPage: 3,
      activeCustomRibbon: 'toolbarGroup-View',
      lastPickedToolAndGroup: {
        tool: 'AnnotationEdit',
        group: ['groupedLeftPanelItems'],
      },
    },
    document: {
      ...initialState.document,
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanelOnRight} />;
};

CustomRightSide.parameters = { layout: 'fullscreen', customizableUI: true };

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
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'bookmarksPanel': { disabled: false, priority: 3 },
        'bookmarksPanelButton': { disabled: false, priority: 3 },
      },
      pageLabels: pageLabels,
      currentPage: 3,
      activeCustomRibbon: 'toolbarGroup-View',
      activeToolName: 'AnnotationCreateTextHighlight'
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanelOnRightEmpty} />;
};

CustomRightSideNoBookmarks.parameters = { layout: 'fullscreen', customizableUI: true };