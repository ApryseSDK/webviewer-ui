import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import SnippingToolPopup from './SnippingToolPopup';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { userEvent, within, expect } from 'storybook/test';
import { getTranslatedText } from 'helpers/testTranslationHelper';

export default {
  title: 'Components/SnippingToolPopup',
  component: SnippingToolPopup,
};

const basicInitialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
};

function rootReducer(state = basicInitialState, action) {
  return state;
}

const store = configureStore({ reducer: rootReducer });

const noop = () => {};

const popupProps = {
  closeSnippingPopup: noop,
  applySnipping: noop,
  isSnipping: true,
  isInDesktopOnlyMode: false,
  isMobile: false,
};

export function Basic() {

  useEffect(() => {
    // test focus style for a11y
    const div = document.querySelector('.ui__choice__input__check ');
    div.classList.add('ui__choice__input__check--focus');
  }, []);

  return (
    <Provider store={store}>
      <div className="SnippingPopupContainer">
        <SnippingToolPopup {...popupProps} />
      </div>
    </Provider>
  );
}

export function BasicMobile() {
  const mobileProps = {
    ...popupProps,
    isMobile: true,
  };

  return (
    <Provider store={store}>
      <div className="SnippingPopupContainer">
        <SnippingToolPopup {...mobileProps} />
      </div>
    </Provider>
  );
}

BasicMobile.parameters = window.storybook?.MobileParameters;

export function PopupInApp(args, context) {
  const { addonRtl } = context.globals;
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeToolName: 'SnippingTool',
      openElements: {
        snippingToolPopup: true,
      },
      isInDesktopOnlyMode: false,
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const mockAppStore = createStore(mockState);
  setItemToFlyoutStore(mockAppStore);

  return (
    <MockApp initialState={mockState} initialDirection={addonRtl}/>
  );
}

// Add interactive tests that clicks on Edit ribbon
PopupInApp.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const editRibbon = canvas.getByRole('button', { name: getTranslatedText('option.toolbarGroup.toolbarGroup-Edit') });
  await userEvent.click(editRibbon);

  // Wait for popup to fully position
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const snippingToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.snipping') });
  expect(snippingToolButton).toBeInTheDocument();
};

PopupInApp.parameters = {
  layout: 'fullscreen',
  chromatic: { delay: 10000 },
};