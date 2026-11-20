let mockHost;

jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: () => ({ host: mockHost }),
}));

describe('device size in web component mode', () => {
  let isMobileSize;
  let isDesktopSize;
  let isMobile;

  beforeEach(() => {
    mockHost = { clientWidth: 0 };
    window.isApryseWebViewerWebComponent = true;
    jest.isolateModules(() => {
      ({ isMobileSize, isDesktopSize } = require('./getDeviceSize'));
      ({ isMobile } = require('./device'));
    });
  });

  afterEach(() => {
    delete window.isApryseWebViewerWebComponent;
  });

  it('reports desktop size when the host is wide', () => {
    mockHost.clientWidth = 1200;

    expect(isMobileSize()).toBe(false);
    expect(isDesktopSize()).toBe(true);
  });

  it('reports mobile size when the host is narrow', () => {
    mockHost.clientWidth = 400;

    expect(isMobileSize()).toBe(true);
    expect(isMobile()).toBe(true);
  });

  it('keeps the last measured size when the host reports zero width, e.g. while hidden for printing', () => {
    mockHost.clientWidth = 1200;
    // Record a real width before the host becomes hidden
    isMobileSize();

    mockHost.clientWidth = 0;

    expect(isMobileSize()).toBe(false);
    expect(isDesktopSize()).toBe(true);
    expect(isMobile()).toBe(false);
  });

  it('keeps each viewer\'s own last measured size when multiple hosts report zero width', () => {
    const desktopHost = { clientWidth: 1200 };
    const mobileHost = { clientWidth: 400 };
    mockHost = desktopHost;
    isMobileSize();
    mockHost = mobileHost;
    isMobileSize();

    desktopHost.clientWidth = 0;
    mobileHost.clientWidth = 0;

    mockHost = desktopHost;
    expect(isMobileSize()).toBe(false);
    mockHost = mobileHost;
    expect(isMobileSize()).toBe(true);
  });

  it('does not use another viewer\'s width for a host that was never measured', () => {
    mockHost = { clientWidth: 1200 };
    isMobileSize();

    mockHost = { clientWidth: 0 };

    expect(isDesktopSize()).toBe(false);
  });

  it('measures the host of the given instance root instead of the most recently registered viewer', () => {
    mockHost = { clientWidth: 1200 };
    const instanceRoot = { host: { clientWidth: 400 } };

    expect(isMobileSize(instanceRoot)).toBe(true);
    expect(isMobileSize()).toBe(false);
  });
});
