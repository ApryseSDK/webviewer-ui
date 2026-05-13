import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import actions from 'actions';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  fireError: jest.fn(),
}));

jest.mock('helpers/getDeviceSize', () => ({
  isMobileSize: jest.fn(() => true),
}));

describe('ModalWrapper', () => {
  describe('Mobile', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('shows mobile swipe indicator when device is mobile size and desktop only mode is disabled', () => {
      const onCloseClick = jest.fn();

      const { container } = render(
        <Provider store={store}>
          <ModalWrapper
            isOpen={true}
            onCloseClick={onCloseClick}
            title="action.close"
          >
            <div>FooBar</div>
          </ModalWrapper>
        </Provider>
      );

      const modalWrapperText = screen.queryByText('FooBar');
      const modalContainer = container.querySelector('.modal-container');
      const swipeIndicator = container.querySelector('.swipe-indicator');

      expect(modalWrapperText).toBeInTheDocument();
      expect(modalContainer).toBeInTheDocument();
      expect(swipeIndicator).toBeInTheDocument();
    });

    it('does not show mobile swipe indicator when device is mobile size and isDesktopOnlyMode is enabled', () => {
      const onCloseClick = jest.fn();
      store.dispatch(actions.setEnableDesktopOnlyMode(true));

      const { container } = render(
        <Provider store={store}>
          <ModalWrapper
            isOpen={true}
            onCloseClick={onCloseClick}
            title="action.close"
          >
            <div>FooBar</div>
          </ModalWrapper>
        </Provider>
      );

      const modalWrapperText = screen.queryByText('FooBar');
      const modalContainer = container.querySelector('.modal-container');
      const swipeIndicator = container.querySelector('.swipe-indicator');

      expect(modalWrapperText).toBeInTheDocument();
      expect(modalContainer).toBeInTheDocument();
      expect(swipeIndicator).not.toBeInTheDocument();
    });
  });
});
