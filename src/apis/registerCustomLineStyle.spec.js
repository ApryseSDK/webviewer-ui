import actions from 'actions';
import { registerCustomLineStyle, unregisterCustomLineStyle } from './registerCustomLineStyle';
import {
  registerCustomLineStyle as registerLineStyleWithManager,
  unregisterCustomLineStyle as unregisterLineStyleWithManager,
} from 'helpers/customLineStyleManager';

jest.mock('actions', () => ({
  registerCustomLineStyle: jest.fn((style) => ({ type: 'REGISTER_CUSTOM_LINE_STYLE', payload: { style } })),
  unregisterCustomLineStyle: jest.fn((key, section) => ({ type: 'UNREGISTER_CUSTOM_LINE_STYLE', payload: { key, section } })),
}));

jest.mock('helpers/customLineStyleManager', () => ({
  registerCustomLineStyle: jest.fn(),
  unregisterCustomLineStyle: jest.fn(),
}));

describe('custom line style APIs', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    actions.registerCustomLineStyle.mockImplementation((style) => ({
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style },
    }));
    actions.unregisterCustomLineStyle.mockImplementation((key, section) => ({
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key, section },
    }));
    store = { dispatch: jest.fn() };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the UI option and runtime line style', () => {
    const drawHandler = jest.fn();
    const options = {
      key: 'double-dash',
      section: 'middle',
      title: 'Double Dash',
      svg: '<svg></svg>',
      drawHandler,
    };

    registerCustomLineStyle(store)(options);

    const registeredOption = {
      key: options.key,
      section: options.section,
      title: options.title,
      svg: options.svg,
      appliesTo: ['line', 'arrow', 'polyline'],
    };
    expect(actions.registerCustomLineStyle).toHaveBeenCalledWith(registeredOption);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style: registeredOption },
    });
    expect(registerLineStyleWithManager).toHaveBeenCalledWith({
      key: options.key,
      section: options.section,
      appliesTo: ['line', 'arrow', 'polyline'],
      drawHandler,
    });
  });

  it('forwards an explicit appliesTo list', () => {
    const drawHandler = jest.fn();

    registerCustomLineStyle(store)({ key: 'custom', section: 'end', drawHandler, appliesTo: ['arrow'] });

    expect(actions.registerCustomLineStyle).toHaveBeenCalledWith(expect.objectContaining({ appliesTo: ['arrow'] }));
    expect(registerLineStyleWithManager).toHaveBeenCalledWith(expect.objectContaining({ appliesTo: ['arrow'] }));
  });

  it('expands all appliesTo targets', () => {
    const drawHandler = jest.fn();

    registerCustomLineStyle(store)({ key: 'custom', section: 'end', drawHandler, appliesTo: ['all'] });

    expect(actions.registerCustomLineStyle).toHaveBeenCalledWith(expect.objectContaining({
      appliesTo: ['line', 'arrow', 'polyline'],
    }));
    expect(registerLineStyleWithManager).toHaveBeenCalledWith(expect.objectContaining({
      appliesTo: ['line', 'arrow', 'polyline'],
    }));
  });

  it.each([[[]], [['circle']], ['arrow']])('rejects an unsupported appliesTo: %p', (appliesTo) => {
    registerCustomLineStyle(store)({ key: 'custom', section: 'end', drawHandler: jest.fn(), appliesTo });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it('defaults an omitted section to middle', () => {
    const drawHandler = jest.fn();

    registerCustomLineStyle(store)({ key: 'custom', drawHandler });

    expect(actions.registerCustomLineStyle).toHaveBeenCalledWith(expect.objectContaining({ section: 'middle' }));
    expect(registerLineStyleWithManager).toHaveBeenCalledWith(expect.objectContaining({ section: 'middle', drawHandler }));
  });

  it('rejects an unsupported section', () => {
    const section = 'fill';

    registerCustomLineStyle(store)({ key: 'custom', section });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it('rejects a missing key', () => {
    registerCustomLineStyle(store)({ section: 'start', drawHandler: jest.fn() });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it.each([
    ['start', 'OpenArrow'],
    ['middle', 'solid'],
    ['middle', 'cloudy'],
    ['end', 'None'],
  ])('rejects the built-in %s key %s', (section, key) => {
    registerCustomLineStyle(store)({ key, section, drawHandler: jest.fn() });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it('rejects a missing draw handler', () => {
    registerCustomLineStyle(store)({ key: 'custom-start', section: 'start' });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it.each([-1, Number.NaN, '12'])('rejects invalid endpoint padding: %p', (padding) => {
    registerCustomLineStyle(store)({
      key: 'custom-start',
      section: 'start',
      drawHandler: jest.fn(),
      padding,
    });

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(registerLineStyleWithManager).not.toHaveBeenCalled();
  });

  it('passes configured endpoint padding to the manager', () => {
    const padding = jest.fn(() => 16);
    const drawHandler = jest.fn();

    registerCustomLineStyle(store)({ key: 'custom-end', section: 'end', drawHandler, padding });

    expect(registerLineStyleWithManager).toHaveBeenCalledWith(expect.objectContaining({
      key: 'custom-end',
      section: 'end',
      drawHandler,
      padding,
    }));
  });

  it('accepts padding for middle styles', () => {
    const drawHandler = jest.fn();

    registerCustomLineStyle(store)({
      key: 'custom-middle',
      section: 'middle',
      drawHandler,
      padding: 12,
    });

    expect(registerLineStyleWithManager).toHaveBeenCalledWith(expect.objectContaining({
      key: 'custom-middle',
      section: 'middle',
      drawHandler,
      padding: 12,
    }));
  });

  it('allows replacing a custom key', () => {
    const options = {
      key: 'custom',
      section: 'middle',
      drawHandler: jest.fn(),
    };

    registerCustomLineStyle(store)(options);
    registerCustomLineStyle(store)({ ...options, title: 'Replacement' });

    expect(actions.registerCustomLineStyle).toHaveBeenLastCalledWith(expect.objectContaining({
      key: 'custom',
      section: 'middle',
      title: 'Replacement',
    }));
    expect(registerLineStyleWithManager).toHaveBeenCalledTimes(2);
  });

  it('unregisters a key from the requested section', () => {
    unregisterCustomLineStyle(store)('custom', 'end');

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom', section: 'end' },
    });
    expect(unregisterLineStyleWithManager).toHaveBeenCalledWith('custom', 'end');
  });

  it('rejects an unsupported unregister section', () => {
    unregisterCustomLineStyle(store)('custom', 'fill');

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(unregisterLineStyleWithManager).not.toHaveBeenCalled();
  });
});