import React, { lazy } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import Panel from 'components/Panel';
import ToastContainerContext from 'components/App/ToastContainerContext';
import { isMobileSize } from 'helpers/getDeviceSize';
import LazyLoadWrapper from './LazyLoadWrapper';

jest.mock('helpers/getDeviceSize', () => ({
  isMobileSize: jest.fn(() => false),
}));

jest.mock('helpers/officeEditor', () => ({
  isOfficeEditorMode: () => false,
  shouldBeDisabledInOfficeEditor: () => false,
}));

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  fireError: jest.fn(),
}));

const createStore = () => configureStore({
  reducer: rootReducer(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

const createLazyComponent = () => {
  let rejectImport;
  const importPromise = new Promise((resolve, reject) => {
    rejectImport = reject;
  });
  return {
    Component: lazy(() => importPromise),
    rejectImport: () => rejectImport(new Error('Failed to fetch dynamically imported module')),
  };
};

const renderWithStore = (store, children, toastContainer) => render(
  <Provider store={store}>
    <ToastContainerContext.Provider value={toastContainer}>
      {children}
    </ToastContainerContext.Provider>
  </Provider>
);

const openElement = (store, dataElement) => {
  store.dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
};

const refreshPageMessage = 'Please check your network connection and refresh the page.';

describe('LazyLoadWrapper error presentation', () => {
  let consoleErrorSpy;
  let toastContainer;
  let originalResizeObserver;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    isMobileSize.mockReturnValue(false);
    originalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
    toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    global.ResizeObserver = originalResizeObserver;
    toastContainer.remove();
  });

  it.each([
    ['desktop', false],
    ['mobile', true],
  ])('shows the existing %s panel fallback for a rejected lazy import with a custom identifier', async (_device, isMobile) => {
    isMobileSize.mockReturnValue(isMobile);
    const store = createStore();
    const dataElement = 'customCommentsPanel';
    const { Component, rejectImport } = createLazyComponent();
    openElement(store, dataElement);

    renderWithStore(store, (
      <Panel dataElement={dataElement} location="left">
        <LazyLoadWrapper Component={Component} dataElement={dataElement} showNetworkErrorToast={false} />
      </Panel>
    ), toastContainer);

    await act(async () => {
      rejectImport();
    });

    expect(await screen.findByText('Something went wrong here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByText(refreshPageMessage)).not.toBeInTheDocument();
    expect(toastContainer).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByText('Something went wrong here.')).not.toBeInTheDocument();
    expect(store.getState().viewer.openElements[dataElement]).toBeFalsy();
  });

  it('should keep the portaled network toast for a standalone popup and allow dismissal', async () => {
    const store = createStore();
    const dataElement = 'annotationPopup';
    const { Component, rejectImport } = createLazyComponent();
    openElement(store, dataElement);

    renderWithStore(store, <LazyLoadWrapper Component={Component} dataElement={dataElement} />, toastContainer);

    await act(async () => {
      rejectImport();
    });

    expect(await screen.findByText(refreshPageMessage)).toBeInTheDocument();
    expect(toastContainer).toHaveTextContent(refreshPageMessage);
    expect(screen.queryByText('Something went wrong here.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByText(refreshPageMessage)).not.toBeInTheDocument();
    expect(toastContainer).toBeEmptyDOMElement();
  });

  it('should not start importing a closed component', () => {
    const store = createStore();
    const loadComponent = jest.fn(() => Promise.resolve({ default: () => <div>Panel content</div> }));
    const Component = lazy(loadComponent);

    renderWithStore(store, (
      <LazyLoadWrapper Component={Component} dataElement="closedPanel" showNetworkErrorToast={false} />
    ), toastContainer);

    expect(loadComponent).not.toHaveBeenCalled();
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
  });

  it('should not start importing an open but disabled component', () => {
    const store = createStore();
    const dataElement = 'disabledPanel';
    const loadComponent = jest.fn(() => Promise.resolve({ default: () => <div>Panel content</div> }));
    const Component = lazy(loadComponent);
    openElement(store, dataElement);
    store.dispatch({ type: 'DISABLE_ELEMENT', payload: { dataElement, priority: 3 } });

    renderWithStore(store, (
      <LazyLoadWrapper Component={Component} dataElement={dataElement} showNetworkErrorToast={false} />
    ), toastContainer);

    expect(loadComponent).not.toHaveBeenCalled();
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
  });
});
