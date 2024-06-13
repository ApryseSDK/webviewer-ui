import { renderHook } from '@testing-library/react-hooks';
import useOnClickPrepareSoundAnnotation from './useOnClickPrepareSoundAnnotation';
import core from 'core';

jest.mock('core');

describe('useOnClickPrepareSoundAnnotation hook', () => {
  it('adds event listener to annotationSelected', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(function() {
      return useOnClickPrepareSoundAnnotation();
    });

    expect(result.error).toBeUndefined();
    expect(core.addEventListener).toBeCalledWith('annotationSelected', expect.any(Function));
  });

  it('removes event listener from annotationSelected when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(function() {
      return useOnClickPrepareSoundAnnotation();
    });

    expect(result.error).toBeUndefined();
    unmount();
    expect(core.removeEventListener).toBeCalledWith('annotationSelected', expect.any(Function));
  });
});