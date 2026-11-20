import defineDeprecatedAlias from './defineDeprecatedAlias';

describe('defineDeprecatedAlias', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should return the value on every access', () => {
    const value = {};
    const target = {};
    defineDeprecatedAlias(target, 'Old', value, 'msg');
    expect(target.Old).toBe(value);
    expect(target.Old).toBe(value);
  });

  it('should warn on first access, and only once', () => {
    const target = {};
    defineDeprecatedAlias(target, 'Old', {}, 'msg');
    expect(warnSpy).not.toHaveBeenCalled();
    target.Old;
    target.Old;
    target.Old;
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('msg');
  });

  it('should not warn when the alias is never accessed', () => {
    defineDeprecatedAlias({}, 'Old', {}, 'msg');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should replace an existing data property, such as one copied by spread', () => {
    const value = {};
    const target = { ...{ Old: value } };
    defineDeprecatedAlias(target, 'Old', value, 'msg');
    expect(target.Old).toBe(value);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should keep separate states per target, as with multiple instances', () => {
    const a = {};
    const b = {};
    defineDeprecatedAlias(a, 'Old', 1, 'msg');
    defineDeprecatedAlias(b, 'Old', 1, 'msg');
    a.Old;
    expect(warnSpy).toHaveBeenCalledTimes(1);
    b.Old;
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});
