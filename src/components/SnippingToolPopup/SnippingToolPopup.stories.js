import React from 'react';
import SnippingToolPopup from './SnippingToolPopup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/SnippingToolPopup',
  component: SnippingToolPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
};

function rootReducer(state = initialState, action) {
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
  return (
    <Provider store={store}>
      <div className="SnippingPopupContainer">
        <SnippingToolPopup {...popupProps} />
      </div>
    </Provider>
  );
}
