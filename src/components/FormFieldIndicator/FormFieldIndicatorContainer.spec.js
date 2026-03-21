import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import FormFieldIndicatorContainer from './FormFieldIndicatorContainer';
import selectors from 'selectors';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: () => ({
    core: {
      getDocument: jest.fn(() => null),
      getScrollViewElement: jest.fn(() => ({
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getViewerElement: jest.fn(() => ({
        getBoundingClientRect: jest.fn(() => ({})),
      })),
      getDocumentViewer: jest.fn(() => ({
        getDisplayModeManager: jest.fn(() => ({
          getDisplayMode: jest.fn(),
        })),
      })),
    },
  }),
}));

jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: () => ({
    getElementById: jest.fn(() => ({
      getBoundingClientRect: jest.fn(() => ({})),
    })),
  }),
  getInstanceID: jest.fn(() => 'default'),
  getInstanceNode: jest.fn(() => globalThis),
  getWebViewerRect: jest.fn(() => ({})),
}));

jest.mock('selectors');

describe('FormFieldIndicatorContainer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
    jest.clearAllMocks();
  });

  it('should render indicator container when not in multiviewer mode', () => {
    selectors.isElementOpen.mockReturnValue(true);
    selectors.isElementDisabled.mockReturnValue(false);
    selectors.isMultiViewerMode.mockReturnValue(false);

    render(
      <Provider store={store}>
        <FormFieldIndicatorContainer />
      </Provider>,
    );
    const wrapper = document.body.querySelector('#form-field-indicator-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('should not render indicator container in multiviewer mode', () => {
    selectors.isElementOpen.mockReturnValue(true);
    selectors.isElementDisabled.mockReturnValue(false);
    selectors.isMultiViewerMode.mockReturnValue(true);

    render(
      <Provider store={store}>
        <FormFieldIndicatorContainer />
      </Provider>,
    );

    const wrapper = document.body.querySelector('#form-field-indicator-wrapper');
    expect(wrapper).not.toBeInTheDocument();
  });

});
