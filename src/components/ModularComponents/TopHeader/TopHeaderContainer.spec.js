import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import useResizeObserver from 'hooks/useResizeObserver';
import TopHeaderContainer from './TopHeaderContainer';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('hooks/useResizeObserver');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
jest.mock('../ModularHeader', () => () => null);
jest.mock('../FloatingHeader', () => {
  const React = require('react');
  return React.forwardRef(function FloatingHeaderMock() {
    return null;
  });
});

describe('TopHeaderContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation((selector) => selector());
    selectors.getTopHeaders = jest.fn(() => [{ dataElement: 'floating', float: true }]);
    useResizeObserver.mockReturnValue([jest.fn(), { height: 100, width: 200 }]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should not dispatch a pending size update after unmounting', () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    const { unmount } = render(<TopHeaderContainer />);

    unmount();
    jest.advanceTimersByTime(200);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
