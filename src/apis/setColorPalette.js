import actions from 'actions';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import mapAnnotationColorPropertyToPalette from 'constants/mapAnnotationColorPropertyToPalette';

export default store => (toolName, colorPalette) => {
  const availablePalettes = getDataWithKey(mapToolNameToKey(toolName)).availablePalettes;
  const property = mapPaletteToAnnotationColorProperty[colorPalette];
  if (availablePalettes.includes(property)) {
    store.dispatch(actions.setColorPalette(mapToolNameToKey(toolName), property));
  } else {
    console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
  }
};