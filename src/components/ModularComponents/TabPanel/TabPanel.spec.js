import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'actions';
import rootReducer from 'src/redux/reducers/rootReducer';
import { panelNames } from 'constants/panel';
import TabPanel from './TabPanel';

let mockHeaderWidth = 0;
let mockInitialHeaderWidth;
let mockOnResize;
let mockTabWidth;

jest.mock('react-measure', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: function MockMeasure({ children, innerRef, onResize }) {
      const hasMeasuredRef = React.useRef(false);
      React.useLayoutEffect(() => {
        if (!hasMeasuredRef.current && mockInitialHeaderWidth !== undefined) {
          hasMeasuredRef.current = true;
          mockHeaderWidth = mockInitialHeaderWidth;
          onResize({ bounds: { width: mockInitialHeaderWidth } });
        }
      }, [onResize]);

      mockOnResize = onResize;
      return children({
        measureRef: (element) => {
          innerRef.current = element;
        },
      });
    },
  };
});

jest.mock('helpers/tabPanelHelper', () => ({
  createCustomElement: ({ render }) => render(),
  getPanelToRender: () => null,
}));

jest.mock('helpers/getDeviceSize', () => ({ isMobileSize: () => false }));

const panels = ['firstPanel', 'secondPanel', 'thirdPanel'].map((dataElement, index) => ({
  dataElement,
  label: `Panel ${index + 1}`,
  render: () => <div>{`Panel ${index + 1} content`}</div>,
  title: `Panel ${index + 1}`,
}));

const updatedPanels = [panels[0], {
  dataElement: 'fourthPanel',
  label: 'Panel 4',
  render: () => <div>Panel 4 content</div>,
  title: 'Panel 4',
}];

const panelIcons = [
  'icon-panel-thumbnail-line',
  'icon-panel-outlines',
  'ic-bookmark',
  'ic-layer',
  'icon-tool-signature',
  'ic_fileattachment_24px',
];

const iconPanels = panelIcons.map((icon, index) => ({
  dataElement: `iconPanel${index + 1}`,
  icon,
  render: () => <div>{`Icon Panel ${index + 1} content`}</div>,
  title: `Icon Panel ${index + 1}`,
}));

const createTabPanelDefinition = (enabledPanels) => ({
  dataElement: 'testTabPanel',
  panelsList: enabledPanels,
  render: 'testTabPanel',
});

const createTestStore = ({ enabledPanels = panels, activeTab = 'firstPanel', additionalPanels = [] } = {}) => {
  const reducer = rootReducer();
  const initialState = reducer(undefined, { type: '@@INIT' });
  const preloadedState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeTabInPanel: {
        ...initialState.viewer.activeTabInPanel,
        testTabPanel: activeTab,
      },
      disabledElements: {},
      flyoutMap: {},
      genericPanels: [createTabPanelDefinition(enabledPanels), ...additionalPanels],
    },
  };

  return configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  });
};

const notifyHeaderResize = (width) => {
  mockHeaderWidth = width;
  act(() => {
    mockOnResize({ bounds: { width } });
  });
};

const getPanelTabs = ({ hidden = false, iconOnly = false } = {}) => screen.queryAllByRole('button', {
  name: iconOnly ? /^Icon Panel \d+$/ : /^Panel \d+$/,
  hidden,
});

const getOverflowFlyoutItems = (store) => store.getState().viewer.flyoutMap['testTabPanel-flyout']?.items ?? [];

describe('TabPanel overflow layout', () => {
  let originalGetBoundingClientRect;

  beforeAll(() => {
    originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function() {
      let width = 0;
      if (this.classList.contains('TabPanelHeader')) {
        width = mockHeaderWidth;
      } else if (this.classList.contains('tabPanelButton')) {
        width = mockTabWidth;
      } else if (this.classList.contains('moreButton')) {
        width = this.classList.contains('hidden') ? 0 : 48;
      }

      return { bottom: 0, height: 0, left: 0, right: width, top: 0, width, x: 0, y: 0 };
    };
  });

  afterAll(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  beforeEach(() => {
    mockHeaderWidth = 0;
    mockInitialHeaderWidth = undefined;
    mockOnResize = undefined;
    mockTabWidth = 100;
  });

  const renderTabPanel = (storeOptions) => {
    const store = createTestStore(storeOptions);
    const result = render(
      <Provider store={store}>
        <TabPanel dataElement="testTabPanel" />
      </Provider>
    );
    return { ...result, store };
  };

  it('moves tabs into overflow on the first shrinking resize', async () => {
    renderTabPanel();
    await waitFor(() => expect(getPanelTabs({ hidden: true })).toHaveLength(3));

    notifyHeaderResize(400);
    notifyHeaderResize(100);

    await waitFor(() => expect(getPanelTabs()).toHaveLength(1));
  });

  it('calculates overflow after tabs mount when the header was measured first', async () => {
    mockInitialHeaderWidth = 250;

    renderTabPanel();

    await waitFor(() => expect(getPanelTabs()).toHaveLength(2));
  });

  it('keeps the header hidden until its initial layout is measured', async () => {
    renderTabPanel();
    await waitFor(() => expect(getPanelTabs({ hidden: true })).toHaveLength(3));

    expect(getPanelTabs()).toHaveLength(0);
    expect(getPanelTabs({ hidden: true })).toHaveLength(3);

    notifyHeaderResize(250);

    await waitFor(() => expect(getPanelTabs()).toHaveLength(2));
  });

  it('keeps enough tabs in overflow for the tab row and overflow button to fit', async () => {
    mockInitialHeaderWidth = 284;
    mockTabWidth = 52;

    renderTabPanel({ enabledPanels: iconPanels, activeTab: 'iconPanel1' });

    await waitFor(() => expect(getPanelTabs({ iconOnly: true })).toHaveLength(4));

    notifyHeaderResize(300);
    await waitFor(() => expect(getPanelTabs({ iconOnly: true })).toHaveLength(4));

    notifyHeaderResize(310);
    await waitFor(() => expect(getPanelTabs({ iconOnly: true })).toHaveLength(5));
  });

  it.each([
    { description: 'renders a preset panel with an icon only', options: {}, shouldShowIcon: true, expectedLabel: null },
    { description: 'renders a preset panel with a label only', options: { useIcon: false, label: 'Thumbnails' }, shouldShowIcon: false, expectedLabel: 'Thumbnails' },
    { description: 'renders a preset panel with an icon and label', options: { label: 'Thumbnails' }, shouldShowIcon: true, expectedLabel: 'Thumbnails' },
  ])('$description', async ({ options, shouldShowIcon, expectedLabel }) => {
    const presetPanel = {
      dataElement: panelNames.THUMBNAIL,
      render: panelNames.THUMBNAIL,
    };
    renderTabPanel({
      enabledPanels: [{ render: panelNames.THUMBNAIL, ...options }],
      activeTab: panelNames.THUMBNAIL,
      additionalPanels: [presetPanel],
    });

    const tabButton = await screen.findByRole('button', { name: 'Thumbnails', hidden: true });
    expect(!!tabButton.querySelector('.Icon')).toBe(shouldShowIcon);
    if (expectedLabel) {
      expect(within(tabButton).getByText(expectedLabel)).toBeInTheDocument();
    } else {
      expect(within(tabButton).queryByText('Thumbnails')).not.toBeInTheDocument();
    }
  });

  it.each([
    { description: 'renders a custom panel with an icon only', options: {}, shouldShowIcon: true, expectedLabel: null },
    { description: 'renders a custom panel with a label only', options: { useIcon: false, label: 'Custom' }, shouldShowIcon: false, expectedLabel: 'Custom' },
    { description: 'renders a custom panel with an icon and label', options: { label: 'Custom' }, shouldShowIcon: true, expectedLabel: 'Custom' },
  ])('$description', async ({ options, shouldShowIcon, expectedLabel }) => {
    const customPanel = {
      dataElement: 'customPanel',
      icon: 'ic-bookmark',
      render: () => <div>Custom panel content</div>,
      title: 'Custom panel',
      ...options,
    };
    renderTabPanel({ enabledPanels: [customPanel], activeTab: customPanel.dataElement });

    const tabButton = await screen.findByRole('button', { name: 'Custom panel', hidden: true });
    expect(!!tabButton.querySelector('.Icon')).toBe(shouldShowIcon);
    if (expectedLabel) {
      expect(within(tabButton).getByText(expectedLabel)).toBeInTheDocument();
    } else {
      expect(within(tabButton).queryByText('Custom panel')).not.toBeInTheDocument();
    }
  });

  it('applies icon and label options to a registered custom panel tab', async () => {
    const registeredPanel = {
      dataElement: 'registeredPanel',
      icon: 'ic-bookmark',
      render: () => <div>Registered panel content</div>,
      title: 'Registered panel',
    };
    renderTabPanel({
      enabledPanels: [{ render: registeredPanel.dataElement, useIcon: false, label: 'Registered' }],
      activeTab: registeredPanel.dataElement,
      additionalPanels: [registeredPanel],
    });

    const tabButton = await screen.findByRole('button', { name: 'Registered panel', hidden: true });
    expect(tabButton.querySelector('.Icon')).not.toBeInTheDocument();
    expect(within(tabButton).getByText('Registered')).toBeInTheDocument();
  });

  it('updates the visible tabs when the enabled panel set changes', async () => {
    mockInitialHeaderWidth = 400;
    const { store } = renderTabPanel();
    await waitFor(() => expect(getPanelTabs()).toHaveLength(3));

    act(() => {
      store.dispatch(actions.setGenericPanels([createTabPanelDefinition(updatedPanels)]));
      store.dispatch(actions.disableElements(['tabPanelTestRefresh']));
    });

    await waitFor(() => expect(getPanelTabs()).toHaveLength(2));
    expect(screen.getByRole('button', { name: 'Panel 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Panel 4' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Panel 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Panel 3' })).not.toBeInTheDocument();
  });

  it('does not duplicate flyout items when the panel set refreshes', async () => {
    mockInitialHeaderWidth = 100;
    const { store } = renderTabPanel();

    await waitFor(() => expect(getOverflowFlyoutItems(store).map(({ dataElement }) => dataElement)).toEqual([
      'secondPanel',
      'thirdPanel',
    ]));

    act(() => {
      store.dispatch(actions.disableElements(['tabPanelTestRefresh']));
      store.dispatch(actions.enableElements(['tabPanelTestRefresh']));
    });

    await waitFor(() => expect(getOverflowFlyoutItems(store).map(({ dataElement }) => dataElement)).toEqual([
      'secondPanel',
      'thirdPanel',
    ]));
  });

  it('returns tabs from overflow on the first growing resize', async () => {
    renderTabPanel();
    await waitFor(() => expect(getPanelTabs({ hidden: true })).toHaveLength(3));

    notifyHeaderResize(400);
    notifyHeaderResize(100);
    await waitFor(() => expect(getPanelTabs()).toHaveLength(1));

    notifyHeaderResize(400);

    await waitFor(() => expect(getPanelTabs()).toHaveLength(3));
  });
});
