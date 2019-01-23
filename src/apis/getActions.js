import core from 'core';
import { PRIORITY_THREE } from 'constants/actionPriority';
import { mapToolNameToKey, getDataWithKey } from 'constants/map';
import * as exposedActions from 'actions/exposedActions';
import actions from 'actions';
import selectors from 'selectors';

export default store => ({
  ...mapExposedActions(store),
  disableElement: dataElement => store.dispatch(actions.disableElement(dataElement, PRIORITY_THREE)),
  disableElements: dataElements => {
    if (typeof dataElements === 'string') {
      return store.dispatch(actions.disableElement(dataElements, PRIORITY_THREE));
    }
    return store.dispatch(actions.disableElements(dataElements, PRIORITY_THREE));
  },
  enableElement: dataElement => store.dispatch(actions.enableElement(dataElement, PRIORITY_THREE)),
  enableElements: dataElements => {
    if (typeof dataElements === 'string') {
      return store.dispatch(actions.enableElement(dataElements, PRIORITY_THREE));
    }
    return store.dispatch(actions.enableElements(dataElements, PRIORITY_THREE));
  },
  setColorPalette: (toolName, colorPalette) => {
    const availablePalettes = getDataWithKey(mapToolNameToKey(toolName)).availablePalettes;
    const property = mapPaletteToAnnotationColorProperty[colorPalette];
    if (availablePalettes.includes(property)) {
      store.dispatch(actions.setColorPalette(mapToolNameToKey(toolName), mapPaletteToAnnotationColorProperty[colorPalette]));
    } else {
      console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
    }
  },
  setIconColor: (toolName, colorPalette) => {
    const availablePalettes = getDataWithKey(mapToolNameToKey(toolName)).availablePalettes;
    const property = mapPaletteToAnnotationColorProperty[colorPalette];
    if (availablePalettes.includes(property)) {
      store.dispatch(actions.setIconColor(mapToolNameToKey(toolName), mapPaletteToAnnotationColorProperty[colorPalette]));
    } else {
      console.warn(`${toolName} does not have ${colorPalette} color, available colors are: ${availablePalettes.map(palette => mapAnnotationColorPropertyToPalette[palette]).join(', ')} `);
    }
  },
  focusNote: id => {
    const state = store.getState();
    const annotation = core.getAnnotationById(id);
     if (selectors.isElementOpen(state, 'leftPanel')) {
      if (!core.isAnnotationSelected(annotation)) {
        core.selectAnnotation(annotation);
      }
      store.dispatch(actions.setActiveLeftPanel('notesPanel'));
      store.dispatch(actions.expandNote(id));
      store.dispatch(actions.setIsNoteEditing(true));
    } else {
      store.dispatch(actions.openElement('notesPanel'));
      setTimeout(() => {
        if (!core.isAnnotationSelected(annotation)) {
          core.selectAnnotation(annotation);
        }
        store.dispatch(actions.expandNote(id));
        store.dispatch(actions.setIsNoteEditing(true));
      }, 400);
    }
  }
});

const mapExposedActions = store => Object.keys(exposedActions).reduce((acc, action) => {
  acc[action] = (...params) => {
    store.dispatch(exposedActions[action](...params));
  };
  return acc;
}, {});

const mapPaletteToAnnotationColorProperty = {
  border: 'StrokeColor',
  fill: 'FillColor',
  text: 'TextColor'
};

const mapAnnotationColorPropertyToPalette = {
  StrokeColor: 'border',
  FillColor: 'fill',
  TextColor: 'text'
};