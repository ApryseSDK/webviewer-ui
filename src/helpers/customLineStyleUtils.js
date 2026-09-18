import {
  getDropdownEntries,
  styleAppliesToContext,
} from './customStyleDropdown';

const LINE_ANNOTATION_CONTEXTS = new Set(['line', 'arrow', 'polyline']);

// Built-in dash patterns (e.g. "dash,2,2") encode dash lengths in the key;
// custom patterns should not be split on commas.
const BUILT_IN_DASH_PATTERN = /^dash(,\d+)+$/;

export const parseMiddleLineStyleValue = (value) => {
  if (!BUILT_IN_DASH_PATTERN.test(value)) {
    return { style: value, dashes: null };
  }
  const dashes = value.split(',');
  const style = dashes.shift();
  return { style, dashes };
};

export const lineStyleAppliesToContext = (style, context) => styleAppliesToContext(
  style,
  context,
  LINE_ANNOTATION_CONTEXTS,
);

export const getLineStyleDropdownEntries = (styles, context) => getDropdownEntries(
  styles,
  context,
  LINE_ANNOTATION_CONTEXTS,
);

export const getLineStyleAnnotationContext = (showLineStyleOptions, activeTool) => {
  const normalizedTool = String(activeTool || '').toLowerCase();

  if (showLineStyleOptions) {
    if (normalizedTool.includes('polyline')) {
      return 'polyline';
    }
    if (normalizedTool.includes('arrow')) {
      return 'arrow';
    }
    return 'line';
  }
  // can be used in the future to support shape stroke styles,
  // but currently only line styles are supported
  return 'shape';
};