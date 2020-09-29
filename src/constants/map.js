import i18next from 'i18next';

/**
 * this is the map we used to get information about annotations and tools
 * for example, we can look for map.freeHand.currentPalette to get the current color palette for freeHandAnnotation and freeHandTool
 * ideally, this map file should be the only place which provides information about annotations and tools
 * if you are tempted to create a new map file(which maps a tool/annotation to something else) under this constants folder
 * please make sure that it is not possible to implement that map here
 * @ignore
 */
const map = {
  signature: {
    icon: 'icon-tool-signature',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateSignature'],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.FreeHandAnnotation &&
      annotation.Subject === i18next.t('annotation.signature'),
  },
  freeHand: {
    icon: 'icon-tool-pen-line',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateFreeHand',
      'AnnotationCreateFreeHand2',
      'AnnotationCreateFreeHand3',
      'AnnotationCreateFreeHand4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.FreeHandAnnotation,
  },
  freeText: {
    icon: 'icon-tool-text-free-text',
    iconColor: 'TextColor',
    currentPalette: 'TextColor',
    availablePalettes: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateFreeText',
      'AnnotationCreateFreeText2',
      'AnnotationCreateFreeText3',
      'AnnotationCreateFreeText4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
        window.Annotations.FreeTextAnnotation.Intent.FreeText,
  },
  distanceMeasurement: {
    icon: 'ic_annotation_distance_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateDistanceMeasurement',
      'AnnotationCreateDistanceMeasurement2',
      'AnnotationCreateDistanceMeasurement3',
      'AnnotationCreateDistanceMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.LineAnnotation &&
      annotation.IT === 'LineDimension' &&
      annotation.Measure,
  },
  perimeterMeasurement: {
    icon: 'ic_annotation_perimeter_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreatePerimeterMeasurement',
      'AnnotationCreatePerimeterMeasurement2',
      'AnnotationCreatePerimeterMeasurement3',
      'AnnotationCreatePerimeterMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolylineAnnotation &&
      annotation.IT === 'PolyLineDimension' &&
      annotation.Measure,
  },
  rectangularAreaMeasurement: {
    icon: 'ic_annotation_rectangular_area_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateRectangularAreaMeasurement',
      'AnnotationCreateRectangularAreaMeasurement2',
      'AnnotationCreateRectangularAreaMeasurement3',
      'AnnotationCreateRectangularAreaMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.IT === 'PolygonDimension' &&
      annotation.Measure &&
      annotation.isRectangularPolygon(),
  },
  areaMeasurement: {
    icon: 'ic_annotation_area_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateAreaMeasurement',
      'AnnotationCreateAreaMeasurement2',
      'AnnotationCreateAreaMeasurement3',
      'AnnotationCreateAreaMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.IT === 'PolygonDimension' &&
      annotation.Measure,
  },
  ellipseMeasurement: {
    icon: 'ic_annotation_ellipse_area_black',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateEllipseMeasurement',
      'AnnotationCreateEllipseMeasurement2',
      'AnnotationCreateEllipseMeasurement3',
      'AnnotationCreateEllipseMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.EllipseAnnotation &&
      annotation.IT === 'EllipseDimension' &&
      annotation.Measure,
  },
  countMeasurement: {
    icon: 'ic_check_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateCountMeasurement',
      'AnnotationCreateCountMeasurement2',
      'AnnotationCreateCountMeasurement3',
      'AnnotationCreateCountMeasurement4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.StickyAnnotation &&
      annotation.getCustomData('trn-is-count')
  },
  callout: {
    icon: 'icon-tool-callout-line',
    iconColor: 'StrokeColor',
    currentPalette: 'TextColor',
    availablePalettes: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateCallout',
      'AnnotationCreateCallout2',
      'AnnotationCreateCallout3',
      'AnnotationCreateCallout4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
        window.Annotations.FreeTextAnnotation.Intent.FreeTextCallout,
  },
  line: {
    icon: 'icon-tool-shape-line',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateLine',
      'AnnotationCreateLine2',
      'AnnotationCreateLine3',
      'AnnotationCreateLine4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.LineAnnotation &&
      annotation.getStartStyle() === 'None' &&
      annotation.getEndStyle() === 'None',
  },
  arrow: {
    icon: 'icon-tool-shape-arrow',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateArrow',
      'AnnotationCreateArrow2',
      'AnnotationCreateArrow3',
      'AnnotationCreateArrow4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.LineAnnotation &&
      (annotation.getStartStyle() !== 'None' ||
        annotation.getEndStyle() !== 'None'),
  },
  polygon: {
    icon: 'icon-tool-shape-polygon',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreatePolygon',
      'AnnotationCreatePolygon2',
      'AnnotationCreatePolygon3',
      'AnnotationCreatePolygon4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.Style !== 'cloudy',
  },
  cloud: {
    icon: 'icon-tool-shape-cloud',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreatePolygonCloud',
      'AnnotationCreatePolygonCloud2',
      'AnnotationCreatePolygonCloud3',
      'AnnotationCreatePolygonCloud4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.Style === 'cloudy',
  },
  highlight: {
    icon: 'icon-tool-text-manipulation-highlight',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextHighlight',
      'AnnotationCreateTextHighlight2',
      'AnnotationCreateTextHighlight3',
      'AnnotationCreateTextHighlight4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.TextHighlightAnnotation,
  },
  underline: {
    icon: 'icon-tool-text-manipulation-underline',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextUnderline',
      'AnnotationCreateTextUnderline2',
      'AnnotationCreateTextUnderline3',
      'AnnotationCreateTextUnderline4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.TextUnderlineAnnotation,
  },
  squiggly: {
    icon: 'icon-tool-text-manipulation-squiggly',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextSquiggly',
      'AnnotationCreateTextSquiggly2',
      'AnnotationCreateTextSquiggly3',
      'AnnotationCreateTextSquiggly4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.TextSquigglyAnnotation,
  },
  strikeout: {
    icon: 'icon-tool-text-manipulation-strikethrough',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextStrikeout',
      'AnnotationCreateTextStrikeout2',
      'AnnotationCreateTextStrikeout3',
      'AnnotationCreateTextStrikeout4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.TextStrikeoutAnnotation,
  },
  redaction: {
    icon: 'ic_annotation_redact_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateRedaction'],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.RedactionAnnotation,
  },
  rectangle: {
    icon: 'icon-tool-shape-rectangle',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateRectangle',
      'AnnotationCreateRectangle2',
      'AnnotationCreateRectangle3',
      'AnnotationCreateRectangle4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.RectangleAnnotation,
  },
  ellipse: {
    icon: 'icon-tool-shape-oval',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateEllipse',
      'AnnotationCreateEllipse2',
      'AnnotationCreateEllipse3',
      'AnnotationCreateEllipse4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.EllipseAnnotation,
  },
  polyline: {
    icon: 'icon-tool-shape-polyline',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreatePolyline',
      'AnnotationCreatePolyline2',
      'AnnotationCreatePolyline3',
      'AnnotationCreatePolyline4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.PolylineAnnotation,
  },
  stickyNote: {
    icon: 'icon-tool-comment-line',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateSticky',
      'AnnotationCreateSticky2',
      'AnnotationCreateSticky3',
      'AnnotationCreateSticky4',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.StickyAnnotation,
  },
  stamp: {
    icon: 'icon-tool-stamp-line',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: [
      'AnnotationCreateStamp',
      'AnnotationCreateRubberStamp',
    ],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.StampAnnotation,
  },
  edit: {
    icon: 'ic_select_black_24px',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AnnotationEdit'],
    annotationCheck: null,
  },
  pan: {
    icon: 'ic_pan_black_24px',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['Pan'],
    annotationCheck: null,
  },
  textSelect: {
    icon: 'textselect_cursor',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['TextSelect'],
    annotationCheck: null,
  },
  marqueeZoomTool: {
    icon: null,
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['MarqueeZoomTool'],
    annotationCheck: null,
  },
  eraser: {
    icon: 'ic_annotation_eraser_black_24px',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AnnotationEraserTool'],
    annotationCheck: annotation =>
      annotation instanceof window.Annotations.FreeHandAnnotation,
  },
  cropPage: {
    icon: 'ic_crop_black_24px',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['CropPage'],
    annotationCheck: null,
  },
  fileattachment: {
    icon: 'ic_fileattachment_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateFileAttachment'],
    annotationCheck: annotation => annotation instanceof window.Annotations.FileAttachmentAnnotation,
  },
};

export const mapToolNameToKey = toolName =>
  Object.keys(map).find(key => map[key].toolNames.includes(toolName));

export const mapAnnotationToKey = annotation =>
  Object.keys(map).find(key => {
    const { annotationCheck } = map[key];
    return annotationCheck && annotationCheck(annotation);
  });

export const mapAnnotationToToolName = annotation =>
  map[mapAnnotationToKey(annotation)].toolNames[0];

export const copyMapWithDataProperties = (...properties) =>
  Object.keys(map).reduce((newMap, key) => {
    newMap[key] = {};
    properties.forEach(property => {
      newMap[key][property] = map[key][property];
    });

    return newMap;
  }, {});

export const register = (tool, annotationConstructor, customAnnotCheckFunc) => {
  const { toolName, buttonImage, toolObject } = tool;
  const key = toolName;
  const availablePalettes = ['TextColor', 'StrokeColor', 'FillColor'].filter(
    property => toolObject.defaults && toolObject.defaults[property],
  );

  map[key] = {
    icon: buttonImage,
    iconColor: availablePalettes[0],
    currentPalette: availablePalettes[0],
    availablePalettes,
    toolNames: [toolName],
    annotationCheck: customAnnotCheckFunc ?
      annotation => customAnnotCheckFunc(annotation) :
      (annotationConstructor ? annotation => annotation instanceof annotationConstructor: null),
  };
};

// we return an empty object here to prevent some components from accessing undefined
// if the map doesn't have a key for some annotations
export const getDataWithKey = key => map[key] || { icon: 'icon - tool - pen and shape - phone - line' };
