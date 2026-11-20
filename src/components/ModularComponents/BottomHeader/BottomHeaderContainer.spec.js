import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import useResizeObserver from 'hooks/useResizeObserver';
import BottomHeaderContainer from './BottomHeaderContainer';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('hooks/useResizeObserver');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
jest.mock('components/ModularComponents/ModularHeader', () => () => null);
jest.mock('../FloatingHeader', () => {
  const React = require('react');
  return React.forwardRef(function FloatingHeaderMock() {
    return null;
  });
});
jest.mock('components/LazyLoadWrapper', () => ({
  __esModule: true,
  default: () => null,
  LazyLoadComponents: { SpreadsheetSwitcher: 'SpreadsheetSwitcher' },
}));

describe('BottomHeaderContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation((selector) => selector());
    selectors.getBottomHeaders = jest.fn(() => [{ dataElement: 'floating', float: true }]);
    selectors.isSpreadsheetEditorModeEnabled = jest.fn(() => false);
    useResizeObserver.mockReturnValue([jest.fn(), { height: 100, width: 200 }]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should not dispatch pending size updates after unmounting', () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    const { unmount } = render(<BottomHeaderContainer />);

    unmount();
    jest.advanceTimersByTime(200);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
