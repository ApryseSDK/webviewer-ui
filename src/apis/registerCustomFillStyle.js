import actions from 'actions';
import { SOLID_FILL_STYLE_KEY } from 'constants/strokeStyleIcons';
import { registerFillDrawHandler, unregisterFillDrawHandler } from 'helpers/customFillStyleManager';

const VALID_APPLIES_TO = ['all', 'rectangle', 'ellipse', 'polygon'];

/**
 * @typedef {object} UI.CustomFillStyleOptions
 * @property {string} key The value applied to the annotation property when selected. Registering with a key that is
 * already in use replaces the previously registered fill style.
 * @property {Array<'all'|'rectangle'|'ellipse'|'polygon'>} [appliesTo] Annotation targets this style applies to.
 * Defaults to all shape annotations when omitted.
 * @property {string} [title] Label shown in the dropdown. Defaults to `key`.
 * @property {string} [svg] Inline SVG string, or a file path/URL to an `.svg` file, used as the dropdown swatch. Falls back to a text label when omitted.
 * @property {boolean} [clipToShape=false] Selects the clipping implementation. When `false`, the built-in
 * annotation geometry clip is used. When `true`, `clipToShapeFn` must provide a custom clip implementation.
 * @property {Function} [clipToShapeFn] Custom clipping function used when `clipToShape` is `true`. It receives the
 * canvas context and annotation and must define the clipping path and call `ctx.clip()`.
 * @property {Function} drawHandler Custom annotation draw handler that receives `(ctx, pageMatrix, rotation, { annotation, originalDraw, originalDrawWithoutFill, clipToShape })`.
 * Calling `originalDrawWithoutFill` draws the built-in border after the custom handler completes so the border remains above the fill.
 */

/**
 * Validates the registration options and reports the first problem found.
 * @param {object} options The options passed to registerCustomFillStyle
 * @returns {string} The warning message, or an empty string when the options are valid
 * @ignore
 */
const validateTargets = (appliesTo) => {
  if (appliesTo !== undefined && (!Array.isArray(appliesTo) || appliesTo.length === 0)) {
    return '"appliesTo" must be a non-empty array when provided.';
  }

  const invalidTargets = (appliesTo || []).filter((value) => !VALID_APPLIES_TO.includes(String(value).toLowerCase()));
  return invalidTargets.length
    ? `"appliesTo" contains unsupported values: ${invalidTargets.join(', ')}. Supported values are: ${VALID_APPLIES_TO.join(', ')}.`
    : '';
};

const validateOptionalTypes = ({ title, svg }) => {
  if (title !== undefined && typeof title !== 'string') {
    return '"title" must be a string when provided.';
  }
  if (svg !== undefined && typeof svg !== 'string') {
    return '"svg" must be a string when provided.';
  }
  return '';
};

const validateClippingOptions = ({ clipToShape = false, clipToShapeFn }) => {
  if (typeof clipToShape !== 'boolean') {
    return '"clipToShape" must be a boolean when provided.';
  }
  if (clipToShapeFn !== undefined && typeof clipToShapeFn !== 'function') {
    return '"clipToShapeFn" must be a function when provided.';
  }
  return clipToShape && typeof clipToShapeFn !== 'function'
    ? '"clipToShapeFn" must be provided when "clipToShape" is true.'
    : '';
};

const getValidationError = (options) => {
  if (!options || typeof options !== 'object') {
    return 'an options object is required.';
  }

  const { key, drawHandler } = options;
  if (typeof key !== 'string' || key.trim() === '') {
    return '"key" is required and must be a non-empty string.';
  }
  if (key === SOLID_FILL_STYLE_KEY) {
    return `"${SOLID_FILL_STYLE_KEY}" is a reserved built-in fill style key.`;
  }
  if (typeof drawHandler !== 'function') {
    return '"drawHandler" must be a function.';
  }

  return validateTargets(options.appliesTo)
    || validateOptionalTypes(options)
    || validateClippingOptions(options);
};

/**
 * Registers a custom fill style entry shown in the Fill section of the style panel.
 *
 * The selected key is stored on the annotation's `FillStyle` property, serialized to XFDF, and
 * re-applied on import. If the key is no longer registered when an annotation is loaded, the
 * annotation falls back to its default solid fill appearance.
 *
 * Registering with a key that matches an already registered fill style replaces the previous one.
 *
 * @method UI.registerCustomFillStyle
 * @param {UI.CustomFillStyleOptions} options Options for the custom fill style
 * @example
 * WebViewer(...).then(function(instance) {
 *   instance.UI.registerCustomFillStyle({
 *     key: 'fill-hatch',
 *     appliesTo: ['all'],
 *     title: 'Hatch Fill',
 *     svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
 *     drawHandler: (ctx, pageMatrix, rotation, { annotation, originalDrawWithoutFill, clipToShape }) => {
 *       originalDrawWithoutFill();
 *
 *       ctx.save();
 *       clipToShape();
 *       ctx.strokeStyle = annotation.StrokeColor.toString();
 *       for (let i = -annotation.Height; i < annotation.Width; i += 8) {
 *         ctx.moveTo(annotation.X + i, annotation.Y);
 *         ctx.lineTo(annotation.X + i + annotation.Height, annotation.Y + annotation.Height);
 *       }
 *       ctx.stroke();
 *       ctx.restore();
 *     },
 *   });
 * });
 */
const registerCustomFillStyle = (store) => (options) => {
  const validationError = getValidationError(options);
  if (validationError) {
    console.warn(`registerCustomFillStyle: ${validationError}`);
    return;
  }

  const { key, appliesTo, title, svg, drawHandler, clipToShape = false, clipToShapeFn } = options;

  store.dispatch(actions.registerCustomFillStyle({ key, title, svg, appliesTo }));
  registerFillDrawHandler(key, drawHandler, appliesTo, clipToShapeFn, clipToShape);
};

/**
 * Unregisters a custom fill style previously added with {@link UI.registerCustomFillStyle registerCustomFillStyle}.
 *
 * Annotations still referencing the key are reset to their default solid fill appearance and redrawn.
 *
 * @method UI.unregisterCustomFillStyle
 * @param {string} key The key of the custom fill style to remove.
 * @example
 * instance.UI.unregisterCustomFillStyle('fill-hatch');
 */
const unregisterCustomFillStyle = (store) => (key) => {
  if (typeof key !== 'string' || key.trim() === '') {
    console.warn('unregisterCustomFillStyle: "key" is required and must be a non-empty string.');
    return;
  }

  store.dispatch(actions.unregisterCustomFillStyle(key));
  unregisterFillDrawHandler(key);
};

export { registerCustomFillStyle, unregisterCustomFillStyle };
