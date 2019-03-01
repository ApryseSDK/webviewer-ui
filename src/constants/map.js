import i18next from 'i18next';

/**
 * this is the map we used to get information about annotations and tools
 * for example, we can look for map.freeHand.currentPalette to get the current color palette for freeHandAnnotation and freeHandTool
 * ideally, this map file should be the only place which provides information about annotations and tools
 * if you are tempted to create a new map file(which maps a tool/annotation to something else) under this constants folder
 * please make sure that it is not possible to implement that map here
 */
const map = {
  signature: {
    icon: 'ic_annotation_signature_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateSignature'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeHandAnnotation && annotation.Subject === i18next.t('annotation.signature')
  },
  freeHand: {
    icon: 'ic_annotation_freehand_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateFreeHand', 'AnnotationCreateFreeHand2', 'AnnotationCreateFreeHand3', 'AnnotationCreateFreeHand4'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeHandAnnotation
  },
  freeText: {
    icon: 'ic_annotation_freetext_black_24px',
    iconColor: 'TextColor',
    currentPalette: 'TextColor',
    availablePalettes: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateFreeText'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeTextAnnotation && annotation.getIntent() === Annotations.FreeTextAnnotation.Intent.FreeText
  },
  distanceMeasurement: {
    icon: 'ic_annotation_distance_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: [ 'StrokeColor' ],
    toolNames: ['AnnotationCreateDistanceMeasurement'],
    annotationCheck: annotation => annotation instanceof Annotations.LineAnnotation && annotation.IT === 'LineDimension' && annotation.Measure
  },
  perimeterMeasurement: {
    icon: 'ic_annotation_perimeter_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: [ 'StrokeColor' ],
    toolNames: ['AnnotationCreatePerimeterMeasurement'],
    annotationCheck: annotation => annotation instanceof Annotations.PolylineAnnotation && annotation.IT === 'PolyLineDimension' && annotation.Measure
  },
  areaMeasurement: {
    icon: 'ic_annotation_area_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: [ 'StrokeColor', 'FillColor' ],
    toolNames: ['AnnotationCreateAreaMeasurement'],
    annotationCheck: annotation => annotation instanceof Annotations.PolygonAnnotation && annotation.IT === 'PolygonDimension' && annotation.Measure
  },
  callout: {
    icon: 'ic_annotation_callout_black_24px',
    iconColor:'TextColor',
    currentPalette: 'TextColor',
    availablePalettes: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateCallout'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeTextAnnotation && annotation.getIntent() === Annotations.FreeTextAnnotation.Intent.FreeTextCallout
  },
  line: {
    icon: 'ic_annotation_line_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateLine'],
    annotationCheck: annotation => annotation instanceof Annotations.LineAnnotation && annotation.getStartStyle() === 'None' && annotation.getEndStyle() === 'None'
  },
  arrow: {
    icon: 'ic_annotation_arrow_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateArrow'],
    annotationCheck: annotation => annotation instanceof Annotations.LineAnnotation && (annotation.getStartStyle() !== 'None' || annotation.getEndStyle() !== 'None')
  },
  polygon: {
    icon: 'ic_annotation_polygon_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreatePolygon'],
    annotationCheck: annotation => annotation instanceof Annotations.PolygonAnnotation && annotation.Style === 'solid'
  },
  cloud: {
    icon: 'ic_annotation_cloud_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreatePolygonCloud'],
    annotationCheck: annotation => annotation instanceof Annotations.PolygonAnnotation && annotation.Style === 'cloudy'
  },
  highlight: {
    icon: 'ic_annotation_highlight_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateTextHighlight', 'AnnotationCreateTextHighlight2', 'AnnotationCreateTextHighlight3', 'AnnotationCreateTextHighlight4'],
    annotationCheck: annotation => annotation instanceof Annotations.TextHighlightAnnotation
  },
  underline: {
    icon: 'ic_annotation_underline_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateTextUnderline'],
    annotationCheck: annotation => annotation instanceof Annotations.TextUnderlineAnnotation
  },
  squiggly: {
    icon: 'ic_annotation_squiggly_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateTextSquiggly'],
    annotationCheck: annotation => annotation instanceof Annotations.TextSquigglyAnnotation
  },
  strikeout: {
    icon: 'ic_annotation_strikeout_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateTextStrikeout'],
    annotationCheck: annotation => annotation instanceof Annotations.TextStrikeoutAnnotation
  },
  redaction: {
    icon: 'ic_annotation_redact_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateRedaction'],
    annotationCheck: annotation => annotation instanceof Annotations.RedactionAnnotation
  },
  rectangle: {
    icon: 'ic_annotation_square_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateRectangle'],
    annotationCheck: annotation => annotation instanceof Annotations.RectangleAnnotation
  },
  ellipse: {
    icon: 'ic_annotation_circle_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor', 'FillColor'],
    toolNames: ['AnnotationCreateEllipse'],
    annotationCheck: annotation => annotation instanceof Annotations.EllipseAnnotation
  },
  polyline: {
    icon: 'ic_annotation_polyline_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreatePolyline'],
    annotationCheck: annotation => annotation instanceof Annotations.PolylineAnnotation
  },
  stickyNote: {
    icon: 'ic_annotation_sticky_note_black_24px',
    iconColor: 'StrokeColor',
    currentPalette: 'StrokeColor',
    availablePalettes: ['StrokeColor'],
    toolNames: ['AnnotationCreateSticky'],
    annotationCheck: annotation => annotation instanceof Annotations.StickyAnnotation
  },
  stamp: {
    icon: 'ic_annotation_stamp_black_24px',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AnnotationCreateStamp'],
    annotationCheck: annotation => annotation instanceof Annotations.StampAnnotation
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
  }
};

export const mapToolNameToKey = toolName => Object.keys(map).find(key => map[key].toolNames.includes(toolName));

export const mapAnnotationToKey = annotation => Object.keys(map).find(key => {
  const { annotationCheck } = map[key];
  return annotationCheck && annotationCheck(annotation);
});

export const mapAnnotationToToolName = annotation => map[mapAnnotationToKey(annotation)].toolNames[0];

export const copyMapWithDataProperties = (...properties) => {
  return Object.keys(map).reduce((newMap, key) => {
    newMap[key] = {};
    properties.forEach(property => {
      newMap[key][property] = map[key][property];
    });

    return newMap;
  }, {});
};

export const register = (tool, annotationConstructor) => {
  const { toolName, buttonImage, toolObject } = tool;
  const key = toolName;
  const availablePalettes = ['TextColor', 'StrokeColor', 'FillColor'].filter(property => toolObject.defaults && toolObject.defaults[property]);

  map[key] = {
    icon: buttonImage,
    iconColor: availablePalettes[0],
    currentPalette: availablePalettes[0],
    availablePalettes,
    toolNames: [toolName],
    annotationCheck: annotationConstructor ? annotation => annotation instanceof annotationConstructor : null,
  };
};

// we return an empty object here to prevent some components from accessing undefined
// if the map doesn't have a key for some annotations
export const getDataWithKey = key => map[key] || {};

export const getAnnotationCreateToolNames = () => {
  return Object.values(map).reduce((annotationCreateToolNames, { toolNames, annotationCheck }) => {
    return annotationCheck ? [...annotationCreateToolNames, ...toolNames] : annotationCreateToolNames;
  }, []);
};

export const getToolButtonObjects = () => {
  // TODO: discuss with Justin if we should move toolButtonObjects here, since toolButtonObjects is used to map toolName to button information
};

