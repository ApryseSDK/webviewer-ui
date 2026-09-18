import createAnnotationStyleRegistry from './annotationStyleRegistry';
import core from 'core';

const CDATA_KEY = '_customStyleKeyFill';
const FILL_SECTION = 'fill';
const Core = window.Core;

const customFillStyles = createAnnotationStyleRegistry([FILL_SECTION]);
const dispatchersInstalled = new Set();
const annotationManagersWithListeners = new WeakSet();
const documentViewersWithListeners = new WeakSet();

function getLiveKey(annotation) {
  return annotation['FillStyle'] || '';
}

function setLiveKey(annotation, key) {
  annotation['FillStyle'] = key;
}

function resolveAnnotationClasses(appliesTo) {
  const Annotations = Core?.Annotations;
  if (!Annotations) {
    return [];
  }

  const targets = Array.isArray(appliesTo) && appliesTo.length > 0
    ? appliesTo.map((value) => String(value).toLowerCase())
    : ['all'];

  const wantsRect = targets.includes('all') || targets.includes('rectangle');
  const wantsEllipse = targets.includes('all') || targets.includes('ellipse');
  const wantsPolygon = targets.includes('all') || targets.includes('polygon');

  const classes = [];

  if (wantsRect && Annotations.RectangleAnnotation) {
    classes.push(Annotations.RectangleAnnotation);
  }
  if (wantsEllipse && Annotations.EllipseAnnotation) {
    classes.push(Annotations.EllipseAnnotation);
  }
  if (wantsPolygon && Annotations.PolygonAnnotation) {
    classes.push(Annotations.PolygonAnnotation);
  }

  return classes;
}

function styleAppliesToAnnotation(appliesTo, annotation) {
  const targets = Array.isArray(appliesTo) && appliesTo.length > 0
    ? appliesTo.map((value) => String(value).toLowerCase())
    : ['all'];

  return targets.includes('all')
    || resolveAnnotationClasses(targets).some((AnnotationClass) => annotation instanceof AnnotationClass);
}

function getCustomData(annotation, key) {
  return annotation.getCustomData?.(key) || '';
}

function setCustomData(annotation, key, value = '') {
  if (!annotation.setCustomData) {
    return;
  }

  // setCustomData marks the XFDF as stale, so only write on a real change.
  if (getCustomData(annotation, key) === value) {
    return;
  }

  // The mirror is internal bookkeeping, so it must not bump the user-visible modified date.
  annotation.setCustomData(key, value, true);
}

/**
 * Resolves which registered fill style key applies. This runs on every draw, so it must stay free
 * of side effects; reconciling the customData mirror is done on annotation events instead.
 * @param {object} annotation The annotation being inspected
 * @returns {string} The effective fill style key, or an empty string
 * @ignore
 */
function getEffectiveKey(annotation) {
  const liveStyle = getLiveKey(annotation);

  if (customFillStyles.has(FILL_SECTION, liveStyle)) {
    return liveStyle;
  }

  const stored = getCustomData(annotation, CDATA_KEY);

  if (!liveStyle && stored && customFillStyles.has(FILL_SECTION, stored)) {
    return stored;
  }

  return liveStyle;
}

function isIncompletePolygon(annotation) {
  return annotation.getPath && annotation.getPath().length < 3;
}

function getUnrotatedPolygonGeometry(annotation) {
  const rotationInRadians = ((annotation['Rotation'] || 0) * Math.PI) / 180;
  const cos = Math.cos(rotationInRadians);
  const sin = Math.sin(rotationInRadians);
  const rotatedPath = annotation.getPath();
  const pathRotatedAroundOrigin = rotatedPath.map((point) => ({
    x: point['x'] * cos - point['y'] * sin,
    y: point['x'] * sin + point['y'] * cos,
  }));

  const originXValues = pathRotatedAroundOrigin.map((point) => point.x);
  // Match the built-in fill-then-stroke order so patterns cannot paint over thick borders.
  const originYValues = pathRotatedAroundOrigin.map((point) => point.y);
  const originCenterX = (Math.min(...originXValues) + Math.max(...originXValues)) / 2;
  const originCenterY = (Math.min(...originYValues) + Math.max(...originYValues)) / 2;
  const centerX = originCenterX * cos + originCenterY * sin;
  const centerY = -originCenterX * sin + originCenterY * cos;
  const path = rotatedPath.map((point) => {
    const deltaX = point['x'] - centerX;
    const deltaY = point['y'] - centerY;
    return {
      x: centerX + deltaX * cos - deltaY * sin,
      y: centerY + deltaX * sin + deltaY * cos,
    };
  });
  const xValues = path.map((point) => point.x);
  const yValues = path.map((point) => point.y);
  const padding = annotation.getRectPadding?.() ?? annotation['StrokeThickness'] ?? 0;
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    path,
    dimensions: {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + (2 * padding),
      height: maxY - minY + (2 * padding),
    },
    centerX,
    centerY,
  };
}

/**
 * Clips the context to the annotation's own geometry so fill patterns stay inside the shape
 * rather than its bounding box. Callers are responsible for save/restore around this.
 *
 * `X`/`Y`/`Width`/`Height` hold the annotation's rotated bounding box, not its own local shape.
 * Rectangular annotations expose their unrotated dimensions, while polygon paths are converted back
 * to local coordinates before the annotation rotation is applied to the context.
 * @param {CanvasRenderingContext2D} ctx The canvas context being drawn into
 * @param {object} annotation The annotation being drawn
 * @ignore
 */
function clipToAnnotationShape(ctx, annotation) {
  const Annotations = window.Core?.Annotations;

  ctx.beginPath();

  if (Annotations?.PolygonAnnotation && annotation instanceof Annotations.PolygonAnnotation && annotation.getPath) {
    const { path: unrotatedPath, centerX, centerY } = getUnrotatedPolygonGeometry(annotation);
    const rotationInRadians = -(((annotation['Rotation'] || 0) * Math.PI) / 180);

    if (rotationInRadians) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationInRadians);
      ctx.translate(-centerX, -centerY);
    }

    unrotatedPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point['x'], point['y']);
      } else {
        ctx.lineTo(point['x'], point['y']);
      }
    });

    if (rotationInRadians) {
      ctx.restore();
    }
  } else {
    const { x, y, width, height } = annotation.getUnrotatedDimensions
      ? annotation.getUnrotatedDimensions()
      : { x: annotation['X'], y: annotation['Y'], width: annotation['Width'], height: annotation['Height'] };
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const rotationInRadians = -(((annotation['Rotation'] || 0) * Math.PI) / 180);

    if (Annotations?.EllipseAnnotation && annotation instanceof Annotations.EllipseAnnotation) {
      ctx.ellipse(centerX, centerY, Math.abs(width / 2), Math.abs(height / 2), rotationInRadians, 0, 2 * Math.PI);
    } else if (rotationInRadians) {
      // ctx.rect() bakes the path into device coordinates, so the rotation can be undone right after.
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationInRadians);
      ctx.translate(-centerX, -centerY);
      ctx.rect(x, y, width, height);
      ctx.restore();
    } else {
      ctx.rect(x, y, width, height);
    }
  }

  ctx.closePath();
  ctx.clip();
  // clip() keeps the current path, so reset it or the caller's next stroke()/fill() would also paint it.
  ctx.beginPath();
}

function installDispatcher(AnnotationClass) {
  if (dispatchersInstalled.has(AnnotationClass)) {
    return;
  }
  dispatchersInstalled.add(AnnotationClass);

  const Annotations = Core.Annotations;

  Annotations.setCustomDrawHandler(
    AnnotationClass,
    function(ctx, pageMatrix, rotation, { annotation, originalDraw }) {
      const entry = customFillStyles.get(FILL_SECTION, getEffectiveKey(annotation));

      if (!entry || !styleAppliesToAnnotation(entry.appliesTo, annotation) || isIncompletePolygon(annotation)) {
        originalDraw(ctx, pageMatrix);
        return;
      }

      let didDrawOriginal = false;
      const drawOriginalOnce = (draw) => {
        if (didDrawOriginal) {
          return;
        }
        didDrawOriginal = true;

        ctx.restore();
        // draw() can permanently mutate the canvas transform (e.g. rotated rectangles), so it's
        // isolated here to keep the clip below computed against the same baseline transform used
        // before the draw handler ran.
        ctx.save();
        draw();
        ctx.restore();

        ctx.save();
        const clipFunction = entry.clipToShape ? entry.clipToShapeFn : clipToAnnotationShape;
        clipFunction(ctx, annotation);
      };

      let shouldDrawOriginalWithoutFill = false;
      const drawOriginalWithoutFillOnce = () => {
        if (!didDrawOriginal) {
          shouldDrawOriginalWithoutFill = true;
        }
      };
      const drawOriginalWithoutFill = () => drawOriginalOnce(() => {
        const originalFillColor = annotation.FillColor;
        annotation.FillColor = new Annotations.Color(0, 0, 0, 0);
        try {
          originalDraw(ctx, pageMatrix);
        } finally {
          annotation.FillColor = originalFillColor;
        }
      });

      ctx.save();
      const clipFunction = entry.clipToShape ? entry.clipToShapeFn : clipToAnnotationShape;
      clipFunction(ctx, annotation);
      const isPolygon = Annotations.PolygonAnnotation && annotation instanceof Annotations.PolygonAnnotation;
      const shouldAddUnrotatedDimensions = isPolygon && !annotation.getUnrotatedDimensions;
      try {
        if (shouldAddUnrotatedDimensions) {
          Object.defineProperty(annotation, 'getUnrotatedDimensions', {
            configurable: true,
            value: () => getUnrotatedPolygonGeometry(annotation).dimensions,
          });
        }

        entry.drawHandler(ctx, pageMatrix, rotation, {
          annotation,
          originalDraw: () => drawOriginalOnce(() => originalDraw(ctx, pageMatrix)),
          originalDrawWithoutFill: drawOriginalWithoutFillOnce,
          clipToShape: () => {
            const manualClipFunction = entry.clipToShape ? entry.clipToShapeFn : clipToAnnotationShape;
            manualClipFunction(ctx, annotation);
          },
        });
      } finally {
        if (shouldAddUnrotatedDimensions) {
          delete annotation.getUnrotatedDimensions;
        }
        ctx.restore();
      }

      if (shouldDrawOriginalWithoutFill) {
        drawOriginalWithoutFill();
      }
    },
    { generateAppearance: true },
  );
}

/**
 * Brings the live fill style and its customData mirror back into agreement.
 * @param {object} annotation The annotation to reconcile
 * @returns {boolean} True when the annotation's appearance changed and needs a redraw
 * @ignore
 */
function reconcileFillStyle(annotation) {
  const live = getLiveKey(annotation);
  const stored = getCustomData(annotation, CDATA_KEY);

  if (customFillStyles.has(FILL_SECTION, live)) {
    setCustomData(annotation, CDATA_KEY, live);
    return false;
  }

  if (stored && live) {
    setCustomData(annotation, CDATA_KEY, '');
    return false;
  }

  if (!live && stored && customFillStyles.has(FILL_SECTION, stored)) {
    setLiveKey(annotation, stored);
    return true;
  }

  if (stored && !customFillStyles.has(FILL_SECTION, stored)) {
    setCustomData(annotation, CDATA_KEY, '');
  }

  return false;
}

function setupAnnotationManagerListeners(annotManager) {
  const restoreAndRedraw = (annotations) => {
    const changed = (annotations || []).filter((annot) => reconcileFillStyle(annot));

    if (changed.length) {
      annotManager.drawAnnotationsFromList(changed);
    }
  };

  if (annotationManagersWithListeners.has(annotManager)) {
    restoreAndRedraw(annotManager.getAnnotationsList());
    return;
  }
  annotationManagersWithListeners.add(annotManager);

  annotManager.addEventListener('annotationChanged', (annotations) => {
    restoreAndRedraw(annotations || []);
  });

  annotManager.addEventListener('annotationSelected', (annotations) => {
    restoreAndRedraw(annotations || []);
  });

  restoreAndRedraw(annotManager.getAnnotationsList());
}

function setupDocumentListeners() {
  core.getDocumentViewers().forEach((docViewer) => {
    if (!documentViewersWithListeners.has(docViewer)) {
      documentViewersWithListeners.add(docViewer);
      docViewer.addEventListener('documentLoaded', () => {
        setupAnnotationManagerListeners(docViewer.getAnnotationManager());
      });
    }

    if (docViewer.getDocument?.()) {
      setupAnnotationManagerListeners(docViewer.getAnnotationManager());
    }
  });
}

/**
 * Refreshes every annotation using a registered or removed fill style. Annotations outside a
 * replacement style's new scope are reset to the default solid fill.
 * @param {string} key The registered or removed fill style key
 * @param {Array<string>} [appliesTo] The replacement style targets; omit when unregistering
 * @ignore
 */
function refreshFillStyleAnnotations(key, appliesTo) {
  core.getDocumentViewers().forEach((docViewer) => {
    const annotManager = docViewer.getAnnotationManager();
    const changed = [];

    annotManager.getAnnotationsList().forEach((annot) => {
      const usesStyle = getLiveKey(annot) === key || getCustomData(annot, CDATA_KEY) === key;
      if (!usesStyle) {
        return;
      }

      if (!appliesTo || !styleAppliesToAnnotation(appliesTo, annot)) {
        if (getLiveKey(annot) === key) {
          setLiveKey(annot, '');
        }
        if (getCustomData(annot, CDATA_KEY) === key) {
          setCustomData(annot, CDATA_KEY, '');
        }
      }

      annot.setModified?.(false, false, true);
      changed.push(annot);
    });

    if (changed.length) {
      annotManager.drawAnnotationsFromList(changed);
    }
  });
}

function resetFillStyleToolDefaults(key) {
  core.getDocumentViewers().forEach((docViewer) => {
    const toolModeMap = docViewer.getToolModeMap?.() || {};
    Object.values(toolModeMap).forEach((tool) => {
      if (tool.defaults?.FillStyle !== key) {
        return;
      }

      tool.setStyles({ FillStyle: '' });
    });
  });
}

/**
 * Registers the draw handler used to render a custom fill style.
 * @param {string} key The fill style key
 * @param {Function} drawHandler The draw callback
 * @param {Array<string>} [appliesTo] The annotation targets the style applies to
 * @param {Function} [clipToShapeFn] Custom clipping function used when clipToShape is true
 * @param {boolean} [clipToShape=false] Whether to use the custom clipping function
 * @ignore
 */
export function registerFillDrawHandler(key, drawHandler, appliesTo, clipToShapeFn, clipToShape = false) {
  customFillStyles.register(FILL_SECTION, key, { key, section: FILL_SECTION, drawHandler, appliesTo, clipToShape, clipToShapeFn });

  resolveAnnotationClasses(appliesTo).forEach((annotationClass) => installDispatcher(annotationClass));

  setupDocumentListeners();
  refreshFillStyleAnnotations(key, appliesTo);
}

/**
 * Removes a fill style draw handler and resets any annotation still using it.
 * @param {string} key The fill style key
 * @ignore
 */
export function unregisterFillDrawHandler(key) {
  customFillStyles.unregister(key, FILL_SECTION);
  resetFillStyleToolDefaults(key);
  refreshFillStyleAnnotations(key);
}

/**
 * Keeps the customData mirror in step with a fill style chosen in the style panel, so the key
 * survives a round trip even when the annotation is serialized before the next annotation event.
 * @param {object} annotation The annotation whose fill style changed
 * @param {string} key The newly selected fill style key
 * @ignore
 */
export function syncCustomFillStyleSelection(annotation, key) {
  setCustomData(annotation, CDATA_KEY, customFillStyles.has(FILL_SECTION, key) ? key : '');
}
