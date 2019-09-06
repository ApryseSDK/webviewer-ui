import i18next from 'i18next';

import LayoutMode from 'constants/layoutMode';
import FitMode from 'constants/fitMode';
import Feature from 'constants/feature';
import getHashParams from 'helpers/getHashParams';
import addSearchListener from './addSearchListener';
import addSortStrategy from './addSortStrategy';
import closeDocument from './closeDocument';
import closeElement from './closeElement';
import closeElements from './closeElements';
import disableAnnotations from './disableAnnotations';
import disableDownload from './disableDownload';
import disableElement from './disableElement';
import disableElements from './disableElements';
import disableFeatures from './disableFeatures';
import disableFilePicker from './disableFilePicker';
import disableLocalStorage from './disableLocalStorage';
import disableMeasurement from './disableMeasurement';
import disableNotesPanel from './disableNotesPanel';
import disablePrint from './disablePrint';
import disableRedaction from './disableRedaction';
import disableTextSelection from './disableTextSelection';
import disableTool from './disableTool';
import disableTools from './disableTools';
import disableTouchScrollLock from './disableTouchScrollLock';
import downloadPdf from './downloadPdf';
import enableAllElements from './enableAllElements';
import enableAnnotations from './enableAnnotations';
import enableDownload from './enableDownload';
import enableElement from './enableElement';
import enableElements from './enableElements';
import enableFeatures from './enableFeatures';
import enableFilePicker from './enableFilePicker';
import enableLocalStorage from './enableLocalStorage';
import enableMeasurement from './enableMeasurement';
import enableNotesPanel from './enableNotesPanel';
import enablePrint from './enablePrint';
import enableRedaction from './enableRedaction';
import enableTextSelection from './enableTextSelection';
import enableTool from './enableTool';
import enableTools from './enableTools';
import enableTouchScrollLock from './enableTouchScrollLock';
import focusNote from './focusNote';
import getAnnotationUser from './getAnnotationUser';
import getBBAnnotManager from './getBBAnnotManager';
import getConstants from './getConstants';
import getCurrentPageNumber from './getCurrentPageNumber';
import getFitMode from './getFitMode';
import getLayoutMode from './getLayoutMode';
import getPageCount from './getPageCount';
import getSelectors from './getSelectors';
import getShowSideWindow from './getShowSideWindow';
import getSideWindowVisibility from './getSideWindowVisibility';
import getToolMode from './getToolMode';
import getZoomLevel from './getZoomLevel';
import goToFirstPage from './goToFirstPage';
import goToLastPage from './goToLastPage';
import goToNextPage from './goToNextPage';
import goToPrevPage from './goToPrevPage';
import hotkeys from './hotkeys';
import isAdminUser from './isAdminUser';
import isElementDisabled from './isElementDisabled';
import isElementOpen from './isElementOpen';
import isMobileDevice from './isMobileDevice';
import isReadOnly from './isReadOnly';
import isToolDisabled from './isToolDisabled';
import loadDocument from './loadDocument';
import openElement from './openElement';
import openElements from './openElements';
import print from './print';
import registerTool from './registerTool';
import removeSearchListener from './removeSearchListener';
import rotateClockwise from './rotateClockwise';
import rotateCounterClockwise from './rotateCounterClockwise';
import saveAnnotations from './saveAnnotations';
import searchText from './searchText';
import searchTextFull from './searchTextFull';
import setActiveHeaderGroup from './setActiveHeaderGroup';
import setActiveLeftPanel from './setActiveLeftPanel';
import setAdminUser from './setAdminUser';
import setAnnotationUser from './setAnnotationUser';
import setColorPalette from './setColorPalette';
import setCurrentPageNumber from './setCurrentPageNumber';
import setCustomNoteFilter from './setCustomNoteFilter';
import setCustomPanel from './setCustomPanel';
import setEngineType from './setEngineType';
import setFitMode from './setFitMode';
import setHeaderItems from './setHeaderItems';
import setIconColor from './setIconColor';
import setLanguage from './setLanguage';
import setLayoutMode from './setLayoutMode';
import setMaxZoomLevel from './setMaxZoomLevel';
import setMinZoomLevel from './setMinZoomLevel';
import setNoteDateFormat from './setNoteDateFormat';
import setNotesPanelSort from './setNotesPanelSort';
import setPageLabels from './setPageLabels';
import setPrintQuality from './setPrintQuality';
import setReadOnly from './setReadOnly';
import setShowSideWindow from './setShowSideWindow';
import setSideWindowVisibility from './setSideWindowVisibility';
import setSortNotesBy from './setSortNotesBy';
import setSortStrategy from './setSortStrategy';
import setSwipeOrientation from './setSwipeOrientation';
import setTheme from './setTheme';
import setToolMode from './setToolMode';
import setZoomLevel from './setZoomLevel';
import setZoomList from './setZoomList';
import showErrorMessage from './showErrorMessage';
import showWarningMessage from './showWarningMessage';
import toggleElement from './toggleElement';
import toggleFullScreen from './toggleFullScreen';
import unregisterTool from './unregisterTool';
import updateOutlines from './updateOutlines';
import updateTool from './updateTool';
import useEmbeddedPrint from './useEmbeddedPrint';
import setMeasurementUnits from './setMeasurementUnits';
import setMaxSignaturesCount from './setMaxSignaturesCount';

export default store => {
  window.readerControl = {
    docViewer: window.docViewer,
    FitMode,
    LayoutMode,
    Feature,
    loadedFromServer: false, // undocumented
    serverFailed: false, // undocumented
    i18n: i18next,
    constants: getConstants(), // undocumented
    addSearchListener: addSearchListener(store),
    addSortStrategy: addSortStrategy(store),
    closeDocument: closeDocument(store),
    closeElement: closeElement(store),
    closeElements: closeElements(store),
    disableAnnotations: disableAnnotations(store),
    disableDownload: disableDownload(store),
    disableElement: disableElement(store),
    disableElements: disableElements(store),
    disableFeatures: disableFeatures(store),
    disableFilePicker: disableFilePicker(store),
    disableLocalStorage,
    disableMeasurement: disableMeasurement(store),
    disableNotesPanel: disableNotesPanel(store),
    disablePrint: disablePrint(store),
    disableRedaction: disableRedaction(store),
    disableTextSelection: disableTextSelection(store),
    disableTool: disableTool(store), // undocumented
    disableTools: disableTools(store),
    disableTouchScrollLock,
    downloadPdf: downloadPdf(store),
    enableAllElements: enableAllElements(store), // undocumented
    enableAnnotations: enableAnnotations(store),
    enableDownload: enableDownload(store),
    enableElement: enableElement(store),
    enableElements: enableElements(store),
    enableFeatures: enableFeatures(store),
    enableFilePicker: enableFilePicker(store),
    enableLocalStorage,
    enableMeasurement: enableMeasurement(store),
    enableNotesPanel: enableNotesPanel(store),
    enablePrint: enablePrint(store),
    enableRedaction: enableRedaction(store),
    enableTextSelection: enableTextSelection(store),
    enableTool: enableTool(store),
    enableTools: enableTools(store),
    enableTouchScrollLock,
    focusNote: focusNote(store),
    getAnnotationUser,
    getBBAnnotManager: getBBAnnotManager(store),
    getCurrentPageNumber: getCurrentPageNumber(store),
    getFitMode: getFitMode(store),
    getLayoutMode: getLayoutMode(store),
    getPageCount: getPageCount(store),
    getShowSideWindow: getShowSideWindow(store),
    getSideWindowVisibility: getSideWindowVisibility(store),
    getToolMode,
    getZoomLevel: getZoomLevel(store),
    goToFirstPage,
    goToLastPage: goToLastPage(store),
    goToNextPage: goToNextPage(store),
    goToPrevPage: goToPrevPage(store),
    hotkeys,
    isAdminUser,
    isElementDisabled: isElementDisabled(store),
    isElementOpen: isElementOpen(store),
    isMobileDevice,
    isReadOnly,
    isToolDisabled: isToolDisabled(store),
    loadDocument: loadDocument(store),
    openElement: openElement(store),
    openElements: openElements(store),
    print: print(store),
    registerTool: registerTool(store),
    removeSearchListener: removeSearchListener(store),
    rotateClockwise,
    rotateCounterClockwise,
    saveAnnotations: saveAnnotations(store),
    searchText: searchText(store),
    searchTextFull: searchTextFull(store),
    selectors: getSelectors(store), // undocumented
    setActiveHeaderGroup: setActiveHeaderGroup(store),
    setActiveLeftPanel: setActiveLeftPanel(store),
    setAdminUser,
    setAnnotationUser,
    setColorPalette: setColorPalette(store), // undocumented
    setCurrentPageNumber,
    setCustomNoteFilter: setCustomNoteFilter(store),
    setCustomPanel: setCustomPanel(store),
    setEngineType: setEngineType(store), // undocumented
    setFitMode,
    setHeaderItems: setHeaderItems(store),
    setIconColor: setIconColor(store),
    setLanguage,
    setLayoutMode,
    setMaxZoomLevel: setMaxZoomLevel(store),
    setMinZoomLevel: setMinZoomLevel(store),
    setNoteDateFormat: setNoteDateFormat(store),
    setNotesPanelSort: setNotesPanelSort(store), // undocumented
    setMeasurementUnits: setMeasurementUnits(store),
    setPageLabels: setPageLabels(store),
    setPrintQuality: setPrintQuality(store),
    setReadOnly,
    setShowSideWindow: setShowSideWindow(store), // undocumented
    setSideWindowVisibility: setSideWindowVisibility(store), // undocumented
    setSortNotesBy: setSortNotesBy(store),
    setSortStrategy: setSortStrategy(store),
    setSwipeOrientation,
    setTheme,
    setToolMode: setToolMode(store),
    setZoomLevel,
    setZoomList: setZoomList(store),
    showErrorMessage: showErrorMessage(store),
    showWarningMessage: showWarningMessage(store), // undocumented
    toggleElement: toggleElement(store),
    toggleFullScreen,
    unregisterTool: unregisterTool(store),
    updateOutlines: updateOutlines(store), // undocumented
    updateTool: updateTool(store),
    useEmbeddedPrint: useEmbeddedPrint(store),
    setMaxSignaturesCount: setMaxSignaturesCount(store),
    getCustomData: () => getHashParams('custom', null), // undocumented
  };
};
