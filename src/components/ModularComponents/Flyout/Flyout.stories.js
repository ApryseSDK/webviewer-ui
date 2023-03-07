import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';

export default {
  title: 'ModularComponents/Flyout',
  component: Flyout,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    customFlxPanels: [],
    flyoutMap: {
      'flyoutMenu': {
        'dataElement': 'flyoutMenu',
        'items': [
          {
            'label': 'Item 1',
            'icon': 'icon-tool-highlight',
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
            'icon': 'icon-save',
            'children': [
              {
                'label': 'Item 2.1',
                'icon': 'icon-arrow-right'
              },
              {
                'label': 'Item 2.2',
                'icon': 'icon-arrow-left'
              },
              'divider',
              {
                'label': 'Item 2.3',
                'icon': 'icon-arrow-up'
              }
            ]
          },
          {
            'label': 'Item 3',
            'icon': 'icon-save'
          },
          {
            'label': 'Item 4',
            'icon': 'icon-download',
            'children': [
              {
                'label': 'Item 4.1',
                'icon': 'icon-arrow-right'
              },
              {
                'label': 'Item 4.2',
                'icon': 'icon-arrow-left'
              },
              'divider',
              {
                'label': 'Item 4.3',
                'icon': 'icon-arrow-up'
              }
            ]
          },
          {
            'label': 'Item 5',
            'icon': 'icon-save'
          },
          {
            'label': 'Item 6',
            'icon': 'icon-download',
            'children': [
              {
                'label': 'Item 6.1',
                'icon': 'icon-arrow-right'
              },
              {
                'label': 'Item 6.2',
                'icon': 'icon-arrow-left'
              },
              'divider',
              {
                'label': 'Item 6.3',
                'icon': 'icon-arrow-up'
              }
            ]
          },
          {
            'label': 'Item 7',
            'icon': 'icon-save'
          },
          {
            'label': 'Item 8',
            'icon': 'icon-download',
            'children': [
              {
                'label': 'Item 8.1',
                'icon': 'icon-arrow-right'
              },
              {
                'label': 'Item 8.2',
                'icon': 'icon-arrow-left'
              },
              'divider',
              {
                'label': 'Item 8.3',
                'icon': 'icon-arrow-up'
              }
            ]
          }
        ],
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'flyoutMenu',
  },
};
const store = configureStore({
  reducer: () => initialState
});

export const FlyoutComponent = () => (
  <Provider store={store}>
    <Flyout/>
  </Provider>
);
