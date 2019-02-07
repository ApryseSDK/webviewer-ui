import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import core from 'core';

import * as exposedActions from 'actions/exposedActions';
import initialState from 'src/redux/initialState.js';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

describe('exposedActions', () => {
  
  beforeEach(() => {
    store.clearActions();
  });

  test('enableAllElements', () => {
    store.dispatch(exposedActions.enableAllElements());
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {},
      type: 'ENABLE_ALL_ELEMENTS'
    }); 
  });

  // openElement
  test('openElement with dataElement and isLeftPanelOpen is false', () => {
    store.dispatch(exposedActions.openElement('notesPanel'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'leftPanel'
      },
      type: 'OPEN_ELEMENT'
    });
  });
  test('openElement with dataElement and isLeftPanelOpen is true', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, openElements: { 'leftPanel':true } } });
    store.dispatch(exposedActions.openElement('notesPanel'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'thumbnailsPanel'
      },
      type: 'CLOSE_ELEMENT'
    });
  });
  test('openElement with non-dataElement', () => {
    store.dispatch(exposedActions.openElement('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test'
      },
      type: 'OPEN_ELEMENT'
    });
  });
  test('openElement with leftPanel', () => {
    store.dispatch(exposedActions.openElement('leftPanel'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'leftPanel'
      },
      type: 'OPEN_ELEMENT'
    });
  });
  
  // openElements
  test('openElements with string', () => {
    store.dispatch(exposedActions.openElements('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test'
      },
      type: 'OPEN_ELEMENT'
    });
  });
  test('openElements with non-string', () => {
    store.dispatch(exposedActions.openElements([1,2,3]));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 1
      },
      type: 'OPEN_ELEMENT'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElement: 2
      },
      type: 'OPEN_ELEMENT'
    });
    expect(actions[2]).toEqual({
      payload: {
        dataElement: 3
      },
      type: 'OPEN_ELEMENT'
    });
  });

  // closeElement
  test('closeElement with disabled element', () => {
    store.dispatch(exposedActions.closeElement('test'));
    const actions = store.getActions();
    expect(actions[0]).toBeUndefined;
  });
  test('closeElement with panel and leftPanel is open', () => {
    const store = mockStore({ ...initialState, viewer:{ ...initialState.viewer, activeLeftPanel: 'notesPanel', openElements: { 'leftPanel': true } } });
    store.dispatch(exposedActions.closeElement('notesPanel'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'leftPanel'
      },
      type: 'CLOSE_ELEMENT'
    });
  });
  test('closeElement with non-panel', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, openElements: { 'leftPanel': true } } });
    store.dispatch(exposedActions.closeElement('leftPanel'));
    const actions = store.getActions();
    // cannot detect fireEvent in Jest
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'leftPanel'
      },
      type: 'CLOSE_ELEMENT'
    });
  });

  // closeElements
  test('closeElements with string', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, openElements: {'test': true} } });
    store.dispatch(exposedActions.closeElements('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test'
      },
      type: 'CLOSE_ELEMENT'
    });
  });
  test('closedElements with non-string', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, openElements: { 'test1': true, 'test2': true, 'test3': true } } });
    store.dispatch(exposedActions.closeElements(['test1','test2','test3']));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test1'
      },
      type: 'CLOSE_ELEMENT'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElement: 'test2'
      },
      type: 'CLOSE_ELEMENT'
    });
    expect(actions[2]).toEqual({
      payload: {
        dataElement: 'test3'
      },
      type: 'CLOSE_ELEMENT'
    });
  });

  //toggleElement
  test('toggleElement with disabled element', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, disabledElements: { 'test': true } } });
    store.dispatch(exposedActions.toggleElement('test'));
    const actions = store.getActions();
    expect(actions[0]).toBeUndefined;
  });
  test('toggleElement with open element', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, openElements: { 'test': true } } });
    store.dispatch(exposedActions.toggleElement('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test'
      },
      type: 'CLOSE_ELEMENT'
    });
  });
  test('toggleElement with closed element', () => {
    const store = mockStore({ ...initialState, viewer: { ...initialState.viewer, closedElements: { 'test': true } } });
    store.dispatch(exposedActions.toggleElement('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'test'
      },
      type: 'OPEN_ELEMENT'
    });
  });

  test('setActiveHeaderGroup', () => {
    store.dispatch(exposedActions.setActiveHeaderGroup('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        headerGroup: 'test'
      },
      type: 'SET_ACTIVE_HEADER_GROUP'
    });
  });

  // setActiveLeftPanel
  test('setActiveLeftPanel with dataElementPanel and activePanel is dataElement', () => {
    store.dispatch(exposedActions.setActiveLeftPanel('thumbnailsPanel'));
    const actions = store.getActions();
    expect(actions[0]).toBeUndefined;
  });
  test('setActiveLeftPanel with dataElement and activePanel is not dataElement', () => {
    store.dispatch(exposedActions.setActiveLeftPanel('notesPanel'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'thumbnailsPanel'
      },
      type: 'CLOSE_ELEMENT'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElement: 'notesPanel'
      },
      type: 'SET_ACTIVE_LEFT_PANEL'
    });
  });
  test('setActiveLeftPanel with non-dataElement', () => {
    store.dispatch(exposedActions.setActiveLeftPanel('test'));
    const actions = store.getActions();
    expect(actions[0]).toBeUndefined;
  });

  test('setSortStrategy', () => {
    store.dispatch(exposedActions.setSortStrategy('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        sortStrategy: 'test'
      },
      type: 'SET_SORT_STRATEGY'
    });
  });

  test('setSortNotesBy', () => {
    store.dispatch(exposedActions.setSortNotesBy('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        sortStrategy: 'test'
      },
      type: 'SET_SORT_STRATEGY'
    });
  });

  test('setNoteDateFormat', () => {
    store.dispatch(exposedActions.setNoteDateFormat('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        noteDateFormat: 'test'
      }, 
      type: 'SET_NOTE_DATE_FORMAT'
    });
  });

  test('updateTool', () => {
    store.dispatch(exposedActions.updateTool('test','test1'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        toolName: 'test',
        properties: 'test1'
      },
      type: 'UPDATE_TOOL'
    });
  });

  test('setCustomPanel', () => {
    store.dispatch(exposedActions.setCustomPanel('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        newPanel: 'test' 
      },
      type: 'SET_CUSTOM_PANEL'
    });
  });
  
  test('useEmbeddedPrint', () => {
    store.dispatch(exposedActions.useEmbeddedPrint(true));
    store.dispatch(exposedActions.useEmbeddedPrint());
    store.dispatch(exposedActions.useEmbeddedPrint(false));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        useEmbeddedPrint: true
      },
      type: 'USE_EMBEDDED_PRINT'
    });
    expect(actions[1]).toEqual({
      payload: {
        useEmbeddedPrint: true
      },
      type: 'USE_EMBEDDED_PRINT'
    });
    expect(actions[2]).toEqual({
      payload: {
        useEmbeddedPrint: false
      },
      type: 'USE_EMBEDDED_PRINT'
    });
  });

  test('setPageLabels', () => {
    core.getTotalPages = jest.fn();
    core.getTotalPages.mockReturnValue(3);
    store.dispatch(exposedActions.setPageLabels(['i','ii','iii']));
    store.dispatch(exposedActions.setPageLabels(['x','xx']));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        pageLabels: ['i', 'ii', 'iii']
      },
      type: 'SET_PAGE_LABELS'
    });
    expect(actions[1]).toBeUndefined;
  });
  
  test('setSwipeOrientation', () => {
    store.dispatch(exposedActions.setSwipeOrientation('test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        swipeOrientation: 'test'
      },
      type: 'SET_SWIPE_ORIENTATION'
    });
  });
});