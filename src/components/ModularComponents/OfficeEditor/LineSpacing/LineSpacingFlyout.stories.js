import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import core from 'core';
import LineSpacingFlyout from './LineSpacingFlyout';
import { getLineSpacingFlyoutItems } from 'helpers/officeEditor';
import Flyout from 'components/ModularComponents/Flyout';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/LineSpacingFlyout',
  component: LineSpacingFlyout,
};

const initialState = {
  ...OEModularUIMockState,
  viewer: {
    ...OEModularUIMockState.viewer,
    openElements: {
      lineSpacingFlyout: true,
    },
    flyoutMap: {
      'lineSpacingFlyout': {
        'dataElement': 'noteStateFlyout',
        'items': getLineSpacingFlyoutItems(),
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'lineSpacingFlyout',
    activeTabInPanel: {},
    modularComponents: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    customHeadersAdditionalProperties: {},
  },
};

const store = configureStore({ reducer: () => initialState });

const prepareFlyoutStory = () => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });

  return (
    <Provider store={store}>
      <Flyout/>
    </Provider>
  );
};

export function DefaultSingle() {
  initialState.officeEditor.cursorProperties.paragraphProperties.lineHeightMultiplier = undefined;
  return prepareFlyoutStory();
}

export function ActiveDouble() {
  initialState.officeEditor.cursorProperties.paragraphProperties.lineHeightMultiplier = 2;
  return prepareFlyoutStory();
}

ActiveDouble.parameters = window.storybook.disableRtlMode;