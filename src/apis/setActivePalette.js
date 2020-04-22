import actions from 'actions';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import mapAnnotationColorPropertyToPalette from 'constants/mapAnnotationColorPropertyToPalette';

/**
 * Sets the active color palette of a tool and its associated annotation
 * @method WebViewerInstance#setActivePalette
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @param {'text'|'border'|'fill'} colorPalette The palette to be activated. One of 'text', 'border' and 'fill'.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setActivePalette('AnnotationCreateFreeText', 'fill')
  });
 */

export default store => (toolName, colorPalette) => {
  const availablePalettes = getDataWithKey(mapToolNameToKey(toolName)).availablePalettes;
  const property = mapPaletteToAnnotationColorProperty[colorPalette];

  if (availablePalettes.includes(property)) {
    store.dispatch(actions.setActivePalette(mapToolNameToKey(toolName), property));
  } else {
    console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
  }
};