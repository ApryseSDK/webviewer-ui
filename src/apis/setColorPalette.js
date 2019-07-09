import actions from 'actions';
import selectors from 'selectors';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import mapAnnotationColorPropertyToPalette from 'constants/mapAnnotationColorPropertyToPalette';

export default store => (toolName, colorPalette) => {
  const state = store.getState();
  const availablePalettes = selectors.getAvailablePalettes(state, toolName);
  const property = mapPaletteToAnnotationColorProperty[colorPalette];
  if (availablePalettes.includes(property)) {
    store.dispatch(actions.setColorPalette(toolName, mapPaletteToAnnotationColorProperty[colorPalette]));
  } else {
    console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
  }
};