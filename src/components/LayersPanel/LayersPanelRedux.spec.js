import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import LayersPanelRedux from './LayersPanelRedux';
import documentReducer from 'reducers/documentReducer';

jest.mock('core', () => {
  const mockNoop = () => {};
  const mockRawLayers = [
    {
      name: 'Parent Label',
      children: [
        { name: 'Child Layer', visible: true, obj: {} },
      ],
    },
  ];
  const mockDocument = {
    isWebViewerServerDocument: () => false,
    getLayersArray: () => Promise.resolve(mockRawLayers),
    setLayersArray: mockNoop,
    addEventListener: mockNoop,
    removeEventListener: mockNoop,
  };
  const mockDocumentViewer = {
    getAnnotationManager: () => ({
      getAnnotationsList: () => [],
      drawAnnotationsFromList: mockNoop,
    }),
    refreshAll: mockNoop,
    updateView: mockNoop,
    getDocument: () => mockDocument,
  };
  return {
    addEventListener: mockNoop,
    removeEventListener: mockNoop,
    getDocument: () => mockDocument,
    getDocumentViewer: () => mockDocumentViewer,
    isFullPDFEnabled: () => false,
  };
});

function createStore() {
  const reducer = combineReducers({
    document: documentReducer({ layers: {} }),
    viewer: (state = {
      activeDocumentViewerKey: 1,
      disabledElements: {},
      customElementOverrides: {},
      openElements: {},
      flyoutMap: {},
      documentLoadedMap: { 1: true },
    }) => state,
    featureFlags: (state = {}) => state,
    search: (state = {}) => state,
  });
  return configureStore({ reducer });
}

describe('LayersPanelRedux - restoreDefaultLayers', () => {
  it('restores a toggled layer to its default in the store and UI, and re-disables the restore button', async () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <LayersPanelRedux />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Parent Label')).toBeInTheDocument());

    const restoreButton = screen.getByRole('button', { name: 'Restore Defaults' });
    expect(restoreButton).toBeDisabled();

    fireEvent.click(container.querySelector('.arrow'));
    await waitFor(() => expect(screen.getByText('Child Layer')).toBeInTheDocument());

    const initialLayers = store.getState().document.layers[1];
    const childCheckbox = screen.getByRole('checkbox', { name: /Child Layer/ });

    await act(async () => {
      fireEvent.click(childCheckbox);
    });
    expect(childCheckbox.checked).toBe(false);
    expect(restoreButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(restoreButton);
    });

    expect(childCheckbox.checked).toBe(true);
    expect(store.getState().document.layers[1]).toEqual(initialLayers);
    expect(restoreButton).toBeDisabled();
  });

  it('restores the latest store state rather than a stale snapshot when layers were toggled first', async () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <LayersPanelRedux />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Parent Label')).toBeInTheDocument());

    // Expand the parent so the toggleable child layer is rendered.
    fireEvent.click(container.querySelector('.arrow'));
    await waitFor(() => expect(screen.getByText('Child Layer')).toBeInTheDocument());

    const initialLayers = store.getState().document.layers[1];
    const childCheckbox = screen.getByRole('checkbox', { name: /Child Layer/ });

    // Toggle the child layer off, moving the store away from the initial (default) state.
    await act(async () => {
      fireEvent.click(childCheckbox);
    });
    expect(store.getState().document.layers[1]).not.toEqual(initialLayers);

    // Toggle it back on, then immediately restore. restoreDefaultLayers reads
    // store.getState() synchronously at click time, so it must always see this
    // latest toggle rather than a value captured from an earlier render/closure.
    await act(async () => {
      fireEvent.click(childCheckbox);
    });

    const restoreButton = screen.getByRole('button', { name: 'Restore Defaults' });
    await act(async () => {
      fireEvent.click(restoreButton);
    });

    expect(store.getState().document.layers[1]).toEqual(initialLayers);
    expect(restoreButton).toBeDisabled();
  });

  it('keeps the restore button enabled after the panel unmounts and remounts with changed layers', async () => {
    const store = createStore();
    const { container, unmount } = render(
      <Provider store={store}>
        <LayersPanelRedux />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Parent Label')).toBeInTheDocument());
    fireEvent.click(container.querySelector('.arrow'));
    await waitFor(() => expect(screen.getByText('Child Layer')).toBeInTheDocument());

    const childCheckbox = screen.getByRole('checkbox', { name: /Child Layer/ });
    await act(async () => {
      fireEvent.click(childCheckbox);
    });
    expect(screen.getByRole('button', { name: 'Restore Defaults' })).toBeEnabled();

    // Simulate closing and reopening the panel while the layers state (and its
    // change relative to the default) persists in the store.
    unmount();
    render(
      <Provider store={store}>
        <LayersPanelRedux />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Parent Label')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Restore Defaults' })).toBeEnabled();
  });
});
