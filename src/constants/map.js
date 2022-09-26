import i18next from 'i18next';

export const annotationMapKeys = {
  SIGNATURE: 'signature',
  FREE_HAND: 'freeHand',
  FREE_HAND_HIGHLIGHT: 'freeHandHighlight',
  FREE_TEXT: 'freeText',
  MARK_INSERT_TEXT: 'markInsertText',
  MARK_REPLACE_TEXT: 'markReplaceText',
  DATE_FREE_TEXT: 'dateFreeText',
  DISTANCE_MEASUREMENT: 'distanceMeasurement',
  PERIMETER_MEASUREMENT: 'perimeterMeasurement',
  ARC_MEASUREMENT: 'arcMeasurement',
  RECTANGULAR_AREA_MEASUREMENT: 'rectangularAreaMeasurement',
  CLOUDY_RECTANGULAR_AREA_MEASUREMENT: 'cloudyRectangularAreaMeasurement',
  AREA_MEASUREMENT: 'areaMeasurement',
  ELLIPSE_MEASUREMENT: 'ellipseMeasurement',
  COUNT_MEASUREMENT: 'countMeasurement',
  CALLOUT: 'callout',
  LINE: 'line',
  ARROW: 'arrow',
  POLYGON: 'polygon',
  CLOUD: 'cloud',
  HIGHLIGHT: 'highlight',
  UNDERLINE: 'underline',
  SQUIGGLY: 'squiggly',
  STRIKEOUT: 'strikeout',
  REDACTION: 'redaction',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  POLYLINE: 'polyline',
  STICKY_NOTE: 'stickyNote',
  STAMP: 'stamp',
  IMAGE: 'image',
  EDIT: 'edit',
  PAN: 'pan',
  CONTENT_EDIT_TOOL: 'ContentEditTool',
  ADD_IMAGE_CONTENT: 'AddImageContentTool',
  ADD_PARAGRAPH_TOOL: 'AddParagraphTool',
  TEXT_SELECT: 'textSelect',
  MARQUEE_ZOOM_TOOL: 'marqueeZoomTool',
  MULTI_STYLE: 'MultiStyle',
  ERASER: 'eraser',
  CROP_PAGE: 'cropPage',
  FILE_ATTACHMENT: 'fileattachment',
  SOUND: 'sound',
  THREE_D_ANNOTATION: 'threeDAnnotation',
  TEXT_FIELD: 'textField',
  SIGNATURE_FORM_FIELD: 'signatureFormField',
  CHECK_BOX_FORM_FIELD: 'checkBoxFormField',
  RADIO_BUTTON_FORM_FIELD: 'radioButtonFormField',
  LIST_BOX_FORM_FIELD: 'listBoxFormField',
  COMBO_BOX_FORM_FIELD: 'comboBoxFormField',
  ARC: 'arc',
  CHANGE_VIEW: 'changeView'
};

/**
 * this is the map we used to get information about annotations and tools
 * for example, we can look for map.freeHand.currentStyleTab to get the current color palette for freeHandAnnotation and freeHandTool
 * ideally, this map file should be the only place which provides information about annotations and tools
 * if you are tempted to create a new map file(which maps a tool/annotation to something else) under this constants folder
 * please make sure that it is not possible to implement that map here
 * @ignore
 */
const map = {
  [annotationMapKeys.SIGNATURE]: {
    icon: 'icon-tool-signature',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: ['AnnotationCreateSignature'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeHandAnnotation &&
      annotation.Subject === i18next.t('annotation.signature'),
  },
  [annotationMapKeys.FREE_HAND]: {
    icon: 'icon-tool-pen-line',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateFreeHand',
      'AnnotationCreateFreeHand2',
      'AnnotationCreateFreeHand3',
      'AnnotationCreateFreeHand4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeHandAnnotation,
  },
  [annotationMapKeys.FREE_HAND_HIGHLIGHT]: {
    icon: 'icon-tool-pen-highlight',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateFreeHandHighlight',
      'AnnotationCreateFreeHandHighlight2',
      'AnnotationCreateFreeHandHighlight3',
      'AnnotationCreateFreeHandHighlight4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeHandAnnotation,
  },
  [annotationMapKeys.FREE_TEXT]: {
    icon: 'icon-tool-text-free-text',
    iconColor: 'TextColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'TextColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateFreeText',
      'AnnotationCreateFreeText2',
      'AnnotationCreateFreeText3',
      'AnnotationCreateFreeText4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
      window.Annotations.FreeTextAnnotation.Intent.FreeText,
  },
  [annotationMapKeys.MARK_INSERT_TEXT]: {
    icon: 'ic-insert text',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateMarkInsertText',
      'AnnotationCreateMarkInsertText2',
      'AnnotationCreateMarkInsertText3',
      'AnnotationCreateMarkInsertText4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.CaretAnnotation
  },
  [annotationMapKeys.MARK_REPLACE_TEXT]: {
    icon: 'ic-replace text',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateMarkReplaceText',
      'AnnotationCreateMarkReplaceText2',
      'AnnotationCreateMarkReplaceText3',
      'AnnotationCreateMarkReplaceText4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.CaretAnnotation
  },
  [annotationMapKeys.DATE_FREE_TEXT]: {
    icon: 'icon-tool-fill-and-sign-calendar',
    iconColor: 'TextColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'TextColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateDateFreeText',
      'AnnotationCreateDateFreeText2',
      'AnnotationCreateDateFreeText3',
      'AnnotationCreateDateFreeText4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
        window.Annotations.FreeTextAnnotation.Intent.FreeText,
  },
  [annotationMapKeys.DISTANCE_MEASUREMENT]: {
    icon: 'icon-tool-measurement-distance-line',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateDistanceMeasurement',
      'AnnotationCreateDistanceMeasurement2',
      'AnnotationCreateDistanceMeasurement3',
      'AnnotationCreateDistanceMeasurement4',
    ],
    hasLineEndings: true,
    annotationCheck: (annotation) => annotation instanceof window.Annotations.LineAnnotation &&
      annotation.IT === 'LineDimension' &&
      annotation.Measure,
  },
  [annotationMapKeys.PERIMETER_MEASUREMENT]: {
    icon: 'ic_annotation_perimeter_black_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreatePerimeterMeasurement',
      'AnnotationCreatePerimeterMeasurement2',
      'AnnotationCreatePerimeterMeasurement3',
      'AnnotationCreatePerimeterMeasurement4',
    ],
    hasLineEndings: true,
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolylineAnnotation &&
      annotation.IT === 'PolyLineDimension' &&
      annotation.Measure,
  },
  [annotationMapKeys.ARC_MEASUREMENT]: {
    icon: 'icon-tool-measurement-arc',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateArcMeasurement',
      'AnnotationCreateArcMeasurement2',
      'AnnotationCreateArcMeasurement3',
      'AnnotationCreateArcMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.ArcAnnotation &&
      annotation.IT === 'ArcDimension' &&
      annotation.Measure,
  },
  [annotationMapKeys.RECTANGULAR_AREA_MEASUREMENT]: {
    icon: 'ic_annotation_rectangular_area_black_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateRectangularAreaMeasurement',
      'AnnotationCreateRectangularAreaMeasurement2',
      'AnnotationCreateRectangularAreaMeasurement3',
      'AnnotationCreateRectangularAreaMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.IT === 'PolygonDimension' &&
      annotation.Measure &&
      annotation.isRectangularPolygon(),
  },
  [annotationMapKeys.CLOUDY_RECTANGULAR_AREA_MEASUREMENT]: {
    icon: 'ic_annotation_cloudy_rectangular_area_black_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateCloudyRectangularAreaMeasurement',
      'AnnotationCreateCloudyRectangularAreaMeasurement2',
      'AnnotationCreateCloudyRectangularAreaMeasurement3',
      'AnnotationCreateCloudyRectangularAreaMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.IT === 'PolygonDimension' &&
      annotation.Measure &&
      annotation.isRectangularPolygon(),
  },
  [annotationMapKeys.AREA_MEASUREMENT]: {
    icon: 'ic_annotation_area_black_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateAreaMeasurement',
      'AnnotationCreateAreaMeasurement2',
      'AnnotationCreateAreaMeasurement3',
      'AnnotationCreateAreaMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.IT === 'PolygonDimension' &&
      annotation.Measure,
  },
  [annotationMapKeys.ELLIPSE_MEASUREMENT]: {
    icon: 'ic_annotation_ellipse_area_black',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateEllipseMeasurement',
      'AnnotationCreateEllipseMeasurement2',
      'AnnotationCreateEllipseMeasurement3',
      'AnnotationCreateEllipseMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.EllipseAnnotation &&
      annotation.IT === 'EllipseDimension' &&
      annotation.Measure,
  },
  [annotationMapKeys.COUNT_MEASUREMENT]: {
    icon: 'ic_check_black_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateCountMeasurement',
      'AnnotationCreateCountMeasurement2',
      'AnnotationCreateCountMeasurement3',
      'AnnotationCreateCountMeasurement4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.StickyAnnotation &&
      annotation.getCustomData('trn-is-count')
  },
  [annotationMapKeys.CALLOUT]: {
    icon: 'icon-tool-callout-line',
    iconColor: 'StrokeColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'TextColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateCallout',
      'AnnotationCreateCallout2',
      'AnnotationCreateCallout3',
      'AnnotationCreateCallout4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
      window.Annotations.FreeTextAnnotation.Intent.FreeTextCallout,
  },
  [annotationMapKeys.LINE]: {
    icon: 'icon-tool-shape-line',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateLine',
      'AnnotationCreateLine2',
      'AnnotationCreateLine3',
      'AnnotationCreateLine4',
    ],
    hasLineEndings: true,
    annotationCheck: (annotation) => annotation instanceof window.Annotations.LineAnnotation &&
      annotation.getStartStyle() === 'None' &&
      annotation.getEndStyle() === 'None',
  },
  [annotationMapKeys.ARROW]: {
    icon: 'icon-tool-shape-arrow',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateArrow',
      'AnnotationCreateArrow2',
      'AnnotationCreateArrow3',
      'AnnotationCreateArrow4',
    ],
    hasLineEndings: true,
    annotationCheck: (annotation) => annotation instanceof window.Annotations.LineAnnotation &&
      (annotation.getStartStyle() !== 'None' ||
        annotation.getEndStyle() !== 'None'),
  },
  [annotationMapKeys.POLYGON]: {
    icon: 'icon-tool-shape-polygon',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreatePolygon',
      'AnnotationCreatePolygon2',
      'AnnotationCreatePolygon3',
      'AnnotationCreatePolygon4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.Style !== 'cloudy',
  },
  [annotationMapKeys.CLOUD]: {
    icon: 'icon-tool-shape-cloud',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreatePolygonCloud',
      'AnnotationCreatePolygonCloud2',
      'AnnotationCreatePolygonCloud3',
      'AnnotationCreatePolygonCloud4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolygonAnnotation &&
      annotation.Style === 'cloudy',
  },
  [annotationMapKeys.HIGHLIGHT]: {
    icon: 'icon-tool-text-manipulation-highlight',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextHighlight',
      'AnnotationCreateTextHighlight2',
      'AnnotationCreateTextHighlight3',
      'AnnotationCreateTextHighlight4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.TextHighlightAnnotation,
  },
  [annotationMapKeys.UNDERLINE]: {
    icon: 'icon-tool-text-manipulation-underline',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextUnderline',
      'AnnotationCreateTextUnderline2',
      'AnnotationCreateTextUnderline3',
      'AnnotationCreateTextUnderline4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.TextUnderlineAnnotation,
  },
  [annotationMapKeys.SQUIGGLY]: {
    icon: 'icon-tool-text-manipulation-squiggly',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextSquiggly',
      'AnnotationCreateTextSquiggly2',
      'AnnotationCreateTextSquiggly3',
      'AnnotationCreateTextSquiggly4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.TextSquigglyAnnotation,
  },
  [annotationMapKeys.STRIKEOUT]: {
    icon: 'icon-tool-text-manipulation-strikethrough',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateTextStrikeout',
      'AnnotationCreateTextStrikeout2',
      'AnnotationCreateTextStrikeout3',
      'AnnotationCreateTextStrikeout4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.TextStrikeoutAnnotation,
  },
  [annotationMapKeys.REDACTION]: {
    icon: 'icon-tool-select-area-redaction',
    iconColor: 'StrokeColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'TextColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateRedaction',
      'AnnotationCreateRedaction2',
      'AnnotationCreateRedaction3',
      'AnnotationCreateRedaction4'
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RedactionAnnotation,
  },
  [annotationMapKeys.RECTANGLE]: {
    icon: 'icon-tool-shape-rectangle',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateRectangle',
      'AnnotationCreateRectangle2',
      'AnnotationCreateRectangle3',
      'AnnotationCreateRectangle4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === '',
  },
  [annotationMapKeys.ELLIPSE]: {
    icon: 'icon-tool-shape-oval',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor', 'FillColor'],
    toolNames: [
      'AnnotationCreateEllipse',
      'AnnotationCreateEllipse2',
      'AnnotationCreateEllipse3',
      'AnnotationCreateEllipse4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.EllipseAnnotation,
  },
  [annotationMapKeys.ARC]: {
    icon: 'icon-tool-arc',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateArc',
      'AnnotationCreateArc2',
      'AnnotationCreateArc3',
      'AnnotationCreateArc4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.ArcAnnotation
  },
  [annotationMapKeys.POLYLINE]: {
    icon: 'icon-tool-shape-polyline',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreatePolyline',
      'AnnotationCreatePolyline2',
      'AnnotationCreatePolyline3',
      'AnnotationCreatePolyline4',
    ],
    hasLineEndings: true,
    annotationCheck: (annotation) => annotation instanceof window.Annotations.PolylineAnnotation,
  },
  [annotationMapKeys.STICKY_NOTE]: {
    icon: 'icon-tool-comment-line',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateSticky',
      'AnnotationCreateSticky2',
      'AnnotationCreateSticky3',
      'AnnotationCreateSticky4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.StickyAnnotation,
  },
  [annotationMapKeys.CHANGE_VIEW]: {
    icon: 'icon-tool-changeview',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'AnnotationCreateChangeViewTool',
      'AnnotationCreateChangeViewTool2',
      'AnnotationCreateChangeViewTool3',
      'AnnotationCreateChangeViewTool4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.StampAnnotation && annotation.ViewState,
  },
  [annotationMapKeys.IMAGE]: {
    icon: 'icon-tool-image-line',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: [
      'AnnotationCreateRubberStamp',
    ],
    annotationCheck: (annotation) => {
      return annotation instanceof window.Annotations.StampAnnotation &&
      annotation.ToolName === 'AnnotationCreateStamp';
    },
  },
  [annotationMapKeys.STAMP]: {
    icon: 'icon-tool-stamp-line',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: [
      'AnnotationCreateStamp',
    ],
    annotationCheck: (annotation) => {
      return annotation instanceof window.Annotations.StampAnnotation;
    },
  },
  [annotationMapKeys.EDIT]: {
    icon: 'ic_select_black_24px',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['AnnotationEdit'],
    annotationCheck: null,
  },
  [annotationMapKeys.PAN]: {
    icon: 'ic_pan_black_24px',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['Pan'],
    annotationCheck: null,
  },
  [annotationMapKeys.CONTENT_EDIT_TOOL]: {
    icon: 'ic_edit_page_24px',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['ContentEditTool'],
    annotationCheck: null,
  },
  [annotationMapKeys.ADD_PARAGRAPH]: {
    icon: 'ic-paragraph',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['AddParagraphTool'],
    annotationCheck: null,
  },
  [annotationMapKeys.ADD_IMAGE_CONTENT]: {
    icon: 'icon-tool-image-line',
    iconColor: null,
    currentPalette: null,
    availablePalettes: [],
    toolNames: ['AddImageContentTool'],
    annotationCheck: null,
  },
  [annotationMapKeys.TEXT_SELECT]: {
    icon: 'textselect_cursor',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['TextSelect'],
    annotationCheck: null,
  },
  [annotationMapKeys.MARQUEE_ZOOM_TOOL]: {
    icon: null,
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['MarqueeZoomTool'],
    annotationCheck: null,
  },
  [annotationMapKeys.MULTI_STYLE]: {
    icon: '',
    iconColor: null,
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: [],
    annotationCheck: null,
  },
  [annotationMapKeys.ERASER]: {
    icon: 'ic_annotation_eraser_black_24px',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['AnnotationEraserTool'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FreeHandAnnotation,
  },
  [annotationMapKeys.CROP_PAGE]: {
    icon: 'ic_crop_black_24px',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['CropPage'],
    annotationCheck: null,
  },
  [annotationMapKeys.FILE_ATTACHMENT]: {
    icon: 'ic_fileattachment_24px',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: ['AnnotationCreateFileAttachment'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.FileAttachmentAnnotation,
  },
  [annotationMapKeys.SOUND]: {
    icon: 'ic_sound_24px',
    iconColor: 'FillColor',
    validStyleTabs: ['FillColor', 'StrokeColor'],
    currentStyleTab: 'FillColor',
    styleTabs: ['FillColor', 'StrokeColor'],
    toolNames: [],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.SoundAnnotation,
  },
  [annotationMapKeys.THREE_D_ANNOTATION]: {
    icon: 'icon-tool-model3d',
    iconColor: null,
    validStyleTabs: [],
    currentStyleTab: null,
    styleTabs: [],
    toolNames: ['AnnotationCreateThreeD'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.Model3DAnnotation,
  },
  [annotationMapKeys.TEXT_FIELD]: {
    icon: 'icon-form-field-text',
    iconColor: 'TextColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'TextColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'TextFormFieldCreateTool',
      'TextFormFieldCreateTool2',
      'TextFormFieldCreateTool3',
      'TextFormFieldCreateTool4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'TextFormField'
  },
  [annotationMapKeys.SIGNATURE_FORM_FIELD]: {
    icon: 'icon-form-field-signature',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: [
      'SignatureFormFieldCreateTool',
      'SignatureFormFieldCreateTool2',
      'SignatureFormFieldCreateTool3',
      'SignatureFormFieldCreateTool4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'SignatureFormField'
  },
  [annotationMapKeys.CHECK_BOX_FORM_FIELD]: {
    icon: 'icon-form-field-checkbox',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: ['CheckBoxFormFieldCreateTool'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'CheckBoxFormField'
  },
  [annotationMapKeys.RADIO_BUTTON_FORM_FIELD]: {
    icon: 'icon-form-field-radiobutton',
    iconColor: 'StrokeColor',
    validStyleTabs: ['StrokeColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['StrokeColor'],
    toolNames: ['RadioButtonFormFieldCreateTool'],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'RadioButtonFormField'
  },
  [annotationMapKeys.LIST_BOX_FORM_FIELD]: {
    icon: 'icon-form-field-listbox',
    iconColor: 'StrokeColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'ListBoxFormFieldCreateTool',
      'ListBoxFormFieldCreateTool2',
      'ListBoxFormFieldCreateTool3',
      'ListBoxFormFieldCreateTool4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'ListBoxFormField'
  },
  [annotationMapKeys.COMBO_BOX_FORM_FIELD]: {
    icon: 'icon-form-field-combobox',
    iconColor: 'StrokeColor',
    validStyleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    currentStyleTab: 'StrokeColor',
    styleTabs: ['TextColor', 'StrokeColor', 'FillColor'],
    toolNames: [
      'ComboBoxFormFieldCreateTool',
      'ComboBoxFormFieldCreateTool2',
      'ComboBoxFormFieldCreateTool3',
      'ComboBoxFormFieldCreateTool4',
    ],
    annotationCheck: (annotation) => annotation instanceof window.Annotations.RectangleAnnotation &&
      annotation.getCustomData('trn-form-field-type') === 'ComboBoxFormField'
  },
};

export const mapToolNameToKey = (toolName) => Object.keys(map).find((key) => map[key].toolNames.includes(toolName));

export const mapAnnotationToKey = (annotation) => Object.keys(map).find((key) => {
  const { annotationCheck } = map[key];
  return annotationCheck && annotationCheck(annotation);
});

export const mapAnnotationToToolName = (annotation) => map[mapAnnotationToKey(annotation)].toolNames[0];

export const copyMapWithDataProperties = (...properties) => Object.keys(map).reduce((newMap, key) => {
  newMap[key] = {};
  properties.forEach((property) => {
    newMap[key][property] = map[key][property];
  });

  return newMap;
}, {});

export const register = (tool, annotationConstructor, customAnnotCheckFunc) => {
  const { toolName, buttonImage, toolObject } = tool;
  const key = toolName;
  const styleTabs = ['TextColor', 'StrokeColor', 'FillColor'].filter(
    (property) => toolObject.defaults && toolObject.defaults[property],
  );

  map[key] = {
    icon: buttonImage,
    iconColor: styleTabs[0],
    currentStyleTab: styleTabs[0],
    styleTabs,
    toolNames: [toolName],
    annotationCheck: customAnnotCheckFunc ?
      (annotation) => customAnnotCheckFunc(annotation) :
      (annotationConstructor ? (annotation) => annotation instanceof annotationConstructor : null)
  };
};

// we return an empty object here to prevent some components from accessing undefined
// if the map doesn't have a key for some annotations
export const getDataWithKey = (key) => map[key] || { icon: 'icon - tool - pen and shape - phone - line' };

export const getMap = () => map;

export const updateAnnotationStylePopupTabs = (annotationKey, newAnnotationStyleTabs, initialTab) => {
  if (map[annotationKey] === undefined) {
    return console.error(
      'The annotation key is invalid. Please provide a valid annotation key. Valid annotation keys can be retrieved through instance.UI.AnnotationKeys.'
    );
  }

  newAnnotationStyleTabs = [...new Set(newAnnotationStyleTabs)];

  const { validStyleTabs } = map[annotationKey];
  const invalidTabs = newAnnotationStyleTabs.filter((styleTab) => {
    return !validStyleTabs.includes(styleTab);
  });

  if (invalidTabs.length > 0) {
    return console.error(
      `Please provide new valid annotation style tabs. The valid tabs are: ${map[annotationKey].validStyleTabs.join(', ')}`
    );
  }

  if (initialTab && !newAnnotationStyleTabs.includes(initialTab)) {
    return console.error(
      `Initial tab is not valid. Valid initial tabs are: ${newAnnotationStyleTabs.join(', ')}`
    );
  }

  map[annotationKey].styleTabs = newAnnotationStyleTabs;
  if (!initialTab) {
    map[annotationKey].currentStyleTab = newAnnotationStyleTabs[0];
  } else {
    map[annotationKey].currentStyleTab = initialTab;
  }
  return true;
};


/**
 * A constant containing keys that identify annotations.
 * @name UI.AnnotationKeys
 * @property {string} SIGNATURE The key represents the signature annotation
 * @property {string} FREE_HAND The key represents the free hand annotation
 * @property {string} FREE_HAND_HIGHLIGHT The key represents the free hand highlight annotation
 * @property {string} FREE_TEXT The key represents the free text annotation
 * @property {string} DATE_FREE_TEXT The key represents the date free text annotation
 * @property {string} DISTANCE_MEASUREMENT The key represents the distance measurement annotation
 * @property {string} PERIMETER_MEASUREMENT The key represents the perimeter measurement annotation
 * @property {string} ARC_MEASUREMENT The key represents the arc measurement annotation
 * @property {string} RECTANGULAR_AREA_MEASUREMENT The key represents the rectangualr area measurement annotation
 * @property {string} CLOUDY_RECTANGULAR_AREA_MEASUREMENT The key represents the cloudy rectangular area measurement annotation
 * @property {string} AREA_MEASUREMENT The key represents the area measurement annotation
 * @property {string} ELLIPSE_MEASUREMENT The key represents the ellipse measurement annotation
 * @property {string} COUNT_MEASUREMENT The key represents the count measurement annotation
 * @property {string} CALLOUT The key represents the callout annotation
 * @property {string} LINE The key represents the line annotation
 * @property {string} ARROW The key represents the arrow annotation
 * @property {string} POLYGON The key represents the polygon annotation
 * @property {string} CLOUD The key represents the cloud annotation
 * @property {string} HIGHLIGHT The key represents the highlight annotation
 * @property {string} UNDERLINE The key represents the underline annotation
 * @property {string} SQUIGGLY The key represents the squiggly annotation
 * @property {string} STRIKEOUT The key represents the strikeout annotation
 * @property {string} REDACTION The key represents the redaction annotation
 * @property {string} RECTANGLE The key represents the rectangle annotation
 * @property {string} ELLIPSE The key represents the ellipse annotation
 * @property {string} ARC The key represents the arc annotation
 * @property {string} POLYLINE The key represents the polyline annotation
 * @property {string} STICKYNOTE The key represents the sticky note annotation
 * @property {string} IMAGE The key represents the image annotation
 * @property {string} STAMP The key represents the stamp annotaiton
 * @property {string} EDIT The key represents the edit annotation
 * @property {string} PAN The key represents the pan annotation
 * @property {string} CONTENT_EDIT_TOOL The key represents the content edit tool annotation
 * @property {string} ADD_PARAGRAPH_TOOL The key represents the add paragraph tool annotation
 * @property {string} TEXT_SELECT The key represents the text select annotation
 * @property {string} MARQUEE_ZOOM_TOOL The key represents the marquee zoom tool annotation
 * @property {string} ERASER The key represents the eraser annotation
 * @property {string} CROP_PAGE The key represents the crop page annotation
 * @property {string} FILE_ATTACHMENT The key represents the file attachment annotation
 * @property {string} SOUND The key represents the sound annotation
 * @property {string} THREE_D_ANNOTATION The key represents the 3D annotation
 * @property {string} TEXT_FIELD The key represents the text field annotation
 * @property {string} SIGNATURE_FORM_FIELD The key represents the signature form field annotation
 * @property {string} CHECK_BOX_FORM_FIELD The key represents the check box form field annotaiton
 * @property {string} RADIO_BUTTON_FORM_FIELD The key represents the radio button form field annotation
 * @property {string} LIST_BOX_FORM_FIELD The key represents list box form field annotation
 * @property {string} COMBO_BOX_FORM_FIELD The key represents the combo box form field annotation
 */

export const AnnotationKeys = {
  SIGNATURE: 'signature',
  FREE_HAND: 'freeHand',
  FREE_HAND_HIGHLIGHT: 'freeHandHighlight',
  FREE_TEXT: 'freeText',
  DATE_FREE_TEXT: 'dateFreeText',
  DISTANCE_MEASUREMENT: 'distanceMeasurement',
  PERIMETER_MEASUREMENT: 'perimeterMeasurement',
  ARC_MEASUREMENT: 'arcMeasurement',
  RECTANGULAR_AREA_MEASUREMENT: 'rectangularAreaMeasurement',
  CLOUDY_RECTANGULAR_AREA_MEASUREMENT: 'cloudyRectangularAreaMeasurement',
  AREA_MEASUREMENT: 'areaMeasurement',
  ELLIPSE_MEASUREMENT: 'ellipseMeasurement',
  COUNT_MEASUREMENT: 'countMeasurement',
  CALLOUT: 'callout',
  LINE: 'line',
  ARROW: 'arrow',
  POLYGON: 'polygon',
  CLOUD: 'cloud',
  HIGHLIGHT: 'highlight',
  UNDERLINE: 'underline',
  SQUIGGLY: 'squiggly',
  STRIKEOUT: 'strikeout',
  REDACTION: 'redaction',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  ARC: 'arc',
  POLYLINE: 'polyline',
  STICKYNOTE: 'stickyNote',
  IMAGE: 'image',
  STAMP: 'stamp',
  EDIT: 'edit',
  PAN: 'pan',
  CONTENT_EDIT_TOOL: 'contentEditTool',
  ADD_PARAGRAPH_TOOL: 'addParagraphTool',
  TEXT_SELECT: 'textSelect',
  MARQUEE_ZOOM_TOOL: 'marqueeZoomTool',
  ERASER: 'eraser',
  CROP_PAGE: 'cropPage',
  FILE_ATTACHMENT: 'fileAttachment',
  SOUND: 'sound',
  THREE_D_ANNOTATION: 'threeDAnnotation',
  TEXT_FIELD: 'textField',
  SIGNATURE_FORM_FIELD: 'signatureFormField',
  CHECK_BOX_FORM_FIELD: 'checkBoxFormField',
  RADIO_BUTTON_FORM_FIELD: 'radioButtonFormField',
  LIST_BOX_FORM_FIELD: 'listBoxFormField',
  COMBO_BOX_FORM_FIELD: 'comboBoxFormField',
};

/**
 * The different available style tabs in the annotation popup.
 * @name UI.AnnotationStylePopupTabs
 * @property {string} TEXT_COLOR Indicates the text style tab in the annotation popup window
 * @property {string} STROKE_COLOR Indicates the stroke color tab in the annotation popup window
 * @property {string} FILL_COLOR Indicates the fill color tab in the annotation popup window
 */

export const AnnotationStylePopupTabs = {
  TEXT_COLOR: 'TextColor',
  STROKE_COLOR: 'StrokeColor',
  FILL_COLOR: 'FillColor'
};
