import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';

import rootReducer from 'src/redux/reducers/rootReducer';
import ErrorBoundaryComponent from './ErrorBoundaryComponent';
import COMPONENT_TYPES from 'constants/componentTypes';
import actions from 'actions';

const ThrowingChild = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <div>safe child</div>;
};

const createStore = () => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

describe('ErrorBoundaryComponent', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <Provider store={createStore()}>
        <ErrorBoundaryComponent dataElement="testPanel">
          <ThrowingChild shouldThrow />
        </ErrorBoundaryComponent>
      </Provider>
    );

    expect(screen.getByText('Something went wrong here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByText('safe child')).not.toBeInTheDocument();
  });

  it('resets error state when dataElement changes', () => {
    const store = createStore();
    const { rerender } = render(
      <Provider store={store}>
        <ErrorBoundaryComponent dataElement="panel-a">
          <ThrowingChild shouldThrow />
        </ErrorBoundaryComponent>
      </Provider>
    );

    expect(screen.getByText('Something went wrong here.')).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <ErrorBoundaryComponent dataElement="panel-b">
          <ThrowingChild shouldThrow={false} />
        </ErrorBoundaryComponent>
      </Provider>
    );

    expect(screen.getByText('safe child')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong here.')).not.toBeInTheDocument();
  });

  it('closes the element when the Close button is clicked', () => {
    const store = createStore();
    store.dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'myPanel' } });
    expect(store.getState().viewer.openElements.myPanel).toBe(true);

    render(
      <Provider store={store}>
        <ErrorBoundaryComponent dataElement="myPanel">
          <ThrowingChild shouldThrow />
        </ErrorBoundaryComponent>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(store.getState().viewer.openElements.myPanel).toBeFalsy();
  });

  it('closes and reopens the element when the Reload button is clicked', () => {
    jest.useFakeTimers();
    const store = createStore();
    store.dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'myPanel' } });

    render(
      <Provider store={store}>
        <ErrorBoundaryComponent dataElement="myPanel">
          <ThrowingChild shouldThrow />
        </ErrorBoundaryComponent>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
    expect(store.getState().viewer.openElements.myPanel).toBeFalsy();

    act(() => {
      jest.runAllTimers();
    });
    expect(store.getState().viewer.openElements.myPanel).toBe(true);

    jest.useRealTimers();
  });

  it('restores the flyout toggle element after reload so the flyout stays anchored', () => {
    jest.useFakeTimers();
    const store = createStore();
    const flyoutDataElement = 'myFlyout';
    const toggleElement = 'flyoutToggleButton';
    store.dispatch(actions.addFlyout({ dataElement: flyoutDataElement, items: [] }));
    store.dispatch(actions.setActiveFlyout(flyoutDataElement));
    store.dispatch(actions.openElement(flyoutDataElement));
    store.dispatch(actions.setFlyoutToggleElement(toggleElement));

    render(
      <Provider store={store}>
        <ErrorBoundaryComponent dataElement={flyoutDataElement} componentType={COMPONENT_TYPES.FLYOUT}>
          <ThrowingChild shouldThrow />
        </ErrorBoundaryComponent>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    // Closing the flyout clears its open + toggle state.
    expect(store.getState().viewer.openElements[flyoutDataElement]).toBeFalsy();
    expect(store.getState().viewer.flyoutToggleElement).toBeNull();

    act(() => {
      jest.runAllTimers();
    });

    // After the delay the flyout reopens and the toggle element is restored so it re-anchors.
    expect(store.getState().viewer.openElements[flyoutDataElement]).toBe(true);
    expect(store.getState().viewer.flyoutToggleElement).toBe(toggleElement);

    jest.useRealTimers();
  });
});
