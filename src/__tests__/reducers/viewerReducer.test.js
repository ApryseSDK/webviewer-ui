import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState.js';

describe('viewerReducer', () => {

  test('Initial state is unchanged', () => {
    const action = { type: 'sample', payload: 'sample' };    
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(initialState.viewer);
  });

  test('DISABLE_ELEMENT', () => {
    const action = { type: 'DISABLE_ELEMENT', payload: { dataElement:'freeHandToolGroupButton', priority: 'high' } };
    const expectedState = { ...initialState.viewer, disabledElements: { ...initialState.viewer.disabledElements, ['freeHandToolGroupButton']: { disabled: true, priority: 'high' } } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('DISABLE_ELEMENTS', () => {
    const action = { type: 'DISABLE_ELEMENTS', payload: { dataElements:['test','test1','test2'], priority: 'high' } };
    const expectedState = { ...initialState.viewer, disabledElements: { ...initialState.viewer.disabledElements, 
      ['test']: { disabled: true, priority: 'high' },
      ['test1']: { disabled: true, priority: 'high' },
      ['test2']: { disabled: true, priority: 'high' },
    } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('ENABLE_ELEMENT', () => {
    const action = { type: 'ENABLE_ELEMENT', payload: { dataElement: 'test', priority: 'high' } };
    const expectedState = { ...initialState.viewer, disabledElements: {...initialState.viewer.disabledElements, ['test']: { disabled: false, priority: 'high' } } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('ENABLE_ELEMENTS', () => {
    const action = { type: 'ENABLE_ELEMENTS', payload: { dataElements:['test','test1'], priority: 'high' } };
    const expectedState = { ...initialState.viewer, disabledElements: { ...initialState.viewer.disabledElements, ['test']: { disabled: false, priority: 'high' }, ['test1']: { disabled: false, priority: 'high' }
   } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('ENABLE_ALL_ELEMENTS', () => {
    const action = { type: 'ENABLE_ALL_ELEMENTS' };
    const expectedState = { ...initialState.viewer, disabledElements: {} };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('OPEN_ELEMENT', () => {
    const action = { type: 'OPEN_ELEMENT', payload: { dataElement: 'test' } };
    const expectedState = { ...initialState.viewer, openElements: { ...initialState.viewer.openElements, ['test']: true } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState); 
  });

  test('CLOSE_ELEMENT', () => {
    const action = { type: 'CLOSE_ELEMENT', payload: { dataElement: 'test' } };
    const expectedState = { ...initialState.viewer, openElements: { ...initialState.viewer.openElements, ['test']: false } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_HEADER_GROUP', () => {
    const action = { type: 'SET_ACTIVE_HEADER_GROUP', payload: { headerGroup: 'test' } };
    const expectedState = { ...initialState.viewer, activeHeaderGroup: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_TOOL_NAME', () => {
    const action = { type: 'SET_ACTIVE_TOOL_NAME', payload: { toolName: 'test' } };
    const expectedState = { ...initialState.viewer, activeToolName: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_TOOL_STYLES', () => {
    const action = { type: 'SET_ACTIVE_TOOL_STYLES', payload: { toolStyles: 'test' } };
    const expectedState = { ...initialState.viewer, activeToolStyles: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_TOOL_NAME_AND_STYLES', () => {
    const action = { type: 'SET_ACTIVE_TOOL_NAME_AND_STYLES', payload: { toolName: 'test', toolStyles: 'test1' } };
    const expectedState = { ...initialState.viewer, activeToolName: 'test', activeToolStyles: 'test1' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_LEFT_PANEL', () => {
    const action = { type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement: 'test' } };
    const expectedState = { ...initialState.viewer, activeLeftPanel: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_TOOL_GROUP', () => {
    const action = { type: 'SET_ACTIVE_TOOL_GROUP', payload: { toolGroup: 'test' } };
    const expectedState = { ...initialState.viewer, activeToolGroup: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_NOTE_POPUP_ID', () => {
    const action = { type: 'SET_NOTE_POPUP_ID', payload: { id: 'test' } };
    const expectedState = { ...initialState.viewer, notePopupId: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('EXPAND_NOTE', () => {
    const action = { type: 'EXPAND_NOTE', payload: { id: 'test' } };
    const expectedState = { ...initialState.viewer, expandedNotes: { ...initialState.viewer.expandedNotes, ['test']: true } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('EXPAND_NOTES', () => {
    const action = { type: 'EXPAND_NOTES', payload: { ids: [ 'test', 'test1', 'test2' ] } };
    const expectedState = { ...initialState.viewer, expandedNotes: { ...initialState.viewer.expandedNotes, 'test': true, 'test1': true, 'test2': true } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('COLLAPSE_NOTE', () => {
    const action = { type: 'COLLAPSE_NOTE', payload: { id: 'test' } };
    const expectedState = { ...initialState.viewer, expandedNotes: { ...initialState.viewer.expandedNotes, 'test': false } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('COLLAPSE_ALL_NOTES', () => {
    const action = { type: 'COLLAPSE_ALL_NOTES' };
    const expectedState = { ...initialState.viewer, expandedNotes: { ...initialState.viewer.expandedNotes } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_IS_NOTE_EDITING', () => {
    const action = { type: 'SET_IS_NOTE_EDITING', payload: { isNoteEditing: 'test' } };
    const expectedState = { ...initialState.viewer, isNoteEditing: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_FIT_MODE', () => {
    const action = { type: 'SET_FIT_MODE', payload: { fitMode: 'test' } };
    const expectedState = { ...initialState.viewer, fitMode: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ZOOM', () => {
    const action = { type: 'SET_ZOOM', payload: { zoom: 'test' } };
    const expectedState = { ...initialState.viewer, zoom: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DISPLAY_MODE', () => {
    const action = { type: 'SET_DISPLAY_MODE', payload: { displayMode: 'test' } };
    const expectedState = { ...initialState.viewer, displayMode: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_CURRENT_PAGE', () => {
    const action = { type: 'SET_CURRENT_PAGE', payload: { currentPage: 'test' } };
    const expectedState = { ...initialState.viewer, currentPage: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_SORT_STRATEGY', () => {
    const action = { type: 'SET_SORT_STRATEGY', payload: { sortStrategy: 'test' } };
    const expectedState = { ...initialState.viewer, sortStrategy: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_NOTE_DATE_FORMAT', () => {
    const action = { type: 'SET_NOTE_DATE_FORMAT', payload: { noteDateFormat: 'test' } };
    const expectedState = { ...initialState.viewer, noteDateFormat: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_FULL_SCREEN', () => {
    const action = { type: 'SET_FULL_SCREEN', payload: { isFullScreen: 'test' } };
    const expectedState = { ...initialState.viewer, isFullScreen: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_HEADER_ITEMS', () => {
    const action = { type: 'SET_HEADER_ITEMS', payload: { header: 'test', headerItems: 'test1' } };
    const expectedState = { ...initialState.viewer, headers: { ...initialState.viewer.headers, ['test']: 'test1' } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });
  
  test('REGISTER_TOOL and UNREGISTER_TOOL', () => {
    const action = { type: 'REGISTER_TOOL', payload: { toolName: 'test', buttonName: 'test1', tooltip: 'test2', buttonGroup: 'test3', buttonImage: 'test4' } };
    const expectedState = { 
      ...initialState.viewer, 
      toolButtonObjects: {
        ...initialState.viewer.toolButtonObjects, 
        'test': {
          dataElement: 'test1',
          title: 'test2', 
          group: 'test3', 
          img: 'test4', 
          showColor: 'active' 
        } 
      } 
    };
    const registeredState = viewerReducer(initialState.viewer)(undefined, action);
    expect(registeredState).toEqual(expectedState);
    const deleteAction = { type: 'UNREGISTER_TOOL', payload: { toolName: 'test' } };
    expect(viewerReducer(registeredState)(undefined, deleteAction)).toEqual(initialState.viewer);
  });

  test('UPDATE_TOOL', () => {
    const action = {
      type: 'UPDATE_TOOL', 
      payload: { 
        toolName: 'test', 
        properties: { 
          buttonName: 'test1', 
          tooltip: 'test2', 
          buttonGroup: 'test3', 
          buttonImage: 'test4' 
        } 
      } 
    };
    viewerReducer(initialState.viewer)(undefined,action);
    const expectedState = {
      ...initialState.viewer, 
      toolButtonObjects: {
        ...initialState.viewer.toolButtonObjects,
        ['test']: {
          dataElement: 'test1',
          title: 'test2',
          group: 'test3',
          img: 'test4'
        }
      }
    };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);    
  });

  test('SET_TOOL_BUTTON_OBJECTS', () => {
    const action = { type: 'SET_TOOL_BUTTON_OBJECTS', payload: { toolButtonObjects: [ 'test', 'test1', 'test2' ] } };
    const expectedState = { ...initialState.viewer, toolButtonObjects: { '0': 'test', '1': 'test1', '2': 'test2' } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DOCUMENT_LOADED', () => {
    const action = { type: 'SET_DOCUMENT_LOADED', payload: { isDocumentLoaded: 'test' } };
    const expectedState = { ...initialState.viewer, isDocumentLoaded: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_READ_ONLY', () => {
    const action = { type: 'SET_READ_ONLY', payload: { isReadOnly: 'test' } };
    const expectedState = { ...initialState.viewer, isReadOnly: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_CUSTOM_PANEL', () => {
    const action = { type: 'SET_CUSTOM_PANEL', payload: { newPanel: 'test' } };
    const expectedState = { ...initialState.viewer, customPanels: [ ...initialState.viewer.customPanels, 'test' ] };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('USE_EMBEDDED_PRINT', () => {
    const action = { type: 'USE_EMBEDDED_PRINT', payload: { useEmbeddedPrint: 'test' } };
    const expectedState = { ...initialState.viewer, useEmbeddedPrint: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_PAGE_LABELS', () => {
    const action = { type: 'SET_PAGE_LABELS', payload: { pageLabels: [ 'test' ] } };
    const expectedState = { ...initialState.viewer, pageLabels: [ 'test' ] };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_COLOR_PALETTE', () => {
    const action = { type: 'SET_COLOR_PALETTE', payload: { colorMapKey: 'test', colorPalette: 'test1' } };
    const expectedState = { ...initialState.viewer, colorMap: { ...initialState.viewer.colorMap, ['test']: { ...initialState.viewer.colorMap['test'], currentPalette: 'test1' } } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ICON_COLOR', () => {
    const action = { type: 'SET_ICON_COLOR', payload: { colorMapKey: 'test', color: 'test1' } };
    const expectedState = { ...initialState.viewer, colorMap: { ...initialState.viewer.colorMap, ['test']: { ...initialState.viewer.colorMap['test'], iconColor: 'test1' } } };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_COLOR_MAP', () => {
    const action = { type: 'SET_COLOR_MAP', payload: { colorMap: 'test' } };
    const expectedState = { ...initialState.viewer, colorMap: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });

  test('SET_SWIPE_ORIENTATION', () => {
    const action = { type: 'SET_SWIPE_ORIENTATION', payload: { swipeOrientation: 'test' } };
    const expectedState = { ...initialState.viewer, swipeOrientation: 'test' };
    expect(viewerReducer(initialState.viewer)(undefined, action)).toEqual(expectedState);
  });
});