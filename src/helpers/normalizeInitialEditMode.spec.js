import normalizeInitialEditMode from './normalizeInitialEditMode';

const VALID_MODES = ['editing', 'viewOnly'];
const FALLBACK = 'editing';

describe('normalizeInitialEditMode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the mode unchanged when it is valid', () => {
    expect(normalizeInitialEditMode('viewOnly', VALID_MODES, FALLBACK, FALLBACK)).toBe('viewOnly');
    expect(normalizeInitialEditMode('editing', VALID_MODES, FALLBACK, FALLBACK)).toBe('editing');
  });

  it('returns the fallback when mode is missing', () => {
    expect(normalizeInitialEditMode(null, VALID_MODES, FALLBACK, FALLBACK)).toBe(FALLBACK);
    expect(normalizeInitialEditMode(undefined, VALID_MODES, FALLBACK, FALLBACK)).toBe(FALLBACK);
    expect(normalizeInitialEditMode('', VALID_MODES, FALLBACK, FALLBACK)).toBe(FALLBACK);
  });

  it('returns the fallback and warns when mode is invalid', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = normalizeInitialEditMode('invalid-mode', VALID_MODES, FALLBACK, FALLBACK);

    expect(result).toBe(FALLBACK);
    expect(warnSpy).toHaveBeenCalledWith(
      'Invalid initialEditMode parameter: invalid-mode. Default to Editing mode.'
    );
  });
});
