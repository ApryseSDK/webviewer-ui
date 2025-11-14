import React from 'react';
import TabPanel from './TabPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { panelMinWidth, panelNames } from 'constants/panel';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { expect, within , userEvent } from 'storybook/test';
import viewOnlyWhitelist from 'src/redux/viewOnlyWhitelist';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/TabPanel',
  component: TabPanel,
  layout: 'fullscreen',
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
    customPanels: [],
    multiPageManipulationControls: [
      { dataElement: 'leftPanelPageTabsRotate' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMove' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMore' },
    ],
  },
  document: {
    bookmarks: [],
    portfolio: [{ id: 1, name: 'Portfolio Item 1' }],
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
TabPanelWithIconsOnly.parameters = window.storybook.disableRtlMode;

export const TabPanelWithLabelsOnly = () => (tabPanelTemplate('tabPanelLabelsOnly', 204));
TabPanelWithLabelsOnly.parameters = window.storybook.disableRtlMode;

export const TabPanelIconsAndLabels = () => (tabPanelTemplate('tabPanelIconsAndLabels', 246));
TabPanelIconsAndLabels.parameters = window.storybook.disableRtlMode;

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
    },
    multiPageManipulationControls: [
      { dataElement: 'leftPanelPageTabsRotate' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMove' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMore' },
    ],
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

const TabPanelInApp = (context, location, activePanel, panelWidth) => {
  const { addonRtl } = context.globals;
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
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(appMockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={appMockState} initialDirection={addonRtl} />;
};

export const TabPanelInApplication = (args, context) => (TabPanelInApp(context, 'left', 'thumbnailsPanel', 400));

export const TabPanelWithThumbnailsInMobile = (args, context) => (TabPanelInApp(context, 'left', 'thumbnailsPanel'));

export const TabPanelWithOutlinesInMobile = (args, context) => (TabPanelInApp(context, 'left', 'outlinesPanel'));

export const TabPanelWithBookmarksInMobile = (args, context) => (TabPanelInApp(context, 'left', 'bookmarksPanel'));

export const TabPanelWithLayersInMobile = (args, context) => (TabPanelInApp(context, 'left', 'layersPanel'));

export const TabPanelWithSignatureInMobile = (args, context) => (TabPanelInApp(context, 'left', 'signaturePanel'));

export const TabPanelWithFileAttachmentInMobile = (args, context) => (TabPanelInApp(context, 'left', 'fileAttachmentPanel'));

TabPanelWithThumbnailsInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithOutlinesInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithBookmarksInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithLayersInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithSignatureInMobile.parameters = window.storybook.MobileParameters;
TabPanelWithFileAttachmentInMobile.parameters = window.storybook.MobileParameters;

const PANELS_META = [
  { key: 'component.thumbnailsPanel', className: 'ThumbnailsPanel', panelName: panelNames.THUMBNAIL },
  { key: 'component.outlinesPanel', className: 'OutlinesPanel', panelName: panelNames.OUTLINE },
  { key: 'component.bookmarksPanel', className: 'BookmarksPanel', panelName: panelNames.BOOKMARKS },
  { key: 'component.layersPanel', className: 'LayersPanel', panelName: panelNames.LAYERS },
  { key: 'component.signaturePanel', className: 'SignaturePanel', panelName: panelNames.SIGNATURE },
  { key: 'component.attachmentPanel', className: 'fileAttachmentPanel', panelName: panelNames.FILE_ATTACHMENT },
];

const getPanelsToCheck = () =>
  PANELS_META.map((p) => ({ ...p, name: getTranslatedText(p.key) }));

TabPanelInApplication.parameters = {
  test: {
    // For issues with mocks that are unrelated to the test
    dangerouslyIgnoreUnhandledErrors: true,
  },
};
TabPanelInApplication.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const tabButton = await canvas.findByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  expect(tabButton).toBeInTheDocument();

  // should correctly renders all the tabs, should render each panel when clicked
  // and each tab should have the correct aria-current attribute when it is active
  for (const panel of getPanelsToCheck()) {
    const tabButton = await canvas.getByRole('button', { name: panel.name });
    await expect(tabButton).toBeInTheDocument();
    await userEvent.click(tabButton);
    const panelElement = canvasElement.querySelector(`.${panel.className}`);
    await expect(panelElement).toBeInTheDocument();
    await expect(tabButton).toHaveAttribute('aria-current', 'true');
  }
};

export const ViewOnlyTabPanel = (args, context) => (TabPanelInApp(context, 'left', 'viewOnlyPanel'));
ViewOnlyTabPanel.parameters = window.storybook.disableRtlMode;

ViewOnlyTabPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  let tabButton = await canvas.findByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  expect(tabButton).toBeInTheDocument();

  window.instance.UI.enableViewOnlyMode();
  window.instance.UI.openElements(['tabPanel']);

  tabButton = await canvas.findByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  expect(tabButton).toBeInTheDocument();

  for (const panel of getPanelsToCheck()) {
    const tabButton = canvas.queryByRole('button', { name: panel.name });
    const isWhitelisted = viewOnlyWhitelist.panel.includes(panel.panelName);
    if (isWhitelisted) {
      await expect(tabButton).toBeInTheDocument();
    } else {
      await expect(tabButton).toBeNull();
    }
  }
};

export const TabPanelWithNoVisibleTabs = (args, context) => (TabPanelInApp(context, 'left', 'viewOnlyPanel'));
TabPanelWithNoVisibleTabs.parameters = window.storybook.disableRtlMode;

TabPanelWithNoVisibleTabs.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const panels = Object.values(panelNames);

  window.instance.UI.openElement(panelNames.TABS);
  let tabButton = await canvas.findByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  expect(tabButton).toBeInTheDocument();

  window.instance.UI.disableElements(panels);
  window.instance.UI.openElement(panelNames.TABS);
  tabButton = canvas.queryByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  expect(tabButton).toBeNull();
};