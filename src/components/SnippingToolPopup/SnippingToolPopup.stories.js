import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import SnippingToolPopup from './SnippingToolPopup';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';

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