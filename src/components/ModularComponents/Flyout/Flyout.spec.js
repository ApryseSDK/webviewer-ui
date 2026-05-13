import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import Flyout from './Flyout';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';

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

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders mobile Flyout when device is mobile size and desktopOnlyMode is disabled', () => {
      store.dispatch(actions.setActiveFlyout(DataElements.MAIN_MENU));
      store.dispatch(actions.openElement(DataElements.MAIN_MENU));

      const { container } = render(
        <Provider store={store}>
          <Flyout />
        </Provider>
      );

      const flyout = container.querySelector('.Flyout');
      const mobileFlyout = container.querySelector('.Flyout.mobile');

      expect(flyout).toBeInTheDocument();
      expect(mobileFlyout).toBeInTheDocument();
    });

    it('does not open mobile Flyout when device is mobile size and isDesktopOnlyMode is enabled', () => {
      store.dispatch(actions.setActiveFlyout(DataElements.MAIN_MENU));
      store.dispatch(actions.openElement(DataElements.MAIN_MENU));
      store.dispatch(actions.setEnableDesktopOnlyMode(true));

      const { container } = render(
        <Provider store={store}>
          <Flyout />
        </Provider>
      );

      const flyout = container.querySelector('.Flyout');
      const mobileFlyout = container.querySelector('.Flyout.mobile');

      expect(flyout).toBeInTheDocument();
      expect(mobileFlyout).not.toBeInTheDocument();
    });
  });
});
