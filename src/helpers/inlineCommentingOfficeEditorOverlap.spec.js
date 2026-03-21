import { annotationMapKeys } from 'constants/map';
import { getOverlappingOfficeEditorAnnotations } from './inlineCommentingOfficeEditorOverlap';

describe('getOverlappingOfficeEditorAnnotations', () => {
  const makeAnnot = (id, type) => ({ id, type, getReplies: () => [] });

  const buildPositionFn = (boundsById) => (annot) => boundsById[annot.id] || {};

  const mapAnnotationToKeyFn = (annot) => annot.type;

  it('returns null when commentingAnnotation is missing', () => {
    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation: null,
      annotations: [],
      mapAnnotationToKeyFn,
    });

    expect(result).toBeNull();
  });

  it('returns null when commentingAnnotation is not a comment or tracked change', () => {
    const commentingAnnotation = makeAnnot('a1', 'OTHER');

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation,
      annotations: [commentingAnnotation],
      mapAnnotationToKeyFn,
    });

    expect(result).toBeNull();
  });

  it('returns null when base bounds cannot be resolved', () => {
    const commentingAnnotation = makeAnnot('a1', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    const getAnnotationPositionFn = buildPositionFn({});

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation,
      annotations: [commentingAnnotation],
      getAnnotationPositionFn,
      mapAnnotationToKeyFn,
    });

    expect(result).toBeNull();
  });

  it('returns null when no overlapping pair is found', () => {
    const commentingAnnotation = makeAnnot('a1', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    const trackedChange = makeAnnot('a2', annotationMapKeys.TRACKED_CHANGE);

    const getAnnotationPositionFn = buildPositionFn({
      a1: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 10, y: 10 } },
      a2: { topLeft: { x: 20, y: 20 }, bottomRight: { x: 30, y: 30 } },
    });

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation,
      annotations: [commentingAnnotation, trackedChange],
      getAnnotationPositionFn,
      mapAnnotationToKeyFn,
    });

    expect(result).toBeNull();
  });

  it('returns the overlapping comment and tracked change annotations', () => {
    const comment = makeAnnot('a1', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    const trackedChange = makeAnnot('a2', annotationMapKeys.TRACKED_CHANGE);
    const other = makeAnnot('a3', 'OTHER');

    const getAnnotationPositionFn = buildPositionFn({
      a1: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 10, y: 10 } },
      a2: { topLeft: { x: 5, y: 5 }, bottomRight: { x: 12, y: 12 } },
      a3: { topLeft: { x: 1, y: 1 }, bottomRight: { x: 2, y: 2 } },
    });

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation: comment,
      annotations: [comment, trackedChange, other],
      getAnnotationPositionFn,
      mapAnnotationToKeyFn,
    });

    expect(result).toEqual({
      trackedChangeAnnotation: trackedChange,
      commentAnnotation: comment,
    });
  });

  it('uses annotations under mouse instead of base annotation bounds when available', () => {
    const comment = makeAnnot('a1', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    const trackedChange = makeAnnot('a2', annotationMapKeys.TRACKED_CHANGE);

    const getAnnotationPositionFn = buildPositionFn({
      a1: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 10, y: 10 } },
      a2: { topLeft: { x: 8, y: 8 }, bottomRight: { x: 18, y: 18 } },
    });

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation: comment,
      annotations: [comment, trackedChange],
      annotationsUnderMouse: [comment],
      getAnnotationPositionFn,
      mapAnnotationToKeyFn,
    });

    expect(result).toBeNull();
  });

  it('prefers the most recently updated overlapping comment', () => {
    const olderComment = makeAnnot('a1', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    olderComment.DateCreated = '2023-01-01T00:00:00Z';
    const newerComment = makeAnnot('a2', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    newerComment.DateModified = '2023-02-01T00:00:00Z';
    const trackedChange = makeAnnot('a3', annotationMapKeys.TRACKED_CHANGE);

    // another even newer comment that appears later in the list to ensure full scan
    const newestComment = makeAnnot('a4', annotationMapKeys.OFFICE_EDITOR_COMMENT);
    newestComment.DateCreated = '2023-03-01T00:00:00Z';

    const getAnnotationPositionFn = buildPositionFn({
      a1: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 10, y: 10 } },
      a2: { topLeft: { x: 2, y: 2 }, bottomRight: { x: 12, y: 12 } },
      a3: { topLeft: { x: 3, y: 3 }, bottomRight: { x: 13, y: 13 } },
      a4: { topLeft: { x: 4, y: 4 }, bottomRight: { x: 14, y: 14 } },
    });

    const result = getOverlappingOfficeEditorAnnotations({
      commentingAnnotation: trackedChange,
      annotations: [olderComment, newerComment, trackedChange, newestComment],
      getAnnotationPositionFn,
      mapAnnotationToKeyFn,
    });

    expect(result).toEqual({
      trackedChangeAnnotation: trackedChange,
      commentAnnotation: newestComment,
    });
  });
});
