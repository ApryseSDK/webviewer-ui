import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import { PRESET_BUTTON_TYPES, ITEM_TYPE } from 'constants/customizationVariables';

import { createTemplate, oePartialState } from 'helpers/storybookHelper';
import { userEvent, within, expect, fireEvent, waitFor } from 'storybook/test';
import { uiWithFlyout, panelsInFlyoutMap } from '../storyModularUIConfigs';
import createItemsForBookmarkOutlineFlyout from 'src/helpers/createItemsForBookmarkOutlineFlyout';
import { menuItems as MenuItemsForBookmarkOutlines, menuTypes } from 'helpers/outlineFlyoutHelper';
import { setClickMiddleWare } from 'helpers/clickTracker';
import { mockHeadersNormalized, mockModularComponents } from '../AppStories/mockAppState';

export default {
  title: 'ModularComponents/Flyout',
  component: Flyout,
};

const initialState = {
  ...oePartialState,
  viewer: {
    toolButtonObjects: {
      AnnotationEdit: {
        'dataElement': 'selectToolButton',
        'title': 'tool.select',
        'img': 'multi select',
        'showColor': 'never'
      },
      Pan: {
        'dataElement': 'panToolButton',
        'title': 'tool.pan',
        'img': 'icon-header-pan',
        'showColor': 'never'
      },
    },
    colorMap: {},
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      flyoutMenu: true,
      noIcons: true,
      [DataElements.MAIN_MENU]: true,
      menuWithComponentItems: true,
      bookmarkOutlineFlyout: true,
    },
    customPanels: [],
    genericPanels: [],
    focusedElementsStack: [],
    canUndo: {
      1: false,
      2: false,
    },
    canRedo: {
      1: false,
      2: false,
    },
    flyoutMap: {
      'flyoutMenu': {
        'dataElement': 'flyoutMenu',
        'items': [
          {
            label: 'Item 1',
            onClick: () => {
              console.log('Item 1 clicked');
            },
            icon: 'icon-tool-highlight',
            children: [
              {
                label: 'Item 1.1',
                onClick: () => {
                  console.log('Item 1.1 clicked');
                },
                icon: 'icon-arrow-right',
                children: [
                  {
                    label: 'Item 1.1.1',
                    onClick: () => {
                      console.log('Item 1.1.1 clicked');
                    },
                    icon: 'icon-arrow-right',
                    children: [
                      {
                        label: 'Item 1.1.1.1',
                        onClick: () => {
                          console.log('Item 1.1.1.1 clicked');
                        },
                        icon: 'icon-arrow-right',
                        children: [
                          {
                            label: 'Item 1.1.1.1.1',
                            onClick: () => {
                              console.log('Item 1.1.1.1.1 clicked');
                            },
                            icon: 'icon-arrow-right',
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'Item 1.1.2',
                    onClick: () => {
                      console.log('Item 1.1.2 clicked');
                    },
                    icon: 'icon-arrow-left',
                    children: [
                      {
                        label: 'Item 1.1.2.1',
                        onClick: () => {
                          console.log('Item 1.1.2.1 clicked');
                        },
                        icon: 'icon-arrow-right',
                        children: [
                          {
                            label: 'Item 1.1.2.1.1',
                            onClick: () => {
                              console.log('Item 1.1.2.1.1 clicked');
                            },
                            icon: 'icon-arrow-right',
                          }
                        ]
                      }
                    ]
                  },
                  'divider',
                  {
                    label: 'Item 1.1.3',
                    onClick: () => {
                      console.log('Item 1.1.3 clicked');
                    },
                    icon: 'icon-arrow-up',
                  },
                ]
              },
              {
                label: 'Item 1.2',
                onClick: () => {
                  console.log('Item 1.2 clicked');
                },
                icon: 'icon-arrow-left',
              },
              'divider',
            ],
          },
          'divider',
          {
            label: 'Item 2',
            onClick: () => {
              console.log('Item 2 clicked');
            },
            icon: 'icon-save',
            children: [
              {
                label: 'Item 2.1',
                onClick: () => {
                  console.log('Item 2.1 clicked');
                },
                icon: 'icon-arrow-right',
              },
              {
                label: 'Item 2.2',
                onClick: () => {
                  console.log('Item 2.2 clicked');
                },
                icon: 'icon-arrow-left',
              },
              'divider',
              {
                label: 'Item 2.3',
                onClick: () => {
                  console.log('Item 2.3 clicked');
                },
                icon: 'icon-arrow-up',
              },
            ],
          },
          {
            label: 'Item 3',
            onClick: () => {
              console.log('Item 3 clicked');
            },
            icon: 'icon-save',
          },
          {
            label: 'Item 4',
            onClick: () => {
              console.log('Item 4 clicked');
            },
            icon: 'icon-download',
            children: [
              {
                label: 'Item 4.1',
                onClick: () => {
                  console.log('Item 4.1 clicked');
                },
                icon: 'icon-arrow-right',
              },
              {
                label: 'Item 4.2',
                onClick: () => {
                  console.log('Item 4.2 clicked');
                },
                icon: 'icon-arrow-left',
              },
              'divider',
              {
                label: 'Item 4.3',
                onClick: () => {
                  console.log('Item 4.3 clicked');
                },
                icon: 'icon-arrow-up',
              },
            ],
          },
          {
            label: 'Item 5',
            onClick: () => {
              console.log('Item 5 clicked');
            },
            icon: 'icon-save',
          },
          {
            label: 'Item 6',
            onClick: () => {
              console.log('Item 6 clicked');
            },
            icon: 'icon-download',
            children: [
              {
                label: 'Item 6.1',
                onClick: () => {
                  console.log('Item 6.1 clicked');
                },
                icon: 'icon-arrow-right',
              },
              {
                label: 'Item 6.2',
                onClick: () => {
                  console.log('Item 6.2 clicked');
                },
                icon: 'icon-arrow-left',
              },
              'divider',
              {
                label: 'Item 6.3',
                onClick: () => {
                  console.log('Item 6.3 clicked');
                },
                icon: 'icon-arrow-up',
              },
            ],
          },
          {
            label: 'Item 7',
            onClick: () => {
              console.log('Item 7 clicked');
            },
            icon: 'icon-save',
          },
          {
            label: 'Item 8',
            onClick: () => {
              console.log('Item 8 clicked');
            },
            icon: 'icon-download',
            children: [
              {
                label: 'Item 8.1',
                onClick: () => {
                  console.log('Item 8.1 clicked');
                },
                icon: 'icon-arrow-right',
              },
              {
                label: 'Item 8.2',
                onClick: () => {
                  console.log('Item 8.2 clicked');
                },
                icon: 'icon-arrow-left',
              },
              'divider',
              {
                label: 'Item 8.3',
                onClick: () => {
                  console.log('Item 8.3 clicked');
                },
                icon: 'icon-arrow-up',
              },
            ],
          },
          {
            label: 'Disabled Item',
            onClick: () => {
              console.warn('Item 9 should not click');
            },
            icon: 'icon-close',
            disabled: true,
          }
        ],
      },
      'noIcons': {
        'dataElement': 'noIcons',
        'items': [
          {
            'label': 'Item 1',
            'children': [
              {
                'label': 'Item 1.1',
                'icon': 'icon-arrow-right'
              },
              {
                'label': 'Item 1.2',
                'icon': 'icon-arrow-left'
              },
              'divider'
            ]
          },
          'divider',
          {
            'label': 'Item 2',
          },
          {
            'label': 'Item 3',
          },
          {
            'label': 'Item 4',
          },
          {
            'label': 'Item 5',
          },
          {
            'label': 'Item 6',
            'disabled': 'true',
          }
        ],
      },
      [DataElements.MAIN_MENU]: {
        dataElement: DataElements.MAIN_MENU,
        items: [
          {
            ...menuItems[PRESET_BUTTON_TYPES.NEW_DOCUMENT],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FILE_PICKER],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.DOWNLOAD],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FULLSCREEN],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.SAVE_AS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.PRINT],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          'divider',
          {
            ...menuItems[PRESET_BUTTON_TYPES.CREATE_PORTFOLIO],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          'divider',
          {
            ...menuItems[PRESET_BUTTON_TYPES.SETTINGS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          'divider',
        ],
      },
      'menuWithComponentItems': {
        dataElement: 'menuWithComponentItems',
        items: [
          { dataElement: 'panToolButton', toolName: 'Pan', className: 'FlyoutToolButton' },
          { dataElement: 'annotationEditToolButton', toolName: 'AnnotationEdit', className: 'FlyoutToolButton' },
        ],
      },
      'bookmarkOutlineFlyout': {
        dataElement: 'bookmarkOutlineFlyout',
        items: createItemsForBookmarkOutlineFlyout(MenuItemsForBookmarkOutlines, 'portfolio', false, () => { }, menuTypes),
      },
    },
    modularComponents: {
      panToolButton: {
        dataElement: 'panToolButton',
        type: 'toolButton',
        toolName: 'Pan',
        img: 'icon-save',
      },
      annotationEditToolButton: {
        dataElement: 'annotationEditToolButton',
        type: 'toolButton',
        toolName: 'AnnotationEdit',
        img: 'icon-save',
      },
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'flyoutMenu',
    activeTabInPanel: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    customHeadersAdditionalProperties: {},
  },
  featureFlags: {
    customizableUI: true,
  }
};

const store = configureStore({
  reducer: () => initialState
});

export const FlyoutComponent = () => (
  <Provider store={store}>
    <Flyout />
  </Provider>
);

const store2 = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: { ...initialState.viewer, activeFlyout: 'noIcons' }
    };
  }
});

export const FlyoutWithoutIcons = () => (
  <Provider store={store2}>
    <Flyout />
  </Provider>
);

const store3 = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: { ...initialState.viewer, activeFlyout: DataElements.MAIN_MENU }
    };
  }
});

export const MainMenuFlyout = () => (
  <Provider store={store3}>
    <Flyout />
  </Provider>
);

const store4 = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: { ...initialState.viewer, activeFlyout: 'menuWithComponentItems' }
    };
  }
});

// Should show save icons instead in the flyout since the modular component has been 'updated' with that icon
export const FlyoutWithComponentItems = () => (
  <Provider store={store4}>
    <Flyout />
  </Provider>
);

export const FlyoutOpeningTest = createTemplate({ headers: uiWithFlyout.modularHeaders, components: uiWithFlyout.modularComponents, flyoutMap: uiWithFlyout.flyouts });

FlyoutOpeningTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Click the toggle button to open the flyout
  const flyoutToggle = await canvas.findByRole('button', { 'name': 'Flyout Toggle' });
  await userEvent.click(flyoutToggle);
  // Check if the flyout is open
  const flyoutItem = await canvas.findByText('Custom Flyout Item');
  expect(flyoutItem).toBeInTheDocument();
  // Click the flyout item to open the submenu
  await userEvent.click(flyoutItem);
  // Check if the submenu item is open
  const submenuItem = await canvas.findByText('Submenu Item');
  expect(submenuItem).toBeInTheDocument();
  // Click the submenu item to open the second submenu
  await userEvent.click(submenuItem);
  // Check if the second submenu item is open
  const submenuItem2 = await canvas.findByText('Submenu Item 2');
  expect(submenuItem2).toBeInTheDocument();
  // Click submenu back button to close it
  const backBtn = await canvas.findByText('Back');
  await userEvent.click(backBtn);
  // Check if the submenu is gone
  expect(submenuItem2).not.toBeInTheDocument();

  // Check disabled buttons
  const disabledButton = await canvas.findByText('Disabled Flyout Item');
  expect(disabledButton).toBeInTheDocument();
  // Try to click the disabled button
  await userEvent.click(disabledButton);
  // Check if the disabled submenu item is not present
  const disabledSubmenuItem = await canvas.queryByText('Disabled Submenu Item');
  expect(disabledSubmenuItem).not.toBeInTheDocument();
};

export const FlyoutClosingTest = createTemplate(
  {
    headers: uiWithFlyout.modularHeaders,
    components: uiWithFlyout.modularComponents,
    flyoutMap: uiWithFlyout.flyouts,
  }
);

FlyoutClosingTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const flyoutToggle = await canvas.findByRole(
    'button',
    { 'name': 'Flyout Toggle' },
  );

  await userEvent.click(flyoutToggle);

  const flyoutItem = await canvas.findByText('Custom Flyout Item');
  expect(flyoutItem).toBeInTheDocument();

  const headerToolBar = await canvas.findByRole('toolbar');
  await userEvent.click(headerToolBar);

  expect(flyoutItem).not.toBeInTheDocument();
};

FlyoutComponent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const option1 = await canvas.findByRole('button', { name: /Item 1/i });
  await fireEvent.focus(option1);
  // Pressing first element on the Flyout to open its children
  await fireEvent.keyDown(option1, { key: 'Enter', code: 'Enter' });
  const backButton = await canvas.findByRole('button', { name: /Back/i });
  const option11 = await canvas.findByRole('button', { name: /Item 1.1/i });
  expect(backButton).toBeInTheDocument();
  expect(option11).toBeInTheDocument();
  // After opening the first child, pressing arrow down to focus the first element with children
  await fireEvent.keyDown(backButton, { key: 'ArrowDown', code: 'ArrowDown' });
  expect(option11).toHaveFocus();
  await fireEvent.keyDown(option11, { key: 'Enter', code: 'Enter' });
  const option111 = await canvas.findByRole('button', { name: /Item 1.1.1/i });
  expect(option111).toBeInTheDocument();
  expect(backButton).toBeInTheDocument();
  // Returning to the beginning of the flyout tree
  await fireEvent.keyDown(backButton, { key: 'Enter', code: 'Enter' });
  await fireEvent.keyDown(backButton, { key: 'Enter', code: 'Enter' });
  // Checking if the first element of the Flyout is in the page
  expect(backButton).not.toBeInTheDocument();
  const option1SecondRef = await canvas.findByRole('button', { name: /Item 1/i });
  expect(option1SecondRef).toBeInTheDocument();
};

let statefulButtonMount = false;
const storeWithStatefulButton = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        activeFlyout: 'flyoutMenu',
        flyoutMap: {
          ...initialState.viewer.flyoutMap,
          flyoutMenu: {
            dataElement: 'flyoutMenu',
            items: [
              {
                type: 'statefulButton',
                dataElement: 'testStatefulButton',
                initialState: 'SinglePage',
                states: {
                  SinglePage: {
                    img: 'icon-header-page-manipulation-page-layout-single-page-line',
                    onClick: (update) => {
                      console.log('SinglePage');
                      update('DoublePage');
                    },
                    title: 'sIngLe pAgE',
                  },
                  DoublePage: {
                    img: 'icon-header-page-manipulation-page-layout-double-page-line',
                    onClick: (update) => {
                      console.log('DoublePage');
                      update('SinglePage');
                    },
                    title: 'Double Page',
                  },
                },
                mount: () => {
                  console.log('Stateful button mounted');
                  statefulButtonMount = true;
                },
                unmount: () => {
                  console.log('Stateful button unmounted');
                },
                title: 'tEsT pAgE',
              },
            ]
          },
        }
      }
    };
  }
});

export const StatefulButtonInFlyout = () => (
  <Provider store={storeWithStatefulButton}>
    <Flyout />
  </Provider>
);
StatefulButtonInFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Ensure flyout calls onMount
  expect(statefulButtonMount).toBe(true);
  // Click and expect state to change (image)
  canvas.getByRole('button', { name: /single page/i }).click();
  let imgTitle = canvasElement.querySelector('svg > title');
  await expect(imgTitle).toContainHTML('icon - header - page manipulation - page layout - double page - line');
  canvas.getByRole('button', { name: /double page/i }).click();
  imgTitle = canvasElement.querySelector('svg > title');
  await expect(imgTitle).toContainHTML('icon - header - page manipulation - page layout - single page - line');
};

const portfolioFlyoutStore = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: { ...initialState.viewer, activeFlyout: 'bookmarkOutlineFlyout' }
    };
  }
});

export const PortfolioFlyout = () => {
  return (
    <Provider store={portfolioFlyoutStore}>
      <Flyout />
    </Provider>
  );
};

const mockInitialState = {
  middleware: false,
  onClick: false,
};
let mockFunctions = mockInitialState;

const overrideStore = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeFlyout: DataElements.MAIN_MENU,
      customElementOverrides: {
        'filePickerButton': {
          onClick: () => mockFunctions.onClick = true,
          img: 'icon-save',
          label: 'New Label',
          title: 'New tooltip',
        },
      },
    },
  }),
});

export const FlyoutOverride = () => {
  mockFunctions = mockInitialState;

  useEffect(() => {
    setClickMiddleWare(() => {
      mockFunctions.middleware = true;
    });
    return () => setClickMiddleWare(undefined);
  }, []);

  return (
    <Provider store={overrideStore}>
      <Flyout />
    </Provider>
  );
};

FlyoutOverride.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await canvas.getByRole('button', { name: /New Label/i }).click();
  await expect(mockFunctions.onClick).toBe(true);
  await expect(mockFunctions.middleware).toBe(true);
};

export const StylePanelInFlyout = createTemplate({ headers: uiWithFlyout.modularHeaders, components: uiWithFlyout.modularComponents, panels: {}, flyoutMap: panelsInFlyoutMap });

StylePanelInFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const flyoutToggleButton = canvas.getByRole('button', { name: /Flyout Toggle/ });
  await userEvent.click(flyoutToggleButton);

  await waitFor(() => {
    const stylePanel = document.querySelector('[data-element="stylePanelInFlyout"]');
    expect(stylePanel).toBeInTheDocument();
  });

  const anotherFlyoutButton = canvas.getByRole('button', { name: /Other Item/i });
  await waitFor(() => {
    expect(anotherFlyoutButton).toBeInTheDocument();
  });
  await userEvent.click(anotherFlyoutButton);

  await waitFor(() => {
    const submenuStylePanel = document.querySelector('[data-element="submenuStylePanel"]');
    expect(submenuStylePanel).toBeInTheDocument();
  });
};

export const RubberStampPanelInFlyout = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents, panels: {}, flyoutMap: panelsInFlyoutMap });
RubberStampPanelInFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const insertRibbon = canvas.getByRole('button', { name: /Insert/i });
  await userEvent.click(insertRibbon);
  const rubberStampButton = canvas.getByRole('button', { name: /Rubber Stamp/i });
  await userEvent.click(rubberStampButton);

  await waitFor(() => {
    const rubberStampPanel = document.querySelector('[data-element="rubber-stamp-flyout"]');
    expect(rubberStampPanel).toBeInTheDocument();
  });
};

export const SignatureListPanelInFlyout = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents, panels: {}, flyoutMap: panelsInFlyoutMap });
SignatureListPanelInFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const insertRibbon = canvas.getByRole('button', { name: /Insert/i });
  await userEvent.click(insertRibbon);
  const signatureListButton = canvas.getByRole('button', { name: /Signature/i });
  await userEvent.click(signatureListButton);

  await waitFor(() => {
    const signatureListPanel = document.querySelector('[data-element="signature-list-flyout"]');
    expect(signatureListPanel).toBeInTheDocument();
  });
};

const getDirectionalArgs = (location, alignment) => ({
  headers: {
    topHeader: {
      dataElement: 'topHeader',
      placement: location,
      justifyContent: alignment,
      items: ['toggleFlyoutButton']
    },
  },
  components: {
    toggleFlyoutButton: {
      dataElement: 'toggleFlyoutButton',
      title: 'Toggle Flyout',
      type: 'toggleButton',
      img: 'icon-header-search',
      toggleElement: 'flyoutMenu',
    }
  },
  flyoutMap: {
    flyoutMenu: {
      dataElement: 'flyoutMenu',
      items: [
        {
          label: 'Flyout Item 1',
          onClick: () => console.log('Flyout Item 1 clicked'),
          icon: 'icon-tool-highlight',
          children: [
            {
              label: 'Submenu Item',
              onClick: () => console.log('Submenu Item clicked'),
              icon: 'icon-arrow-right',
            },
            {
              label: 'Disabled Flyout Item',
              onClick: () => console.warn('Disabled Flyout Item clicked'),
              disabled: true,
            },
          ],
        },
        {
          label: 'Flyout Item 2',
          onClick: () => console.log('Flyout Item 2 clicked'),
          icon: 'icon-save',
        },
        {
          label: 'Flyout Item 3',
          onClick: () => console.log('Flyout Item 3 clicked'),
          icon: 'icon-download',
        },
        {
          label: 'Flyout Item 4',
          onClick: () => console.log('Flyout Item 4 clicked'),
          icon: 'icon-close',
        },
        {
          label: 'Flyout Item 5',
          onClick: () => console.log('Flyout Item 5 clicked'),
          icon: 'icon-save',
        },
        {
          label: 'Flyout Item 6',
          onClick: () => console.log('Flyout Item 6 clicked'),
          icon: 'icon-download',
        },
        {
          label: 'Flyout Item 7',
          onClick: () => console.log('Flyout Item 7 clicked'),
          icon: 'icon-close',
        },
      ],
    },
  },
  viewerRedux: {
    activeFlyout: 'flyoutMenu',
    openElements: { 'flyoutMenu': true },
    flyoutToggleElement: 'toggleFlyoutButton',
  }
});

export const FlyoutTopLeft = createTemplate(getDirectionalArgs('top', 'left'));
export const FlyoutTopCenter = createTemplate(getDirectionalArgs('top', 'center'));
export const FlyoutTopRight = createTemplate(getDirectionalArgs('top', 'right'));

export const FlyoutLeftCenter = createTemplate(getDirectionalArgs('left', 'center'));
export const FlyoutLeftEnd = createTemplate(getDirectionalArgs('left', 'end'));

export const FlyoutRightCenter = createTemplate(getDirectionalArgs('right', 'center'));
export const FlyoutRightEnd = createTemplate(getDirectionalArgs('right', 'end'));

export const FlyoutBottomLeft = createTemplate(getDirectionalArgs('bottom', 'left'));
export const FlyoutBottomCenter = createTemplate(getDirectionalArgs('bottom', 'center'));
export const FlyoutBottomRight = createTemplate(getDirectionalArgs('bottom', 'right'));

export const FlyoutOverflow = createTemplate({
  ...getDirectionalArgs('top', 'left'),
  height: '200px',
});
