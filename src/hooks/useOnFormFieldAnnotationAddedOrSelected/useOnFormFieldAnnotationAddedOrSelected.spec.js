import { renderHook } from '@testing-library/react-hooks';
import useOnFormFieldAnnotationAddedOrSelected from './useOnFormFieldAnnotationAddedOrSelected';
import core from 'core';

jest.mock('core');

describe('useOnFormFieldAnnotationAddedOrSelected hook', () => {
  it('adds event listeners to Annotation Changed', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(function () {
      return useOnFormFieldAnnotationAddedOrSelected();
    });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('annotationChanged', expect.any(Function));
  });

  it('adds event listeners to Annotation Selected', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(function () {
      return useOnFormFieldAnnotationAddedOrSelected();
    });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('annotationSelected', expect.any(Function));
  });

  it('removes event listeners to Annotation Changed when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(function () {
      return useOnFormFieldAnnotationAddedOrSelected();
    });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('annotationChanged', expect.any(Function));
  });

  it('removes event listeners to Annotation Selected when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(function () {
      return useOnFormFieldAnnotationAddedOrSelected();
    });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('annotationSelected', expect.any(Function));
  });

})