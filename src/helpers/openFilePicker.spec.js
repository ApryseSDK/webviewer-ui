import openFilePicker from './openFilePicker';
import getRootNode, { getShadowRootFromNode } from 'helpers/getRootNode';

jest.mock('helpers/getRootNode', () => ({
  ...jest.requireActual('helpers/getRootNode'),
  __esModule: true,
  default: jest.fn(),
}));

describe('openFilePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('clicks the file-picker input found within the event target\'s own root when available', () => {
    const clickSpy = jest.fn();
    const ownRoot = {
      host: {},
      querySelector: jest.fn(() => ({ click: clickSpy })),
    };
    const eventTarget = {
      getRootNode: jest.fn(() => ownRoot),
    };
    const event = { currentTarget: eventTarget };

    openFilePicker(event);

    expect(ownRoot.querySelector).toHaveBeenCalledWith('#file-picker');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(getRootNode).not.toHaveBeenCalled();
  });

  it('falls back to event.target when event.currentTarget is not available', () => {
    const clickSpy = jest.fn();
    const ownRoot = {
      host: {},
      querySelector: jest.fn(() => ({ click: clickSpy })),
    };
    const eventTarget = {
      getRootNode: jest.fn(() => ownRoot),
    };
    const event = { target: eventTarget };

    openFilePicker(event);

    expect(ownRoot.querySelector).toHaveBeenCalledWith('#file-picker');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to event.target when currentTarget does not resolve to a shadow root', () => {
    const clickSpy = jest.fn();
    const ownRoot = {
      host: {},
      querySelector: jest.fn(() => ({ click: clickSpy })),
    };
    const event = {
      currentTarget: {
        getRootNode: jest.fn(() => document),
      },
      target: {
        getRootNode: jest.fn(() => ownRoot),
      },
    };

    openFilePicker(event);

    expect(ownRoot.querySelector).toHaveBeenCalledWith('#file-picker');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to the singleton getRootNode() when no event is provided (e.g. programmatic call)', () => {
    const clickSpy = jest.fn();
    getRootNode.mockReturnValue({
      querySelector: jest.fn(() => ({ click: clickSpy })),
    });

    openFilePicker();

    expect(getRootNode).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to the singleton getRootNode() when the event target has no usable root', () => {
    const clickSpy = jest.fn();
    getRootNode.mockReturnValue({
      querySelector: jest.fn(() => ({ click: clickSpy })),
    });
    const eventTarget = {}; // no getRootNode method
    const event = { currentTarget: eventTarget };

    openFilePicker(event);

    expect(getRootNode).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not throw when the file-picker input cannot be found', () => {
    const ownRoot = {
      host: {},
      querySelector: jest.fn(() => null),
    };
    const eventTarget = {
      getRootNode: jest.fn(() => ownRoot),
    };
    const event = { currentTarget: eventTarget };

    expect(() => openFilePicker(event)).not.toThrow();
  });

  it('does not throw when neither the event root nor getRootNode() resolve to a usable root', () => {
    getRootNode.mockReturnValue(undefined);

    expect(() => openFilePicker()).not.toThrow();
  });
});
