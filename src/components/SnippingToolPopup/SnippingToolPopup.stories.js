import React, { useEffect } from 'react';
import SnippingToolPopup from './SnippingToolPopup';
import { MockApp, createStore as createMockAppStore } from 'helpers/storybookHelper';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { createStore } from 'redux';

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

const store = createStore(rootReducer);

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

export function BasicMobile(args, context) {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeToolName: 'SnippingTool',
      openElements: {
        snippingToolPopup: true,
      },
      isInDesktopOnlyMode: false,
      isMobile: true,
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const mockAppStore = createMockAppStore(mockState);
  setItemToFlyoutStore(mockAppStore);

  return (
    <MockApp initialState={mockState}/>
  );
}

BasicMobile.parameters = window.storybook?.MobileParameters;
