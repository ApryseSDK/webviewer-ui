import actions from 'actions';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import mapAnnotationColorPropertyToPalette from 'constants/mapAnnotationColorPropertyToPalette';

/**
 * Sets the active color palette of a tool and its associated annotation
 * @method UI.setActivePalette
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @param {'text'|'border'|'fill'} colorPalette The palette to be activated. One of 'text', 'border' and 'fill'.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setActivePalette('AnnotationCreateFreeText', 'fill')
  });
 */

export default (store) => (toolName, colorPalette) => {
  const styleTabs = getDataWithKey(mapToolNameToKey(toolName)).styleTabs;
  const property = mapPaletteToAnnotationColorProperty[colorPalette];

  if (styleTabs.includes(property)) {
    store.dispatch(actions.setActivePalette(mapToolNameToKey(toolName), property));
  } else {
    console.warn(`${toolName} does not have the ${colorPalette} color. The available colors are: ${styleTabs.map((palette) => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
  }
};