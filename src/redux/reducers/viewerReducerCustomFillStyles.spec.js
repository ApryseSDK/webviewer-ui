import viewerReducer from 'reducers/viewerReducer';
import selectors from 'selectors';

describe('viewerReducer custom fill styles', () => {
  let reducer;
  let state;

  const reduce = (action) => {
    state = reducer(state, action);
  };
  const register = (style) => reduce({ type: 'REGISTER_CUSTOM_FILL_STYLE', payload: { style } });
  const unregister = (key) => reduce({ type: 'UNREGISTER_CUSTOM_FILL_STYLE', payload: { key } });
  const fillStyles = () => selectors.getCustomFillStyles({ viewer: state });

  beforeEach(() => {
    reducer = viewerReducer({ customFillStyles: [] });
    state = reducer(undefined, { type: '@@INIT' });
  });

  it('starts with no registered fill styles', () => {
    expect(fillStyles()).toEqual([]);
  });

  it('registers fill styles in registration order', () => {
    register({ key: 'hatch', title: 'Hatch' });
    register({ key: 'cross', title: 'Cross' });

    expect(fillStyles().map((s) => s.key)).toEqual(['hatch', 'cross']);
  });

  it('replaces an existing entry instead of duplicating it when the key collides', () => {
    register({ key: 'hatch', title: 'Hatch' });
    register({ key: 'hatch', title: 'Updated Hatch' });

    expect(fillStyles()).toEqual([{ key: 'hatch', title: 'Updated Hatch' }]);
  });

  it('ignores a registration without a key', () => {
    register({ title: 'No Key' });

    expect(fillStyles()).toEqual([]);
  });

  it('ignores a malformed registration action without a style', () => {
    expect(() => reduce({ type: 'REGISTER_CUSTOM_FILL_STYLE', payload: {} })).not.toThrow();
    expect(fillStyles()).toEqual([]);
  });

  it('removes only the unregistered key', () => {
    register({ key: 'hatch' });
    register({ key: 'cross' });

    unregister('hatch');

    expect(fillStyles().map((s) => s.key)).toEqual(['cross']);
  });

  it('is a no-op when unregistering a key that was never registered', () => {
    register({ key: 'hatch' });
    unregister('nonexistent');

    expect(fillStyles().map((s) => s.key)).toEqual(['hatch']);
  });

  it('resets activeToolStyles.FillStyle when the active fill style is unregistered', () => {
    state = { ...state, activeToolStyles: { FillStyle: 'hatch', StrokeThickness: 2 } };
    register({ key: 'hatch' });

    unregister('hatch');

    expect(state.activeToolStyles.FillStyle).toBe('');
    expect(state.activeToolStyles.StrokeThickness).toBe(2);
  });
});
