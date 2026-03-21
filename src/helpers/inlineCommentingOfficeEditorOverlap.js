import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import { getAnnotationPosition } from 'helpers/getPopupPosition';
import getLatestActivityDate from 'helpers/getLatestActivityDate';

const getAnnotationBounds = (annot, documentViewerKey, getAnnotationPositionFn) => {
  const { topLeft, bottomRight } = getAnnotationPositionFn(annot, documentViewerKey);
  if (!topLeft || !bottomRight) {
    return null;
  }

  const left = Math.min(topLeft.x, bottomRight.x);
  const right = Math.max(topLeft.x, bottomRight.x);
  const top = Math.min(topLeft.y, bottomRight.y);
  const bottom = Math.max(topLeft.y, bottomRight.y);

  return { left, right, top, bottom };
};

const doesOverlap = (a, b) => (
  a.left <= b.right &&
  a.right >= b.left &&
  a.top <= b.bottom &&
  a.bottom >= b.top
);

/**
 * Finds a tracked change and a comment annotation that overlap the provided annotation.
 * @param {object} options The function arguments.
 * @param {object} options.commentingAnnotation Base annotation to match against.
 * @param {object[]} options.annotations Candidate annotations to test for overlap.
 * @param {number} [options.documentViewerKey=1] Document viewer key for position lookups.
 * @param {object[]} [options.annotationsUnderMouse] Annotations found under the mouse event.
 * @param {Function} [options.getAnnotationPositionFn=getAnnotationPosition] Position resolver.
 * @param {Function} [options.mapAnnotationToKeyFn=mapAnnotationToKey] Annotation type mapper.
 * @returns {{trackedChangeAnnotation: object, commentAnnotation: object} | null} The overlapping pair, or null.
 * @ignore
 */
export const getOverlappingOfficeEditorAnnotations = ({
  commentingAnnotation,
  annotations,
  documentViewerKey = 1,
  annotationsUnderMouse,
  getAnnotationPositionFn = getAnnotationPosition,
  mapAnnotationToKeyFn = mapAnnotationToKey,
}) => {
  if (!commentingAnnotation) {
    return null;
  }

  const annotationKey = mapAnnotationToKeyFn(commentingAnnotation);
  const isOfficeEditorComment = annotationKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;
  const isTrackedChange = annotationKey === annotationMapKeys.TRACKED_CHANGE;
  if (!isOfficeEditorComment && !isTrackedChange) {
    return null;
  }

  const hasMouseOverlap = Array.isArray(annotationsUnderMouse) && annotationsUnderMouse.includes(commentingAnnotation);
  const baseBounds = hasMouseOverlap
    ? null
    : getAnnotationBounds(commentingAnnotation, documentViewerKey, getAnnotationPositionFn);
  if (!hasMouseOverlap && !baseBounds) {
    return null;
  }

  let trackedChangeAnnotation = isTrackedChange ? commentingAnnotation : null;
  let commentAnnotation = isOfficeEditorComment ? commentingAnnotation : null;

  const candidates = hasMouseOverlap ? (annotationsUnderMouse || []) : (annotations || []);
  for (const annot of candidates) {
    if (annot === commentingAnnotation) {
      continue;
    }

    const annotKey = mapAnnotationToKeyFn(annot);
    const isTrackAnnot = annotKey === annotationMapKeys.TRACKED_CHANGE;
    const isCommentAnnot = annotKey === annotationMapKeys.OFFICE_EDITOR_COMMENT;
    if (!isTrackAnnot && !isCommentAnnot) {
      continue;
    }

    if (!hasMouseOverlap) {
      const annotBounds = getAnnotationBounds(annot, documentViewerKey, getAnnotationPositionFn);
      if (!annotBounds || !doesOverlap(baseBounds, annotBounds)) {
        continue;
      }
    }

    if (isTrackAnnot && !trackedChangeAnnotation) {
      trackedChangeAnnotation = annot;
    }

    if (isCommentAnnot) {
      const currentDate = commentAnnotation ? getLatestActivityDate(commentAnnotation) : null;
      const candidateDate = getLatestActivityDate(annot);
      const isNewer = (!currentDate && candidateDate) || (currentDate && candidateDate && new Date(candidateDate) > new Date(currentDate));
      if (!commentAnnotation || isNewer) {
        commentAnnotation = annot;
      }
    }
  }

  if (!trackedChangeAnnotation || !commentAnnotation) {
    return null;
  }

  return { trackedChangeAnnotation, commentAnnotation };
};
