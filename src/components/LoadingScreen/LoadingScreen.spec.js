import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import actions from 'actions';
import DataElements from 'constants/dataElement';
import LoadingScreenContexts from 'constants/loadingScreenContexts';
import LoadingScreenStyles from 'constants/loadingScreenStyles';
import rootReducer from 'reducers/rootReducer';
import selectors from 'selectors';
import LoadingScreen from './LoadingScreen';

let svgRadiusDescriptor;

beforeAll(() => {
  svgRadiusDescriptor = Object.getOwnPropertyDescriptor(SVGElement.prototype, 'r');
  Object.defineProperty(SVGElement.prototype, 'r', {
    configurable: true,
    value: { baseVal: { value: 25 } },
  });
});

afterAll(() => {
  if (svgRadiusDescriptor) {
    Object.defineProperty(SVGElement.prototype, 'r', svgRadiusDescriptor);
  } else {
    delete SVGElement.prototype.r;
  }
});

const renderLoadingScreen = ({
  loadingScreenStyle = LoadingScreenStyles.SKELETON,
  loadingScreenContext = LoadingScreenContexts.DEFAULT,
  openElement = DataElements.LOADING_MODAL,
  isMultiViewerMode = false,
} = {}) => {
  const store = configureStore({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
  });
  store.dispatch(actions.setIsMultiViewerMode(isMultiViewerMode));
  store.dispatch(actions.setLoadingScreenStyle(loadingScreenStyle));
  if (loadingScreenContext === LoadingScreenContexts.DOCUMENT && openElement) {
    store.dispatch(actions.openDocumentLoadingScreen());
  } else if (openElement) {
    store.dispatch(actions.openElement(openElement));
  }

  return {
    store,
    ...render(
      <Provider store={store}>
        <LoadingScreen />
      </Provider>
    ),
  };
};

describe('LoadingScreen', () => {
  it('shows the skeleton for document loading', () => {
    const { container } = renderLoadingScreen({ loadingScreenContext: LoadingScreenContexts.DOCUMENT });

    expect(screen.getByRole('status', { name: 'Loading document' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('progressbar', { name: 'Loading document' })).not.toBeInTheDocument();
    expect(container.querySelector('.LoadingModal')).not.toBeInTheDocument();
  });

  it('shows the legacy spinner for document loading when configured', () => {
    renderLoadingScreen({
      loadingScreenStyle: LoadingScreenStyles.LEGACY,
      loadingScreenContext: LoadingScreenContexts.DOCUMENT,
    });

    expect(screen.getByRole('progressbar', { name: 'Loading document' })).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading document' })).not.toBeInTheDocument();
  });

  it('does not show global document loading UI in multi-viewer mode', () => {
    const { container } = renderLoadingScreen({
      loadingScreenContext: LoadingScreenContexts.DOCUMENT,
      isMultiViewerMode: true,
    });

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('progressbar', { name: 'Loading document' })).not.toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading document' })).not.toBeInTheDocument();
  });

  it('preserves the legacy loading modal for existing loading operations', () => {
    const { container } = renderLoadingScreen();

    expect(container.querySelector('[data-element="loadingModal"]')).toHaveClass('open');
    expect(container.querySelector('.LoadingModal .inner-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.LoadingSkeleton')).not.toBeInTheDocument();
  });

  it('preserves the legacy progress spinner for document loading progress', () => {
    const { store } = renderLoadingScreen({ openElement: DataElements.PROGRESS_MODAL });

    act(() => {
      store.dispatch(actions.openDocumentLoadingScreen());
    });

    expect(screen.getByRole('progressbar', { name: 'Loading document' })).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading document' })).not.toBeInTheDocument();
  });

  it('renders nothing when loading is closed', () => {
    const { container } = renderLoadingScreen({
      loadingScreenContext: LoadingScreenContexts.DOCUMENT,
      openElement: null,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('returns to the legacy loading modal after document loading closes', () => {
    const { container, store } = renderLoadingScreen({ loadingScreenContext: LoadingScreenContexts.DOCUMENT });

    act(() => {
      store.dispatch(actions.closeLoadingScreen());
      store.dispatch(actions.openElement(DataElements.LOADING_MODAL));
    });

    expect(container.querySelector('[data-element="loadingModal"]')).toHaveClass('open');
    expect(container.querySelector('.LoadingSkeleton')).not.toBeInTheDocument();
  });

  it('preserves other document viewers that are still loading when the shared loading screen closes', () => {
    const { store } = renderLoadingScreen({ openElement: null });

    act(() => {
      store.dispatch(actions.openDocumentLoadingScreen(1));
      store.dispatch(actions.openDocumentLoadingScreen(2));
      store.dispatch(actions.closeDocumentLoadingScreen(1));
      store.dispatch(actions.closeLoadingScreen());
    });

    expect(selectors.isDocumentViewerLoading(store.getState(), 1)).toBe(false);
    expect(selectors.isDocumentViewerLoading(store.getState(), 2)).toBe(true);
  });
});
