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
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateSignature'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeHandAnnotation && annotation.Subject === i18next.t('annotation.signature')
  },
  freeHand: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateFreeHand', 'AnnotationCreateFreeHand2', 'AnnotationCreateFreeHand3', 'AnnotationCreateFreeHand4'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeHandAnnotation
  },
  freeText: {
    iconColorPalette: 'text',
    currentPalette: 'text',
    availablePalettes: ['text', 'border', 'fill'],
    toolNames: ['AnnotationCreateFreeText'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeTextAnnotation && annotation.getIntent() === Annotations.FreeTextAnnotation.Intent.FreeText
  },
  callout: {
    iconColorPalette:'text',
    currentPalette: 'text',
    availablePalettes: ['text', 'border', 'fill'],
    toolNames: ['CalloutCreateTool'],
    annotationCheck: annotation => annotation instanceof Annotations.FreeTextAnnotation && annotation.getIntent() === Annotations.FreeTextAnnotation.Intent.FreeTextCallout
  },
  line: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateLine'],
    annotationCheck: annotation => annotation instanceof Annotations.LineAnnotation && annotation.getStartStyle() === 'None' && annotation.getEndStyle() === 'None'
  },
  arrow: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateArrow'],
    annotationCheck: annotation => annotation instanceof Annotations.LineAnnotation && annotation.getStartStyle() === 'None' && annotation.getEndStyle() === 'OpenArrow'
  },
  polygon: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border', 'fill'],
    toolNames: ['AnnotationCreatePolygon'],
    annotationCheck: annotation => annotation instanceof Annotations.PolygonAnnotation && annotation.Style === 'solid'
  },
  cloud: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border', 'fill'],
    toolNames: ['AnnotationCreatePolygonCloud'],
    annotationCheck: annotation => annotation instanceof Annotations.PolygonAnnotation && annotation.Style === 'cloudy'
  },
  highlight: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateTextHighlight', 'AnnotationCreateTextHighlight2', 'AnnotationCreateTextHighlight3', 'AnnotationCreateTextHighlight4'],
    annotationCheck: annotation => annotation instanceof Annotations.TextHighlightAnnotation
  },
  underline: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateTextUnderline'],
    annotationCheck: annotation => annotation instanceof Annotations.TextUnderlineAnnotation
  },
  squiggly: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateTextSquiggly'],
    annotationCheck: annotation => annotation instanceof Annotations.TextSquigglyAnnotation
  },
  strikeout: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateTextStrikeout'],
    annotationCheck: annotation => annotation instanceof Annotations.TextStrikeoutAnnotation
  },
  rectangle: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border', 'fill'],
    toolNames: ['AnnotationCreateRectangle'],
    annotationCheck: annotation => annotation instanceof Annotations.RectangleAnnotation
  },
  ellipse: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border', 'fill'],
    toolNames: ['AnnotationCreateEllipse'],
    annotationCheck: annotation => annotation instanceof Annotations.EllipseAnnotation
  },
  polyline: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreatePolyline'],
    annotationCheck: annotation => annotation instanceof Annotations.PolylineAnnotation
  },
  stickyNote: {
    iconColorPalette: 'border',
    currentPalette: 'border',
    availablePalettes: ['border'],
    toolNames: ['AnnotationCreateSticky'],
    annotationCheck: annotation => annotation instanceof Annotations.StickyAnnotation
  },
  stamp: {
    iconColorPalette: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AnnotationCreateStamp'],
    annotationCheck: annotation => annotation instanceof Annotations.StampAnnotation
  },
  edit: {
    iconColorPalette: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AnnotationEdit'],
    annotationCheck: () => false,
  },
  pan: {
    iconColorPalette: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['Pan'],
    annotationCheck: () => false,
  },
  textSelect: {
    iconColorPalette: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['TextSelect'],
    annotationCheck: () => false,
  },
};

export const mapToolNameToKey = toolName => Object.keys(map).find(key => map[key].toolNames.includes(toolName));
  
export const mapAnnotationToKey = annotation => Object.keys(map).find(key => map[key].annotationCheck(annotation));

export const getToolButtonObjects = () => {
  // TODO: discuss with Justin if we should move toolButtonObjects here, since toolButtonObjects is used to map toolName to button information
};

export const copyMapWithDataProperties = (...properties) => {
  return Object.keys(map).reduce((newMap, key) => {
    newMap[key] = {};
    properties.forEach(property => {
      newMap[key][property] = map[key][property];
    });

    return newMap;
  }, {});
};

export const getDataWithKey = key => map[key];
