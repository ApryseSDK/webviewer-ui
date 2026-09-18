import { registerCustomFillStyle, unregisterCustomFillStyle } from './registerCustomFillStyle';
import actions from 'actions';
import { registerFillDrawHandler, unregisterFillDrawHandler } from 'helpers/customFillStyleManager';

jest.mock('actions', () => ({
  registerCustomFillStyle: jest.fn((style) => ({ type: 'REGISTER_CUSTOM_FILL_STYLE', payload: { style } })),
  unregisterCustomFillStyle: jest.fn((key) => ({ type: 'UNREGISTER_CUSTOM_FILL_STYLE', payload: { key } })),
}));

jest.mock('helpers/customFillStyleManager', () => ({
  registerFillDrawHandler: jest.fn(),
  unregisterFillDrawHandler: jest.fn(),
}));

const createStore = (customFillStyles = []) => ({
  dispatch: jest.fn(),
  getState: () => ({ viewer: { customFillStyles } }),
});

describe('UI.registerCustomFillStyle API', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createStore();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers a fill style and wires its draw handler', () => {
    const drawHandler = jest.fn();

    registerCustomFillStyle(store)({
      key: 'fill-hatch',
      appliesTo: ['all'],
      title: 'Hatch Fill',
      svg: '<svg></svg>',
      drawHandler,
    });

    expect(actions.registerCustomFillStyle).toHaveBeenCalledWith({
      key: 'fill-hatch',
      title: 'Hatch Fill',
      svg: '<svg></svg>',
      appliesTo: ['all'],
    });
    expect(store.dispatch).toHaveBeenCalled();
    expect(registerFillDrawHandler).toHaveBeenCalledWith('fill-hatch', drawHandler, ['all'], undefined, false);
  });

  it('uses the built-in clip when the custom clip toggle is disabled', () => {
    const drawHandler = jest.fn();

    registerCustomFillStyle(store)({
      key: 'unclipped',
      appliesTo: ['all'],
      clipToShape: false,
      drawHandler,
    });

    expect(registerFillDrawHandler).toHaveBeenCalledWith('unclipped', drawHandler, ['all'], undefined, false);
  });

  it('accepts a custom clipping function', () => {
    const drawHandler = jest.fn();
    const clipToShapeFn = jest.fn();

    registerCustomFillStyle(store)({
      key: 'custom-clip',
      appliesTo: ['all'],
      clipToShape: true,
      clipToShapeFn,
      drawHandler,
    });

    expect(registerFillDrawHandler).toHaveBeenCalledWith('custom-clip', drawHandler, ['all'], clipToShapeFn, true);
  });

  it.each([
    ['no options', undefined],
    ['a non-object', 'fill-hatch'],
    ['a missing key', {}],
    ['a blank key', { key: '  ' }],
    ['a non-string key', { key: 42 }],
    ['the reserved solid key', { key: 'solid', drawHandler: jest.fn() }],
    ['an empty appliesTo', { key: 'k', appliesTo: [] }],
    ['a non-array appliesTo', { key: 'k', appliesTo: 'all' }],
    ['an unsupported appliesTo value', { key: 'k', appliesTo: ['line'] }],
    ['a non-string title', { key: 'k', title: 1 }],
    ['a non-string svg', { key: 'k', svg: 1 }],
    ['a missing drawHandler', { key: 'k' }],
    ['a non-function drawHandler', { key: 'k', drawHandler: 'nope' }],
    ['a non-boolean clipToShape', { key: 'k', clipToShape: 'nope' }],
    ['a non-function clipToShapeFn', { key: 'k', clipToShapeFn: 'nope' }],
    ['a custom clip toggle without a function', { key: 'k', clipToShape: true }],
  ])('rejects %s', (_label, options) => {
    registerCustomFillStyle(store)(options);

    expect(console.warn).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerFillDrawHandler).not.toHaveBeenCalled();
  });

  it('replaces an already registered key without warning', () => {
    store = createStore([{ key: 'fill-hatch' }]);

    registerCustomFillStyle(store)({ key: 'fill-hatch', drawHandler: jest.fn() });

    expect(console.warn).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('UI.unregisterCustomFillStyle API', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createStore([{ key: 'fill-hatch' }]);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('unregisters the style and its draw handler', () => {
    unregisterCustomFillStyle(store)('fill-hatch');

    expect(actions.unregisterCustomFillStyle).toHaveBeenCalledWith('fill-hatch');
    expect(store.dispatch).toHaveBeenCalled();
    expect(unregisterFillDrawHandler).toHaveBeenCalledWith('fill-hatch');
  });

  it.each([undefined, null, '', '  ', 5])('rejects an invalid key: %p', (key) => {
    unregisterCustomFillStyle(store)(key);

    expect(console.warn).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(unregisterFillDrawHandler).not.toHaveBeenCalled();
  });
});
