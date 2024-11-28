import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ViewControlsFlyout from './ViewControlsFlyout';
import Flyout from '../Flyout';

import { createTemplate } from 'helpers/storybookHelper';
import { userEvent, within, expect } from '@storybook/test';
import { uiWithFlyout } from '../storyModularUIConfigs';

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
    activeTabInPanel: {},
    flyoutPosition: { x: 0, y: 0 },
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    modularHeaders: {},
    canUndo: {
      1: false,
      2: false,
    },
    canRedo: {
      1: false,
      2: false,
    },
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
  featureFlags: {
    customizableUI: true,
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

const flyoutWitViewControls = {
  ...uiWithFlyout.modularComponents,
  flyoutToggle: {
    ...uiWithFlyout.modularComponents.flyoutToggle,
    toggleElement: 'viewControlsFlyout'
  }
};
export const ViewControlsFlyoutTest = createTemplate({
  headers: uiWithFlyout.modularHeaders,
  components: flyoutWitViewControls,
  flyoutMap: {
    'viewControlsFlyout': {
      'dataElement': 'viewControlsFlyout',
      'items': []
    }
  }
});

ViewControlsFlyoutTest.play = async (context) => {
  const canvas = within(context.canvasElement);
  // Click the toggle button to open the flyout
  const flyoutToggle = await canvas.findByRole('button', { 'aria-label': 'View Control Toggle' });
  await userEvent.click(flyoutToggle);
  // Check if the flyout is open
  const flyoutItem = await canvas.findByText('Rotate Clockwise');
  expect(flyoutItem).toBeInTheDocument();
  // Click flyoutItem
  await userEvent.click(flyoutItem);
  expect(flyoutItem).toBeInTheDocument();
};

const flyoutMapWithNestedViewControls = {
  ...uiWithFlyout.modularComponents,
  flyoutToggle: {
    ...uiWithFlyout.modularComponents.flyoutToggle,
    toggleElement: 'myViewControls'
  },
};

export const ViewControlsToggleButtonInsideAFlyout = createTemplate({
  headers: uiWithFlyout.modularHeaders,
  components: flyoutMapWithNestedViewControls,
  flyoutMap: {
    'myViewControls': {
      'dataElement': 'viewControlsFlyout',
      'items': [
        {
          label: 'component.viewControls',
          icon: 'icon-header-page-manipulation-line',
          children: [
            'option.displayMode.pageTransition',
            {
              icon: 'icon-header-page-manipulation-page-transition-continuous-page-line',
              label: 'option.pageTransition.continuous',
              title: 'option.pageTransition.continuous',
              dataElement: 'continuousPageTransitionButton',
              isActive: true
            },
            {
              icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
              label: 'option.pageTransition.default',
              title: 'option.pageTransition.default',
              dataElement: 'defaultPageTransitionButton',
              isActive: false
            },
            {
              icon: 'icon-header-page-manipulation-page-transition-reader',
              label: 'option.pageTransition.reader',
              title: 'option.pageTransition.reader',
              dataElement: 'readerPageTransitionButton',
              isActive: false
            },
            'divider',
            'action.rotate',
            {
              icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
              label: 'action.rotateClockwise',
              title: 'action.rotateClockwise',
              dataElement: 'rotateClockwiseButton'
            },
            {
              icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
              label: 'action.rotateCounterClockwise',
              title: 'action.rotateCounterClockwise',
              dataElement: 'rotateCounterClockwiseButton'
            },
            'divider',
            'option.displayMode.layout',
            {
              icon: 'icon-header-page-manipulation-page-layout-single-page-line',
              label: 'option.layout.single',
              title: 'option.layout.single',
              dataElement: 'singleLayoutButton',
              isActive: true
            },
            {
              icon: 'icon-header-page-manipulation-page-layout-double-page-line',
              label: 'option.layout.double',
              title: 'option.layout.double',
              dataElement: 'doubleLayoutButton',
              isActive: false
            },
            {
              icon: 'icon-header-page-manipulation-page-layout-cover-line',
              label: 'option.layout.cover',
              title: 'option.layout.cover',
              dataElement: 'coverLayoutButton',
              isActive: false
            },
            'divider',
            {
              icon: 'icon-header-full-screen',
              label: 'action.enterFullscreen',
              title: 'action.enterFullscreen',
              dataElement: 'fullscreenButton'
            }
          ],
          dataElement: 'view-controls',
          type: 'viewControls',
          title: 'component.viewControls'
        },
      ]
    }
  },
});

ViewControlsToggleButtonInsideAFlyout.play = async (context) => {
  const canvas = within(context.canvasElement);
  // Click the toggle button to open the flyout
  const flyoutToggle = await canvas.getByLabelText('Flyout Toggle');
  await userEvent.click(flyoutToggle);

  // Check if the flyout is open
  const viewControls = await canvas.findByRole('button', { name: /View Controls/i });
  expect(viewControls).toBeInTheDocument();
  // Click flyoutItem
  await userEvent.click(viewControls);
  const viewControlsItem = await canvas.findByRole('button', { name: /Rotate Clockwise/i });
  expect(viewControlsItem).toBeInTheDocument();

  // Click the toggle again to close the flyout
  await userEvent.click(flyoutToggle);
  expect(viewControlsItem).not.toBeInTheDocument();
};

export const ViewControlsFlyoutOnMobile = () => {
  return <Default />;
};

ViewControlsFlyoutOnMobile.parameters = {
  ...window.storybook?.MobileParameters
};