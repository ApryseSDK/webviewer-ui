import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import { COLOR_PALETTE_STYLES } from 'src/constants/commonColors';

/**
 * @typedef UI.PaletteOption
 * @property {string[]} toolNames Tools that will have the same colors in the palette.
 * @property {string[]} colors An array of hex colors. Use 'transparency' for a transparent color.
 */

/**
 * Sets the colors in the palette globally or for specific tools and their associated annotations.
 * @method UI.setColorPalette
 * @param {string[]|UI.PaletteOption} palette array of hex colors that will override the default colors for every tool.
 * An object can be passed to specify colors for particular tools.
 * @example
WebViewer(...)
  .then(function(instance) {
    // this sets the palette globally. All the tools will use these colors. Can use 'transparency' for a transparent color.
    instance.UI.setColorPalette(['#FFFFFF', '#DDDDDD', 'transparency']);

    // use a different set of colors for the freetext and rectangle tool.
    instance.UI.setColorPalette({
      toolNames: ['AnnotationCreateFreeText', 'AnnotationCreateRectangle'],
      colors: ['#333333'],
    })
  });
 */

export default (store) => (overrides) => {
  const currentOverride = {
    ...(selectors.getCustomElementOverrides(store.getState(), 'colorPalette') || {}),
  };

  if (Array.isArray(overrides)) {
    if (overrides.every(isValidColor)) {
      currentOverride.global = overrides;
    } else {
      return console.warn(
        // eslint-disable-next-line custom/no-hex-colors
        'An array is passed to setColorPalette, but some colors are invalid. A color must be   \'transparency\' or a hex color string. For example #F0F0F0'
      );
    }
  } else if (typeof overrides === 'object') {
    if (overrides.toolNames && overrides.colors) {
      overrides.toolNames.forEach((toolName) => {
        const key = mapToolNameToKey(toolName);
        currentOverride[key] = overrides.colors;
      });
    } else {
      return console.warn(
        'An object is passed to setColorPalette, but it doesn\'t have a toolNames or colors property.'
      );
    }
  }

  store.dispatch(actions.setCustomElementOverrides('colorPalette', currentOverride));

  // Custom-UI pallete override logic
  // Fill color includes transparent by default
  if (Array.isArray(overrides)) {
    const colorPalette = overrides.map((color) => (color === 'transparency' ? 'transparent' : color.toLowerCase()));
    store.dispatch(actions.setColors(colorPalette, undefined, COLOR_PALETTE_STYLES.TextColor.type));
    store.dispatch(actions.setColors(colorPalette, undefined, COLOR_PALETTE_STYLES.StrokeColor.type));
    store.dispatch(actions.setColors(colorPalette.filter((color) => color !== 'transparent'), undefined, COLOR_PALETTE_STYLES.FillColor.type));
  } else if (typeof overrides === 'object') {
    overrides.toolNames.forEach((toolName) => {
      const colorPalette = overrides.colors.map((color) => (color === 'transparency' ? 'transparent' : color.toLowerCase()));
      store.dispatch(actions.setColors(colorPalette, toolName, COLOR_PALETTE_STYLES.TextColor.type));
      store.dispatch(actions.setColors(colorPalette, toolName, COLOR_PALETTE_STYLES.StrokeColor.type));
      store.dispatch(actions.setColors(colorPalette.filter((color) => color !== 'transparent'), toolName, COLOR_PALETTE_STYLES.FillColor.type));
    });
  }
};

// examples of valid colors are: '#f0f0f0', '#FFFFFF'
const isValidColor = (color) => color === 'transparency' || (color.startsWith('#') && color.split('#')[1].length === 6);
