import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as internalActions from 'actions/internalActions';
import initialState from 'src/redux/initialState.js';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

describe('internalActions', () => {
  
  beforeEach(() => {
    store.clearActions();
  });

  test('disableElement stylePopup', () => {
    store.dispatch(internalActions.disableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS'
    });
  });
  test('disableElement not stylePopup', () => {
    store.dispatch(internalActions.disableElement('notesPanel',1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'notesPanel',
        priority: 1
      },
      type: 'DISABLE_ELEMENT'
    });
  });

  test('disableElements', () => {
    store.dispatch(internalActions.disableElements(['stylePopup'], 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ 
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS' 
    });
  });

  test('enableElement stylePopup', () => {
    store.dispatch(internalActions.enableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });
  test('enableElement not stylePopup', () => {
    store.dispatch(internalActions.enableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });

  test('enableElements', () => {
    store.dispatch(internalActions.enableElements(['notesPanel'],1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['notesPanel'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });

  test('setActiveToolNameAndStyle with TextSelect', () => {
    const mockObject = {
      name: 'TextSelect',
      defalt: 'none'
    };
    store.dispatch(internalActions.setActiveToolNameAndStyle(mockObject));
    const actions = store.getActions();
    // since default activeToolName is AnnotationEdit, no action is fired
    expect(actions[0]).toBeUndefined;
  });
  test('setActiveToolNameAndStyle', () => {
    const mockObject = {
      name: 'test',
      default: 'none'
    };
    store.dispatch(internalActions.setActiveToolNameAndStyle(mockObject));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        toolName: 'test',
        toolStyles: {}
      },
      type: 'SET_ACTIVE_TOOL_NAME_AND_STYLES'
    });
  });

  test('setIsNoteEditing with true', () => {
    store.dispatch(internalActions.setIsNoteEditing(true));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        isNoteEditing: true
      },
      type: 'SET_IS_NOTE_EDITING'
    });
  });

  test('setIsNoteEditing with false', () => {
    store.dispatch(internalActions.setIsNoteEditing(false));
    const actions = store.getActions();
    expect(actions[0]).toBeUndefined;
  });
});
