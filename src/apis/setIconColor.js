/**
 * Sets the color palette that will be used as a tool button's icon color.
 * @method WebViewer#setIconColor
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @param {string} colorPalette The palette which will be used as a tool button's icon color. One of 'text', 'border' and 'fill'.
 * @example // sets the color in fill palette to be used as freetext tool button's icon color
// by default freetext tool button will use the color in text palette as its icon color
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setIconColor('AnnotationCreateFreeText', 'fill')
});
 */

import actions from 'actions';
import selectors from 'selectors';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import mapAnnotationColorPropertyToPalette from 'constants/mapAnnotationColorPropertyToPalette';

export default store => (toolName, colorPalette) => {
  const state = store.getState();
  const availablePalettes = selectors.getAvailablePalettes(state, toolName);
  const property = mapPaletteToAnnotationColorProperty[colorPalette];
  if (availablePalettes.includes(property)) {
    store.dispatch(actions.setIconColor(toolName, mapPaletteToAnnotationColorProperty[colorPalette]));
  } else {
    console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
  }
};