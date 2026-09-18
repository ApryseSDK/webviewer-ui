/**
 * Converts a registered custom style entry to the image format used by Dropdown.
 * @param {object} style Custom style entry from Redux.
 * @returns {object} Dropdown image-compatible entry.
 * @ignore
 */
export const toDropdownEntry = (style) => ({
  key: style.key,
  src: style.svg || '',
  title: style.title || style.key,
  className: style.svg
    ? `linestyle-image shift-alignment custom-line-style-image custom-line-style-image--${String(style.key).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : 'linestyle-label',
});

/**
 * Determines whether a registered style applies to a UI annotation context.
 * @param {object} style Custom style entry.
 * @param {string} context Resolved annotation context.
 * @param {Set<string>} [domainContexts] Contexts that do not inherit a generic shape style.
 * @returns {boolean} Whether the style applies to the context.
 * @ignore
 */
export const styleAppliesToContext = (style, context, domainContexts = new Set()) => {
  const appliesTo = Array.isArray(style?.appliesTo)
    ? style.appliesTo.map((value) => String(value).toLowerCase())
    : [];

  return !appliesTo.length
    || appliesTo.includes('all')
    || appliesTo.includes(context)
    || (context === 'cloud' && appliesTo.includes('polygon'))
    || (context !== 'line' && !domainContexts.has(context) && appliesTo.includes('shape'));
};

/**
 * Filters and converts registered styles for a dropdown.
 * @param {Array<object>} styles Registered style entries.
 * @param {string} context Resolved annotation context.
 * @param {Set<string>} [domainContexts] Contexts that do not inherit a generic shape style.
 * @returns {Array<object>} Dropdown image-compatible entries.
 * @ignore
 */
export const getDropdownEntries = (styles, context, domainContexts) => styles
  .filter((style) => styleAppliesToContext(style, context, domainContexts))
  .map(toDropdownEntry);

/**
 * Resolves the annotation context used to filter custom styles.
 * @param {boolean} showLineStyleOptions Whether the current panel shows line endings.
 * @param {string} activeTool The active tool name.
 * @param {Array<string>} [annotationTypes] Selected annotation types, when a selection exists.
 * @returns {'line'|'rectangle'|'ellipse'|'polygon'|'cloud'|'shape'} The resolved context.
 * @ignore
 */
export const getAnnotationContext = (showLineStyleOptions, activeTool, annotationTypes) => {
  if (showLineStyleOptions) {
    return 'line';
  }

  const normalizedTypes = Array.isArray(annotationTypes)
    ? annotationTypes.map((type) => String(type).toLowerCase())
    : [];

  const hasEllipse = normalizedTypes.some((type) => type.includes('ellipse') || type.includes('circle'));
  const hasRectangle = normalizedTypes.some((type) => type.includes('rectangle') || type.includes('rect'));
  const hasPolygon = normalizedTypes.some((type) => type.includes('polygon'));
  const hasCloud = normalizedTypes.some((type) => type.includes('cloud'));

  if (hasEllipse && !hasRectangle) {
    return 'ellipse';
  }
  if (hasRectangle && !hasEllipse) {
    return 'rectangle';
  }
  if (hasPolygon && !hasEllipse && !hasRectangle) {
    return 'polygon';
  }
  if (hasCloud && !hasEllipse && !hasRectangle && !hasPolygon) {
    return 'cloud';
  }

  const normalizedTool = String(activeTool || '').toLowerCase();
  if (normalizedTool.includes('ellipse') || normalizedTool.includes('circle')) {
    return 'ellipse';
  }
  if (normalizedTool.includes('rectangle') || normalizedTool.includes('rect')) {
    return 'rectangle';
  }
  if (normalizedTool.includes('polygon')) {
    return 'polygon';
  }
  if (normalizedTool.includes('cloud')) {
    return 'cloud';
  }

  return 'shape';
};
