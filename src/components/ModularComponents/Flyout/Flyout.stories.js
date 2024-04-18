import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import { PRESET_BUTTON_TYPES, ITEM_TYPE } from 'constants/customizationVariables';

export default {
  title: 'ModularComponents/Flyout',
  component: Flyout,
};

const initialState = {
  viewer: {
    lastPickedToolForGroupedItems: {
      undefined: '',
    },
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
    openElements: {},
    customPanels: [],
    genericPanels: [],
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
      }
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
    activeCustomPanel: '',
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    customHeadersAdditionalProperties: {},
  },
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
    <Flyout/>
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