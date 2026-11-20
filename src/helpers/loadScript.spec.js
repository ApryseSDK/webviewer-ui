import loadScript from './loadScript';

describe('loadScript', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should report a successful script load', async () => {
    const appendChild = jest.spyOn(document.head, 'appendChild').mockImplementation(() => undefined);
    const loadPromise = loadScript('/loaded.js');
    const script = appendChild.mock.calls[0][0];

    script.onload();

    await expect(loadPromise).resolves.toBe(true);
  });

  it('should report a failed script load', async () => {
    const appendChild = jest.spyOn(document.head, 'appendChild').mockImplementation(() => undefined);
    const loadPromise = loadScript('/missing.js');
    const script = appendChild.mock.calls[0][0];

    script.onerror();

    await expect(loadPromise).resolves.toBe(false);
  });
});
