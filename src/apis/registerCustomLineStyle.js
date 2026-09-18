import actions from 'actions';
import {
  registerCustomLineStyle as registerLineStyleWithManager,
  unregisterCustomLineStyle as unregisterLineStyleWithManager,
} from 'helpers/customLineStyleManager';
import { cloudyStrokeStyle, defaultEndLineStyles, defaultStartLineStyles, defaultStrokeStyles } from 'constants/strokeStyleIcons';

const VALID_SECTIONS = ['start', 'middle', 'end'];
const VALID_APPLIES_TO = ['all', 'line', 'arrow', 'polyline'];
const LINE_ANNOTATION_TYPES = VALID_APPLIES_TO.slice(1);
const RESERVED_KEYS_BY_SECTION = {
  start: new Set(defaultStartLineStyles.map(({ key }) => key)),
  middle: new Set([...defaultStrokeStyles, cloudyStrokeStyle].map(({ key }) => key)),
  end: new Set(defaultEndLineStyles.map(({ key }) => key)),
};

/**
 * @typedef {object} UI.CustomLineStyleOptions
 * @property {string} key The value applied to the annotation's `StartLineStyle`, `StrokeStyle`, or `EndLineStyle` property when the style is selected. Must be unique within its section.
 * @property {'start'|'middle'|'end'} [section='middle'] The line section to customize. Defaults to the middle section, which is the main line stroke.
 * @property {Array<'all'|'line'|'arrow'|'polyline'>} [appliesTo] Annotation targets this style applies to. Defaults to all line annotations when omitted.
 * @property {string} [title] Label shown in the dropdown. Defaults to `key`.
 * @property {string} [svg] Inline SVG string, or a file path/URL to an `.svg` file, used as the dropdown swatch. Falls back to a text label when omitted.
 * @property {Function} drawHandler Draw callback receiving `(ctx, pageMatrix, rotation, { annotation, originalDraw })`.
 * @property {number|Function} [padding] Extra bounds padding (in page points), or a `(annotation) => number` callback that returns it.
 */

/**
 * Registers a custom line style entry shown in the line style panel.
 *
 * The selected key is stored on the annotation's `StartLineStyle`, `StrokeStyle`, or `EndLineStyle` property,
 * serialized to XFDF, and re-applied on import.
 * If the key is no longer registered when an annotation is loaded, the annotation falls back to its default appearance.
 * Registering the same key and section replaces the previous registration.
 *
 * @method UI.registerCustomLineStyle
 * @param {UI.CustomLineStyleOptions} options Custom line style options.
 * @example
 * instance.UI.registerCustomLineStyle({
 *   key: 'double-dash',
 *   section: 'middle',
 *   appliesTo: ['all'],
 *   title: 'Double Dash',
 *   svg: '<svg>...</svg>',
 *   drawHandler: (ctx, pageMatrix, rotation, { annotation, originalDraw }) => {
 *     // Draw the custom line style.
 *   },
 * });
 */
const registerCustomLineStyle = (store) => (options) => {
  const { key, section: requestedSection, title, svg, drawHandler, padding, appliesTo } = options || {};
  const section = requestedSection ?? 'middle';

  if (!VALID_SECTIONS.includes(section)) {
    console.warn(`registerCustomLineStyle: "section" must be one of: ${VALID_SECTIONS.join(', ')}.`);
    return;
  }

  if (typeof key !== 'string' || !key.trim()) {
    console.warn('registerCustomLineStyle: "key" must be a non-empty string.');
    return;
  }

  if (RESERVED_KEYS_BY_SECTION[section].has(key)) {
    console.warn(`registerCustomLineStyle: "${key}" is a reserved built-in key for the ${section} section.`);
    return;
  }

  if (typeof drawHandler !== 'function') {
    console.warn('registerCustomLineStyle: "drawHandler" must be a function.');
    return;
  }

  if (padding !== undefined && typeof padding !== 'function' && (!Number.isFinite(padding) || padding < 0)) {
    console.warn('registerCustomLineStyle: "padding" must be a non-negative number or a function.');
    return;
  }

  if (appliesTo !== undefined && (!Array.isArray(appliesTo) || !appliesTo.length || !appliesTo.every((value) => VALID_APPLIES_TO.includes(value)))) {
    console.warn(`registerCustomLineStyle: "appliesTo" must be a non-empty array containing only: ${VALID_APPLIES_TO.join(', ')}.`);
    return;
  }

  const resolvedAppliesTo = !appliesTo || appliesTo.includes('all') ? LINE_ANNOTATION_TYPES : appliesTo;
  store.dispatch(actions.registerCustomLineStyle({ key, section, title, svg, appliesTo: resolvedAppliesTo }));
  registerLineStyleWithManager({ key, section, appliesTo: resolvedAppliesTo, drawHandler, padding });
};

/**
 * Unregisters a custom line style previously added with {@link UI.registerCustomLineStyle registerCustomLineStyle}.
 *
 * Annotations still referencing the key are reset to their default appearance and redrawn.
 *
 * @method UI.unregisterCustomLineStyle
 * @param {string} key The custom line style key.
 * @param {'start'|'middle'|'end'} [section] The section to remove. If omitted, removes the key from every line section.
 * @example
 * instance.UI.unregisterCustomLineStyle('double-dash', 'middle');
 */
const unregisterCustomLineStyle = (store) => (key, section) => {
  if (typeof key !== 'string' || !key.trim()) {
    console.warn('unregisterCustomLineStyle: "key" must be a non-empty string.');
    return;
  }

  if (section !== undefined && !VALID_SECTIONS.includes(section)) {
    console.warn(`unregisterCustomLineStyle: "section" must be one of: ${VALID_SECTIONS.join(', ')}.`);
    return;
  }

  store.dispatch(actions.unregisterCustomLineStyle(key, section));
  unregisterLineStyleWithManager(key, section);
};

export { registerCustomLineStyle, unregisterCustomLineStyle };