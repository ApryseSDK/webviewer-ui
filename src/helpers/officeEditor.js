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
  LAYOUT_UNITS,
  MARGIN_UNIT_LABELS,
  MM_PER_CM,
  POINTS_PER_INCH,
  POINTS_PER_CM,
  MINIMUM_COLUMN_WIDTH_IN_POINTS,
  DEFAULT_COLUMN_SPACING_IN_POINTS,
  PAGE_LAYOUT_WARNING_TYPE
} from 'constants/officeEditor';
import { COMMON_COLORS } from 'constants/commonColors';
import mapObjectKeys from 'helpers/mapObjectKeys';
import { rgbaToHex } from 'helpers/color';
import DataElements from 'constants/dataElement';

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

async function applyMargins(dispatch, actions) {
  const { top, left, bottom, right } = this;
  try {
    await core.getOfficeEditor().setSectionMargins({ top, bottom, left, right }, LAYOUT_UNITS.CM);
  } catch (error) {
    console.error('Error applying margins:', error);
    showPageLayoutWarning(dispatch, actions, PAGE_LAYOUT_WARNING_TYPE.MARGIN);
  }
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
    onClick: (dispatch, actions) => {
      dispatch(actions.openElement(DataElements.OFFICE_EDITOR_MARGINS_MODAL));
    }
  }
];

export const getConvertedMarginOptions = (unit) => {
  return MARGIN_OPTIONS.map((option) => {
    if (option.key === 'customMargins') {
      return option;
    }

    return {
      ...option,
      ...mapObjectKeys(Object.values(MARGIN_SIDES), (side) => {
        const convertedValue = convertMeasurementUnit(option[side], LAYOUT_UNITS.CM, unit);
        return roundNumberToDecimals(convertedValue);
      }),
    };
  });
};

export const getUnitLabel = (unit) => {
  const matchKey = Object.keys(LAYOUT_UNITS).find((key) => LAYOUT_UNITS[key] === unit);
  return MARGIN_UNIT_LABELS[matchKey] || MARGIN_UNIT_LABELS.CM;
};

async function setEqualSectionColumns(dispatch, actions) {
  const { numberOfColumns } = this;
  try {
    await core.getOfficeEditor().setEqualSectionColumns(numberOfColumns);
  } catch (error) {
    console.error(`Error setting equal section columns to ${numberOfColumns}:`, error);
    showPageLayoutWarning(dispatch, actions, PAGE_LAYOUT_WARNING_TYPE.COLUMN);
  }
}

export const COLUMN_OPTIONS = [
  {
    key: 'singleColumn',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}singleColumn`,
    numberOfColumns: 1,
    onClick: setEqualSectionColumns,
  },
  {
    key: 'twoColumn',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}twoColumn`,
    numberOfColumns: 2,
    onClick: setEqualSectionColumns,
  },
  {
    key: 'threeColumn',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}threeColumn`,
    numberOfColumns: 3,
    onClick: setEqualSectionColumns,
  },
  {
    key: 'customColumn',
    label: `${OFFICE_EDITOR_TRANSLATION_PREFIX}customColumn`,
    description: `${OFFICE_EDITOR_TRANSLATION_PREFIX}customColumnDescription`,
    onClick: (dispatch, actions) => {
      dispatch(actions.openElement(DataElements.OFFICE_EDITOR_COLUMNS_MODAL));
    },
  },
];

export const showPageLayoutWarning = (dispatch, actions, type) => {
  const confirmBtnTxt = 'action.ok';
  const title = 'warning.officeEditorPageLayout.title';
  let message;
  switch (type) {
    case PAGE_LAYOUT_WARNING_TYPE.COLUMN:
      message = 'warning.officeEditorPageLayout.columnsMessage';
      break;
    case PAGE_LAYOUT_WARNING_TYPE.MARGIN:
      message = 'warning.officeEditorPageLayout.marginsMessage';
      break;
    default:
      message = '';
      break;
  }

  const warning = {
    message,
    title,
    confirmBtnTxt
  };
  dispatch(actions.showWarningMessage(warning));
};

export const convertMeasurementUnit = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) {
    return value;
  }
  // Convert value to point
  let valueInPoint;
  switch (fromUnit) {
    case LAYOUT_UNITS.CM:
      valueInPoint = value * POINTS_PER_CM;
      break;
    case LAYOUT_UNITS.MM:
      valueInPoint = value * (POINTS_PER_CM / MM_PER_CM);
      break;
    case LAYOUT_UNITS.INCH:
      valueInPoint = value * POINTS_PER_INCH;
      break;
    case LAYOUT_UNITS.PHYSICAL_POINT:
    default:
      valueInPoint = value;
      break;
  }

  // Convert from point to target unit
  switch (toUnit) {
    case LAYOUT_UNITS.CM:
      return valueInPoint / POINTS_PER_CM;
    case LAYOUT_UNITS.MM:
      return valueInPoint / (POINTS_PER_CM / MM_PER_CM);
    case LAYOUT_UNITS.INCH:
      return valueInPoint / POINTS_PER_INCH;
    case LAYOUT_UNITS.PHYSICAL_POINT:
    default:
      return valueInPoint;
  }
};

export const getMinimumColumnWidth = (unit) => {
  return convertMeasurementUnit(MINIMUM_COLUMN_WIDTH_IN_POINTS, LAYOUT_UNITS.PHYSICAL_POINT, unit);
};

export const getDefaultColumnSpacing = (unit) => {
  return convertMeasurementUnit(DEFAULT_COLUMN_SPACING_IN_POINTS, LAYOUT_UNITS.PHYSICAL_POINT, unit);
};

/**
 * @ignore
 * Formats a number to a string with a specified number of decimal places, removing unnecessary trailing zeros. Returns '0' for null, undefined, NaN, or zero input.
 * @param {number} value - The value to format.
 * @param {number} [decimals=2] - The number of decimal places to round to (default is 2).
 * @returns {string} The formatted number as a string, with trailing zeros removed.
 */
export const formatToDecimalString = (value, decimals = 2) => {
  if (value == null || isNaN(value) || value === 0) {
    return '0';
  }
  return parseFloat(value.toFixed(decimals)).toString();
};

/**
 * @ignore
 * Floors a number to a specified number of decimal places.
 * @param {number} value - The value to floor.
 * @param {number} [decimals=4] - The number of decimal places to keep (default is 4).
 * @returns {number} The floored number with the specified decimal precision.
 */
export const floorNumberToDecimals = (value, decimals = 4) => {
  if (value == null || isNaN(value)) {
    return 0;
  }
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
};

/**
 * @ignore
 * Rounds a number to a specified number of decimal places and returns a float.
 * Uses `toFixed` to avoid floating-point precision issues that can occur with `Math.round()`.
 * @param value - The value to round.
 * @param {number} [decimals=2] - The number of decimal places to keep (default is 2).
 * @returns The rounded number as a float.
 */
export const roundNumberToDecimals = (value, decimals = 2) => {
  if (value == null || isNaN(value)) {
    return 0;
  }
  return parseFloat(value.toFixed(decimals));
};

/**
 * @ignore
 * Validates a margin value to ensure it is within bounds
 * @param {number} input - The margin value to validate.
 * @param {number} maxMargin - The maximum allowed value for the margin.
 * @returns {number} The validated margin value:
 *   - Returns 0 if the input is NaN or less than or equal to zero.
 *   - Returns maxMargin (rounded to two decimals) if value exceeds maxMargin.
 *   - Otherwise, returns the original value.
 */
export const validateMarginInput = (input, maxMargin) => {
  if (isNaN(input) || input <= 0) {
    return 0;
  }
  maxMargin = maxMargin < 0 ? 0 : maxMargin;
  if (input > maxMargin) {
    return roundNumberToDecimals(maxMargin);
  }
  return input;
};

export const focusContent = () => {
  setTimeout(() => {
    core.getOfficeEditor().focusContent();
  }, 0);
};