import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as internalActions from 'actions/internalActions';
import initialState from 'src/redux/initialState.js';
import selectors from 'selectors';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

describe('internalActions', () => {
  
  beforeEach(() => {
    store.clearActions();
  });

  test('disableElement', () => {
    store.dispatch(internalActions.disableElement('stylePopup', 1));
    store.dispatch(internalActions.disableElement('test', 1));
    selectors.getDisabledElementPriority = jest.fn();
    selectors.getDisabledElementPriority.mockReturnValueOnce(2);
    store.dispatch(internalActions.disableElement('test1', 1));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElement: 'test',
        priority: 1
      },
      type: 'DISABLE_ELEMENT'
    });
    expect(actions[2]).toBeUndefined;
  });

  test('disableElements', () => {
    store.dispatch(internalActions.disableElements(['test'], 1));
    store.dispatch(internalActions.disableElements(['stylePopup'], 1));
    const actions = store.getActions();

    expect(actions[0]).toEqual({ 
      payload: {
        dataElements: ['test'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS' 
    });
    expect(actions[1]).toEqual({ 
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS' 
    });
  });

  test('enableElement stylePopup', () => {
    store.dispatch(internalActions.enableElement('stylePopup', 1));
    store.dispatch(internalActions.enableElement('test', 1));
    selectors.getDisabledElementPriority = jest.fn();
    selectors.getDisabledElementPriority.mockReturnValueOnce(2);
    store.dispatch(internalActions.enableElement('test1',1));
    const actions = store.getActions();
  
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElement: 'test',
        priority: 1
      },
      type: 'ENABLE_ELEMENT'
    });
    expect(actions[2]).toBeUndefined;
  });

  test('enableElements', () => {
    store.dispatch(internalActions.enableElements(['notesPanel'],1));
    store.dispatch(internalActions.enableElements(['stylePopup'],1));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['notesPanel'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
    expect(actions[1]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });

  test('setActiveToolNameAndStyle', () => {
    const mockObject = {
      name: 'test',
      default: 'none'
    };
    const mockObject1 = {
      name: 'TextSelect',
      defalt: 'none'
    };
    store.dispatch(internalActions.setActiveToolNameAndStyle(mockObject));
    store.dispatch(internalActions.setActiveToolNameAndStyle(mockObject1));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        toolName: 'test',
        toolStyles: {}
      },
      type: 'SET_ACTIVE_TOOL_NAME_AND_STYLES'
    });
    // since default activeToolName is AnnotationEdit, no action is fired
    expect(actions[1]).toBeUndefined;
  });

  test('setActiveToolStyles', () => {
    store.dispatch(internalActions.setActiveToolStyles({'test':'test1'}));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        toolStyles: { test: 'test1' }
      },
      type: 'SET_ACTIVE_TOOL_STYLES'
    });
  });

  test('setActiveToolGroup', () => {
    store.dispatch(internalActions.setActiveToolGroup('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        toolGroup: 'test'
      },
      type: 'SET_ACTIVE_TOOL_GROUP'
    });
  });

  test('setNotePopupId', () => {
    store.dispatch(internalActions.setNotePopupId('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        id: 'test'
      },
      type: 'SET_NOTE_POPUP_ID'
    });
  });

  test('setFitMode', () => {
    store.dispatch(internalActions.setFitMode('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        fitMode: 'test'
      },
      type: 'SET_FIT_MODE'
    });
  });

  test('setZoom', () => {
    store.dispatch(internalActions.setZoom('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        zoom: 'test'
      },
      type: 'SET_ZOOM'
    });
  });

  test('setDisplayMode', () => {
    store.dispatch(internalActions.setDisplayMode('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        displayMode: 'test'
      },
      type: 'SET_DISPLAY_MODE'
    });
  });

  test('setCurrentPage', () => {
    store.dispatch(internalActions.setCurrentPage('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        currentPage: 'test'
      },
      type: 'SET_CURRENT_PAGE'
    });
  });

  test('setFullScreen', () => {
    store.dispatch(internalActions.setFullScreen('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        isFullScreen: 'test'
      },
      type: 'SET_FULL_SCREEN'
    });
  });

  test('setDocumentLoaded', () => {
    store.dispatch(internalActions.setDocumentLoaded('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        isDocumentLoaded: 'test'
      },
      type: 'SET_DOCUMENT_LOADED'
    });
  });

  test('setReadOnly', () => {
    store.dispatch(internalActions.setReadOnly('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        isReadOnly: 'test'
      },
      type: 'SET_READ_ONLY'
    });
  });

  test('registerTool', () => {
    store.dispatch(internalActions.registerTool({ 'test': true }));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        test: true
      },
      type: 'REGISTER_TOOL'
    });
  });

  test('unregisterTool', () => {
    store.dispatch(internalActions.unregisterTool('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        toolName: 'test'
      }, 
      type: 'UNREGISTER_TOOL'
    });
  });

  test('setToolButtonObjects', () => {
    store.dispatch(internalActions.setToolButtonObjects('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        toolButtonObjects: 'test'
      },
      type: 'SET_TOOL_BUTTON_OBJECTS'
    });
  });

  test('setIsNoteEditing', () => {
    store.dispatch(internalActions.setIsNoteEditing(true));
    store.dispatch(internalActions.setIsNoteEditing(false));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        isNoteEditing: true
      },
      type: 'SET_IS_NOTE_EDITING'
    });
    expect(actions[0]).toBeUndefined;
  });

  test('expandNote', () => {
    store.dispatch(internalActions.expandNote('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        id: 'test'
      },
      type: 'EXPAND_NOTE'
    });
  });

  test('expandNotes', () => {
    store.dispatch(internalActions.expandNotes('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        ids: 'test'
      },
      type: 'EXPAND_NOTES'
    });
  });

  test('collapseNote', () => {
    store.dispatch(internalActions.collapseNote('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        id: 'test'
      },
      type: 'COLLAPSE_NOTE'
    });
  });

  test('collapseAllNotes', () => {
    let store = mockStore(initialState);
    store.dispatch(internalActions.collapseAllNotes());
    store = mockStore({ ...initialState, viewer: { ...initialState.viewer, expandedNotes: { ...initialState.viewer.expandedNotes, test: true } } });
    store.dispatch(internalActions.collapseAllNotes());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'COLLAPSE_ALL_NOTES'
    });
    expect(actions[1]).toBeUndefined;    
  });

  test('setHeaderItems', () => {
    store.dispatch(internalActions.setHeaderItems('test','test1'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        header: 'test',
        headerItems: 'test1'
      },
      type: 'SET_HEADER_ITEMS'
    });
  });

  test('setColorPalette', () => {
    store.dispatch(internalActions.setColorPalette('test','test1'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        colorMapKey: 'test',
        colorPalette: 'test1'
      },
      type: 'SET_COLOR_PALETTE'
    });
  });

  test('setIconColor', () => {
    store.dispatch(internalActions.setIconColor('test','test1'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        colorMapKey: 'test',
        color: 'test1'
      },
      type: 'SET_ICON_COLOR'
    });
  });

  test('setColorMap', () => {
    store.dispatch(internalActions.setColorMap('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        colorMap: 'test'
      },
      type: 'SET_COLOR_MAP'
    });
  });

  test('setDocumentId', () => {
    store.dispatch(internalActions.setDocumentId('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        documentId: 'test'
      },
      type: 'SET_DOCUMENT_ID'
    });
  });

  test('setDocumentPath', () => {
    store.dispatch(internalActions.setDocumentPath('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        documentPath: 'test'
      },
      type: 'SET_DOCUMENT_PATH'
    });
  });

  test('setDocumentFile', () => {
    store.dispatch(internalActions.setDocumentFile('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        documentFile: 'test'
      },
      type: 'SET_DOCUMENT_FILE'
    });
  });

  test('setDocumentType', () => {
    store.dispatch(internalActions.setDocumentType('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        type: 'test'
      },
      type: 'SET_DOCUMENT_TYPE'
    });
  });

  test('setPDFDoc', () => {
    store.dispatch(internalActions.setPDFDoc('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        pdfDoc: 'test'
      },
      type: 'SET_PDF_DOC'
    });
  });

  test('setFilename', () => {
    store.dispatch(internalActions.setFilename('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        filename: 'test'
      },
      type: 'SET_FILENAME'
    });
  });

  test('setTotalPages', () => {
    store.dispatch(internalActions.setTotalPages('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        totalPages: 'test'
      },
      type: 'SET_TOTAL_PAGES'
    });
  });

  test('setOutlines', () => {
    store.dispatch(internalActions.setOutlines('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        outlines: 'test'
      },
      type: 'SET_OUTLINES'
    });
  });

  test('setCheckPasswordFunction', () => {
    store.dispatch(internalActions.setCheckPasswordFunction('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        func: 'test'
      },
      type: 'SET_CHECKPASSWORD'
    });
  });

  test('setPasswordAttempts', () => {
    store.dispatch(internalActions.setPasswordAttempts('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        attempt: 'test'
      },
      type: 'SET_PASSWORD_ATTEMPTS'
    });
  });

  test('setPrintQuality', () => {
    store.dispatch(internalActions.setPrintQuality('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload: {
        quality: 'test'
      },
      type: 'SET_PRINT_QUALITY'
    });
  });
  
  test('setLoadingProgress', () => {
    const store = mockStore({ ...initialState, document: { ...initialState.document, loadingProgress: 5 } });
    store.dispatch(internalActions.setLoadingProgress(6));
    store.dispatch(internalActions.setLoadingProgress(1));

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        loadingProgress: 6
      },
      type: 'SET_LOADING_PROGRESS'
    });
    expect(actions[1]).toBeUndefined;
  });

  test('resetLoadingProgress', () => {
    store.dispatch(internalActions.resetLoadingProgress());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: 'RESET_LOADING_PROGRESS'
    });
  });

  test('setPassword', () => {
    store.dispatch(internalActions.setPassword('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        password: 'test'
      },
      type: 'SET_PASSWORD'
    });
  });

  test('setUserName', () => {
    store.dispatch(internalActions.setUserName('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        userName: 'test'
      },
      type: 'SET_USER_NAME'
    });
  });

  test('setAdminUser', () => {
    store.dispatch(internalActions.setAdminUser('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isAdminUser: 'test'
      },
      type: 'SET_ADMIN_USER'
    });
  });

  test('setStreaming', () => {
    store.dispatch(internalActions.setStreaming('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        streaming: 'test'
      },
      type: 'SET_STREAMING'
    });
  });

  test('setDecryptFunction', () => {
    store.dispatch(internalActions.setDecryptFunction('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        decryptFunction: 'test'
      },
      type: 'SET_DECRYPT_FUNCTION'
    });
  });

  test('setDecryptOptions', () => {
    store.dispatch(internalActions.setDecryptOptions('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        decryptOptions: 'test'
      },
      type: 'SET_DECRYPT_OPTIONS'
    });
  });

  test('setEngineType', () => {
    store.dispatch(internalActions.setEngineType('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        type: 'test'
      },
      type: 'SET_ENGINE_TYPE'
    });
  });

  test('setCustomHeaders', () => {
    store.dispatch(internalActions.setCustomHeaders('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        customHeaders: 'test'
      },
      type: 'SET_CUSTOM_HEADERS'
    });
  });

  test('setWithCredentials', () => {
    store.dispatch(internalActions.setWithCredentials('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        withCredentials: 'test'
      },
      type: 'SET_WITH_CREDENTIALS'
    });
  });

  test('searchText', () => {
    store.dispatch(internalActions.searchText('test','test1'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        searchValue: 'test',
        options: 'test1'
      },
      type: 'SEARCH_TEXT'
    });
  });

  test('searchTextFull', () => {
    store.dispatch(internalActions.searchTextFull('test','test1'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        searchValue: 'test',
        options: 'test1'
      },
      type: 'SEARCH_TEXT_FULL'
    });
  });

  test('addSearchListener', () => {
    store.dispatch(internalActions.addSearchListener('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        func: 'test'
      },
      type: 'ADD_SEARCH_LISTENER'
    });
  });

  test('removeSearchListener', () => {
    store.dispatch(internalActions.removeSearchListener('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        func: 'test'
      },
      type: 'REMOVE_SEARCH_LISTENER'
    });
  });

  test('setSearchValue', () => {
    store.dispatch(internalActions.setSearchValue('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        value: 'test'
      },
      type: 'SET_SEARCH_VALUE'
    });
  });

  test('setActiveResult', () => {
    store.dispatch(internalActions.setActiveResult('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        activeResult: 'test'
      },
      type: 'SET_ACTIVE_RESULT'
    });
  });

  test('setActiveResultIndex', () => {
    store.dispatch(internalActions.setActiveResultIndex('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        index: 'test'
      },
      type: 'SET_ACTIVE_RESULT_INDEX'
    });
  });

  test('addResult', () => {
    store.dispatch(internalActions.addResult('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        result: 'test'
      },
      type: 'ADD_RESULT'
    });
  });

  test('setCaseSensitive', () => {
    store.dispatch(internalActions.setCaseSensitive('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isCaseSensitive: 'test'
      },
      type: 'SET_CASE_SENSITIVE'
    });
  });

  test('setWholeWord', () => {
    store.dispatch(internalActions.setWholeWord('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isWholeWord: 'test'
      },
      type: 'SET_WHOLE_WORD'
    });
  });

  test('setIsSearching', () => {
    store.dispatch(internalActions.setIsSearching('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isSearching: 'test'
      },
      type: 'SET_IS_SEARCHING'
    });
  });

  test('setNoResult', () => {
    store.dispatch(internalActions.setNoResult('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        noResult: 'test'
      },
      type: 'SET_NO_RESULT'
    });
  });

  test('resetSearch', () => {
    store.dispatch(internalActions.resetSearch());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{

      },
      type: 'RESET_SEARCH'
    });
  });

  test('setIsProgrammaticSearch', () => {
    store.dispatch(internalActions.setIsProgrammaticSearch('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isProgrammaticSearch: 'test'
      },
      type: 'SET_IS_PROG_SEARCH'
    });
  });

  test('setIsProgrammaticSearchFull', () => {
    store.dispatch(internalActions.setIsProgrammaticSearchFull('test'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      payload:{
        isProgrammaticSearchFull: 'test'
      },
      type: 'SET_IS_PROG_SEARCH_FULL'
    });
  });

});
