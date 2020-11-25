import getRichTextPopupPosition from './getRichTextPopupPosition';
import { calcPopupLeft, calcPopupTop } from 'helpers/getPopupPosition';
import core from 'core';

jest.mock('core');

jest.mock('helpers/getPopupPosition', () => {
  return {
    calcPopupLeft: jest.fn(),
    calcPopupTop: jest.fn(),
  };
});

describe('getRichTextPopupPosition', () => {
  let origQuerySelector;
  beforeAll(() => {
    origQuerySelector = document.querySelector;
  });
  afterEach(() => {
    document.querySelector = origQuerySelector;
  });

  it('Should calculate the position correctly', () => {
    const zoom = 1.5;
    const annot = {
      PageNumber: 1,
      Id: 'asdf',
      StrokeThickness: 1,
    };
    const popup = {
      current: {
        getBoundingClientRect: jest.fn(),
      },
    };
    const scrollContainer = {
      scrollLeft: 100,
      scrollTop: 100,
    };
    const cBox = {
      left: 0,
      top: 0,
      right: 1280,
      bottom: 720,
    };
    const pBox = {};
    const padding = 2 * parseFloat(annot.StrokeThickness) * zoom;
    const cInfo = {
      topLeft: {
        x: cBox.left + scrollContainer.scrollLeft - padding,
        y: cBox.top + scrollContainer.scrollTop - padding,
      },
      bottomRight: {
        x: cBox.right + scrollContainer.scrollLeft + padding,
        y: cBox.bottom + scrollContainer.scrollTop + padding,
      },
    };

    document.querySelector = jest.fn();
    document.querySelector.mockReturnValue({
      getBoundingClientRect: () => cBox,
    });
    core.getScrollViewElement = jest.fn();
    core.getScrollViewElement.mockReturnValue(scrollContainer);
    core.getZoom = jest.fn();
    core.getZoom.mockReturnValue(zoom);
    popup.current.getBoundingClientRect.mockReturnValue(pBox);

    expect(document.querySelector).toHaveBeenCalledWith(`#pageWidgetContainer${annot.PageNumber} [id="freetext-editor-${annot.Id}"]`);
    expect(popup.current.getBoundingClientRect).toHaveBeenCalled();
    expect(calcPopupLeft).toHaveBeenCalledWith(cInfo, pBox);
    expect(calcPopupTop).toHaveBeenCalledWith(cInfo, pBox);
  });

  it('If popup is not mounted, function should return undefined', () => {
    const result = getRichTextPopupPosition();
    expect(result).toBeUndefined();
  });
});
