import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import FlyoutContainer from '../FlyoutContainer';
import actions from 'actions';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { isMobileSize } from 'helpers/getDeviceSize';

jest.mock('core', () => ({
  getDocument: jest.fn(),
  getDocumentViewer: () => {},
  isFullPDFEnabled: jest.fn(() => false),
  addEventListener: jest.fn(),
}));

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  fireError: jest.fn(),
}));

jest.mock('helpers/getDeviceSize', () => ({
  isMobileSize: jest.fn(() => true),
}));

describe('Flyout', () => {
  describe('Mobile', () => {
    let store;
    const mobileTestFlyout = 'mobileTestFlyout';

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
      });
      store.dispatch(actions.addFlyout({
        dataElement: mobileTestFlyout,
        items: [{ label: 'Mobile Item' }],
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders mobile Flyout when device is mobile size and desktopOnlyMode is disabled', () => {
      store.dispatch(actions.setActiveFlyout(mobileTestFlyout));
      store.dispatch(actions.openElement(mobileTestFlyout));

      const { container } = render(
        <Provider store={store}>
          <FlyoutContainer />
        </Provider>
      );

      const flyout = container.querySelector('.Flyout');
      const mobileFlyout = container.querySelector('.Flyout.mobile');

      expect(flyout).toBeInTheDocument();
      expect(mobileFlyout).toBeInTheDocument();
    });

    it('does not open mobile Flyout when device is mobile size and isDesktopOnlyMode is enabled', () => {
      store.dispatch(actions.setActiveFlyout(mobileTestFlyout));
      store.dispatch(actions.openElement(mobileTestFlyout));
      store.dispatch(actions.setEnableDesktopOnlyMode(true));

      const { container } = render(
        <Provider store={store}>
          <FlyoutContainer />
        </Provider>
      );

      const flyout = container.querySelector('.Flyout');
      const mobileFlyout = container.querySelector('.Flyout.mobile');

      expect(flyout).toBeInTheDocument();
      expect(mobileFlyout).not.toBeInTheDocument();
    });
  });

  describe('Error boundary', () => {
    let store;
    let consoleErrorSpy;

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
      });
      isMobileSize.mockReturnValue(true);
      store.dispatch(actions.setEnableDesktopOnlyMode(false));
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      jest.clearAllMocks();
    });

    it('renders the flyout fallback and does not propagate when a flyout item throws', () => {
      const ThrowingItem = () => {
        throw new Error('Flyout item crash');
      };
      const crashFlyout = 'crashFlyout';
      store.dispatch(actions.addFlyout({
        dataElement: crashFlyout,
        items: [<ThrowingItem key="throwing-item" />],
      }));
      store.dispatch(actions.setActiveFlyout(crashFlyout));
      store.dispatch(actions.openElement(crashFlyout));

      let container;
      expect(() => {
        ({ container } = render(
          <Provider store={store}>
            <FlyoutContainer />
          </Provider>
        ));
      }).not.toThrow();

      // The positioned flyout shell should still render so the fallback stays anchored.
      expect(container.querySelector('.Flyout')).toBeInTheDocument();
      expect(container.querySelector('.error-boundary--flyout')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong here.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('keeps mobile shell affordances when flyout content crashes', () => {
      const ThrowingItem = () => {
        throw new Error('Flyout item crash on mobile');
      };
      const crashFlyout = 'mobileCrashFlyout';
      store.dispatch(actions.addFlyout({
        dataElement: crashFlyout,
        items: [<ThrowingItem key="throwing-mobile-item" />],
      }));
      store.dispatch(actions.setActiveFlyout(crashFlyout));
      store.dispatch(actions.openElement(crashFlyout));

      const { container } = render(
        <Provider store={store}>
          <FlyoutContainer />
        </Provider>
      );

      expect(container.querySelector('.Flyout.mobile')).toBeInTheDocument();
      expect(container.querySelector('.swipe-indicator')).toBeInTheDocument();
      expect(container.querySelector('.error-boundary--flyout')).toBeInTheDocument();
    });
  });
});
