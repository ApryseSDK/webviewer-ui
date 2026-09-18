import createAnnotationStyleRegistry from './annotationStyleRegistry';
import {
  getCustomData,
  setCustomData,
  syncCustomStyleSelection,
} from './customStyleManagerUtils';
import { FALLBACK_LINE_STYLES } from 'constants/customStyleDefaults';
import core from 'core';

const LINE_STYLE_SECTIONS = ['start', 'middle', 'end'];
const LINE_ANNOTATION_TYPES = ['line', 'arrow', 'polyline'];
const customLineStyles = createAnnotationStyleRegistry(LINE_STYLE_SECTIONS);

const TOOL_SECTION_PROPERTIES = {
  start: 'StartLineStyle',
  middle: 'StrokeStyle',
  end: 'EndLineStyle',
};

const dispatchersInstalled = new Set();
const initializedAnnotationManagers = new WeakSet();
const documentViewersWithListeners = new WeakSet();

const getEndpointDefaultPadding = (annotation) => Math.max(8, (Number(annotation.StrokeThickness) || 1) * 5);
const getMiddleDefaultPadding = (annotation) => Math.max(4, (Number(annotation.StrokeThickness) || 1) * 2);

const SECTION_META = {
  start: {
    customDataKey: '_customStyleKeyStart',
    xfdfAttribute: 'trn-custom-style-key-start',
    paddingProperty: '_customLineStyleStartPadding',
    defaultPadding: getEndpointDefaultPadding,
    fallbackKey: FALLBACK_LINE_STYLES.start,
    getLiveKey: (annotation) => annotation.getStartStyle?.() ?? annotation.StartLineStyle ?? '',
    setLiveKey: (annotation, key) => {
      if (annotation.setStartStyle) {
        annotation.setStartStyle(key);
        return;
      }
      annotation.StartLineStyle = key;
    },
  },
  middle: {
    customDataKey: '_customStyleKeyMiddle',
    xfdfAttribute: 'trn-custom-style-key-middle',
    paddingProperty: '_customLineStyleMiddlePadding',
    defaultPadding: getMiddleDefaultPadding,
    fallbackKey: FALLBACK_LINE_STYLES.middle,
    getLiveKey: (annotation) => annotation.Style || '',
    setLiveKey: (annotation, key) => {
      annotation.Style = key;
    },
  },
  end: {
    customDataKey: '_customStyleKeyEnd',
    xfdfAttribute: 'trn-custom-style-key-end',
    paddingProperty: '_customLineStyleEndPadding',
    defaultPadding: getEndpointDefaultPadding,
    fallbackKey: FALLBACK_LINE_STYLES.end,
    getLiveKey: (annotation) => annotation.getEndStyle?.() ?? annotation.EndLineStyle ?? '',
    setLiveKey: (annotation, key) => {
      if (annotation.setEndStyle) {
        annotation.setEndStyle(key);
        return;
      }
      annotation.EndLineStyle = key;
    },
  },
};

const updateSectionPadding = (annotation, section, key) => {
  const meta = SECTION_META[section];
  // Only line annotations grow their rect from these padding properties.
  if (!meta.paddingProperty || !isLineStyleAnnotation(annotation)) {
    return false;
  }

  const oppositeSection = getOppositeEndpointSection(section);
  const entry = customLineStyles.getApplicable(section, key, (candidate) => entryAppliesToAnnotation(candidate, annotation))
    || (oppositeSection && customLineStyles.getApplicable(
      oppositeSection,
      key,
      (candidate) => entryAppliesToAnnotation(candidate, annotation),
    ));
  let configuredPadding;
  try {
    configuredPadding = typeof entry?.padding === 'function' ? entry.padding(annotation) : entry?.padding;
  } catch (error) {
    configuredPadding = undefined;
  }
  const defaultPadding = meta.defaultPadding(annotation);
  const hasValidConfiguredPadding = Number.isFinite(configuredPadding) && configuredPadding >= 0;
  let nextPadding = 0;
  if (entry) {
    nextPadding = hasValidConfiguredPadding ? configuredPadding : defaultPadding;
  }

  if (annotation[meta.paddingProperty] === nextPadding) {
    return false;
  }

  annotation[meta.paddingProperty] = nextPadding;
  if (typeof annotation.adjustRect === 'function') {
    annotation.adjustRect();
  }
  return true;
};

const normalizeAppliesTo = (appliesTo) => {
  const types = (Array.isArray(appliesTo) ? appliesTo : [])
    .map((value) => String(value).toLowerCase())
    .filter((value) => LINE_ANNOTATION_TYPES.includes(value));

  return types.length ? types : LINE_ANNOTATION_TYPES;
};

// Arrows are LineAnnotations distinguished only by their LineArrow intent.
const getAnnotationLineType = (annotation) => {
  const Annotations = window.Core?.Annotations;
  if (!Annotations || !annotation) {
    return null;
  }

  if (Annotations.PolygonAnnotation && annotation instanceof Annotations.PolygonAnnotation) {
    return null;
  }
  if (Annotations.PolylineAnnotation && annotation instanceof Annotations.PolylineAnnotation) {
    return 'polyline';
  }
  if (Annotations.LineAnnotation && annotation instanceof Annotations.LineAnnotation) {
    return annotation.IT === 'LineArrow' ? 'arrow' : 'line';
  }

  return null;
};

const resolveAnnotationClasses = (appliesTo) => {
  const Annotations = window.Core?.Annotations;
  if (!Annotations) {
    return [];
  }

  const types = normalizeAppliesTo(appliesTo);
  const classes = [];
  if (types.includes('line') || types.includes('arrow')) {
    classes.push(Annotations.LineAnnotation);
  }
  if (types.includes('polyline')) {
    classes.push(Annotations.PolylineAnnotation);
  }

  return classes.filter(Boolean);
};

const entryAppliesToAnnotation = (entry, annotation) => {
  const lineType = getAnnotationLineType(annotation);
  return !!lineType && normalizeAppliesTo(entry.appliesTo).includes(lineType);
};

const isLineStyleAnnotation = (annotation) => {
  return !!getAnnotationLineType(annotation);
};

const getOppositeEndpointSection = (section) => {
  if (section === 'start') {
    return 'end';
  }
  if (section === 'end') {
    return 'start';
  }
  return null;
};

const getApplicableEntryForLiveSection = (section, key, annotation) => {
  const entry = customLineStyles.getApplicable(section, key, (candidate) => entryAppliesToAnnotation(candidate, annotation));
  if (entry) {
    return { entry, activeSection: section };
  }

  const oppositeSection = getOppositeEndpointSection(section);
  if (!oppositeSection) {
    return null;
  }

  const oppositeEntry = customLineStyles.getApplicable(
    oppositeSection,
    key,
    (candidate) => entryAppliesToAnnotation(candidate, annotation),
  );
  return oppositeEntry ? { entry: oppositeEntry, activeSection: section, swapEndpointGeometry: true } : null;
};

const getEffectiveKey = (annotation, section) => {
  const meta = SECTION_META[section];
  return meta.getLiveKey(annotation) || '';
};

const getMatchingDrawEntries = (annotation) => {
  const sectionPriority = ['middle', 'start', 'end'];
  return sectionPriority.reduce((entries, section) => {
    const key = getEffectiveKey(annotation, section);
    const resolved = key && getApplicableEntryForLiveSection(section, key, annotation);
    if (resolved?.entry && typeof resolved.entry.drawHandler === 'function') {
      entries.push({ ...resolved.entry, activeSection: resolved.activeSection, swapEndpointGeometry: resolved.swapEndpointGeometry });
    }
    return entries;
  }, []);
};

const isCustomEndpointStyleKey = (key) => {
  return customLineStyles.has('start', key) || customLineStyles.has('end', key);
};

const drawWithEndpointGeometry = (annotation, shouldSwapEndpointGeometry, draw) => {
  if (!shouldSwapEndpointGeometry) {
    draw();
    return;
  }

  const originalStart = annotation.Start;
  const originalEnd = annotation.End;
  const hadOwnGetStartPoint = Object.hasOwn(annotation, 'getStartPoint');
  const hadOwnGetEndPoint = Object.hasOwn(annotation, 'getEndPoint');
  const hadOwnGetPath = Object.hasOwn(annotation, 'getPath');
  const originalGetStartPoint = annotation.getStartPoint;
  const originalGetEndPoint = annotation.getEndPoint;
  const originalGetPath = annotation.getPath;

  annotation.Start = originalEnd;
  annotation.End = originalStart;
  annotation.getStartPoint = () => originalEnd;
  annotation.getEndPoint = () => originalStart;
  if (typeof originalGetPath === 'function') {
    annotation.getPath = () => {
      const path = originalGetPath.call(annotation);
      return Array.isArray(path) ? [...path].reverse() : path;
    };
  }

  try {
    draw();
  } finally {
    annotation.Start = originalStart;
    annotation.End = originalEnd;
    if (hadOwnGetStartPoint) {
      annotation.getStartPoint = originalGetStartPoint;
    } else {
      delete annotation.getStartPoint;
    }
    if (hadOwnGetEndPoint) {
      annotation.getEndPoint = originalGetEndPoint;
    } else {
      delete annotation.getEndPoint;
    }
    if (hadOwnGetPath) {
      annotation.getPath = originalGetPath;
    } else {
      delete annotation.getPath;
    }
  }
};

const drawWithBuiltInStyles = (annotation, activeSections, originalDraw, ctx, pageMatrix) => {
  const originalStyle = annotation.Style;
  const originalGetStartStyle = annotation['getStartStyle'];
  const originalGetEndStyle = annotation['getEndStyle'];
  const originalStartLineStyle = annotation.StartLineStyle;
  const originalEndLineStyle = annotation.EndLineStyle;
  const startStyle = originalGetStartStyle?.call(annotation) ?? originalStartLineStyle ?? '';
  const endStyle = originalGetEndStyle?.call(annotation) ?? originalEndLineStyle ?? '';

  if (activeSections.includes('start') || isCustomEndpointStyleKey(startStyle)) {
    annotation['getStartStyle'] = () => SECTION_META.start.fallbackKey;
    annotation.StartLineStyle = SECTION_META.start.fallbackKey;
  }
  if (activeSections.includes('middle')) {
    annotation.Style = SECTION_META.middle.fallbackKey;
  }
  if (activeSections.includes('end') || isCustomEndpointStyleKey(endStyle)) {
    annotation['getEndStyle'] = () => SECTION_META.end.fallbackKey;
    annotation.EndLineStyle = SECTION_META.end.fallbackKey;
  }
  try {
    originalDraw(ctx, pageMatrix);
  } finally {
    annotation['getStartStyle'] = originalGetStartStyle;
    annotation.Style = originalStyle;
    annotation['getEndStyle'] = originalGetEndStyle;
    annotation.StartLineStyle = originalStartLineStyle;
    annotation.EndLineStyle = originalEndLineStyle;
  }
};

const restrictGeneratedAppearanceToCustomStyles = (AnnotationClass) => {
  const { prototype } = AnnotationClass;
  const generatedGetCustomAppearance = prototype.getCustomAppearance;
  const defaultGetCustomAppearance = prototype.originalGetCustomAppearance;

  if (typeof generatedGetCustomAppearance !== 'function' || typeof defaultGetCustomAppearance !== 'function') {
    return;
  }

  // setCustomDrawHandler rasterizes an appearance for every annotation of this class on export,
  // which corrupts annotations that were never drawn with a custom style.
  prototype.getCustomAppearance = function(...args) {
    if (getMatchingDrawEntries(this).length) {
      return generatedGetCustomAppearance.apply(this, args);
    }

    if (this._hasCustomDrawnAppearance) {
      this.removeCustomAppearance?.();
    }
    return defaultGetCustomAppearance.apply(this, args);
  };
};

const installDispatcher = (AnnotationClass) => {
  if (dispatchersInstalled.has(AnnotationClass)) {
    return;
  }
  dispatchersInstalled.add(AnnotationClass);

  const Annotations = window.Core.Annotations;

  Annotations.setCustomDrawHandler(
    AnnotationClass,
    function(ctx, pageMatrix, rotation, { annotation, originalDraw }) {
      const entries = getMatchingDrawEntries(annotation);
      if (!entries.length) {
        originalDraw(ctx, pageMatrix);
        return;
      }

      let didDrawOriginal = false;
      const activeSections = entries.map(({ activeSection, section }) => activeSection || section);
      const drawOriginalOnce = () => {
        if (didDrawOriginal) {
          return;
        }
        didDrawOriginal = true;
        drawWithBuiltInStyles(annotation, activeSections, originalDraw, ctx, pageMatrix);
      };
      let didDrawOriginalEndings = false;
      const drawOriginalEndingsOnce = () => {
        let drawLineMethod = null;

        if (typeof annotation.drawLine === 'function') {
          drawLineMethod = 'drawLine';
        } else if (typeof annotation.drawLines === 'function') {
          drawLineMethod = 'drawLines';
        }
        if (didDrawOriginal || didDrawOriginalEndings || !drawLineMethod) {
          return;
        }
        didDrawOriginalEndings = true;
        didDrawOriginal = true;
        const originalDrawLine = annotation[drawLineMethod];
        annotation[drawLineMethod] = () => {};
        try {
          drawWithBuiltInStyles(annotation, activeSections, originalDraw, ctx, pageMatrix);
        } finally {
          annotation[drawLineMethod] = originalDrawLine;
        }
      };

      entries.forEach((entry) => {
        drawWithEndpointGeometry(annotation, entry.swapEndpointGeometry, () => {
          entry.drawHandler(ctx, pageMatrix, rotation, {
            annotation,
            originalDraw: drawOriginalOnce,
            originalDrawEndings: drawOriginalEndingsOnce,
            section: entry.section,
            activeSections,
          });
        });
      });
    },
    { generateAppearance: true },
  );

  restrictGeneratedAppearanceToCustomStyles(AnnotationClass);

  Annotations.setCustomSerializeHandler(
    AnnotationClass,
    function(element, pageMatrix, { annotation, originalSerialize }) {
      // Annotations that were never edited serialize their original XFDF element instead of the one passed in.
      const serializedElement = originalSerialize(element, pageMatrix) || element;
      if (!isLineStyleAnnotation(annotation)) {
        return serializedElement;
      }

      LINE_STYLE_SECTIONS.forEach((section) => {
        const meta = SECTION_META[section];
        const liveKey = meta.getLiveKey(annotation) || '';
        const storedKey = getCustomData(annotation, meta.customDataKey);
        const key = customLineStyles.has(section, liveKey) ? liveKey : storedKey;

        if (key) {
          serializedElement.setAttribute(meta.xfdfAttribute, key);
        }
      });

      return serializedElement;
    },
  );

  Annotations.setCustomDeserializeHandler(
    AnnotationClass,
    function(element, pageMatrix, { annotation, originalDeserialize }) {
      originalDeserialize(element, pageMatrix);
      if (!isLineStyleAnnotation(annotation)) {
        return;
      }

      LINE_STYLE_SECTIONS.forEach((section) => {
        const meta = SECTION_META[section];
        const key = element.getAttribute(meta.xfdfAttribute) || '';

        if (key) {
          setCustomData(annotation, meta.customDataKey, key);
          const liveKey = customLineStyles.has(section, key) ? key : meta.fallbackKey;
          updateSectionPadding(annotation, section, liveKey);
          meta.setLiveKey(annotation, liveKey);
        }
      });
    },
  );
};

const reconcileSectionStyle = (annotation, section) => {
  const meta = SECTION_META[section];
  const liveKey = meta.getLiveKey(annotation) || '';
  const storedKey = getCustomData(annotation, meta.customDataKey);

  if (customLineStyles.getApplicable(section, liveKey, (entry) => entryAppliesToAnnotation(entry, annotation))) {
    setCustomData(annotation, meta.customDataKey, liveKey);
    return updateSectionPadding(annotation, section, liveKey);
  }

  if (storedKey && customLineStyles.has(section, storedKey) && (!liveKey || liveKey === meta.fallbackKey)) {
    updateSectionPadding(annotation, section, storedKey);
    meta.setLiveKey(annotation, storedKey);
    setCustomData(annotation, meta.customDataKey, storedKey);
    return true;
  }

  if (storedKey && liveKey && liveKey !== meta.fallbackKey) {
    setCustomData(annotation, meta.customDataKey, '');
    return updateSectionPadding(annotation, section, liveKey);
  }

  if (storedKey && !customLineStyles.has(section, storedKey)) {
    updateSectionPadding(annotation, section, meta.fallbackKey);
    if (liveKey !== meta.fallbackKey) {
      meta.setLiveKey(annotation, meta.fallbackKey);
      return true;
    }
    return false;
  }

  if (!liveKey) {
    updateSectionPadding(annotation, section, meta.fallbackKey);
    meta.setLiveKey(annotation, meta.fallbackKey);
    return true;
  }

  return false;
};

const restoreAndRedraw = (annotationManager, annotations) => {
  const changedAnnotations = [];

  (annotations || []).forEach((annotation) => {
    if (!isLineStyleAnnotation(annotation)) {
      return;
    }
    const didChange = LINE_STYLE_SECTIONS.reduce(
      (changed, section) => reconcileSectionStyle(annotation, section) || changed,
      false,
    );
    didChange && changedAnnotations.push(annotation);
  });

  if (changedAnnotations.length) {
    annotationManager.drawAnnotationsFromList(changedAnnotations);
  }
};

const setupAnnotationManagerListeners = (annotationManager) => {
  if (initializedAnnotationManagers.has(annotationManager)) {
    restoreAndRedraw(annotationManager, annotationManager.getAnnotationsList());
    return;
  }
  initializedAnnotationManagers.add(annotationManager);

  annotationManager.addEventListener('annotationChanged', (annotations) => {
    (annotations || []).forEach((annotation) => {
      if (!isLineStyleAnnotation(annotation)) {
        return;
      }
      LINE_STYLE_SECTIONS.forEach((section) => {
        const meta = SECTION_META[section];
        const liveKey = meta.getLiveKey(annotation) || '';

        if (customLineStyles.has(section, liveKey)) {
          setCustomData(annotation, meta.customDataKey, liveKey);
          updateSectionPadding(annotation, section, liveKey);
        } else if (getCustomData(annotation, meta.customDataKey)
          && (liveKey !== meta.fallbackKey || customLineStyles.has(section, getCustomData(annotation, meta.customDataKey)))) {
          setCustomData(annotation, meta.customDataKey, '');
          updateSectionPadding(annotation, section, liveKey);
        }
      });
    });
  });

  annotationManager.addEventListener('annotationSelected', (annotations) => {
    restoreAndRedraw(annotationManager, annotations || []);
  });

  restoreAndRedraw(annotationManager, annotationManager.getAnnotationsList());
};

const setupDocumentListeners = () => {
  core.getDocumentViewers?.().forEach((documentViewer) => {
    if (!documentViewersWithListeners.has(documentViewer)) {
      documentViewersWithListeners.add(documentViewer);
      documentViewer.addEventListener('documentLoaded', () => {
        setupAnnotationManagerListeners(documentViewer.getAnnotationManager());
      });
    }

    if (documentViewer.getDocument?.()) {
      setupAnnotationManagerListeners(documentViewer.getAnnotationManager());
    }
  });
};

const refreshLineStyleAnnotations = (key, sections, appliesTo) => {
  core.getDocumentViewers?.().forEach((documentViewer) => {
    const annotationManager = documentViewer.getAnnotationManager();
    const changedAnnotations = [];

    annotationManager.getAnnotationsList().forEach((annotation) => {
      if (!isLineStyleAnnotation(annotation)) {
        return;
      }

      let didChange = false;
      sections.forEach((section) => {
        const meta = SECTION_META[section];
        const usesStyle = meta.getLiveKey(annotation) === key
          || getCustomData(annotation, meta.customDataKey) === key;
        if (!usesStyle) {
          return;
        }

        const remainingEntry = !appliesTo && getApplicableEntryForLiveSection(section, key, annotation);
        if (remainingEntry) {
          updateSectionPadding(annotation, section, key);
          return;
        }

        if (!appliesTo || !entryAppliesToAnnotation({ appliesTo }, annotation)) {
          if (meta.getLiveKey(annotation) === key) {
            meta.setLiveKey(annotation, meta.fallbackKey);
          }
          if (getCustomData(annotation, meta.customDataKey) === key) {
            setCustomData(annotation, meta.customDataKey, '');
          }
          updateSectionPadding(annotation, section, meta.fallbackKey);
        } else {
          updateSectionPadding(annotation, section, key);
        }

        annotation.setModified?.(false, false, true);
        didChange = true;
      });

      didChange && changedAnnotations.push(annotation);
    });

    changedAnnotations.length && annotationManager.drawAnnotationsFromList(changedAnnotations);
  });
};

const resetLineStyleToolDefaults = (key, sections) => {
  core.getDocumentViewers?.().forEach((documentViewer) => {
    const toolModeMap = documentViewer.getToolModeMap?.() || {};
    Object.values(toolModeMap).forEach((tool) => {
      const fallbackStyles = sections.reduce((styles, section) => {
        const property = TOOL_SECTION_PROPERTIES[section];
        if (tool.defaults?.[property] === key) {
          styles[property] = FALLBACK_LINE_STYLES[section];
        }
        return styles;
      }, {});

      if (Object.keys(fallbackStyles).length) {
        tool.setStyles(fallbackStyles);
      }
    });
  });
};

export const registerCustomLineStyle = ({ key, section = 'middle', appliesTo = LINE_ANNOTATION_TYPES, drawHandler, padding }) => {
  if (typeof drawHandler !== 'function') {
    return false;
  }

  const entry = { key, section, appliesTo: normalizeAppliesTo(appliesTo), drawHandler, padding };
  if (!customLineStyles.register(section, key, entry)) {
    return false;
  }

  resolveAnnotationClasses(entry.appliesTo).forEach(installDispatcher);
  setupDocumentListeners();

  core.getDocumentViewers?.().forEach((documentViewer) => {
    const annotationManager = documentViewer.getAnnotationManager();
    setupAnnotationManagerListeners(annotationManager);
  });
  refreshLineStyleAnnotations(key, [section], entry.appliesTo);
  return true;
};

export const unregisterCustomLineStyle = (key, section) => {
  const sections = section ? [section] : LINE_STYLE_SECTIONS;
  customLineStyles.unregister(key, section);
  resetLineStyleToolDefaults(key, sections);
  const oppositeSection = getOppositeEndpointSection(section);
  const sectionsToRefresh = oppositeSection ? [...sections, oppositeSection] : sections;
  refreshLineStyleAnnotations(key, sectionsToRefresh);
};

export const syncCustomLineStyleSelection = (annotation, section, key) => {
  const meta = SECTION_META[section];
  if (!meta) {
    return;
  }

  syncCustomStyleSelection(annotation, customLineStyles, section, meta.customDataKey, key);
  updateSectionPadding(annotation, section, key);
};