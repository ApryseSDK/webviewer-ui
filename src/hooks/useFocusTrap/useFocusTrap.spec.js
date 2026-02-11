import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useFocusTrap from './useFocusTrap';

describe('useFocusTrap', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should blur target inside container when no focusable elements', () => {
    const { result } = renderHook(() => useFocusTrap(true));

    // Attach ref to container
    act(() => {
      result.current.current = container;
    });

    // Create a non-focusable element inside
    const divInside = document.createElement('div');
    container.appendChild(divInside);

    const blurSpy = jest.spyOn(divInside, 'blur');

    // Simulate focusin event
    act(() => {
      const event = new FocusEvent('focusin', {
        bubbles: true,
        target: divInside,
      });
      Object.defineProperty(event, 'target', { value: divInside });
      document.dispatchEvent(event);
    });

    expect(blurSpy).toHaveBeenCalled();
  });

  it('should NOT blur target outside container when no focusable elements', () => {
    const { result } = renderHook(() => useFocusTrap(true));

    act(() => {
      result.current.current = container;
    });

    // Create element OUTSIDE container
    const divOutside = document.createElement('div');
    document.body.appendChild(divOutside);

    const blurSpy = jest.spyOn(divOutside, 'blur');

    act(() => {
      const event = new FocusEvent('focusin', {
        bubbles: true,
        target: divOutside,
      });
      Object.defineProperty(event, 'target', { value: divOutside });
      document.dispatchEvent(event);
    });

    expect(blurSpy).not.toHaveBeenCalled();

    document.body.removeChild(divOutside);
  });
});
