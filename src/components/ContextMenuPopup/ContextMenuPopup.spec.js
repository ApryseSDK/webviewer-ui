import React from 'react';
import { render, act } from '@testing-library/react';
import DataElements from 'constants/dataElement';
import ContextMenuPopup from './ContextMenuPopup';

jest.mock('helpers/officeEditor', () => ({
  ...jest.requireActual('helpers/officeEditor'),
  isOfficeEditorMode: () => true,
}));
const mockOfficeContextMenuRender = jest.fn();
jest.mock('./OfficeContextMenu', () => function MockOfficeContextMenu({ spellingErrorId, misspelledWord }) {
  mockOfficeContextMenuRender();
  return <div data-testid="office-context-menu" data-spelling-error-id={spellingErrorId} data-misspelled-word={misspelledWord} />;
});
jest.mock('actions', () => ({
  closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
  closeElements: jest.fn((elements) => ({ type: 'CLOSE_ELEMENTS', payload: elements })),
}));

const CONTAINER_BOX = { left: 0, top: 0, right: 1000, bottom: 500 };
const POPUP_WIDTH = 300;

let resizeObserverCallback;

const wrapper = withProviders(({ children }) => <>{children}</>, {
  viewer: {
    openElements: { [DataElements.CONTEXT_MENU_POPUP]: true },
  },
});

describe('ContextMenuPopup', () => {
  let documentContainer;
  let popupHeight;
  let getBoundingClientRectSpy;

  const renderPopup = (clickPosition, props = {}) => render(<ContextMenuPopup clickPosition={clickPosition} {...props} />, { wrapper });
  const getPopup = (container) => container.querySelector(`[data-element="${DataElements.CONTEXT_MENU_POPUP}"]`);

  beforeEach(() => {
    jest.clearAllMocks();
    popupHeight = 100;

    global.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        resizeObserverCallback = callback;
      }

      observe() {}

      disconnect() {}
    };

    documentContainer = document.createElement('div');
    documentContainer.className = 'DocumentContainer';
    documentContainer.getBoundingClientRect = () => CONTAINER_BOX;
    document.body.appendChild(documentContainer);

    getBoundingClientRectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect() {
      if (this.dataset.element === DataElements.CONTEXT_MENU_POPUP) {
        return { width: POPUP_WIDTH, height: popupHeight };
      }
      return { width: 0, height: 0 };
    });
  });

  afterEach(() => {
    getBoundingClientRectSpy.mockRestore();
    documentContainer.remove();
    delete global.ResizeObserver;
  });

  it('should keep the popup inside the document container when its content grows after opening', () => {
    const { container } = renderPopup({ left: 100, top: 350 });
    const popup = getPopup(container);
    expect(popup).toHaveStyle({ top: '350px' });

    // e.g. spell check suggestions finish loading and add rows to the menu
    popupHeight = 250;
    act(() => resizeObserverCallback());

    expect(parseFloat(getComputedStyle(popup).top) + popupHeight).toBeLessThanOrEqual(CONTAINER_BOX.bottom);
    expect(popup).toHaveStyle({ left: '100px' });
  });

  it('should pass the spelling error under the mouse to the office context menu', () => {
    // Id 0 is a valid spelling error id, so it must survive being passed down as a prop
    const { getByTestId } = renderPopup({ left: 100, top: 100 }, { spellingErrorId: 0, misspelledWord: 'wrold' });

    const officeContextMenu = getByTestId('office-context-menu');
    expect(officeContextMenu).toHaveAttribute('data-spelling-error-id', '0');
    expect(officeContextMenu).toHaveAttribute('data-misspelled-word', 'wrold');
  });

  it('should not re-render when the popup is resized without its position changing', () => {
    renderPopup({ left: 100, top: 100 });
    mockOfficeContextMenuRender.mockClear();

    act(() => resizeObserverCallback());

    expect(mockOfficeContextMenuRender).not.toHaveBeenCalled();
  });
});
