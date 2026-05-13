import DOMPurify from 'dompurify';

/**
 * Checks if the provided attribute value is a candidate for color override.
 * Values that are not candidates for override include:
 *   - 'none' (explicitly indicates no color)
 *   - 'currentColor' (already using the currentColor channel)
 *   - 'stroke' (references the stroke color channel)
 *   - any value that references an external resource (e.g. url(#gradient1))
 *   - any value that references a CSS variable (e.g. var(--icon-color))
 * @param {string} value The attribute value to check
 * @returns {boolean} Whether the provided value is a candidate for color override
 * @ignore
 */
const isColorOverrideCandidate = (value = '') => {
  const normalizedValue = `${value}`.trim().toLowerCase();
  if (!normalizedValue) {
    return false;
  }

  return normalizedValue !== 'none'
    && normalizedValue !== 'currentcolor'
    && normalizedValue !== 'stroke'
    && !normalizedValue.startsWith('url(')
    && !normalizedValue.startsWith('var(');
};

/* eslint-disable custom/no-hex-colors */
const NEUTRAL_ICON_FILLS = new Set([
  '#abb0c4',
  '#868e96',
  '#8c8c8c',
  '#808080',
  '#000000',
  'black',
]);
/* eslint-enable custom/no-hex-colors */

/* eslint-disable custom/no-hex-colors */
const WHITE_FILL_VALUES = new Set([
  'white',
  '#fff',
  '#ffffff',
  'rgb(255,255,255)',
  'rgba(255,255,255,1)',
]);
/* eslint-enable custom/no-hex-colors */

const isWhiteFillValue = (value = '') => WHITE_FILL_VALUES.has(`${value}`.trim().toLowerCase().replace(/\s+/g, ''));

/**
 * Determines whether the attribute value should be overridden with the currentColor channel
 * @param {object} options
 * @param {string} options.attributeValue The value of the attribute to check
 * @param {boolean} options.hasColorProp Whether the Icon component has a color prop provided
 * @returns {boolean} Whether the attribute value should be overridden with the currentColor channel
 * @ignore
 */
const shouldUseCurrentColorChannel = ({ attributeValue, hasColorProp }) => {
  if (!isColorOverrideCandidate(attributeValue)) {
    return false;
  }

  if (isWhiteFillValue(attributeValue)) {
    return false;
  }

  if (hasColorProp) {
    return true;
  }

  return NEUTRAL_ICON_FILLS.has(`${attributeValue}`.trim().toLowerCase());
};

/**
 * Replaces the values of a specified attribute in the SVG markup by applying a replacer function to the current attribute value
 * @param {string} markup The SVG markup to transform
 * @param {string} attributeName The name of the attribute to replace
 * @param {function} replacer A function that takes the current attribute value and returns the new value
 * @returns {string} The transformed SVG markup
 * @ignore
 */
const replaceAttributeValues = (markup, attributeName, replacer) => {
  const attrRegex = new RegExp(String.raw`\b${attributeName}\s*=\s*(['"])(.*?)\1`, 'gi');

  return markup.replace(attrRegex, (match, quote, attributeValue) => {
    const nextValue = replacer(attributeValue);
    if (typeof nextValue !== 'string' || nextValue === attributeValue) {
      return match;
    }

    return `${attributeName}=${quote}${nextValue}${quote}`;
  });
};

/**
 * Escapes special characters in the provided value and returns the escaped string
 * @param {*} value The value to escape
 * @returns {string} The escaped value
 * @ignore
 */
const escapeAttributeValue = (value = '') => `${value}`
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/**
 * Wraps String.fromCodePoint to safely return the default backup value if the code point is invalid
 * @param {number} codePoint
 * @param {string} defaultValue
 * @returns {string}
 * @ignore
 */
const fromCodePoint = (codePoint, defaultValue) => {
  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return defaultValue;
  }
};

/**
 * Decodes HTML entities in the provided value and returns the decoded string
 * @param {*} value The value to decode
 * @returns {string} The decoded value
 * @ignore
 */
const decodeHtmlEntities = (value = '') => `${value}`
  .replace(/&#(\d+);/g, (match, decimalCode) => fromCodePoint(Number(decimalCode), match))
  .replace(/&#x([0-9a-f]+);/gi, (match, hexCode) => fromCodePoint(Number.parseInt(hexCode, 16), match))
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .replace(/&apos;/g, '\'')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

/**
 * Sets the specified attribute to the provided value in the root <svg> tag of the markup.
 * If the attribute already exists, its value will be replaced, otherwise the attribute will be added to the tag.
 * @param {string} markup The SVG markup in which to set the attribute
 * @param {string} attributeName The name of the attribute to set
 * @param {string} attributeValue The value to set for the attribute
 * @returns {string} The transformed SVG markup with the attribute set to the provided value
 * @ignore
 */
const setSvgAttribute = (markup, attributeName, attributeValue) => {
  if (!markup || !attributeName) {
    return markup;
  }

  const svgTagRegex = /<svg\b([^>]*)>/i;
  return markup.replace(svgTagRegex, (svgTag, attrs = '') => {
    const attrPresenceRegex = new RegExp(String.raw`\b${attributeName}\s*=\s*(['"]).*?\1`, 'i');
    const escapedValue = escapeAttributeValue(attributeValue);

    if (attrPresenceRegex.test(attrs)) {
      const replacementAttr = `${attributeName}="${escapedValue}"`;
      const updatedAttrs = attrs.replace(attrPresenceRegex, replacementAttr);
      return `<svg${updatedAttrs}>`;
    }

    return `<svg${attrs} ${attributeName}="${escapedValue}">`;
  });
};

/**
 * Transforms the provided SVG markup by applying various attribute modifications based on the provided options.
 * @param {string} svgMarkup The SVG markup to transform
 * @param {object} options
 * @param {string} options.color The color to apply to the SVG
 * @param {string} options.fillColor The fill color to apply to the SVG
 * @param {string} options.strokeColor The stroke color to apply to the SVG
 * @param {boolean} options.disabled Whether the SVG is disabled
 * @param {string} options.ariaLabel The aria-label to apply to the SVG
 * @returns {string} The transformed SVG markup
 * @ignore
 */
export const transformSvgMarkup = (svgMarkup, {
  color,
  fillColor,
  strokeColor,
  disabled,
  ariaLabel,
}) => {
  if (!svgMarkup) {
    return svgMarkup;
  }
  if (!/<svg\b/i.test(svgMarkup)) {
    return svgMarkup;
  }

  let transformedSvgMarkup = svgMarkup;

  if (!disabled) {
    transformedSvgMarkup = replaceAttributeValues(transformedSvgMarkup, 'fill', (fillValue) => {
      if (fillValue && fillValue !== 'default' && shouldUseCurrentColorChannel({ attributeValue: fillValue, hasColorProp: !!color })) {
        return 'currentColor';
      }
      return fillValue;
    });

    transformedSvgMarkup = replaceAttributeValues(transformedSvgMarkup, 'stroke', (strokeValue) => {
      if (strokeValue && strokeValue !== 'default' && shouldUseCurrentColorChannel({ attributeValue: strokeValue, hasColorProp: !!color })) {
        return 'currentColor';
      }
      return strokeValue;
    });
  }

  if (!disabled && fillColor) {
    const fillColorValue = `#${fillColor}`;
    transformedSvgMarkup = replaceAttributeValues(transformedSvgMarkup, 'fill', (fillValue) => {
      if (`${fillValue}`.trim().toLowerCase() === 'none') {
        return fillColorValue;
      }
      return fillValue;
    });
  }

  if (!disabled && strokeColor) {
    const strokeColorValue = `#${strokeColor}`;
    transformedSvgMarkup = replaceAttributeValues(transformedSvgMarkup, 'fill', (fillValue) => {
      if (`${fillValue}`.trim().toLowerCase() === 'stroke') {
        return strokeColorValue;
      }
      return fillValue;
    });
  }

  if (ariaLabel) {
    const sanitizedAriaLabel = DOMPurify.sanitize(ariaLabel, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    transformedSvgMarkup = setSvgAttribute(transformedSvgMarkup, 'aria-label', decodeHtmlEntities(sanitizedAriaLabel));
  }

  return transformedSvgMarkup;
};
