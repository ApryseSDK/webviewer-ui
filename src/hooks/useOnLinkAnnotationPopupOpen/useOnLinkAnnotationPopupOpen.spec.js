import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useOnLinkAnnotationPopupOpen from './useOnLinkAnnotationPopupOpen';
import core from 'core';
import DataElements from 'constants/dataElement';

jest.mock('core');

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

const scrollContainer = {
  scrollLeft: 100,
  scrollTop: 100,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const getAnnotationsByMouseEvent = jest.fn();

const getLatestMouseMoveHandler = () => {
  const mouseMoveCalls = core.addEventListener.mock.calls.filter(([eventName]) => eventName === 'mouseMove');
  return mouseMoveCalls[mouseMoveCalls.length - 1][1];
};

describe('useOnLinkAnnotationPopupOpen hook', () => {
  beforeAll(() => {
    core.addEventListener = jest.fn();
    core.getScrollViewElement = jest.fn();
    core.getScrollViewElement.mockReturnValue(scrollContainer);
    core.getAnnotationManager = jest.fn().mockReturnValue({
      getAnnotationsByMouseEvent,
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

  it('keeps the popup open and ignores the underlying link when the cursor is over the popup', () => {
    getAnnotationsByMouseEvent.mockClear();
    getAnnotationsByMouseEvent.mockReturnValue([]);

    renderHook(() => useOnLinkAnnotationPopupOpen(), { wrapper });
    const onMouseHover = getLatestMouseMoveHandler();

    const closest = jest.fn().mockReturnValue({});
    onMouseHover({ buttons: 0, target: { closest } });

    expect(closest).toBeCalledWith(`[data-element="${DataElements.LINK_ANNOTATION_POPUP}"]`);
    // Detecting the link under the popup would switch the popup to it, so it must be skipped.
    expect(getAnnotationsByMouseEvent).not.toBeCalled();
  });

  it('detects the underlying link when the cursor is not over the popup', () => {
    getAnnotationsByMouseEvent.mockClear();
    getAnnotationsByMouseEvent.mockReturnValue([]);

    renderHook(() => useOnLinkAnnotationPopupOpen(), { wrapper });
    const onMouseHover = getLatestMouseMoveHandler();

    const event = { buttons: 0, target: { closest: jest.fn().mockReturnValue(null) } };
    onMouseHover(event);

    expect(getAnnotationsByMouseEvent).toBeCalledWith(event, true);
  });

  it('keeps the popup open while the cursor crosses the gap between the link and the popup', () => {
    getAnnotationsByMouseEvent.mockClear();
    getAnnotationsByMouseEvent.mockReturnValue([]);

    const openPopup = document.createElement('div');
    openPopup.setAttribute('data-element', 'linkAnnotationPopup');
    openPopup.classList.add('open');
    openPopup.getBoundingClientRect = () => ({ left: 100, right: 200, top: 100, bottom: 130 });
    document.body.appendChild(openPopup);

    const wrapperWithPopupOpen = withProviders(MockComponent, { viewer: { openElements: { linkAnnotationPopup: true } } });

    try {
      renderHook(() => useOnLinkAnnotationPopupOpen(), { wrapper: wrapperWithPopupOpen });
      const onMouseHover = getLatestMouseMoveHandler();

      // Cursor is in the gap just above the popup, not over any DOM node of the popup.
      onMouseHover({ buttons: 0, target: { closest: jest.fn().mockReturnValue(null) }, clientX: 150, clientY: 95 });

      expect(getAnnotationsByMouseEvent).not.toBeCalled();
    } finally {
      openPopup.remove();
    }
  });
});
