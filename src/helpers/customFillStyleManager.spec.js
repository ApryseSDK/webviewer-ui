const FILL_CDATA_KEY = '_customStyleKeyFill';

jest.mock('core', () => ({
  getDocumentViewers: () => globalThis.Core.getDocumentViewers(),
}));

const createAnnotation = (props = {}) => {
  const customData = {};
  return {
    FillStyle: '',
    ...props,
    setCustomDataCalls: 0,
    setModified: jest.fn(),
    getCustomData: (key) => customData[key] || '',
    setCustomData(key, value) {
      this.setCustomDataCalls += 1;
      customData[key] = value || '';
    },
  };
};

const createContext = () => {
  const calls = [];
  const record = (name) => (...args) => calls.push([name, args]);
  return {
    calls,
    beginPath: record('beginPath'),
    closePath: record('closePath'),
    clip: record('clip'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    rect: record('rect'),
    ellipse: record('ellipse'),
    save: record('save'),
    restore: record('restore'),
    translate: record('translate'),
    rotate: record('rotate'),
  };
};

describe('customFillStyleManager', () => {
  let manager;
  let handlers;
  let annotManager;
  let documentLoadedListeners;
  let originalCore;

  const loadManager = () => {
    jest.resetModules();
    // eslint-disable-next-line global-require
    manager = require('./customFillStyleManager');
  };

  beforeEach(() => {
    originalCore = window.Core;
    handlers = {};
    documentLoadedListeners = [];

    annotManager = {
      listeners: {},
      annotations: [],
      drawAnnotationsFromList: jest.fn(),
      getAnnotationsList() {
        return this.annotations;
      },
      addEventListener(name, cb) {
        this.listeners[name] = this.listeners[name] || [];
        this.listeners[name].push(cb);
      },
      trigger(name, payload) {
        (this.listeners[name] || []).forEach((cb) => cb(payload));
      },
    };

    class RectangleAnnotation {}
    class EllipseAnnotation {}
    class PolygonAnnotation {}
    class LineAnnotation {}
    class Color {}

    window.Core = {
      Annotations: {
        RectangleAnnotation,
        EllipseAnnotation,
        PolygonAnnotation,
        LineAnnotation,
        Color,
        setCustomDrawHandler: jest.fn((cls, cb) => {
          handlers.draw = cb;
        }),
        setCustomSerializeHandler: jest.fn((cls, cb) => {
          handlers.serialize = cb;
        }),
        setCustomDeserializeHandler: jest.fn((cls, cb) => {
          handlers.deserialize = cb;
        }),
      },
      documentViewer: {
        addEventListener: (name, cb) => {
          if (name === 'documentLoaded') {
            documentLoadedListeners.push(cb);
          }
        },
        getDocument: () => ({}),
        getAnnotationManager: () => annotManager,
        getToolModeMap: jest.fn(() => ({})),
      },
    };
    window.Core.getDocumentViewers = () => [window.Core.documentViewer];

    loadManager();
  });

  afterEach(() => {
    window.Core = originalCore;
  });

  describe('drawing', () => {
    it('dispatches to the registered draw handler when the annotation uses its key', () => {
      const drawHandler = jest.fn();
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('hatch', drawHandler, ['all']);

      const annotation = createAnnotation({ FillStyle: 'hatch' });
      handlers.draw(createContext(), 'matrix', 0, { annotation, originalDraw });

      expect(drawHandler).toHaveBeenCalled();
      expect(originalDraw).not.toHaveBeenCalled();
    });

    it('falls back to the default appearance when the style does not apply to the annotation type', () => {
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
      const rectangleDrawHandler = jest.fn();
      manager.registerFillDrawHandler('hatch', rectangleDrawHandler, ['rectangle']);

      const annotation = createAnnotation({ FillStyle: 'hatch' });
      Object.setPrototypeOf(annotation, window.Core.Annotations.EllipseAnnotation.prototype);
      handlers.draw(createContext(), 'matrix', 0, { annotation, originalDraw });

      expect(rectangleDrawHandler).not.toHaveBeenCalled();
      expect(originalDraw).toHaveBeenCalledWith(expect.any(Object), 'matrix');
    });

    it('clips custom drawing by default without requiring the handler to call clipToShape', () => {
      const ctx = createContext();
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);

      handlers.draw(ctx, 'matrix', 0, {
        annotation: createAnnotation({ FillStyle: 'hatch', X: 10, Y: 20, Width: 100, Height: 60 }),
        originalDraw: jest.fn(),
      });

      expect(ctx.calls.map(([name]) => name)).toEqual([
        'save',
        'beginPath',
        'rect',
        'closePath',
        'clip',
        'beginPath',
        'restore',
      ]);
    });

    it('uses the built-in clip when the custom clip toggle is disabled', () => {
      const ctx = createContext();
      manager.registerFillDrawHandler('unclipped', jest.fn(), ['all'], undefined, false);

      handlers.draw(ctx, 'matrix', 0, {
        annotation: createAnnotation({ FillStyle: 'unclipped', X: 10, Y: 20, Width: 100, Height: 60 }),
        originalDraw: jest.fn(),
      });

      expect(ctx.calls.map(([name]) => name)).toContain('rect');
    });

    it('uses a custom clipping function when clipping is enabled', () => {
      const ctx = createContext();
      const clipToShapeFn = jest.fn();
      manager.registerFillDrawHandler('custom-clip', jest.fn(), ['all'], clipToShapeFn, true);

      handlers.draw(ctx, 'matrix', 0, {
        annotation: createAnnotation({ FillStyle: 'custom-clip' }),
        originalDraw: jest.fn(),
      });

      expect(clipToShapeFn).toHaveBeenCalledWith(ctx, expect.any(Object));
      expect(ctx.calls.map(([name]) => name)).toEqual(['save', 'restore']);
    });

    it('draws the built-in border without painting the base fill', () => {
      const ctx = createContext();
      const originalFillColor = { value: 'blue' };
      const annotation = createAnnotation({ FillStyle: 'hatch', FillColor: originalFillColor });
      const paintOrder = [];
      const originalDraw = jest.fn(() => {
        paintOrder.push('border');
        expect(annotation.FillColor).not.toBe(originalFillColor);
      });
      manager.registerFillDrawHandler('hatch', (drawCtx, pageMatrix, rotation, { originalDrawWithoutFill }) => {
        originalDrawWithoutFill();
        paintOrder.push('pattern');
      }, ['all']);

      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw });

      expect(originalDraw).toHaveBeenCalledWith(ctx, 'matrix');
      expect(annotation.FillColor).toBe(originalFillColor);
      expect(paintOrder).toEqual(['pattern', 'border']);
    });

    it('ignores a custom clipping function when the custom clip toggle is disabled', () => {
      const ctx = createContext();
      const clipToShapeFn = jest.fn();
      manager.registerFillDrawHandler('custom-clip', jest.fn(), ['all'], clipToShapeFn, false);

      handlers.draw(ctx, 'matrix', 0, {
        annotation: createAnnotation({ FillStyle: 'custom-clip' }),
        originalDraw: jest.fn(),
      });

      expect(clipToShapeFn).not.toHaveBeenCalled();
      expect(ctx.calls.map(([name]) => name)).toContain('rect');
    });

    it('falls back to the default appearance for an unregistered key', () => {
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);

      const annotation = createAnnotation({ FillStyle: 'not-registered' });
      const ctx = createContext();
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw });

      expect(originalDraw).toHaveBeenCalledWith(ctx, 'matrix');
    });

    it('clips to the ellipse geometry rather than the bounding box', () => {
      let clip;
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      const annotation = createAnnotation({ FillStyle: 'hatch', X: 10, Y: 20, Width: 100, Height: 60 });
      Object.setPrototypeOf(annotation, window.Core.Annotations.EllipseAnnotation.prototype);
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      clip = ctx.calls;
      expect(clip).toContainEqual(['ellipse', [60, 50, 50, 30, -0, 0, 2 * Math.PI]]);
      expect(clip.map(([name]) => name)).toContain('clip');
      expect(clip.map(([name]) => name)).not.toContain('rect');
    });

    it('clips to the polygon path rather than the bounding box', () => {
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      const annotation = createAnnotation({
        FillStyle: 'hatch',
        X: 10,
        Y: 20,
        Width: 100,
        Height: 60,
        getPath: () => [{ x: 10, y: 20 }, { x: 110, y: 20 }, { x: 60, y: 80 }],
      });
      Object.setPrototypeOf(annotation, window.Core.Annotations.PolygonAnnotation.prototype);
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      expect(ctx.calls).toContainEqual(['moveTo', [10, 20]]);
      expect(ctx.calls).toContainEqual(['lineTo', [110, 20]]);
      expect(ctx.calls).toContainEqual(['lineTo', [60, 80]]);
      expect(ctx.calls.map(([name]) => name)).not.toContain('rect');
      expect(ctx.calls.map(([name]) => name)).toContain('clip');
    });

    it('clips a rotated polygon around its rotation point rather than its bounding box center', () => {
      let dimensions;
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { annotation, clipToShape }) => {
        dimensions = annotation.getUnrotatedDimensions();
        clipToShape();
      }, ['polygon']);

      const ctx = createContext();
      const annotation = createAnnotation({
        FillStyle: 'hatch',
        X: 209.62100197297534,
        Y: 147.27205411342945,
        Width: 248.36078382729264,
        Height: 243.69208275263694,
        Rotation: 345,
        StrokeThickness: 3,
        getPath: () => [
          { x: 214.193832769211, y: 150.27205411342945 },
          { x: 454.98178580026797, y: 256.2020388916476 },
          { x: 212.62100197297534, y: 387.9641368660664 },
        ],
      });
      Object.setPrototypeOf(annotation, window.Core.Annotations.PolygonAnnotation.prototype);
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      expect(ctx.calls).toContainEqual(['translate', [expect.closeTo(310, 5), expect.closeTo(295, 5)]]);
      expect(ctx.calls).toContainEqual(['rotate', [-(345 * Math.PI) / 180]]);
      expect(ctx.calls).toContainEqual(['moveTo', [expect.closeTo(180, 5), expect.closeTo(180, 5)]]);
      expect(ctx.calls).toContainEqual(['lineTo', [expect.closeTo(440, 5), expect.closeTo(220, 5)]]);
      expect(ctx.calls).toContainEqual(['lineTo', [expect.closeTo(240, 5), expect.closeTo(410, 5)]]);
      expect(ctx.calls.map(([name]) => name)).toContain('clip');
      expect(dimensions.x).toBeCloseTo(177);
      expect(dimensions.y).toBeCloseTo(177);
      expect(dimensions.width).toBeCloseTo(266);
      expect(dimensions.height).toBeCloseTo(236);
      expect(annotation.getUnrotatedDimensions).toBeUndefined();
    });

    it('applies a polygon-only style to clouds', () => {
      const drawHandler = jest.fn();
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('polygon-hatch', drawHandler, ['polygon']);

      const annotation = createAnnotation({
        FillStyle: 'polygon-hatch',
        getIntent: () => 'PolygonCloud',
      });
      Object.setPrototypeOf(annotation, window.Core.Annotations.PolygonAnnotation.prototype);
      handlers.draw(createContext(), 'matrix', 0, { annotation, originalDraw });

      expect(drawHandler).toHaveBeenCalled();
    });

    it('keeps the live polygon segment visible before the polygon is complete', () => {
      const drawHandler = jest.fn();
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('polygon-hatch', drawHandler, ['polygon']);

      const annotation = createAnnotation({
        FillStyle: 'polygon-hatch',
        getPath: () => [{ x: 10, y: 20 }, { x: 110, y: 20 }],
      });
      Object.setPrototypeOf(annotation, window.Core.Annotations.PolygonAnnotation.prototype);
      const ctx = createContext();
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw });

      expect(drawHandler).not.toHaveBeenCalled();
      expect(originalDraw).toHaveBeenCalledWith(ctx, 'matrix');
    });

    it('clips to the bounding box for rectangular shapes', () => {
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      const annotation = createAnnotation({ FillStyle: 'hatch', X: 10, Y: 20, Width: 100, Height: 60 });
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      expect(ctx.calls).toContainEqual(['rect', [10, 20, 100, 60]]);
      expect(ctx.calls.map(([name]) => name)).toContain('clip');
    });

    it('clips a rotated rectangle using its unrotated shape rather than the rotated bounding box', () => {
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      // X/Y/Width/Height hold the rotated bounding box (post 90deg rotation, so swapped versus the
      // original shape); getUnrotatedDimensions returns the annotation's own local geometry.
      const annotation = createAnnotation({
        FillStyle: 'hatch',
        X: 25,
        Y: 5,
        Width: 60,
        Height: 100,
        Rotation: 90,
        getUnrotatedDimensions: () => ({ x: 10, y: 20, width: 100, height: 60 }),
      });
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      expect(ctx.calls).toContainEqual(['translate', [60, 50]]);
      expect(ctx.calls).toContainEqual(['rotate', [-(90 * Math.PI) / 180]]);
      expect(ctx.calls).toContainEqual(['rect', [10, 20, 100, 60]]);
      expect(ctx.calls.map(([name]) => name)).toContain('clip');
    });

    it('clips a rotated ellipse using its unrotated radii rather than the rotated bounding box', () => {
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      const annotation = createAnnotation({
        FillStyle: 'hatch',
        X: 25,
        Y: 5,
        Width: 60,
        Height: 100,
        Rotation: 90,
        getUnrotatedDimensions: () => ({ x: 10, y: 20, width: 100, height: 60 }),
      });
      Object.setPrototypeOf(annotation, window.Core.Annotations.EllipseAnnotation.prototype);
      handlers.draw(ctx, 'matrix', 0, { annotation, originalDraw: jest.fn() });

      expect(ctx.calls).toContainEqual(['ellipse', [60, 50, 50, 30, -(90 * Math.PI) / 180, 0, 2 * Math.PI]]);
    });

    it('leaves an empty path after clipping so the handler cannot repaint the clip path', () => {
      manager.registerFillDrawHandler('hatch', (ctx, pm, r, { clipToShape }) => clipToShape(), ['all']);

      const ctx = createContext();
      handlers.draw(ctx, 'matrix', 0, {
        annotation: createAnnotation({ FillStyle: 'hatch', X: 10, Y: 20, Width: 100, Height: 60 }),
        originalDraw: jest.fn(),
      });

      const names = ctx.calls.map(([name]) => name);
      expect(names[names.length - 2]).toBe('beginPath');
      expect(names[names.length - 1]).toBe('restore');
    });

    it('never mutates the annotation while drawing', () => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);

      const withStyle = createAnnotation({ FillStyle: 'hatch' });
      const withStaleBackup = createAnnotation({ FillStyle: '' });
      withStaleBackup.setCustomData(FILL_CDATA_KEY, 'removed');
      const baselineCalls = withStaleBackup.setCustomDataCalls;

      for (let i = 0; i < 20; i += 1) {
        handlers.draw(createContext(), 'matrix', 0, { annotation: withStyle, originalDraw: jest.fn() });
        handlers.draw(createContext(), 'matrix', 0, { annotation: withStaleBackup, originalDraw: jest.fn() });
      }

      expect(withStyle.setCustomDataCalls).toBe(0);
      expect(withStaleBackup.setCustomDataCalls).toBe(baselineCalls);
    });
  });

  describe('persistence', () => {
    beforeEach(() => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
    });

    // Chaining setCustomSerializeHandler/setCustomDeserializeHandler on classes with real PDF-backed
    // annotations has produced annotations that serialize to an empty element (missing even required
    // attributes like page). setCustomData round-trips through XFDF natively without any override, so
    // persistence relies solely on that customData mirror plus the document-load reconciliation below.
    it('does not install a custom serialize or deserialize handler', () => {
      expect(window.Core.Annotations.setCustomSerializeHandler).not.toHaveBeenCalled();
      expect(window.Core.Annotations.setCustomDeserializeHandler).not.toHaveBeenCalled();
    });

    it('persists the fill style key through customData', () => {
      const annotation = createAnnotation({ FillStyle: 'hatch' });
      annotManager.trigger('annotationChanged', [annotation]);

      expect(annotation.getCustomData(FILL_CDATA_KEY)).toBe('hatch');
    });
  });

  describe('reconciliation on selection', () => {
    beforeEach(() => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
    });

    it('restores a lost fill style from the customData backup and redraws', () => {
      const annotation = createAnnotation();
      annotation.setCustomData(FILL_CDATA_KEY, 'hatch');

      annotManager.trigger('annotationSelected', [annotation]);

      expect(annotation.FillStyle).toBe('hatch');
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
    });

    it('clears a stale backup key without throwing or redrawing', () => {
      const annotation = createAnnotation();
      annotation.setCustomData(FILL_CDATA_KEY, 'removed');

      expect(() => annotManager.trigger('annotationSelected', [annotation])).not.toThrow();
      expect(annotation.FillStyle).toBe('');
      expect(annotation.getCustomData(FILL_CDATA_KEY)).toBe('');
      expect(annotManager.drawAnnotationsFromList).not.toHaveBeenCalled();
    });

    it('mirrors the live fill style into customData when the annotation changes', () => {
      const annotation = createAnnotation({ FillStyle: 'hatch' });

      annotManager.trigger('annotationChanged', [annotation]);

      expect(annotation.getCustomData(FILL_CDATA_KEY)).toBe('hatch');
    });

    it('restores a custom fill style cleared while transforming an annotation', () => {
      const annotation = createAnnotation({ FillStyle: 'hatch' });
      annotManager.trigger('annotationChanged', [annotation]);

      annotation.FillStyle = '';
      annotManager.trigger('annotationChanged', [annotation]);

      expect(annotation.FillStyle).toBe('hatch');
      expect(annotation.getCustomData(FILL_CDATA_KEY)).toBe('hatch');
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
    });

    it('clears the backup when the fill style is changed to a non-custom value', () => {
      const annotation = createAnnotation({ FillStyle: 'hatch' });
      annotManager.trigger('annotationChanged', [annotation]);

      annotation.FillStyle = '';
      manager.syncCustomFillStyleSelection(annotation, '');
      annotManager.trigger('annotationChanged', [annotation]);

      expect(annotation.getCustomData(FILL_CDATA_KEY)).toBe('');
    });

    it('does not rewrite customData when the mirror is already correct', () => {
      const annotation = createAnnotation({ FillStyle: 'hatch' });
      annotManager.trigger('annotationChanged', [annotation]);
      const callsAfterFirstMirror = annotation.setCustomDataCalls;

      annotManager.trigger('annotationChanged', [annotation]);
      annotManager.trigger('annotationChanged', [annotation]);

      expect(annotation.setCustomDataCalls).toBe(callsAfterFirstMirror);
    });
  });

  describe('unregistering', () => {
    it('resets shape tool defaults using the removed style to solid fill', () => {
      const toolsUsingStyle = ['Rectangle', 'Ellipse', 'Polygon', 'AreaMeasurement', 'EllipseMeasurement', 'CustomShape']
        .reduce((toolMap, annotationType) => {
          toolMap[`AnnotationCreate${annotationType}`] = {
            defaults: { FillStyle: 'hatch' },
            setStyles: jest.fn(),
          };
          return toolMap;
        }, {});
      const unrelatedTool = {
        defaults: { FillStyle: 'other' },
        setStyles: jest.fn(),
      };
      window.Core.documentViewer.getToolModeMap.mockReturnValue({
        ...toolsUsingStyle,
        AnnotationCreateOther: unrelatedTool,
      });
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);

      manager.unregisterFillDrawHandler('hatch');

      Object.values(toolsUsingStyle).forEach((tool) => {
        expect(tool.setStyles).toHaveBeenCalledWith({ FillStyle: '' });
      });
      expect(unrelatedTool.setStyles).not.toHaveBeenCalled();
    });

    it('clears the key, invalidates the cached appearance, and redraws existing annotations', () => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
      const usingStyle = createAnnotation({ FillStyle: 'hatch' });
      usingStyle.setCustomData(FILL_CDATA_KEY, 'hatch');
      const untouched = createAnnotation({ FillStyle: 'other' });
      annotManager.annotations = [usingStyle, untouched];

      manager.unregisterFillDrawHandler('hatch');

      expect(usingStyle.FillStyle).toBe('');
      expect(usingStyle.getCustomData(FILL_CDATA_KEY)).toBe('');
      expect(untouched.FillStyle).toBe('other');
      expect(usingStyle.setModified).toHaveBeenCalledWith(false, false, true);
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([usingStyle]);
    });

    it('invalidates the cached appearance when the customData mirror has not been written yet', () => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
      const usingStyle = createAnnotation({ FillStyle: 'hatch' });
      annotManager.annotations = [usingStyle];

      manager.unregisterFillDrawHandler('hatch');

      expect(usingStyle.FillStyle).toBe('');
      expect(usingStyle.setModified).toHaveBeenCalledWith(false, false, true);
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([usingStyle]);
    });

    it('clears and redraws annotations excluded by a replacement style scope', () => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
      const ellipse = createAnnotation({ FillStyle: 'hatch' });
      Object.setPrototypeOf(ellipse, window.Core.Annotations.EllipseAnnotation.prototype);
      annotManager.annotations = [ellipse];

      manager.registerFillDrawHandler('hatch', jest.fn(), ['rectangle']);

      expect(ellipse.FillStyle).toBe('');
      expect(ellipse.setModified).toHaveBeenCalledWith(false, false, true);
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([ellipse]);
    });

    it('keeps and redraws annotations included by a replacement style scope', () => {
      manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
      const rectangle = createAnnotation({ FillStyle: 'hatch' });
      Object.setPrototypeOf(rectangle, window.Core.Annotations.RectangleAnnotation.prototype);
      annotManager.annotations = [rectangle];

      manager.registerFillDrawHandler('hatch', jest.fn(), ['rectangle']);

      expect(rectangle.FillStyle).toBe('hatch');
      expect(rectangle.setModified).toHaveBeenCalledWith(false, false, true);
      expect(annotManager.drawAnnotationsFromList).toHaveBeenCalledWith([rectangle]);
    });


    it('stops dispatching to the removed draw handler', () => {
      const drawHandler = jest.fn();
      const originalDraw = jest.fn();
      manager.registerFillDrawHandler('hatch', drawHandler, ['all']);
      manager.unregisterFillDrawHandler('hatch');

      handlers.draw(createContext(), 'matrix', 0, { annotation: createAnnotation({ FillStyle: 'hatch' }), originalDraw });

      expect(drawHandler).not.toHaveBeenCalled();
      expect(originalDraw).toHaveBeenCalled();
    });
  });

  it('does not add duplicate annotation manager listeners across document loads', () => {
    manager.registerFillDrawHandler('hatch', jest.fn(), ['all']);
    const listenerCount = annotManager.listeners['annotationSelected'].length;

    documentLoadedListeners.forEach((cb) => cb());
    documentLoadedListeners.forEach((cb) => cb());

    expect(annotManager.listeners['annotationSelected']).toHaveLength(listenerCount);
  });
});
