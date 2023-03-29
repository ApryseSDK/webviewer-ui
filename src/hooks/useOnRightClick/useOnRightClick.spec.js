import { renderHook } from '@testing-library/react-hooks';
import useOnRightClick from './useOnRightClick';
import core from 'core';

jest.mock('core');

describe('useOnRightClick hook', () => {
  it('adds event listeners to longTap on mobile', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(() => useOnRightClick());

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('longTap', expect.any(Function));
  });

  it('removes event listeners to longTap when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(() => useOnRightClick());

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('longTap', expect.any(Function));
  });
});