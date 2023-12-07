import { renderHook } from '@testing-library/react-hooks';
import { useSelector, Provider } from 'react-redux';
import useFloatingHeaderSelectors from './useFloatingHeaderSelectors';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { RESIZE_BAR_WIDTH } from 'src/constants/panel';
// Mocking useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const floatEndBottomHeader = {
  dataElement: 'floatEndBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'end',
  items: [],
};

const floatStartBottomHeader = {
  dataElement: 'floatStartBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'start',
  items: [],
};

const floatStartTopHeader = {
  dataElement: 'topStartFloatingHeader',
  placement: 'top',
  float: true,
  position: 'start',
  items: [],
};

const floatEndTopHeader = {
  dataElement: 'topEndFloatingHeader',
  placement: 'top',
  float: true,
  position: 'end',
  items: [],
};

describe('useFloatingHeaderSelectors hook', () => {
  it('should return the correct values from the state', () => {
    const mockState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        openElements: {
          ...initialState.viewer.openElements,
          leftPanel: false,
          notesPanel: false,
          redactionPanel: true,
        },
        modularHeadersWidth: {
          rightHeader: 23,
          leftHeader: 48,
        },
        floatingContainersDimensions: {
          topFloatingContainerHeight: 36,
          bottomFloatingContainerHeight: 28,
        },
        modularHeaders: [
          floatEndBottomHeader,
          floatStartTopHeader,
          floatEndTopHeader,
          floatStartBottomHeader,
        ],
      }
    };

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: mockState,
    });

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useFloatingHeaderSelectors(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.isLeftPanelOpen).toBeFalsy();
    expect(result.current.isRightPanelOpen).toBe(true);
    expect(result.current.leftPanelWidth).toBe(mockState.viewer.panelWidths.leftPanel + RESIZE_BAR_WIDTH);
    expect(result.current.rightPanelWidth).toBe(mockState.viewer.panelWidths.redactionPanel);
    expect(result.current.leftHeaderWidth).toBe(0);
    expect(result.current.rightHeaderWidth).toBe(0);
    expect(result.current.topHeadersHeight).toBe(0);
    expect(result.current.bottomHeadersHeight).toBe(0);
    expect(result.current.topFloatingContainerHeight).toBe(mockState.viewer.floatingContainersDimensions.topFloatingContainerHeight);
    expect(result.current.bottomFloatingContainerHeight).toBe(mockState.viewer.floatingContainersDimensions.bottomFloatingContainerHeight);
    expect(result.current.topStartFloatingHeaders).toEqual([floatStartTopHeader]);
    expect(result.current.bottomStartFloatingHeaders).toEqual([floatStartBottomHeader]);
    expect(result.current.bottomEndFloatingHeaders).toEqual([floatEndBottomHeader]);
    expect(result.current.topEndFloatingHeaders).toEqual([floatEndTopHeader]);
  });
});
