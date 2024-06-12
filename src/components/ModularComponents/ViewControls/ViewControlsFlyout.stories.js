import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ViewControlsFlyout from './ViewControlsFlyout';
import Flyout from '../Flyout';

export default {
  title: 'ModularComponents/ViewControlsFlyout',
  component: ViewControlsFlyout,
  parameters: {
    customizableUI: true,
  },
};

const continuousPageTransitionButton = {
  icon: 'icon-header-page-manipulation-page-transition-continuous-page-line',
  label: 'option.pageTransition.continuous',
  title: 'option.pageTransition.continuous',
  dataElement: 'continuousPageTransitionButton',
  isActive: false
};
const defaultPageTransitionButton = {
  icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
  label: 'option.pageTransition.default',
  title: 'option.pageTransition.default',
  dataElement: 'defaultPageTransitionButton',
  isActive: true
};
const readerPageTransitionButton = {
  icon: 'icon-header-page-manipulation-page-transition-reader',
  label: 'option.pageTransition.reader',
  title: 'option.pageTransition.reader',
  dataElement: 'readerPageTransitionButton',
  isActive: false
};
const rotateClockwiseButton = {
  icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
  label: 'action.rotateClockwise',
  title: 'action.rotateClockwise',
  dataElement: 'rotateClockwiseButton'
};
const rotateCounterClockwiseButton = {
  icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
  label: 'action.rotateCounterClockwise',
  title: 'action.rotateCounterClockwise',
  dataElement: 'rotateCounterClockwiseButton'
};
const singleLayoutButton = {
  icon: 'icon-header-page-manipulation-page-layout-single-page-line',
  label: 'option.layout.single',
  title: 'option.layout.single',
  dataElement: 'singleLayoutButton',
  isActive: true
};
const doubleLayoutButton = {
  icon: 'icon-header-page-manipulation-page-layout-double-page-line',
  label: 'option.layout.double',
  title: 'option.layout.double',
  dataElement: 'doubleLayoutButton',
  isActive: false
};
const coverLayoutButton = {
  icon: 'icon-header-page-manipulation-page-layout-cover-line',
  label: 'option.layout.cover',
  title: 'option.layout.cover',
  dataElement: 'coverLayoutButton',
  isActive: false
};
const toggleCompareModeButton = {
  icon: 'icon-header-compare',
  label: 'action.comparePages',
  title: 'action.comparePages',
  dataElement: 'toggleCompareModeButton',
  isActive: false
};

const divider = 'divider';

const initialState = {
  viewer: {
    modularComponents: {},
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      viewControlsFlyout: true
    },
    customPanels: [],
    genericPanels: [],
    activeFlyout: 'viewControlsFlyout',
    activeCustomPanel: '',
    flyoutPosition: { x: 0, y: 0 },
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    modularHeaders: {},
    flyoutMap: {
      'viewControlsFlyout': {
        dataElement: 'viewControlsFlyout',
        items: [
          'option.displayMode.pageTransition',
          continuousPageTransitionButton,
          defaultPageTransitionButton,
          readerPageTransitionButton,
          divider,
          'action.rotate',
          rotateClockwiseButton,
          rotateCounterClockwiseButton,
          divider,
          'option.displayMode.layout',
          singleLayoutButton,
          doubleLayoutButton,
          coverLayoutButton,
          toggleCompareModeButton
        ]
      }
    }
  },
  document: {
    totalPages: {
      1: 1,
    }
  }
};

const store = configureStore({
  reducer: () => initialState,
});

export const Default = () => {
  return (
    <Provider store={store}>
      <div>
        <Flyout />
      </div>
    </Provider>
  );
};
