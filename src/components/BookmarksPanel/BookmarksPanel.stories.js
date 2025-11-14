
import React from 'react';
import BookmarksPanel from './BookmarksPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import '../LeftPanel/LeftPanel.scss';
import initialState from 'src/redux/initialState';
import { createTemplate, MockApp } from 'helpers/storybookHelper';
import { menuItems } from 'helpers/outlineFlyoutHelper';
import { expect, within } from 'storybook/test';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

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
      activeCustomRibbon: 'toolbarGroup-Annotate',
      flyoutMap: {
        'bookmarkFlyout-outlinePath': {
          dataElement: 'bookmarkFlyout-outlinePath',
          items: menuItems,
        }
      },
      activeFlyout: 'bookmarkFlyout-outlinePath',
      openElements: {
        'bookmarkFlyout-outlinePath': true,
      },
    },
    lastActiveToolForRibbon: {},
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

Basic.parameters = window.storybook.disableRtlMode;

export const NoBookmarks = () => {
  const initialState = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      pageLabels: pageLabels,
      currentPage: 3,
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

NoBookmarks.parameters = window.storybook.disableRtlMode;

// Custom panels
const DEFAULT_NOTES_PANEL_WIDTH = 293;

export const CustomBasic = (args, context) => {
  const { addonRtl } = context.globals;
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
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'AnnotationCreateTextHighlight',
      activeTheme: context.globals.theme,
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

  return <MockApp initialState={stateWithBookmarksPanel} initialDirection={addonRtl}/>;
};

CustomBasic.parameters = { layout: 'fullscreen', customizableUI: true };

export const CustomBasicNoBookmarks = (args, context) => {
  const { addonRtl } = context.globals;
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
      activeTheme: context.globals.theme,
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanelEmpty} initialDirection={addonRtl} />;
};

CustomBasicNoBookmarks.parameters = { layout: 'fullscreen', customizableUI: true };

export const CustomRightSide = (args, context) => {
  const { addonRtl } = context.globals;
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
      activeTheme: context.globals.theme,
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

  return <MockApp initialState={stateWithBookmarksPanelOnRight} initialDirection={addonRtl} />;
};

CustomRightSide.parameters = {
  layout: 'fullscreen',
  ...window.storybook.disableRtlMode,
};

export const CustomRightSideNoBookmarks = (args, context) => {
  const { addonRtl } = context.globals;
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
      activeToolName: 'AnnotationCreateTextHighlight',
      activeTheme: context.globals.theme,
    },
    document: {
      ...initialState.document,
      bookmarks: {}
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={stateWithBookmarksPanelOnRightEmpty} initialDirection={addonRtl} />;
};

CustomRightSideNoBookmarks.parameters = {
  layout: 'fullscreen',
  ...window.storybook.disableRtlMode,
};

export const ViewOnlyMode = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents,
  viewerRedux: {
    pageLabels: pageLabels,
  },
  documentRedux: {
    bookmarks: {
      0: 'B1',
      1: 'B2',
    }
  }
});

ViewOnlyMode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const leftPanel = canvas.getByRole('button', { name: getTranslatedText('component.leftPanel') });
  await leftPanel.click();

  const bookmarksPanelButton = await canvas.findByRole('button', { name: getTranslatedText('component.bookmarksPanel') });
  await bookmarksPanelButton.click();

  const editBookmarksLabel = `${getTranslatedText('action.edit')} ${getTranslatedText('component.bookmarksPanel')}`;
  const editBookmarksButton = await canvas.getByRole('button', { name: editBookmarksLabel });
  expect(editBookmarksButton).toBeInTheDocument();
  expect(editBookmarksButton).toBeEnabled();

  const addBookmarkLabel = `${getTranslatedText('action.add')} ${getTranslatedText('component.bookmarkPanel')}`;
  const addBookmarkButton = await canvas.getByRole('button', { name: addBookmarkLabel });
  expect(addBookmarkButton).toBeInTheDocument();

  window.instance.UI.enableViewOnlyMode();

  await leftPanel.click();
  await bookmarksPanelButton.click();

  expect(editBookmarksButton).not.toBeInTheDocument();
  expect(addBookmarkButton).toBeDisabled();
};

ViewOnlyMode.parameters = {
  layout: 'fullscreen',
  ...window.storybook.disableRtlMode
};