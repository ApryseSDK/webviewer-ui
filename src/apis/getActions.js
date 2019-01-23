import core from 'core';
import { PRIORITY_THREE } from 'constants/actionPriority';
import { mapToolNameToKey } from 'constants/map';
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
    // TODO: add warning messages
    store.dispatch(actions.setColorPalette(mapToolNameToKey(toolName), mapPaletteToAnnotationColor[colorPalette]));
  },
  setIconColor: (toolName, colorPalette) => {
    // TODO: add warning messages
    store.dispatch(actions.setIconColor(mapToolNameToKey(toolName), mapPaletteToAnnotationColor[colorPalette]));
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

const mapPaletteToAnnotationColor = {
  border: 'StrokeColor',
  fill: 'FillColor',
  text: 'TextColor'
};