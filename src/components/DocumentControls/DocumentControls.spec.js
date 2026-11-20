import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import DocumentControls from './DocumentControls';

jest.mock('core', () => ({
  getTotalPages: () => 9,
  getCurrentPage: () => 1,
  getDocumentViewer: () => ({}),
  getDocument: () => null,
}));

const TestDocumentControls = withProviders(DocumentControls, {
  viewer: { selectedThumbnailPageIndexes: [] },
});

const PAGE_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// A real store so dispatched selection changes actually flow back into props, unlike withMockRedux's static reducer
function renderWithLiveStore() {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(actions.setPageLabels(PAGE_LABELS));

  const TestDocumentControlsWithI18n = withI18n(DocumentControls);
  render(
    <Provider store={store}>
      <TestDocumentControlsWithI18n shouldShowControls parentElement={null} />
    </Provider>
  );

  return store;
}

describe('DocumentControls - Multi-Select Pages validation', () => {
  it('does not show an error and keeps the typed value while an input is incomplete', () => {
    render(<TestDocumentControls shouldShowControls parentElement={null} />);

    const input = screen.getByLabelText('Enter page numbers to select');
    fireEvent.change(input, { target: { value: '1,' } });

    expect(input).toHaveValue('1,');
    expect(screen.queryByText(/Invalid page number/)).not.toBeInTheDocument();
  });

  it('shows an error while typing an out-of-range page number', () => {
    render(<TestDocumentControls shouldShowControls parentElement={null} />);

    const input = screen.getByLabelText('Enter page numbers to select');
    fireEvent.change(input, { target: { value: '1-99' } });

    expect(screen.getByText(/Invalid page number/)).toBeInTheDocument();
    expect(screen.getByText(/Limit is 9/)).toBeInTheDocument();
  });

  it('clears the input on blur when the value is invalid, matching PageNumberInput', () => {
    render(<TestDocumentControls shouldShowControls parentElement={null} />);

    const input = screen.getByLabelText('Enter page numbers to select');
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('');
    expect(screen.getByText(/Invalid page number/)).toBeInTheDocument();
  });

  it('keeps a valid page number in the field and selects the matching page on blur', () => {
    const store = renderWithLiveStore();

    const input = screen.getByLabelText('Enter page numbers to select');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.blur(input);

    expect(screen.queryByText(/Invalid page number/)).not.toBeInTheDocument();
    expect(input).toHaveValue('2');
    expect(store.getState().viewer.selectedThumbnailPageIndexes).toEqual([1]);
  });

  it('clears the committed selection on invalid blur while keeping the error visible', () => {
    const store = renderWithLiveStore();
    act(() => {
      store.dispatch(actions.setSelectedPageThumbnails([1]));
    });

    const input = screen.getByLabelText('Enter page numbers to select');
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('');
    expect(screen.getByText(/Invalid page number/)).toBeInTheDocument();
    expect(store.getState().viewer.selectedThumbnailPageIndexes).toEqual([]);
  });

  it('does not enable thumbnail multi-select after an invalid blur, even past the debounce timeout', () => {
    jest.useFakeTimers();
    try {
      const store = renderWithLiveStore();
      act(() => {
        store.dispatch(actions.setSelectedPageThumbnails([1]));
      });

      const input = screen.getByLabelText('Enter page numbers to select');
      fireEvent.change(input, { target: { value: '99' } });
      fireEvent.blur(input);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(store.getState().viewer.thumbnailSelectingPages).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it('enables thumbnail multi-select after a valid blur once the debounce timeout elapses', () => {
    jest.useFakeTimers();
    try {
      const store = renderWithLiveStore();
      act(() => {
        store.dispatch(actions.setSelectedPageThumbnails([1]));
      });

      const input = screen.getByLabelText('Enter page numbers to select');
      fireEvent.change(input, { target: { value: '2' } });
      fireEvent.blur(input);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(store.getState().viewer.thumbnailSelectingPages).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});