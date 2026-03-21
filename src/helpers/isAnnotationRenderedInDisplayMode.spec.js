import { isAnnotationRenderedInDisplayMode } from './isAnnotationRenderedInDisplayMode';

describe('isAnnotationRenderedInDisplayMode', () => {
  const createCore = ({
    pageCount = 5,
    visiblePages = [1],
    isContinuousDisplayMode = false,
  } = {}) => ({
    getTotalPages: () => pageCount,
    getDisplayModeObject: () => ({
      getVisiblePages: () => visiblePages,
    }),
    isContinuousDisplayMode: () => isContinuousDisplayMode,
  });

  it('returns false when annotation is missing or out of range', () => {
    const core = createCore({ pageCount: 3, visiblePages: [1, 2, 3], isContinuousDisplayMode: true });

    expect(isAnnotationRenderedInDisplayMode(core, null)).toBe(false);
    expect(isAnnotationRenderedInDisplayMode(core, { PageNumber: 0 })).toBe(false);
    expect(isAnnotationRenderedInDisplayMode(core, { PageNumber: 4 })).toBe(false);
  });

  it('returns true when continuous display mode and annotation is valid', () => {
    const core = createCore({ pageCount: 3, visiblePages: [], isContinuousDisplayMode: true });

    expect(isAnnotationRenderedInDisplayMode(core, { PageNumber: 2 })).toBe(true);
  });

  it('returns true only when page is visible in non-continuous display mode', () => {
    const core = createCore({ pageCount: 3, visiblePages: [2], isContinuousDisplayMode: false });

    expect(isAnnotationRenderedInDisplayMode(core, { PageNumber: 2 })).toBe(true);
    expect(isAnnotationRenderedInDisplayMode(core, { PageNumber: 1 })).toBe(false);
  });
});
