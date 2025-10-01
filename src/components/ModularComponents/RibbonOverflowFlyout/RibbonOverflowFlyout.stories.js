import React from 'react';
import RibbonOverflowFlyout from './RibbonOverflowFlyout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout/Flyout';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { oePartialState } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/RibbonGroup',
  component: RibbonOverflowFlyout,
};

const item1 = {
  dataElement: 'Ribbon Item1',
  img: 'icon-header-pan',
  type: 'ribbonItem',
};

const item2 = {
  dataElement: 'Ribbon Item2',
  label: 'label only',
  type: 'ribbonItem',
};

const item3 = {
  dataElement: 'Ribbon Item3',
  label: 'icon and label',
  img: 'icon-header-pan',
  type: 'ribbonItem',
};

const item4 = {
  dataElement: 'Ribbon Item4',
  label: 'label only 2',
  type: 'ribbonItem',
};

const translatedItem1 = {
  'dataElement': 'toolbarGroup-Forms',
  'title': 'Forms',
  'type': 'ribbonItem',
  'label': 'Forms',
  'groupedItems': [
    'formsGroupedItems'
  ],
  'toolbarGroup': 'toolbarGroup-Forms',
};

const translatedItem2 = {
  'dataElement': 'toolbarGroup-FillAndSign',
  'title': 'Fill and Sign',
  'type': 'ribbonItem',
  'label': 'Fill and Sign',
  'groupedItems': [
    'fillAndSignGroupedItems'
  ],
  'toolbarGroup': 'toolbarGroup-FillAndSign',
  'sortIndex': 8
};

const initialState = {
  ...oePartialState,
  viewer: {
    modularComponents: {},
    customHeadersAdditionalProperties: {},
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      RibbonOverflowFlyout: true,
    },
    customPanels: [],
    genericPanels: [],
    activeGroupedItems: [],
    canUndo: {
      1: false,
      2: false,
    },
    canRedo: {
      1: false,
      2: false,
    },
    flyoutMap: {
      'RibbonOverflowFlyout': {
        'dataElement': 'RibbonOverflowFlyout',
        className: 'RibbonOverflowFlyout',
        items: [item1, item2, item3],
      },
      'RibbonOverflowFlyoutNoIcons': {
        'dataElement': 'RibbonOverflowFlyoutNoIcons',
        className: 'RibbonOverflowFlyoutNoIcons',
        items: [item2, item4],
      },
      'RibbonOverflowFlyoutTranslated': {
        'dataElement': 'RibbonOverflowFlyoutTranslated',
        className: 'RibbonOverflowFlyoutTranslated',
        items: [translatedItem1, translatedItem2],
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'RibbonOverflowFlyout',
    activeTabInPanel: {},
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    lastActiveToolForRibbon: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-View',
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    activeCustomRibbon: 'Ribbon Item1',
  },
};

const store = configureStore({
  reducer: () => initialState,
});

export const OverflowFlyout = (props) => {
  return (
    <Provider store={store}>
      <Flyout {...props} className={'overFlowFlyout'} />
    </Provider>
  );
};
OverflowFlyout.parameters = window.storybook.disableRtlMode;

const noIconsStore = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        openElements: {
          RibbonOverflowFlyoutNoIcons: true,
        },
        activeFlyout: 'RibbonOverflowFlyoutNoIcons',
        activeTabInPanel: {},
        modularHeaders: {},
        modularHeadersHeight: {
          topHeaders: 40,
          bottomHeaders: 40
        },
        customHeadersAdditionalProperties: {},
      }
    };
  }
});

export const NoIconsOverflowFlyout = (props) => {
  return (
    <Provider store={noIconsStore}>
      <Flyout {...props} className={'overflowFlyout'} />
    </Provider>
  );
};
NoIconsOverflowFlyout.parameters = window.storybook.disableRtlMode;

const translatedStore = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        openElements: {
          RibbonOverflowFlyoutTranslated: true,
        },
        activeFlyout: 'RibbonOverflowFlyoutTranslated',
        activeTabInPanel: {},
        modularHeaders: {},
        modularHeadersHeight: {
          topHeaders: 40,
          bottomHeaders: 40
        },
        customHeadersAdditionalProperties: {},
        currentLanguage: 'bn'
      }
    };
  }
});

export const TranslatedFlyout = (props) => {
  i18next.init({
    nsSeparator: false,
  });
  i18next.changeLanguage('bn');
  return (
    <Provider store={translatedStore}>
      <I18nextProvider i18n={i18next}>
        <Flyout {...props} className={'overflowFlyout'}/>
      </I18nextProvider>
    </Provider>
  );
};
