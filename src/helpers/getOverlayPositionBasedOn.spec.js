import getOverlayPositionBasedOn from './getOverlayPositionBasedOn';
import getRootNode from 'helpers/getRootNode';

jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('getOverlayPositionBasedOn', () => {
  const originalIsWebComponent = window.isApryseWebViewerWebComponent;
  const overlayRef = {
    current: {
      getBoundingClientRect: jest.fn(() => ({
        width: 50,
        height: 40,
      })),
    },
  };

  beforeEach(() => {
    window.isApryseWebViewerWebComponent = true;
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.isApryseWebViewerWebComponent = originalIsWebComponent;
  });

  it('uses the provided root override instead of the singleton root in WebComponent mode', () => {
    const singletonButton = {
      getBoundingClientRect: jest.fn(() => ({
        bottom: 300,
        left: 400,
      })),
    };
    const singletonRoot = {
      host: {
        clientWidth: 900,
        clientHeight: 700,
        getBoundingClientRect: jest.fn(() => ({
          left: 100,
          top: 50,
        })),
      },
      querySelector: jest.fn(() => singletonButton),
    };
    const ownButton = {
      getBoundingClientRect: jest.fn(() => ({
        bottom: 90,
        left: 70,
      })),
    };
    const ownRoot = {
      host: {
        clientWidth: 500,
        clientHeight: 400,
        getBoundingClientRect: jest.fn(() => ({
          left: 20,
          top: 10,
        })),
      },
      querySelector: jest.fn(() => ownButton),
    };
    getRootNode.mockReturnValue(singletonRoot);

    const position = getOverlayPositionBasedOn('trigger', overlayRef, false, ownRoot);

    expect(position).toEqual({
      left: 50,
      right: 'auto',
      top: 86,
    });
    expect(ownRoot.querySelector).toHaveBeenCalledWith('[data-element="trigger"]');
    expect(singletonRoot.querySelector).not.toHaveBeenCalled();
  });
});
