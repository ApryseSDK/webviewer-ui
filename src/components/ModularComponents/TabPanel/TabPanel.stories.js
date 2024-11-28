import React from 'react';
import TabPanel from './TabPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { panelMinWidth } from 'constants/panel';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from '@storybook/test';

export default {
  title: 'ModularComponents/TabPanel',
  component: TabPanel,
  parameters: {
    customizableUI: true,
  },
};

const mockState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    bookmarkIconShortcutVisibility: false,
    openElements: {
      signatureModal: false
    },
    toolbarGroup: 'toolbarGroup-Insert',
    genericPanels: [
      {
        render: 'thumbnailsPanel',
        dataElement: 'thumbnailsPanel',
      },
      {
        render: 'bookmarksPanel',
        dataElement: 'bookmarksPanel',
      },
      {
        render: 'notesPanel',
        dataElement: 'notesPanel',
      },
      {
        render: 'layersPanel',
        dataElement: 'layersPanel',
      },
      {
        render: 'signaturePanel',
        dataElement: 'signaturePanel',
      },
      {
        render: 'portfolioPanel',
        dataElement: 'portfolioPanel',
      },
      {
        'render': 'tabPanelIconsOnly',
        'dataElement': 'tabPanelIconsOnly',
        'panelsList': [
          {
            'render': 'thumbnailsPanel'
          },
          {
            'render': 'bookmarksPanel'
          },
          {
            'render': 'notesPanel'
          },
          {
            'render': 'layersPanel'
          },
          {
            'render': 'signaturePanel',
          },
          {
            'render': 'portfolioPanel',
          }
        ]
      },
      {
        'render': 'tabPanelLabelsOnly',
        'dataElement': 'tabPanelLabelsOnly',
        'panelsList': [
          {
            'render': 'label1'
          },
          {
            'render': 'label2'
          },
          {
            'render': 'label3'
          },
        ]
      },
      {
        'render': 'tabPanelIconsAndLabels',
        'dataElement': 'tabPanelIconsAndLabels',
        'panelsList': [
          {
            'render': 'icon-label1'
          },
          {
            'render': 'icon-label2'
          },
          {
            'render': 'icon-label3'
          },
        ]
      },
      {
        dataElement: 'label1',
        title: 'Tab 1',
        label: 'Tab 1',
        render: {},
      },
      {
        dataElement: 'label2',
        title: 'Tab 2',
        label: 'Tab 2',
        render: {},
      },
      {
        dataElement: 'label3',
        title: 'Tab 3',
        label: 'Tab 3',
        render: {},
      },
      {
        dataElement: 'icon-label1',
        icon: 'ic_bookmarks_black_24px',
        title: 'Tab 1',
        label: 'Tab 1',
        render: {},
      },
      {
        dataElement: 'icon-label2',
        icon: 'ic_annotation_cloudy_rectangular_area_black_24px',
        title: 'Tab 2',
        label: 'Tab 2',
        render: {},
      },
      {
        dataElement: 'icon-label3',
        icon: 'ic_thumbnails_grid_black_24px',
        title: 'Tab 3',
        label: 'Tab 3',
        render: {},
      },
    ],
    lastPickedToolGroup: '',
    activeTabInPanel: {
      'tabPanel': 'thumbnailsPanel',
    },
    flyoutMap: {},
    customPanels: []
  },
  document: {
    bookmarks: [],
  },
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({ reducer: () => mockState });

const tabPanelTemplate = (dataElement, width) => {
  return (
    <Provider store={store}>
      <div style={{ width: `${width}px` }}>
        <TabPanel dataElement={dataElement} />
      </div>
    </Provider>
  );
};

export const TabPanelWithIconsOnly = () => (tabPanelTemplate('tabPanelIconsOnly', 320));

export const TabPanelWithLabelsOnly = () => (tabPanelTemplate('tabPanelLabelsOnly', 204));

export const TabPanelIconsAndLabels = () => (tabPanelTemplate('tabPanelIconsAndLabels', 246));

const initialStateThumbnailsOnly = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    bookmarkIconShortcutVisibility: false,
    openElements: {
      signatureModal: false
    },
    toolbarGroup: 'toolbarGroup-Insert',
    genericPanels: [
      {
        'render': 'tabPanelIconsAndLabels',
        'dataElement': 'tabPanelIconsAndLabels',
        'panelsList': [
          {
            'render': 'icon-label1'
          },
        ]
      },
      {
        dataElement: 'icon-label1',
        icon: 'ic_bookmarks_black_24px',
        title: 'Tab 1',
        label: 'Tab 1',
        render: 'thumbnailsPanel',
      },
    ],
    lastPickedToolGroup: '',
    flyoutMap: {},
    customPanels: [],
    activeTabInPanel: {
      'tabPanelIconsAndLabels': 'icon-label1',
    },
    selectedThumbnailPageIndexes: [],
    thumbnailSelectingPages: true,
    panelWidths: {
      'tabPanelIconsAndLabels': panelMinWidth,
    }
  },
  document: {
    bookmarks: [],
    totalPages: {
      1: 0,
    }
  },
  featureFlags: {
    customizableUI: false,
  },
};

const storeThumbnailsOnly = configureStore({ reducer: () => initialStateThumbnailsOnly });

export const TabPanelWithThumbnailPanelMinWidth = () => (
  <Provider store={storeThumbnailsOnly}>
    <div style={{ display: 'flex' }}>
      <div style={{ width: `${panelMinWidth}px`, height: '75%' }}>
        <TabPanel dataElement="tabPanelIconsAndLabels"/>
      </div>
    </div>
  </Provider>
);

const initialStateThumbnailsOnlyMaxWidth = {
  ...initialStateThumbnailsOnly,
  viewer: {
    ...initialStateThumbnailsOnly.viewer,
    panelWidths: {
      'tabPanelIconsAndLabels': 600,
    }
  }
};
const storeThumbnailsOnlyMaxWidth = configureStore({ reducer: () => initialStateThumbnailsOnlyMaxWidth });
export const TabPanelWithThumbnailPanelMaxWidth = () => (
  <Provider store={storeThumbnailsOnlyMaxWidth}>
    <div style={{ display: 'flex' }}>
      <div style={{ width: '600px', height: '75%' }}>
        <TabPanel dataElement="tabPanelIconsAndLabels"/>
      </div>
    </div>
  </Provider>
);

const TabPanelInApp = (location, activePanel, panelWidth) => {
  const appMockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      ...mockState.viewer,
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: false,
      genericPanels: [
        {
          render: 'tabPanel',
          dataElement: 'tabPanel',
          panelsList: [
            {
              'render': 'thumbnailsPanel'
            },
            {
              'render': 'outlinesPanel'
            },
            {
              'render': 'bookmarksPanel'
            },
            {
              'render': 'layersPanel'
            },
            {
              'render': 'signaturePanel',
            },
            {
              'render': 'fileAttachmentPanel',
            }
          ],
          location,
        },
        {
          render: 'thumbnailsPanel',
          dataElement: 'thumbnailsPanel',
        },
        {
          render: 'bookmarksPanel',
          dataElement: 'bookmarksPanel',
        },
        {
          render: 'outlinesPanel',
          dataElement: 'outlinesPanel',
        },
        {
          render: 'layersPanel',
          dataElement: 'layersPanel',
        },
        {
          render: 'signaturePanel',
          dataElement: 'signaturePanel',
        },
        {
          render: 'fileAttachmentPanel',
          dataElement: 'fileAttachmentPanel',
        },
      ],
      openElements: {
        tabPanel: true,
      },
      activeTabInPanel: {
        ...initialState.viewer.activeTabInPanel,
        'tabPanel': activePanel,
      },
      panelWidths: {
        ...initialState.viewer.panelWidths,
        tabPanel: panelWidth || 330,
      },
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(appMockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={appMockState} />;
} ;

export const TabPanelInApplication = () => (TabPanelInApp('left', 'thumbnailsPanel', 400));

export const TabPanelWithThumbnailsInMobile = () => (TabPanelInApp('left', 'thumbnailsPanel'));

export const TabPanelWithOutlinesInMobile = () => (TabPanelInApp('left', 'outlinesPanel'));

export const TabPanelWithBookmarksInMobile = () => (TabPanelInApp('left', 'bookmarksPanel'));

export const TabPanelWithLayersInMobile = () => (TabPanelInApp('left', 'layersPanel'));

export const TabPanelWithSignatureInMobile = () => (TabPanelInApp('left', 'signaturePanel'));

export const TabPanelWithFileAttachmentInMobile = () => (TabPanelInApp('left', 'fileAttachmentPanel'));

TabPanelWithThumbnailsInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithOutlinesInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithBookmarksInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithLayersInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithSignatureInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithFileAttachmentInMobile.parameters = window.storybook.MobileParameters;

const panelsToCheck = [
  { name: 'Thumbnails', className: 'ThumbnailsPanel' },
  { name: 'Outlines', className: 'OutlinesPanel' },
  { name: 'Bookmarks', className: 'BookmarksPanel' },
  { name: 'Layers', className: 'LayersPanel' },
  { name: 'Signatures', className: 'SignaturePanel' },
  { name: 'Attachments', className: 'fileAttachmentPanel' },
];

TabPanelInApplication.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Wait for the first tab to be rendered before proceeding
  await waitFor(() => {
    const tabButton = canvas.getByRole('button', { name: /Thumbnails/i });
    expect(tabButton).toBeInTheDocument();
  });

  // should correctly renders all the tabs, should render each panel when clicked
  // and each tab should have the correct aria-current attribute when it is active
  for (const panel of panelsToCheck) {
    const tabButton = await canvas.getByRole('button', { name: panel.name });
    await expect(tabButton).toBeInTheDocument();
    await userEvent.click(tabButton);
    const panelElement = canvasElement.querySelector(`.${panel.className}`);
    await expect(panelElement).toBeInTheDocument();
    await expect(tabButton).toHaveAttribute('aria-current', 'true');
  }
};