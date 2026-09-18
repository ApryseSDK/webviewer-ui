import setSignatureModalColors from './setSignatureModalColors';
import actions from 'actions';

/* eslint-disable custom/no-hex-colors */

jest.mock('actions', () => ({
  setSignatureModalColors: jest.fn(),
}));

describe('UI.setSignatureModalColors API', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    actions.setSignatureModalColors.mockImplementation((colors) => ({
      type: 'SET_SIGNATURE_MODAL_COLORS',
      payload: { signatureModalColors: colors },
    }));
    store = { dispatch: jest.fn() };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    { colors: ['#000000'] },
    { colors: ['#000000', '#4E7DE9'] },
    { colors: ['#000000', '#4E7DE9', '#E44234'] },
  ])('sets a valid signature modal color collection: $colors', ({ colors }) => {
    setSignatureModalColors(store)(colors);

    expect(actions.setSignatureModalColors).toHaveBeenCalledWith(colors);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_SIGNATURE_MODAL_COLORS',
      payload: { signatureModalColors: colors },
    });
  });

  it.each([
    undefined,
    null,
    '#000000',
    [],
    ['#000000', '#4E7DE9', '#E44234', '#FFFFFF'],
  ])('rejects an invalid color collection: %p', (colors) => {
    setSignatureModalColors(store)(colors);

    expect(console.warn).toHaveBeenCalledWith(
      'UI.setSignatureModalColors: colors must be an array containing between one and three colors.'
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it.each([
    { colors: ['#FFF'] },
    { colors: ['red'] },
    { colors: ['transparency'] },
    { colors: ['#000000', 123] },
  ])('rejects invalid hexadecimal colors: $colors', ({ colors }) => {
    setSignatureModalColors(store)(colors);

    expect(console.warn).toHaveBeenCalledWith(
      'UI.setSignatureModalColors: each color must be a six-digit hexadecimal color string. For example, #4E7DE9.'
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
