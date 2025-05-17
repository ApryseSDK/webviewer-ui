import core from 'core';
import { workerTypes } from 'constants/types';
import {
  LINE_SPACING_OPTIONS,
  AVAILABLE_STYLE_PRESET_MAP,
  ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR,
  DEFAULT_COLOR,
  OFFICE_EDITOR_TRANSLATION_PREFIX,
  MARGIN_VALUES,
  MARGIN_SIDES,
  MARGIN_UNITS,
  CM_PER_INCH,
} from 'constants/officeEditor';
import { COMMON_COLORS } from 'constants/commonColors';
import { rgbaToHex } from 'helpers/color';

export function shouldBeDisabledInOfficeEditor(dataElement) {
  return ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR.includes(dataElement);
}

export function isOfficeEditorMode() {
  return core.getDocument()?.getType() === workerTypes.OFFICE_EDITOR;
}

export function isSpreadsheetEditorDocument() {
  return core.getDocument()?.getType() === workerTypes.SPREADSHEET_EDITOR;
}

export const calculateLineSpacing = (lineHeightMultiplier, lineHeight, fontSize) => {
  // if lineHeight is provided, it takes precedence, because the rule sets the line height in points (either exact or at least)
  const lineSpacing = lineHeight ? lineHeight / fontSize : lineHeightMultiplier;

  // Sometimes we get floating points so we locate the closest line spacing option
  const roundedLineSpacing = Object.values(LINE_SPACING_OPTIONS).reduce((a, b) => {
    const aDiff = Math.abs(a - lineSpacing);
    const bDiff = Math.abs(b - lineSpacing);

    if (aDiff === bDiff) {
      return a < b ? a : b;
    }
    return bDiff < aDiff ? b : a;
  });

  switch (roundedLineSpacing) {
    case 1:
      return 'Single';
    case 1.15:
      return '1.15';
    case 1.5:
      return '1.5';
    case 2:
      return 'Double';
    default:
      return 'Single';
  }
};

export const convertCursorToStylePreset = (cursorProperties) => {
  const {
    pointSize,
    color: currentColor
  } = cursorProperties || {};

  const defaultStylePreset = 'Normal Text';
  if (!pointSize || !currentColor) {
    return defaultStylePreset;
  }

  const fontSize = `${pointSize}pt`;
  let color = COMMON_COLORS['black'];
  if (color) {
    color = rgbaToHex(
      currentColor.r,
      currentColor.g,
      currentColor.b
    ).slice(0, -2);
  }

  return Object.keys(AVAILABLE_STYLE_PRESET_MAP).find(
    (style) => AVAILABLE_STYLE_PRESET_MAP[style].fontSize === fontSize && AVAILABLE_STYLE_PRESET_MAP[style].color === color
  ) || defaultStylePreset;
};

export const convertCoreColorToWebViewerColor = (color) => {
  if (!color) {
    return DEFAULT_COLOR;
  }

  return new window.Core.Annotations.Color(
    color.r,
    color.g,
    color.b,
    1,
  );
};

export const getLineSpacingFlyoutItems = () => {
  const lineSpacingOptions = Object.keys(LINE_SPACING_OPTIONS);
  return lineSpacingOptions.map((item) => {
    const normalizedItem = item.toLowerCase().split('.').join(''); // normalize the string to exclude periods
    return {
      label: `officeEditor.lineSpacingOptions.${normalizedItem}`,
      onClick: () => {
        handleLineSpacingChange(item);
      },
      dataElement: `line-spacing-button-${normalizedItem}`
    };
  });
};

export const handleLineSpacingChange = (lineSpacingOption) => {
  const lineSpacing = LINE_SPACING_OPTIONS[lineSpacingOption];
  core.getOfficeEditor().updateParagraphStyle({
    'lineHeightMultiplier': lineSpacing
  });
};

export const getListTypeFlyoutItems = (type, options) => options.map((option) => {
  const normalizedType = type.toLowerCase();
  return {
    label: `officeEditor.${normalizedType}Dropdown.${option.enum}`,
    onClick: () => {
      core.getOfficeEditor().setListPreset(option.enum);
    },
    dataElement: `office-editor-list-type-${normalizedType}-${option.enum}`,
    icon: option.img,
  };
});

export const PAGE_SECTION_BREAK_OPTIONS = [
  {
    key: 'pageBreak',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}pageBreak`,
    description: `${OFFICE_EDITOR_TRANSLATION_PREFIX}pageBreakDescription`,
    icon: 'icon-office-editor-page-break-split',
    onClick: () => core.getOfficeEditor().insertPageBreak(),
  },
  {
    key: 'sectionBreakNextPage',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}sectionBreakNextPage`,
    description: `${OFFICE_EDITOR_TRANSLATION_PREFIX}sectionBreakNextPageDescription`,
    icon: 'icon-office-editor-page-break',
    onClick: () => core.getOfficeEditor().insertSectionBreakNextPage(),
  },
  {
    key: 'sectionBreakContinuous',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}sectionBreakContinuous`,
    description: `${OFFICE_EDITOR_TRANSLATION_PREFIX}sectionBreakContinuousDescription`,
    icon: 'icon-page-manipulation-extract',
    onClick: () => core.getOfficeEditor().insertSectionBreakContinuous(),
  },
];

async function applyMargins() {
  // const { top, left, bottom, right } = this;
  // core.getOfficeEditor().setMargins({ top, left, bottom, right });
}

export const MARGIN_OPTIONS = [
  {
    key: 'normal',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}normal`,
    [MARGIN_SIDES.TOP]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.BOTTOM]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.LEFT]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.RIGHT]: MARGIN_VALUES.NORMAL,
    onClick: applyMargins,
  },
  {
    key: 'narrow',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}narrow`,
    [MARGIN_SIDES.TOP]: MARGIN_VALUES.NARROW,
    [MARGIN_SIDES.BOTTOM]: MARGIN_VALUES.NARROW,
    [MARGIN_SIDES.LEFT]: MARGIN_VALUES.NARROW,
    [MARGIN_SIDES.RIGHT]: MARGIN_VALUES.NARROW,
    onClick: applyMargins,
  },
  {
    key: 'moderate',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}moderate`,
    [MARGIN_SIDES.TOP]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.BOTTOM]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.LEFT]: MARGIN_VALUES.MODERATE,
    [MARGIN_SIDES.RIGHT]: MARGIN_VALUES.MODERATE,
    onClick: applyMargins,
  },
  {
    key: 'wide',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}wide`,
    [MARGIN_SIDES.TOP]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.BOTTOM]: MARGIN_VALUES.NORMAL,
    [MARGIN_SIDES.LEFT]: MARGIN_VALUES.WIDE,
    [MARGIN_SIDES.RIGHT]: MARGIN_VALUES.WIDE,
    onClick: applyMargins,
  },
  {
    key: 'customMargins',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}customMargins`,
    description: `${OFFICE_EDITOR_TRANSLATION_PREFIX}customMarginsDescription`,
    onClick: () => {},
  },
];

export const validateMarginInput = (input, maxMarginInInches, currentUnit) => {
  let maxMarginConverted = maxMarginInInches;
  if (currentUnit === MARGIN_UNITS.CM) {
    maxMarginConverted = maxMarginInInches * CM_PER_INCH;
  }
  if (input && input <= 0) {
    return '0';
  }
  // Removes leading zero unless it is followed by a decimal
  const validatedInput = input.replace(/^0+(?!\.)/, '');
  if (parseFloat(validatedInput) > maxMarginConverted) {
    return maxMarginConverted.toFixed(2);
  }
  return validatedInput;
};
