import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import actions from 'actions';

jest.mock('actions', () => ({
  addFlyout: jest.fn((flyout) => ({ type: 'ADD_FLYOUT', payload: flyout })),
  updateFlyout: jest.fn((dataElement, flyout) => ({ type: 'UPDATE_FLYOUT', payload: { dataElement, flyout } })),
}));

jest.mock('selectors', () => ({
  getFlyout: jest.fn(() => null),
  getStatusList: jest.fn(() => null),
}));

// Must import after mocks are set up
const selectors = require('selectors');
const NoteStateFlyout = require('./NoteStateFlyout').default;

function renderWithStatusList(statusList) {
  selectors.getFlyout.mockReturnValue(null);
  selectors.getStatusList.mockReturnValue(statusList);

  const store = configureStore({
    reducer: () => ({}),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  render(
    <Provider store={store}>
      <NoteStateFlyout noteId="test-123" />
    </Provider>
  );
}

describe('NoteStateFlyout', () => {
  beforeEach(() => {
    actions.addFlyout.mockClear();
    actions.updateFlyout.mockClear();
  });

  it('should include all 7 items when statusList is null', () => {
    renderWithStatusList(null);

    expect(actions.addFlyout).toHaveBeenCalledTimes(1);
    const flyout = actions.addFlyout.mock.calls[0][0];
    expect(flyout.items).toHaveLength(7);

    const options = flyout.items.map((item) => item.option);
    expect(options).toEqual([
      'Accepted', 'Rejected', 'Cancelled', 'Completed', 'None', 'Marked', 'Unmarked',
    ]);
  });

  it('should include no items when statusList is an empty array', () => {
    renderWithStatusList([]);

    expect(actions.addFlyout).toHaveBeenCalledTimes(1);
    const flyout = actions.addFlyout.mock.calls[0][0];
    expect(flyout.items).toHaveLength(0);
  });

  it('should filter items to only those in the statusList', () => {
    renderWithStatusList(['Accepted', 'Rejected']);

    expect(actions.addFlyout).toHaveBeenCalledTimes(1);
    const flyout = actions.addFlyout.mock.calls[0][0];
    expect(flyout.items).toHaveLength(2);

    const options = flyout.items.map((item) => item.option);
    expect(options).toEqual(['Accepted', 'Rejected']);
  });
});
