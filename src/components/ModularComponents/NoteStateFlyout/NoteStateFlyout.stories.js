import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import NoteStateFlyout, { noteStateFlyoutItems } from './NoteStateFlyout';
import Flyout from '../Flyout';

import { createTemplate } from 'helpers/storybookHelper';
import { userEvent, within, expect } from '@storybook/test';
import { uiWithFlyout } from '../storyModularUIConfigs';

export default {
  title: 'ModularComponents/NoteStateFlyout',
  component: NoteStateFlyout,
  parameters: {
    customizableUI: true,
  },
};

function createReduxWrapper(dataElement, disabled) {
  const currentState = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      flyoutMap: {
        'noteStateFlyout': {
          dataElement: 'noteStateFlyout',
          items: noteStateFlyoutItems,
        }
      },
      activeFlyout: 'noteStateFlyout',
      openElements: {
        'noteStateFlyout': true
      },
      genericPanels: [],
      modularHeaders: [],
      modularHeadersHeight: {},
      flyoutPosition: { x: 0, y: 0 },
      modularComponents: {},
      activeTabInPanel: {},
    },
    featureFlags: {
      customizableUI: true
    }
  };

  currentState.viewer.disabledElements[dataElement] = { disabled };

  const store = configureStore({ reducer: () => currentState });

  const ReduxWrapper = (props) => {
    const { children } = props;
    return <Provider store={store}>{children}</Provider>;
  };

  ReduxWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return ReduxWrapper;
}

const ReduxWrapper = createReduxWrapper();

export const Default = () => {
  return (
    <ReduxWrapper>
      <Flyout />
    </ReduxWrapper>
  );
};

export const CancelledStateDisabled = () => {
  const ReduxWrapper = createReduxWrapper('noteStateFlyoutCancelledOption', true);
  return (
    <ReduxWrapper>
      <Flyout />
    </ReduxWrapper>
  );
};

export const RejectedStateDisabled = () => {
  const ReduxWrapper = createReduxWrapper('noteStateFlyoutRejectedOption', true);
  return (
    <ReduxWrapper>
      <Flyout />
    </ReduxWrapper>
  );
};

export const NoteStateFlyoutTest = createTemplate({
  headers: uiWithFlyout.modularHeaders,
  components: {
    ...uiWithFlyout.modularComponents,
    flyoutToggle: {
      ...uiWithFlyout.modularComponents.flyoutToggle,
      toggleElement: 'noteStateFlyout'
    }
  },
  flyoutMap: {
    'noteStateFlyout': {
      'dataElement': 'noteStateFlyout',
      'items': noteStateFlyoutItems,
    }
  }
});

NoteStateFlyoutTest.play = async (context) => {
  const canvas = within(context.canvasElement);
  // Click the toggle button to open the flyout
  const flyoutToggle = await canvas.findByRole('button', { 'aria-label': /Flyout Toggle/i });
  await userEvent.click(flyoutToggle);
  // Check if the flyout is open
  const flyoutItem = await canvas.findByText('Rejected');
  expect(flyoutItem).toBeInTheDocument();
};

export const NoteStateFlyoutOnMobile = () => {
  return <Default />;
};

NoteStateFlyoutOnMobile.parameters = {
  ...window.storybook?.MobileParameters
};