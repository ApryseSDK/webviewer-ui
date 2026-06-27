import getToolStyles from 'helpers/getToolStyles';
import getColor from 'helpers/getColor';

const { ToolNames } = window.Core.Tools;

/**
 * Resolves the color / fillColor / strokeColor that a tool button should display,
 * based on its `showColor` setting and whether the button is currently active.
 *
 * Returns empty strings for all three when no color should be shown.
 *
 * @param {Object} params
 * @param {string} params.toolName The Core tool name (e.g., 'AnnotationCreateRectangle')
 * @param {string} [params.showColor] Whether the button should show color ('always' | 'active' | undefined)
 * @param {boolean} [params.isActive] Whether the button is currently active
 * @param {string} [params.iconColorKey] Style key used to look up the icon color (e.g., 'StrokeColor')
 * @returns {{ color: string, fillColor: string, strokeColor: string }}
 * @ignore
 */
const getToolButtonColors = ({ toolName, showColor, isActive, iconColorKey }) => {
  const shouldShowColor = showColor === 'always' || (showColor === 'active' && isActive);
  if (!toolName || !shouldShowColor) {
    return { color: '', fillColor: '', strokeColor: '' };
  }

  const toolStyles = getToolStyles(toolName);
  const color = toolStyles?.[iconColorKey]?.toHexString?.() || '';
  const fillColor = getColor(toolStyles?.FillColor);
  let strokeColor = getColor(toolStyles?.StrokeColor);

  if (toolName.includes(ToolNames.FREETEXT) && toolStyles?.StrokeThickness === 0) {
    // transparent
    strokeColor = 'ff000000';
  }

  return { color, fillColor, strokeColor };
};

export default getToolButtonColors;
