import {
  setDocumentViewer,
  deleteDocumentViewer,
  setMultiInstanceActiveKey,
  setMultiViewerModeActive,
  getDocumentViewers,
} from './documentViewers';

// Reset shared module state between tests.
afterEach(() => {
  setMultiViewerModeActive(false);
  setMultiInstanceActiveKey(null);
  [1, 2, 3].forEach((key) => deleteDocumentViewer(key));
});

describe('getDocumentViewers', () => {
  it('returns all viewers when no multi-instance active key is set (single-instance / no interaction yet)', () => {
    const viewerA = { id: 'a' };
    const viewerB = { id: 'b' };
    setDocumentViewer(1, viewerA);
    setDocumentViewer(2, viewerB);

    expect(getDocumentViewers()).toEqual([viewerA, viewerB]);
  });

  it('returns only the viewer for the active instance when a multi-instance key is set', () => {
    const viewerA = { id: 'a' };
    const viewerB = { id: 'b' };
    setDocumentViewer(1, viewerA);
    setDocumentViewer(2, viewerB);
    setMultiInstanceActiveKey(1);

    expect(getDocumentViewers()).toEqual([viewerA]);

    setMultiInstanceActiveKey(2);
    expect(getDocumentViewers()).toEqual([viewerB]);
  });

  it('returns all viewers when MultiViewer mode is active (key cleared to null)', () => {
    const viewerA = { id: 'a' };
    const viewerB = { id: 'b' };
    setDocumentViewer(1, viewerA);
    setDocumentViewer(2, viewerB);
    setMultiViewerModeActive(true); // clears multiInstanceActiveKey

    expect(getDocumentViewers()).toEqual([viewerA, viewerB]);
  });

  it('falls back to all viewers when the active key resolves to a viewer not in the map', () => {
    const viewerA = { id: 'a' };
    setDocumentViewer(1, viewerA);
    setMultiInstanceActiveKey(99); // key that was never registered

    expect(getDocumentViewers()).toEqual([viewerA]);
  });

  it('scopes to viewer with key 2 when that is the active instance key', () => {
    const viewerA = { id: 'a' };
    const viewerB = { id: 'b' };
    setDocumentViewer(1, viewerA);
    setDocumentViewer(2, viewerB);
    setMultiInstanceActiveKey(2);

    const result = getDocumentViewers();
    expect(result).toEqual([viewerB]);
    // Confirm the index-based anti-pattern would silently return undefined:
    expect(result[2 - 1]).toBeUndefined();
  });
});
