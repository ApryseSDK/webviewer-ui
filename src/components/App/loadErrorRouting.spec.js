import { shouldHandleLoadError } from './loadErrorRouting';

describe('loadErrorRouting', () => {
  it('handles legacy load errors without a document viewer ID', () => {
    expect(shouldHandleLoadError(undefined, {})).toBe(true);
  });

  it('handles load errors from document viewers owned by the current instance', () => {
    const core = {
      getDocumentViewers: () => [
        { getID: () => 'instance-1-viewer-1' },
        { id: 'instance-1-viewer-2' },
      ],
    };

    expect(shouldHandleLoadError('instance-1-viewer-2', core)).toBe(true);
  });

  it('ignores load errors from another multi-viewer instance', () => {
    const core = {
      getDocumentViewers: () => [
        { getID: () => 'instance-1-viewer-1' },
        { getID: () => 'instance-1-viewer-2' },
      ],
    };

    expect(shouldHandleLoadError('instance-2-viewer-1', core)).toBe(false);
  });

  it('uses the supplied document viewer key instead of shared active viewers', () => {
    const firstInstanceViewer = { getID: () => 'instance-1-viewer-1' };
    const secondInstanceViewer = { getID: () => 'instance-2-viewer-1' };
    const core = {
      getDocumentViewer: (key) => key === 1 ? firstInstanceViewer : secondInstanceViewer,
      getDocumentViewers: () => [firstInstanceViewer, secondInstanceViewer],
    };

    expect(shouldHandleLoadError('instance-1-viewer-1', core, 1)).toBe(true);
    expect(shouldHandleLoadError('instance-2-viewer-1', core, 1)).toBe(false);
  });

  it('falls back to the current document viewer when getDocumentViewers is unavailable', () => {
    const core = {
      getDocumentViewer: () => ({ getID: () => 2 }),
    };

    expect(shouldHandleLoadError('2', core)).toBe(true);
  });
});