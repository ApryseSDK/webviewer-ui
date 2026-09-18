describe('customLineStyleManager', () => {
  jest.mock('core', () => ({
    getAnnotationManager: jest.fn(),
    getDocumentViewers: jest.fn(),
    getMultiViewerModeActive: jest.fn(),
  }));

  let core;
  let originalCore;

  beforeEach(() => {
    jest.resetModules();
    core = require('core');
    originalCore = window.Core;
  });

  jest.fn(),
  afterEach(() => {
    window.Core = originalCore;
  });

  const createAnnotation = ({ start = 'None', middle = 'solid', end = 'None', customData = {} } = {}) => {
    const storedData = { ...customData };
    return {
      Style: middle,
      StartLineStyle: start,
      EndLineStyle: end,
      _startStyle: start,
      _endStyle: end,
      StrokeThickness: 2,
      adjustRect: jest.fn(),
      setModified: jest.fn(),
      getStartStyle() {
        return this._startStyle;
      },
      setStartStyle(key) {
        this._startStyle = key;
        this.StartLineStyle = key;
      },
      getEndStyle() {
        return this._endStyle;
      },
      setEndStyle(key) {
        this._endStyle = key;
        this.EndLineStyle = key;
      },
      getCustomData(key) {
        return storedData[key] || '';
      },
      setCustomData(key, value) {
        storedData[key] = value;
      },
      storedData,
    };
  };

  const setupCore = ({ annotations = [], hasDocument = false } = {}) => {
    class LineAnnotation {}
    class PolylineAnnotation {}
    class RectangleAnnotation {}
    class EllipseAnnotation {}

    const handlers = {};
    const appearance = {
      default: jest.fn(() => 'default-appearance'),
      generated: jest.fn(() => 'generated-appearance'),
    };
    const annotationManagerListeners = {};
    const annotationManager = {
      addEventListener: jest.fn((event, listener) => {
        annotationManagerListeners[event] = listener;
      }),
      getAnnotationsList: jest.fn(() => annotations),
      drawAnnotationsFromList: jest.fn(),
    };
    core.getAnnotationManager.mockReturnValue(annotationManager);
    core.getDocumentViewers.mockReturnValue([]);
    core.getMultiViewerModeActive.mockReturnValue(false);
    const Annotations = {
      LineAnnotation,
      PolylineAnnotation,
      RectangleAnnotation,
      EllipseAnnotation,
      setCustomDrawHandler: jest.fn((AnnotationClass, handler) => {
        handlers.draw = handler;
        AnnotationClass.prototype.originalGetCustomAppearance = appearance.default;
        AnnotationClass.prototype.getCustomAppearance = appearance.generated;
      }),
      setCustomSerializeHandler: jest.fn((AnnotationClass, handler) => {
        handlers.serialize = handler;
      }),
      setCustomDeserializeHandler: jest.fn((AnnotationClass, handler) => {
        handlers.deserialize = handler;
      }),
    };
    const documentViewer = {
      addEventListener: jest.fn(),
      getDocument: jest.fn(() => hasDocument ? {} : null),
      getAnnotationManager: jest.fn(() => annotationManager),
      getToolModeMap: jest.fn(() => ({})),
    };
    window.Core = { Annotations, documentViewer };
    core.getDocumentViewers.mockReturnValue([documentViewer]);
    annotations.forEach((annotation) => Object.setPrototypeOf(annotation, LineAnnotation.prototype));

    return { Annotations, annotationManager, annotationManagerListeners, appearance, documentViewer, handlers };
  };

  const registerAllSections = (registerCustomLineStyle) => {
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: jest.fn() });
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });
    registerCustomLineStyle({ key: 'custom-end', section: 'end', drawHandler: jest.fn() });
  };

  it('serializes and deserializes start, middle, and end style keys', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerAllSections(registerCustomLineStyle);

    const annotation = createAnnotation({
      start: 'custom-start',
      middle: 'custom-middle',
      end: 'custom-end',
    });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const attributes = {};
    const element = {
      setAttribute: jest.fn((key, value) => {
        attributes[key] = value;
      }),
      getAttribute: jest.fn((key) => attributes[key] || ''),
    };

    handlers.serialize(element, null, { annotation, originalSerialize: jest.fn() });

    expect(attributes).toEqual({
      'trn-custom-style-key-start': 'custom-start',
      'trn-custom-style-key-middle': 'custom-middle',
      'trn-custom-style-key-end': 'custom-end',
    });

    annotation.setStartStyle('None');
    annotation.Style = 'solid';
    annotation.setEndStyle('None');
    handlers.deserialize(element, null, { annotation, originalDeserialize: jest.fn() });

    expect(annotation.StartLineStyle).toBe('custom-start');
    expect(annotation.Style).toBe('custom-middle');
    expect(annotation.EndLineStyle).toBe('custom-end');
    expect(annotation.storedData).toEqual({
      _customStyleKeyStart: 'custom-start',
      _customStyleKeyMiddle: 'custom-middle',
      _customStyleKeyEnd: 'custom-end',
    });
    expect(annotation._customLineStyleStartPadding).toBe(10);
    expect(annotation._customLineStyleEndPadding).toBe(10);
  });

  it('writes style keys onto the element returned by the original serializer', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerAllSections(registerCustomLineStyle);

    const annotation = createAnnotation({ middle: 'custom-middle' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const passedInAttributes = {};
    const passedInElement = { setAttribute: jest.fn((key, value) => {
      passedInAttributes[key] = value;
    }) };
    const originalAttributes = {};
    const originalElement = { setAttribute: jest.fn((key, value) => {
      originalAttributes[key] = value;
    }) };

    const result = handlers.serialize(passedInElement, null, {
      annotation,
      originalSerialize: jest.fn(() => originalElement),
    });

    expect(result).toBe(originalElement);
    expect(originalAttributes).toEqual({ 'trn-custom-style-key-middle': 'custom-middle' });
    expect(passedInAttributes).toEqual({});
  });

  it('composes active handlers in middle, start, end order', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const startHandler = jest.fn();
    const middleHandler = jest.fn();
    const endHandler = jest.fn();
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: startHandler });
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: middleHandler });
    registerCustomLineStyle({ key: 'custom-end', section: 'end', drawHandler: endHandler });
    const annotation = createAnnotation({ start: 'custom-start', middle: 'custom-middle', end: 'custom-end' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);

    handlers.draw({}, null, 0, { annotation, originalDraw: jest.fn() });

    expect(middleHandler).toHaveBeenCalledWith(
      expect.anything(), null, 0, expect.objectContaining({ section: 'middle', activeSections: ['middle', 'start', 'end'] }),
    );
    expect(startHandler).toHaveBeenCalledWith(
      expect.anything(), null, 0, expect.objectContaining({ section: 'start', activeSections: ['middle', 'start', 'end'] }),
    );
    expect(endHandler).toHaveBeenCalledWith(
      expect.anything(), null, 0, expect.objectContaining({ section: 'end', activeSections: ['middle', 'start', 'end'] }),
    );
    expect(middleHandler.mock.invocationCallOrder[0]).toBeLessThan(startHandler.mock.invocationCallOrder[0]);
    expect(startHandler.mock.invocationCallOrder[0]).toBeLessThan(endHandler.mock.invocationCallOrder[0]);
  });

  it.each([
    ['start', { start: 'custom-start' }],
    ['end', { end: 'custom-end' }],
  ])('dispatches a custom %s handler when selected independently', (section, annotationStyles) => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const drawHandler = jest.fn();
    const key = `custom-${section}`;
    registerCustomLineStyle({ key, section, drawHandler });
    const annotation = createAnnotation(annotationStyles);
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const drawArguments = [{}, null, 0, { annotation, originalDraw: jest.fn() }];

    handlers.draw(...drawArguments);

    expect(drawHandler).toHaveBeenCalledWith(
      drawArguments[0],
      drawArguments[1],
      drawArguments[2],
      expect.objectContaining({
        annotation,
        originalDraw: expect.any(Function),
        section,
        activeSections: [section],
      }),
    );
  });

  it.each([
    ['start', 'end'],
    ['end', 'start'],
  ])('draws a custom %s style at the correct endpoint when the line is drawn backwards', (registeredSection, liveSection) => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const drawHandler = jest.fn((ctx, pageMatrix, rotation, { annotation }) => {
      expect(annotation.Start).toEqual({ x: 100, y: 100 });
      expect(annotation.End).toEqual({ x: 0, y: 0 });
    });
    registerCustomLineStyle({ key: 'custom-backwards', section: registeredSection, drawHandler });
    const annotation = createAnnotation({ [liveSection]: 'custom-backwards' });
    annotation.Start = { x: 0, y: 0 };
    annotation.End = { x: 100, y: 100 };
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);

    handlers.draw({}, null, 0, { annotation, originalDraw: jest.fn() });

    expect(drawHandler).toHaveBeenCalled();
    expect(annotation.Start).toEqual({ x: 0, y: 0 });
    expect(annotation.End).toEqual({ x: 100, y: 100 });
  });

  it('masks a custom endpoint style before drawing the built-in line', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({
      key: 'custom-end-backwards',
      section: 'end',
      drawHandler: (ctx, pageMatrix, rotation, { originalDraw }) => originalDraw(ctx, pageMatrix),
    });
    const annotation = createAnnotation({ start: 'custom-end-backwards' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const originalDraw = jest.fn(() => {
      expect(annotation.getStartStyle()).toBe('None');
      expect(annotation.getEndStyle()).toBe('None');
    });

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(originalDraw).toHaveBeenCalledTimes(1);
    expect(annotation.getStartStyle()).toBe('custom-end-backwards');
  });

  it('draws the built-in baseline at most once with custom keys masked', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const invokeOriginal = (ctx, pageMatrix, rotation, { originalDraw }) => originalDraw(ctx, pageMatrix);
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: invokeOriginal });
    registerCustomLineStyle({ key: 'custom-end', section: 'end', drawHandler: invokeOriginal });
    const annotation = createAnnotation({ middle: 'custom-middle', end: 'custom-end' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const originalDraw = jest.fn(() => {
      expect(annotation.Style).toBe('solid');
      expect(annotation.getEndStyle()).toBe('None');
    });

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(originalDraw).toHaveBeenCalledTimes(1);
    expect(annotation.Style).toBe('custom-middle');
    expect(annotation.getEndStyle()).toBe('custom-end');
  });

  it('draws a built-in endpoint without the built-in line body for a replacement middle style', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const middleHandler = jest.fn((ctx, pageMatrix, rotation, { originalDraw, originalDrawEndings }) => {
      originalDrawEndings(ctx, pageMatrix);
      originalDraw(ctx, pageMatrix);
    });
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: middleHandler });
    const annotation = createAnnotation({ middle: 'custom-middle', end: 'OpenArrow' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    annotation.drawLine = jest.fn();
    const originalDraw = jest.fn(() => {
      expect(annotation.Style).toBe('solid');
      expect(annotation.getEndStyle()).toBe('OpenArrow');
      annotation.drawLine();
    });

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(originalDraw).toHaveBeenCalledTimes(1);
    expect(annotation.drawLine).not.toHaveBeenCalled();
    expect(annotation.Style).toBe('custom-middle');
    expect(annotation.getEndStyle()).toBe('OpenArrow');
  });

  it('uses the original draw implementation for built-in line styles', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: jest.fn() });
    const annotation = createAnnotation({ start: 'OpenArrow', middle: 'solid', end: 'None' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const originalDraw = jest.fn();

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(originalDraw).toHaveBeenCalled();
  });

  it('does not dispatch a style to a non-line annotation', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const drawHandler = jest.fn();
    registerCustomLineStyle({ key: 'custom-style', section: 'middle', drawHandler });
    const annotation = createAnnotation({ middle: 'custom-style' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.RectangleAnnotation.prototype);
    const originalDraw = jest.fn();

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(drawHandler).not.toHaveBeenCalled();
    expect(originalDraw).toHaveBeenCalled();
  });

  it('dispatches a line style to a polyline and draws built-in endings without its path', () => {
    const { Annotations, handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const drawHandler = jest.fn((ctx, pageMatrix, rotation, { originalDrawEndings }) => {
      originalDrawEndings(ctx, pageMatrix);
    });
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler });
    const annotation = createAnnotation({ middle: 'custom-middle', end: 'OpenArrow' });
    annotation.drawLines = jest.fn();
    Object.setPrototypeOf(annotation, Annotations.PolylineAnnotation.prototype);
    const originalDraw = jest.fn(() => annotation.drawLines());

    handlers.draw({}, null, 0, { annotation, originalDraw });

    expect(drawHandler).toHaveBeenCalled();
    expect(originalDraw).toHaveBeenCalledTimes(1);
    expect(annotation.drawLines).not.toHaveBeenCalled();
  });

  it('preserves an unavailable key and restores it after late registration', () => {
    const annotation = createAnnotation();
    const { annotationManager, handlers } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'known-start', section: 'start', drawHandler: jest.fn() });
    const element = {
      getAttribute: jest.fn((attribute) => attribute === 'trn-custom-style-key-start' ? 'late-start' : ''),
    };

    handlers.deserialize(element, null, { annotation, originalDeserialize: jest.fn() });

    expect(annotation.StartLineStyle).toBe('None');
    expect(annotation.storedData._customStyleKeyStart).toBe('late-start');

    registerCustomLineStyle({ key: 'late-start', section: 'start', drawHandler: jest.fn() });

    expect(annotation.StartLineStyle).toBe('late-start');
    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it('keeps a conflicting built-in live value and clears the stale stored key', () => {
    const annotation = createAnnotation({
      start: 'OpenArrow',
      customData: { _customStyleKeyStart: 'custom-start' },
    });
    const { annotationManagerListeners } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: jest.fn() });

    annotationManagerListeners.annotationSelected([annotation]);

    expect(annotation.StartLineStyle).toBe('OpenArrow');
    expect(annotation.storedData._customStyleKeyStart).toBe('');
  });

  it('clears a registered stored key when the live style changes to its fallback', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    const { annotationManagerListeners } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    annotation.Style = 'solid';
    annotationManagerListeners.annotationChanged([annotation]);

    expect(annotation.storedData._customStyleKeyMiddle).toBe('');
  });

  it('falls back safely and redraws when a selected style is unregistered', () => {
    const annotation = createAnnotation({ end: 'custom-end' });
    const { annotationManager } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle, unregisterCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-end', section: 'end', drawHandler: jest.fn() });

    unregisterCustomLineStyle('custom-end', 'end');

    expect(annotation.EndLineStyle).toBe('None');
    expect(annotation.storedData._customStyleKeyEnd).toBe('');
    expect(annotation._customLineStyleEndPadding).toBe(0);
    expect(annotation.setModified).toHaveBeenCalledWith(false, false, true);
    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it.each([
    ['start', 'end'],
    ['end', 'start'],
  ])('falls back safely when an unregistered %s style is on the opposite endpoint', (registeredSection, liveSection) => {
    const key = `custom-${registeredSection}`;
    const annotation = createAnnotation({ [liveSection]: key });
    const { annotationManager } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle, unregisterCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key, section: registeredSection, drawHandler: jest.fn() });

    unregisterCustomLineStyle(key, registeredSection);

    expect(annotation[`${liveSection === 'start' ? 'Start' : 'End'}LineStyle`]).toBe('None');
    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it('resets line tool defaults when styles used by its dropdowns are unregistered', () => {
    const { documentViewer } = setupCore();
    const createTool = (defaults) => ({
      defaults,
      setStyles(styles) {
        Object.assign(this.defaults, styles);
      },
    });
    const toolsUsingStyle = {
      AnnotationCreateLine: createTool({ StartLineStyle: 'custom-style' }),
      AnnotationCreateDistanceMeasurement: createTool({ EndLineStyle: 'custom-style' }),
      AnnotationCreatePerimeterMeasurement: createTool({ StrokeStyle: 'custom-style' }),
      AnnotationCreateCustomLine: createTool({ StrokeStyle: 'custom-style' }),
    };
    const unrelatedTool = createTool({ StrokeStyle: 'other' });
    jest.spyOn(unrelatedTool, 'setStyles');
    documentViewer.getToolModeMap.mockReturnValue({
      ...toolsUsingStyle,
      AnnotationCreateOther: unrelatedTool,
    });
    const { registerCustomLineStyle, unregisterCustomLineStyle } = require('./customLineStyleManager');
    ['start', 'middle', 'end'].forEach((section) => {
      registerCustomLineStyle({ key: 'custom-style', section, drawHandler: jest.fn() });
    });

    unregisterCustomLineStyle('custom-style');

    expect(toolsUsingStyle.AnnotationCreateLine.defaults.StartLineStyle).toBe('None');
    expect(toolsUsingStyle.AnnotationCreateDistanceMeasurement.defaults.EndLineStyle).toBe('None');
    expect(toolsUsingStyle.AnnotationCreatePerimeterMeasurement.defaults.StrokeStyle).toBe('solid');
    expect(toolsUsingStyle.AnnotationCreateCustomLine.defaults.StrokeStyle).toBe('solid');
    expect(unrelatedTool.setStyles).not.toHaveBeenCalled();
  });

  it('unregisters a style when the annotation manager is available before a document is loaded', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    const { annotationManager } = setupCore({ annotations: [annotation] });
    const { registerCustomLineStyle, unregisterCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    unregisterCustomLineStyle('custom-middle', 'middle');

    expect(annotation.Style).toBe('solid');
    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it('redraws annotations in both viewers when unregistering in multi-viewer mode', () => {
    const firstAnnotation = createAnnotation({ middle: 'custom-middle' });
    const secondAnnotation = createAnnotation({ middle: 'custom-middle' });
    const { Annotations, annotationManager: firstAnnotationManager } = setupCore({ annotations: [firstAnnotation] });
    const secondAnnotationManager = {
      addEventListener: jest.fn(),
      getAnnotationsList: jest.fn(() => [secondAnnotation]),
      drawAnnotationsFromList: jest.fn(),
    };
    Object.setPrototypeOf(secondAnnotation, Annotations.LineAnnotation.prototype);
    core.getMultiViewerModeActive.mockReturnValue(true);
    core.getDocumentViewers.mockReturnValue([
      { addEventListener: jest.fn(), getAnnotationManager: () => firstAnnotationManager },
      { addEventListener: jest.fn(), getAnnotationManager: () => secondAnnotationManager },
    ]);
    const { registerCustomLineStyle, unregisterCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    unregisterCustomLineStyle('custom-middle', 'middle');

    expect(firstAnnotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([firstAnnotation]);
    expect(secondAnnotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([secondAnnotation]);
  });

  it('installs annotation manager listeners only once', () => {
    const { annotationManager } = setupCore({ hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');

    registerAllSections(registerCustomLineStyle);

    expect(annotationManager.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('clears an unavailable stored key when the user explicitly selects a built-in fallback', () => {
    const annotation = createAnnotation({
      start: 'None',
      customData: { _customStyleKeyStart: 'unavailable-start' },
    });
    setupCore();
    const { syncCustomLineStyleSelection } = require('./customLineStyleManager');

    syncCustomLineStyleSelection(annotation, 'start', 'None');

    expect(annotation.storedData._customStyleKeyStart).toBe('');
  });

  it('applies stroke-aware endpoint padding and clears it for a built-in selection', () => {
    const annotation = createAnnotation({ start: 'custom-start' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: jest.fn() });

    syncCustomLineStyleSelection(annotation, 'start', 'custom-start');

    expect(annotation._customLineStyleStartPadding).toBe(10);
    expect(annotation.adjustRect).toHaveBeenCalled();

    syncCustomLineStyleSelection(annotation, 'start', 'None');

    expect(annotation._customLineStyleStartPadding).toBe(0);
  });

  it('uses configured endpoint padding callbacks', () => {
    const annotation = createAnnotation({ end: 'custom-end' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({
      key: 'custom-end',
      section: 'end',
      drawHandler: jest.fn(),
      padding: (lineAnnotation) => lineAnnotation.StrokeThickness * 9,
    });

    syncCustomLineStyleSelection(annotation, 'end', 'custom-end');

    expect(annotation._customLineStyleEndPadding).toBe(18);
  });

  it('recalculates default endpoint padding when stroke thickness changes', () => {
    const annotation = createAnnotation({ start: 'custom-start' });
    const { annotationManagerListeners } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-start', section: 'start', drawHandler: jest.fn() });

    annotation.StrokeThickness = 6;
    annotationManagerListeners.annotationChanged([annotation]);

    expect(annotation._customLineStyleStartPadding).toBe(30);
  });

  it('falls back to default padding when a padding callback throws', () => {
    const annotation = createAnnotation({ end: 'custom-end' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({
      key: 'custom-end',
      section: 'end',
      drawHandler: jest.fn(),
      padding: () => {
        throw new Error('invalid padding');
      },
    });

    syncCustomLineStyleSelection(annotation, 'end', 'custom-end');

    expect(annotation._customLineStyleEndPadding).toBe(10);
  });

  it('pads the line rect for custom middle styles so downloads are not clipped', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    syncCustomLineStyleSelection(annotation, 'middle', 'custom-middle');

    expect(annotation._customLineStyleMiddlePadding).toBe(4);
  });

  it('uses the configured padding for custom middle styles', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({
      key: 'custom-middle',
      section: 'middle',
      drawHandler: jest.fn(),
      padding: (lineAnnotation) => lineAnnotation.StrokeThickness * 7,
    });

    syncCustomLineStyleSelection(annotation, 'middle', 'custom-middle');

    expect(annotation._customLineStyleMiddlePadding).toBe(14);
  });

  it('clears middle padding when the custom middle style is removed', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    setupCore();
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);
    const { registerCustomLineStyle, syncCustomLineStyleSelection } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    syncCustomLineStyleSelection(annotation, 'middle', 'custom-middle');
    syncCustomLineStyleSelection(annotation, 'middle', 'solid');

    expect(annotation._customLineStyleMiddlePadding).toBe(0);
  });

  it('rejects registrations without a draw handler at the manager boundary', () => {
    const { Annotations } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');

    expect(registerCustomLineStyle({ key: 'custom', section: 'middle' })).toBe(false);
    expect(Annotations.setCustomDrawHandler).not.toHaveBeenCalled();
  });

  it('redraws annotations already using a key when re-registering the same key and section', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    const { annotationManager } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');

    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });
    annotationManager.drawAnnotationsFromList.mockClear();

    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it('resets annotations outside a replacement style scope', () => {
    const annotation = createAnnotation({ middle: 'custom-middle' });
    annotation.IT = 'LineArrow';
    const { annotationManager } = setupCore({ annotations: [annotation], hasDocument: true });
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', appliesTo: ['line', 'arrow'], drawHandler: jest.fn() });
    annotationManager.drawAnnotationsFromList.mockClear();

    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', appliesTo: ['line'], drawHandler: jest.fn() });

    expect(annotation.Style).toBe('solid');
    expect(annotation.storedData._customStyleKeyMiddle).toBe('');
    expect(annotation.setModified).toHaveBeenCalledWith(false, false, true);
    expect(annotationManager.drawAnnotationsFromList).toHaveBeenCalledWith([annotation]);
  });

  it('does not reconcile custom-data or padding while drawing', () => {
    const { handlers } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });
    const annotation = createAnnotation({ middle: 'custom-middle' });
    Object.setPrototypeOf(annotation, window.Core.Annotations.LineAnnotation.prototype);

    handlers.draw({}, null, 0, { annotation, originalDraw: jest.fn() });

    expect(annotation.storedData._customStyleKeyMiddle).toBeUndefined();
    expect(annotation._customLineStyleMiddlePadding).toBeUndefined();
  });

  it('registers an omitted section as a middle style', () => {
    const { Annotations } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    const drawHandler = jest.fn();
    const styled = createAnnotation({ middle: 'custom' });
    const builtIn = createAnnotation();
    Object.setPrototypeOf(styled, Annotations.LineAnnotation.prototype);
    Object.setPrototypeOf(builtIn, Annotations.LineAnnotation.prototype);

    registerCustomLineStyle({ key: 'custom', drawHandler });

    expect(styled.getCustomAppearance()).toBe('generated-appearance');
    expect(builtIn.getCustomAppearance()).toBe('default-appearance');
  });

  it('generates an appearance only for annotations drawn with a registered style', () => {
    const { Annotations, appearance } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    const styled = createAnnotation({ middle: 'custom-middle' });
    Object.setPrototypeOf(styled, Annotations.LineAnnotation.prototype);
    const builtIn = createAnnotation();
    Object.setPrototypeOf(builtIn, Annotations.LineAnnotation.prototype);

    expect(styled.getCustomAppearance()).toBe('generated-appearance');
    expect(builtIn.getCustomAppearance()).toBe('default-appearance');
  });

  it('drops a stale generated appearance when the annotation no longer uses a registered style', () => {
    const { Annotations } = setupCore();
    const { registerCustomLineStyle } = require('./customLineStyleManager');
    registerCustomLineStyle({ key: 'custom-middle', section: 'middle', drawHandler: jest.fn() });

    const annotation = createAnnotation();
    annotation._hasCustomDrawnAppearance = true;
    annotation.removeCustomAppearance = jest.fn();
    Object.setPrototypeOf(annotation, Annotations.LineAnnotation.prototype);

    annotation.getCustomAppearance();

    expect(annotation.removeCustomAppearance).toHaveBeenCalled();
  });
});