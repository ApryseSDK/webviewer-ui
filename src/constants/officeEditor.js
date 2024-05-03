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

const OfficeEditorListStylePresets = window.Core.Document.OfficeEditorListStylePresets;
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
