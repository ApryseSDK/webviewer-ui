import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useOnLinkAnnotationPopupOpen from './useOnLinkAnnotationPopupOpen';
import core from 'core';

jest.mock('core');

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

const scrollContainer = {
  scrollLeft: 100,
  scrollTop: 100,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

describe('useOnLinkAnnotationPopupOpen hook', () => {
  beforeAll(() => {
    core.addEventListener = jest.fn();
    core.getScrollViewElement = jest.fn();
    core.getScrollViewElement.mockReturnValue(scrollContainer);
    core.getAnnotationManager = jest.fn().mockReturnValue({
      getContentEditHistoryManager: jest.fn().mockReturnValue({
        getAnnotationsByMouseEvent: jest.fn(),
      }),
    });
  });

  it('adds event listeners on mouse move', () => {
    const { result } = renderHook(() => {
      return useOnLinkAnnotationPopupOpen();
    }, { wrapper });

    expect(result.error).toBeUndefined();
    expect(core.addEventListener).toBeCalledWith('mouseMove', expect.any(Function));
  });

  it('removes event listeners to mouse move when component is unmounted', () => {
    const { result, unmount } = renderHook(() => useOnLinkAnnotationPopupOpen(), { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('mouseMove', expect.any(Function));
  });
});
