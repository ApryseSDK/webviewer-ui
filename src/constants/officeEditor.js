import DataElements from 'constants/dataElement';

export const FONT_SIZE = {
  MAX: 1638,
  MIN: 2,
};

export const LINE_SPACING_OPTIONS = {
  'Single': 1,
  '1.15': 1.15,
  '1.5': 1.5,
  'Double': 2,
};

export const JUSTIFICATION_OPTIONS = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
  Both: 'both'
};

export const LIST_OPTIONS = {
  Ordered: 'ordered',
  Unordered: 'unordered',
};

export const DEFAULT_POINT_SIZE = 11;
export const DEFAULT_COLOR = new window.Core.Annotations.Color(0, 0, 0, 1);

const OfficeEditorListStylePresets = window.Core.Document.OfficeEditor.ListStylePresets;
export const OFFICE_BULLET_OPTIONS = [
  { enum: OfficeEditorListStylePresets.BULLET, img: 'icon-office-editor-list-style-bullet' },
  { enum: OfficeEditorListStylePresets.BULLET_SQUARE, img: 'icon-office-editor-list-style-square' },
  { enum: OfficeEditorListStylePresets.SQUARE_BULLET, img: 'icon-office-editor-list-style-square-bullet' },
  { enum: OfficeEditorListStylePresets.DIAMOND, img: 'icon-office-editor-list-style-diamond' },
  { enum: OfficeEditorListStylePresets.CHECK, img: 'icon-office-editor-list-style-check' },
  { enum: OfficeEditorListStylePresets.ARROW, img: 'icon-office-editor-list-style-arrow' },
];

export const OFFICE_NUMBER_OPTIONS = [
  { enum: OfficeEditorListStylePresets.NUMBER_LATIN_ROMAN_1, img: 'icon-office-editor-list-style-number-latin-1' },
  { enum: OfficeEditorListStylePresets.NUMBER_DECIMAL, img: 'icon-office-editor-list-style-number-decimal' },
  { enum: OfficeEditorListStylePresets.NUMBER_LATIN_ROMAN_2, img: 'icon-office-editor-list-style-number-latin-2' },
  { enum: OfficeEditorListStylePresets.LATIN_ROMAN, img: 'icon-office-editor-list-style-latin-roman' },
  { enum: OfficeEditorListStylePresets.ROMAN_LATIN_NUMBER, img: 'icon-office-editor-list-style-roman-latin' },
];

export const OFFICE_EDITOR_TRACKED_CHANGE_KEY = 'officeEditorTrackedChangeUID';

export const OfficeEditorEditMode = window.Core.Document.OfficeEditor.EditMode;

export const EditingStreamType = window.Core.Document.OfficeEditor.EditingStreamType;

export const EditOperationSource = window.Core.Document.OfficeEditor.EditOperationSource;

export const DocElementType = window.Core.Document.OfficeEditor.DocumentElementType;

export const OFFICE_EDITOR_SCOPE = 'office-editor';

export const ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR = [
  'toggleNotesButton',
  'toolsHeader',
  'viewControlsButton',
  'textPopup',
  'marqueeToolButton',
  DataElements.OUTLINE_PANEL_BUTTON,
  DataElements.OUTLINE_PANEL,
  DataElements.LEFT_PANEL_BUTTON,
  DataElements.ANNOTATION_POPUP,
  DataElements.NotesPanel.DefaultHeader.FILTER_ANNOTATION_BUTTON,
  DataElements.ANNOTATION_NOTE_CONNECTOR_LINE,
  DataElements.ANNOTATION_CONTENT_OVERLAY,
];

export const ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR = [
  DataElements.OFFICE_EDITOR_TOOLS_HEADER,
  DataElements.INLINE_COMMENT_POPUP,
  DataElements.SEARCH_PANEL_REPLACE_CONTAINER
];

export const NOTES_PANEL_TEXTS = {
  [DataElements.OFFICE_EDITOR_REVIEW_PANEL]: {
    title: 'officeEditor.reviewing',
    icon: 'ic-edit-page',
    noAnnotation: 'message.noRevisions',
    searchPlaceholder: 'message.searchSuggestionsPlaceholder',
  },
  [DataElements.OFFICE_EDITOR_COMMENT_PANEL]: {
    title: 'component.notesPanel',
    icon: 'illustration - empty state - outlines',
    noAnnotation: 'message.noAnnotations',
    searchPlaceholder: 'message.searchCommentsPlaceholder',
  },
  [DataElements.NOTES_PANEL]: {
    title: 'component.notesPanel',
    icon: 'illustration - empty state - outlines',
    noAnnotation: 'message.noAnnotations',
    searchPlaceholder: 'message.searchCommentsPlaceholder',
  },
};

export const AVAILABLE_POINT_SIZES = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72'];

/* eslint-disable custom/no-hex-colors */
export const AVAILABLE_STYLE_PRESET_MAP = {
  'Normal Text': {
    fontSize: '11pt',
    color: '#000000',
  },
  'Title': {
    fontSize: '26pt',
    color: '#000000',
  },
  'Subtitle': {
    fontSize: '15pt',
    color: '#666666',
  },
  'Heading 1': {
    fontSize: '20pt',
    color: '#000000',
  },
  'Heading 2': {
    fontSize: '16pt',
    color: '#000000',
  },
  'Heading 3': {
    fontSize: '14pt',
    color: '#434343',
  },
  'Heading 4': {
    fontSize: '12pt',
    color: '#666666',
  },
  'Heading 5': {
    fontSize: '11pt',
    color: '#666666',
  },
};
/* eslint-enable custom/no-hex-colors */

export const HEADER_FOOTER_BAR_DEFAULT_POSITION = 100;

export const LAYOUT_UNITS = window.Core.Document.OfficeEditor.LayoutUnits;

export const EDIT_OPERATION_SOURCE = window.Core.Document.OfficeEditor.EditOperationSource;

export const MARGIN_UNIT_LABELS = {
  CM: 'cm',
  MM: 'mm',
  INCH: '"',
  PHYSICAL_POINT: 'pt',
};

// MARGIN_VALUES in centimeters
export const MARGIN_VALUES = {
  NORMAL: 2.54,
  NARROW: 1.27,
  MODERATE: 1.905,
  WIDE: 5.08,
};

export const COLUMN_INPUT_TYPES = {
  WIDTH: 'width',
  SPACING: 'spacing',
};

export const MARGIN_SIDES = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};

export const PAGE_LAYOUT_WARNING_TYPE = {
  COLUMN: 'column',
  MARGIN: 'margin',
};

export const VERTICAL_MARGIN_LIMIT = window.Core.Document.OfficeEditor.VERTICAL_MARGIN_LIMIT; // 0.4

export const DEFAULT_COLUMN_SPACING_IN_POINTS = window.Core.Document.OfficeEditor.DEFAULT_COLUMN_SPACING_IN_POINTS; // 36

export const MINIMUM_COLUMN_WIDTH_IN_POINTS = window.Core.Document.OfficeEditor.MINIMUM_COLUMN_WIDTH_IN_POINTS; // 36

export const OFFICE_EDITOR_TRANSLATION_PREFIX = 'officeEditor.';

// TODO: Can we accept any other image formats?
export const OFFICE_EDITOR_ACCEPTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'bmp'].map(
  (format) => `.${format}`,
).join(', ');