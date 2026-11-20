import applyDeprecatedCoreAliases from './applyDeprecatedCoreAliases';

describe('applyDeprecatedCoreAliases', () => {
  let warnSpy;
  const ContentEditSession = class {};

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  const buildInstanceCore = () => {
    // Mirrors apis/index.js: window.Core is spread, with ContentBoxEditor as a plain value.
    const Core = { ContentEditSession, ContentBoxEditor: ContentEditSession };
    const instanceCore = { ...Core };
    applyDeprecatedCoreAliases(instanceCore, Core);
    return instanceCore;
  };

  it('does not warn when applied', () => {
    buildInstanceCore();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('resolves ContentBoxEditor to ContentEditSession', () => {
    expect(buildInstanceCore().ContentBoxEditor).toBe(ContentEditSession);
  });

  it('warns once on the first ContentBoxEditor access', () => {
    const instanceCore = buildInstanceCore();
    instanceCore.ContentBoxEditor;
    instanceCore.ContentBoxEditor;
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('Core.ContentBoxEditor is deprecated. Use Core.ContentEditSession instead.');
  });

  it('does not warn when spreading the instance Core again', () => {
    const instanceCore = buildInstanceCore();
    const copy = { ...instanceCore };
    expect(copy.ContentBoxEditor).toBe(ContentEditSession);
    // The spread reads the getter, which is the first access.
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps separate warning state per instance', () => {
    const a = buildInstanceCore();
    const b = buildInstanceCore();
    a.ContentBoxEditor;
    b.ContentBoxEditor;
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});
