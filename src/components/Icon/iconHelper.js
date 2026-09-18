import DOMPurify from 'dompurify';

// Matches inline SVG markup, optionally preceded by an XML preamble (e.g. `<?xml ...?><svg ...>`).
const INLINE_SVG_MARKUP_REGEX = /^(?:<\?xml[^>]*\?>\s*)?<svg\b/i;

/**
 * Determines whether a source string is raw inline SVG markup.
 * @param {string} source The `glyph`/`img` value to classify
 * @returns {boolean} Whether the source is inline SVG markup
 * @ignore
 */
export const isInlineSvgMarkup = (source) => typeof source === 'string' && INLINE_SVG_MARKUP_REGEX.test(source.trim());

/**
 * Determines whether a source string should be treated as a bundled/inline glyph (rendered by
 * injecting SVG markup) rather than an external image source (rendered via an `<img>` tag).
 * Glyph sources are either raw inline SVG markup, or a bundled icon name with no file extension.
 * Anything else - a relative/absolute file path, a URL, or a data URI - is treated as an external
 * image source so it can be loaded with `<img src>` instead of being required from the icon bundle.
 * @param {string} source The `glyph`/`img` value to classify
 * @returns {boolean} Whether the source should be treated as a glyph
 * @ignore
 */
export const isGlyphSource = (source) => {
  if (typeof source !== 'string') {
    return false;
  }

  const trimmedSource = source.trim();
  if (!trimmedSource) {
    return false;
  }

  if (isInlineSvgMarkup(trimmedSource)) {
    return true;
  }

  return !trimmedSource.includes('.') && !trimmedSource.startsWith('data:');
};

/**
 * Sanitizes SVG markup before it is injected into the DOM. Custom style registrations
 * (e.g. `registerCustomLineStyle`/`registerCustomFillStyle`) allow customers to supply raw SVG
 * markup, so this strips scripts and event handler attributes before rendering.
 * @param {string} svgMarkup The SVG markup to sanitize
 * @returns {string} The sanitized SVG markup
 * @ignore
 */
export const sanitizeSvgMarkup = (svgMarkup) => {
  if (!svgMarkup) {
    return svgMarkup;
  }
  return DOMPurify.sanitize(svgMarkup, { USE_PROFILES: { svg: true, svgFilters: true } });
};

/**
 * Determines whether an external (non-glyph) source points at an SVG file. These are fetched and
 * injected as markup rather than rendered with `<img>`, so that `currentColor` fills/strokes and
 * the CSS rules that size icon markup (e.g. `.linestyle-image svg`) keep working the same way they
 * do for bundled/inline glyphs. Non-SVG externals (png/jpg/data URIs, etc.) fall back to `<img>`.
 * @param {string} source The `glyph` value to classify
 * @returns {boolean} Whether the source is an external SVG file
 * @ignore
 */
export const isExternalSvgSource = (source) => {
  if (typeof source !== 'string' || isGlyphSource(source)) {
    return false;
  }
  const withoutQueryOrHash = source.split(/[?#]/)[0].trim().toLowerCase();
  return withoutQueryOrHash.endsWith('.svg');
};

// Caps memory growth from long-lived sessions/apps that reference many unique external icon URLs.
const SVG_FETCH_CACHE_MAX_SIZE = 100;
const svgFetchCache = new Map();

/**
 * Fetches and caches the text contents of an external SVG file, so multiple Icons referencing the
 * same path/URL (e.g. repeated dropdown swatches) only trigger a single network request. Evicts the
 * oldest entry once the cache exceeds `SVG_FETCH_CACHE_MAX_SIZE`.
 * @param {string} url The SVG file path or URL to fetch
 * @returns {Promise<string|null>} The SVG markup, or `null` if it could not be loaded
 * @ignore
 */
export const fetchSvgMarkup = (url) => {
  if (!svgFetchCache.has(url)) {
    const request = fetch(url)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error(`${response.status} ${response.statusText}`))))
      .catch((error) => {
        console.warn(`Icon: unable to load SVG from "${url}": ${error}`);
        svgFetchCache.delete(url);
        return null;
      });

    if (svgFetchCache.size >= SVG_FETCH_CACHE_MAX_SIZE) {
      const oldestKey = svgFetchCache.keys().next().value;
      svgFetchCache.delete(oldestKey);
    }
    svgFetchCache.set(url, request);
  }
  return svgFetchCache.get(url);
};

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
  if (disabled && !ariaLabel) {
    return svgMarkup;
  }

  const svgDocument = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
  if (svgDocument.querySelector('parsererror')) {
    return svgMarkup;
  }

  const svgElement = svgDocument.documentElement;
  const elementsWithAttributes = (attributeName) => [
    ...(svgElement.matches(`[${attributeName}]`) ? [svgElement] : []),
    ...svgElement.querySelectorAll(`[${attributeName}]`),
  ];

  if (!disabled) {
    elementsWithAttributes('fill').forEach((element) => {
      const fillValue = element.getAttribute('fill');
      if (fillValue && fillValue !== 'default' && shouldUseCurrentColorChannel({ attributeValue: fillValue, hasColorProp: !!color })) {
        element.setAttribute('fill', 'currentColor');
      }
    });

    elementsWithAttributes('stroke').forEach((element) => {
      const strokeValue = element.getAttribute('stroke');
      if (strokeValue && strokeValue !== 'default' && shouldUseCurrentColorChannel({ attributeValue: strokeValue, hasColorProp: !!color })) {
        element.setAttribute('stroke', 'currentColor');
      }
    });
  }

  if (!disabled && fillColor) {
    const fillColorValue = `#${fillColor}`;
    elementsWithAttributes('fill').forEach((element) => {
      if (element.getAttribute('fill').trim().toLowerCase() === 'none') {
        element.setAttribute('fill', fillColorValue);
      }
    });
  }

  if (!disabled && strokeColor) {
    const strokeColorValue = `#${strokeColor}`;
    elementsWithAttributes('fill').forEach((element) => {
      if (element.getAttribute('fill').trim().toLowerCase() === 'stroke') {
        element.setAttribute('fill', strokeColorValue);
      }
    });
  }

  if (ariaLabel) {
    const sanitizedAriaLabel = DOMPurify.sanitize(ariaLabel, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    svgElement.setAttribute('aria-label', decodeHtmlEntities(sanitizedAriaLabel));
  }

  return new XMLSerializer().serializeToString(svgElement);
};
