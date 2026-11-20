import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useInstanceDebouncedCallback from './useInstanceDebouncedCallback';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { getCurrentInstanceId, setCurrentInstanceId, resetInstances } from 'core/documentViewers';

const renderInInstance = (instanceId, initialProps) => renderHook(
  ({ callback }) => useInstanceDebouncedCallback(callback, 100),
  {
    initialProps,
    wrapper: ({ children }) => <InstanceIdContext.Provider value={instanceId}>{children}</InstanceIdContext.Provider>,
  },
);

describe('useInstanceDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    resetInstances();
  });

  it('should keep its pending call across re-renders and run the latest callback once', () => {
    const first = jest.fn();
    const latest = jest.fn();
    const { result, rerender } = renderInInstance(2, { callback: first });

    result.current('a');
    rerender({ callback: latest });
    result.current('b');
    jest.advanceTimersByTime(100);

    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
    expect(latest).toHaveBeenCalledWith('b');
  });

  it('should run against its own instance when another instance is ambient as the timer fires', () => {
    let instanceAtCall;
    const { result } = renderInInstance(2, { callback: () => (instanceAtCall = getCurrentInstanceId()) });

    result.current();
    setCurrentInstanceId(1);
    jest.advanceTimersByTime(100);

    expect(instanceAtCall).toBe(2);
  });

  it('should drop a pending call when the component unmounts', () => {
    const callback = jest.fn();
    const { result, unmount } = renderInInstance(2, { callback });

    result.current();
    unmount();
    jest.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });
});
