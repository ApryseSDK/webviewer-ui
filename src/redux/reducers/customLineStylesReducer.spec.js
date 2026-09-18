import viewerReducer from './viewerReducer';

describe('custom line style reducer', () => {
  const initialState = {
    customLineStyles: { start: [], middle: [], end: [] },
  };
  const reducer = viewerReducer(initialState);

  it('registers and replaces a style by key within its section', () => {
    const originalStyle = { key: 'custom', section: 'middle', title: 'Original' };
    const replacementStyle = { key: 'custom', section: 'middle', title: 'Replacement' };

    const registeredState = reducer(initialState, {
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style: originalStyle },
    });
    const replacedState = reducer(registeredState, {
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style: replacementStyle },
    });

    expect(replacedState.customLineStyles.middle).toEqual([replacementStyle]);
  });

  it('unregisters a key from one section', () => {
    const state = {
      customLineStyles: {
        start: [{ key: 'custom' }],
        middle: [],
        end: [{ key: 'custom' }],
      },
    };

    const nextState = reducer(state, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom', section: 'start' },
    });

    expect(nextState.customLineStyles.start).toEqual([]);
    expect(nextState.customLineStyles.end).toEqual([{ key: 'custom' }]);
  });

  it('unregisters a key from every section when no section is provided', () => {
    const state = {
      customLineStyles: {
        start: [{ key: 'custom' }],
        middle: [{ key: 'custom' }],
        end: [{ key: 'custom' }],
      },
    };

    const nextState = reducer(state, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom' },
    });

    expect(nextState.customLineStyles).toEqual({ start: [], middle: [], end: [] });
  });

  it('ignores unsupported sections', () => {
    const nextState = reducer(initialState, {
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style: { key: 'custom', section: 'fill' } },
    });

    expect(nextState).toBe(initialState);
  });

  it('handles missing custom line style state', () => {
    const state = {};
    const registeredState = reducer(state, {
      type: 'REGISTER_CUSTOM_LINE_STYLE',
      payload: { style: { key: 'custom', section: 'start' } },
    });

    expect(registeredState.customLineStyles).toEqual({
      start: [{ key: 'custom', section: 'start' }],
      middle: [],
      end: [],
    });

    const unregisteredState = reducer(state, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom', section: 'start' },
    });

    expect(unregisteredState.customLineStyles).toEqual({ start: [], middle: [], end: [] });
  });

  it('ignores unsupported unregister sections', () => {
    const nextState = reducer(initialState, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom', section: 'fill' },
    });

    expect(nextState).toBe(initialState);
  });

  it('resets activeToolStyles line style properties when unregistered', () => {
    const stateWithStyles = {
      ...initialState,
      activeToolStyles: {
        StartLineStyle: 'custom-start',
        StrokeStyle: 'custom-middle,3,3',
        EndLineStyle: 'custom-end',
      },
    };

    const nextState = reducer(stateWithStyles, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom-middle', section: 'middle' },
    });

    expect(nextState.activeToolStyles.StrokeStyle).toBe('solid');
    expect(nextState.activeToolStyles.StartLineStyle).toBe('custom-start');
    expect(nextState.activeToolStyles.EndLineStyle).toBe('custom-end');

    const stateAllRemoved = reducer(nextState, {
      type: 'UNREGISTER_CUSTOM_LINE_STYLE',
      payload: { key: 'custom-start' },
    });

    expect(stateAllRemoved.activeToolStyles.StartLineStyle).toBe('None');
  });
});