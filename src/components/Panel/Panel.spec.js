import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Panel from './Panel';
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

describe('Panel', () => {
  describe('Mobile', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
      });
      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders mobile Panel when device is mobile size and desktopOnlyMode is disabled', () => {
      store.dispatch(actions.openElement('panel'));

      const { container } = render(
        <Provider store={store}>
          <Panel dataElement="panel" location="left">
            <div>FooBar</div>
          </Panel>
        </Provider>
      );

      const panelText = screen.queryByText('FooBar');
      const panel = container.querySelector('[data-element="panel"]');
      const mobilePanel = container.querySelector('[data-element="MobilePanelWrapper"]');

      expect(panelText).toBeInTheDocument();
      expect(panel).not.toBeInTheDocument();
      expect(mobilePanel).toBeInTheDocument();
    });

    it('does not open mobile Panel when device is mobile size and isDesktopOnlyMode is enabled', () => {
      store.dispatch(actions.openElement('panel'));
      store.dispatch(actions.setEnableDesktopOnlyMode(true));

      const { container } = render(
        <Provider store={store}>
          <Panel dataElement="panel" location="left">
            <div>FooBar</div>
          </Panel>
        </Provider>
      );

      const panelText = screen.queryByText('FooBar');
      const panel = container.querySelector('[data-element="panel"]');
      const mobilePanel = container.querySelector('[data-element="MobilePanelWrapper"]');

      expect(panelText).toBeInTheDocument();
      expect(panel).toBeInTheDocument();
      expect(mobilePanel).not.toBeInTheDocument();
    });
  });
});
