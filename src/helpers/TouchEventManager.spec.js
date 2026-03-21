import defaultTouchEventManager, { createTouchEventManager } from './TouchEventManager';

jest.mock('core');
jest.mock('./localStorageManager', () => ({
  getItemSynchronous: jest.fn(() => null),
}));

function makeContainer(overrides = {}) {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    scrollLeft: 0,
    scrollTop: 0,
    clientWidth: 800,
    clientHeight: 600,
    ...overrides,
  };
}

function makeDocument(overrides = {}) {
  return {
    offsetLeft: 0,
    offsetTop: 0,
    clientWidth: 400,
    clientHeight: 500,
    style: {},
    ...overrides,
  };
}

describe('createTouchEventManager', () => {
  it('returns an object with initialize and terminate methods', () => {
    const manager = createTouchEventManager();
    expect(typeof manager.initialize).toBe('function');
    expect(typeof manager.terminate).toBe('function');
  });

  it('creates a new independent object each call', () => {
    const m1 = createTouchEventManager();
    const m2 = createTouchEventManager();
    expect(m1).not.toBe(m2);
  });

  it('two instances do not share mutable state after initialize', () => {
    const m1 = createTouchEventManager();
    const m2 = createTouchEventManager();

    m1.initialize(makeDocument(), makeContainer(), 1);
    m2.initialize(makeDocument(), makeContainer(), 2);

    expect(m1.documentViewerKey).toBe(1);
    expect(m2.documentViewerKey).toBe(2);

    m1.documentViewerKey = 99;
    expect(m2.documentViewerKey).toBe(2);
  });

  it('default export and createTouchEventManager instances are independent', () => {
    const created = createTouchEventManager();
    created.initialize(makeDocument(), makeContainer(), 3);
    expect(defaultTouchEventManager).not.toBe(created);
  });
});