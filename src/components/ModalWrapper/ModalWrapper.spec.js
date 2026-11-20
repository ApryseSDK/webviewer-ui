import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import actions from 'actions';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';
import { isMobileSize } from 'helpers/getDeviceSize';

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  fireError: jest.fn(),
}));

jest.mock('helpers/getDeviceSize', () => ({
  isMobileSize: jest.fn(() => true),
}));

const createStore = () => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

describe('ModalWrapper', () => {
  describe('Mobile', () => {
    let store;

    beforeEach(() => {
      store = createStore();
      isMobileSize.mockImplementation(() => true);
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
            modalDataElement="testModal"
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
            modalDataElement="testModal"
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

    it('uses its own instance root to decide the mobile layout when multiple viewers are on the page', () => {
      const mobileRoot = document.createElement('div').attachShadow({ mode: 'open' });
      const desktopRoot = document.createElement('div').attachShadow({ mode: 'open' });
      isMobileSize.mockImplementation((rootNode) => rootNode === mobileRoot);

      const renderModal = (rootNode) => render(
        <InstanceRootNodeContext.Provider value={rootNode}>
          <Provider store={store}>
            <ModalWrapper
              isOpen={true}
              onCloseClick={jest.fn()}
              modalDataElement="testModal"
              title="action.close"
            >
              <div>FooBar</div>
            </ModalWrapper>
          </Provider>
        </InstanceRootNodeContext.Provider>
      );

      const { container: mobileContainer } = renderModal(mobileRoot);
      const { container: desktopContainer } = renderModal(desktopRoot);

      expect(mobileContainer.querySelector('.swipe-indicator')).toBeInTheDocument();
      expect(desktopContainer.querySelector('.swipe-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Error boundary', () => {
    let store;
    let consoleErrorSpy;

    const ThrowingChild = () => {
      throw new Error('new error');
    };

    beforeEach(() => {
      store = createStore();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      jest.clearAllMocks();
    });

    it('renders the error fallback when a child throws', () => {
      render(
        <Provider store={store}>
          <ModalWrapper
            isOpen={true}
            onCloseClick={jest.fn()}
            modalDataElement="settingsModal"
            title="action.settings"
          >
            <ThrowingChild />
          </ModalWrapper>
        </Provider>
      );

      expect(screen.getByText('Something went wrong here.')).toBeInTheDocument();
      expect(document.querySelector('[data-element="errorBoundaryReloadButton"]')).toBeInTheDocument();
      expect(document.querySelector('[data-element="errorBoundaryCloseButton"]')).toBeInTheDocument();
    });

    it('closes the modal via its modalDataElement when the fallback Close button is clicked', () => {
      store.dispatch(actions.openElement('settingsModal'));
      expect(store.getState().viewer.openElements.settingsModal).toBe(true);

      render(
        <Provider store={store}>
          <ModalWrapper
            isOpen={true}
            onCloseClick={jest.fn()}
            modalDataElement="settingsModal"
            title="action.settings"
          >
            <ThrowingChild />
          </ModalWrapper>
        </Provider>
      );

      fireEvent.click(document.querySelector('[data-element="errorBoundaryCloseButton"]'));
      expect(store.getState().viewer.openElements.settingsModal).toBeFalsy();
    });
  });
});
