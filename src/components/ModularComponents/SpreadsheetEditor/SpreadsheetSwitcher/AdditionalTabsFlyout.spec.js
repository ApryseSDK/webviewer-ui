import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import actions from 'actions';

jest.mock('actions', () => ({
  addFlyout: jest.fn((flyout) => ({ type: 'ADD_FLYOUT', payload: flyout })),
  updateFlyout: jest.fn((dataElement, flyout) => ({ type: 'UPDATE_FLYOUT', payload: { dataElement, flyout } })),
}));

const { default: AdditionalTabsFlyout } = require('./AdditionalTabsFlyout');

const createStore = () => configureStore({
  reducer: () => ({}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

describe('AdditionalTabsFlyout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates flyout items when the overflow tab list changes after resize', () => {
    const onClick = jest.fn();
    const store = createStore();
    const { rerender } = render(
      <Provider store={store}>
        <AdditionalTabsFlyout
          id="test-flyout"
          additionalTabs={[
            { name: 'Sheet 3', sheetIndex: 2 },
            { name: 'Sheet 4', sheetIndex: 3 },
            { name: 'Sheet 5', sheetIndex: 4 },
          ]}
          onClick={onClick}
          activeItem="Sheet 5"
        />
      </Provider>
    );

    actions.updateFlyout.mockClear();

    rerender(
      <Provider store={store}>
        <AdditionalTabsFlyout
          id="test-flyout"
          additionalTabs={[
            { name: 'Sheet 2', sheetIndex: 1 },
            { name: 'Sheet 3', sheetIndex: 2 },
            { name: 'Sheet 4', sheetIndex: 3 },
          ]}
          onClick={onClick}
          activeItem="Sheet 5"
        />
      </Provider>
    );

    expect(actions.updateFlyout).toHaveBeenCalledTimes(1);
    const [, flyout] = actions.updateFlyout.mock.calls[0];
    expect(flyout.items.map((item) => item.option)).toEqual(['Sheet 2', 'Sheet 3', 'Sheet 4']);
  });

  it('does not update the flyout when its inputs are unchanged', () => {
    const onClick = jest.fn();
    const additionalTabs = [
      { name: 'Sheet 3', sheetIndex: 2 },
      { name: 'Sheet 4', sheetIndex: 3 },
    ];
    const store = createStore();
    const { rerender } = render(
      <Provider store={store}>
        <AdditionalTabsFlyout
          id="test-flyout"
          additionalTabs={additionalTabs}
          onClick={onClick}
          activeItem="Sheet 1"
        />
      </Provider>
    );

    actions.updateFlyout.mockClear();

    rerender(
      <Provider store={store}>
        <AdditionalTabsFlyout
          id="test-flyout"
          additionalTabs={additionalTabs}
          onClick={onClick}
          activeItem="Sheet 1"
        />
      </Provider>
    );

    expect(actions.updateFlyout).not.toHaveBeenCalled();
  });
});
