import i18next from 'i18next';

import LayoutMode from 'constants/layoutMode';
import FitMode from 'constants/fitMode';
import Feature from 'constants/feature';
import addSearchListener from './addSearchListener';
import addSortStrategy from './addSortStrategy';
import annotationPopup from './annotationPopup';
import closeDocument from './closeDocument';
import closeElement from './closeElement';
import closeElements from './closeElements';
import contextMenuPopup from './contextMenuPopup';
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
import extractPagesWithAnnotations from './extractPagesWithAnnotations';
import focusNote from './focusNote';
import getAnnotationUser from './getAnnotationUser';
import getBBAnnotManager from './getBBAnnotManager';
import getCurrentPageNumber from './getCurrentPageNumber';
import getFitMode from './getFitMode';
import getLayoutMode from './getLayoutMode';
import getPageCount from './getPageCount';
import getSelectedThumbnailPageNumbers from './getSelectedThumbnailPageNumbers';
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
import exportBookmarks from './exportBookmarks';
import importBookmarks from './importBookmarks';
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
import setSelectedTab from './setSelectedTab';
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
import textPopup from './textPopup';
import toggleElement from './toggleElement';
import toggleFullScreen from './toggleFullScreen';
import unregisterTool from './unregisterTool';
import updateElement from './updateElement';
import updateOutlines from './updateOutlines';
import updateTool from './updateTool';
import useEmbeddedPrint from './useEmbeddedPrint';
import useNativeScroll from './useNativeScroll';
import setMeasurementUnits from './setMeasurementUnits';
import setMaxSignaturesCount from './setMaxSignaturesCount';
import setSignatureFonts from './setSignatureFonts';
import disableReplyForAnnotations from './disableReplyForAnnotations';
import getCustomData from './getCustomData';
import setCustomMeasurementOverlayInfo from './setCustomMeasurementOverlayInfo';
import setNoteTransformFunction from './setNoteTransformFunction';
import selectThumbnailPages from './selectThumbnailPages';
import unselectThumbnailPages from './unselectThumbnailPages';

export default store => {
  window.readerControl = {
    docViewer: window.docViewer,
    FitMode,
    LayoutMode,
    Feature,
    addSearchListener: addSearchListener(store),
    addSortStrategy: addSortStrategy(store),
    annotationPopup: annotationPopup(store),
    closeDocument: closeDocument(store),
    closeElements: closeElements(store),
    contextMenuPopup: contextMenuPopup(store),
    disableElements: disableElements(store),
    disableFeatures: disableFeatures(store),
    disableTools: disableTools(store),
    disableReplyForAnnotations: disableReplyForAnnotations(store),
    downloadPdf: downloadPdf(store),
    enableElements: enableElements(store),
    enableTools: enableTools(store),
    focusNote: focusNote(store),
    getFitMode: getFitMode(store),
    getLayoutMode: getLayoutMode(store),
    getToolMode,
    getZoomLevel,
    hotkeys,
    isElementDisabled: isElementDisabled(store),
    isElementOpen: isElementOpen(store),
    isToolDisabled: isToolDisabled(store),
    loadDocument: loadDocument(store),
    openElements: openElements(store),
    print: print(store),
    registerTool: registerTool(store),
    removeSearchListener: removeSearchListener(store),
    searchText: searchText(store),
    searchTextFull: searchTextFull(store),
    setActiveHeaderGroup: setActiveHeaderGroup(store),
    setActiveLeftPanel: setActiveLeftPanel(store),
    setCustomNoteFilter: setCustomNoteFilter(store),
    setCustomPanel: setCustomPanel(store),
    exportBookmarks: exportBookmarks(store),
    extractPagesWithAnnotations,
    importBookmarks: importBookmarks(store),
    setFitMode,
    setHeaderItems: setHeaderItems(store),
    setIconColor: setIconColor(store),
    setLanguage,
    setLayoutMode,
    setMaxZoomLevel: setMaxZoomLevel(store),
    setMinZoomLevel: setMinZoomLevel(store),
    setNoteDateFormat: setNoteDateFormat(store),
    setMeasurementUnits: setMeasurementUnits(store),
    setPageLabels: setPageLabels(store),
    setPrintQuality: setPrintQuality(store),
    setSortStrategy: setSortStrategy(store),
    setSwipeOrientation,
    setTheme,
    dangerouslySetNoteTransformFunction: setNoteTransformFunction(store),
    setToolMode: setToolMode(store),
    setZoomLevel,
    setZoomList: setZoomList(store),
    showErrorMessage: showErrorMessage(store),
    textPopup: textPopup(store),
    toggleElement: toggleElement(store),
    toggleFullScreen,
    unregisterTool: unregisterTool(store),
    updateTool: updateTool(store),
    updateElement: updateElement(store),
    useEmbeddedPrint: useEmbeddedPrint(store),
    setMaxSignaturesCount: setMaxSignaturesCount(store),
    setCustomMeasurementOverlayInfo: setCustomMeasurementOverlayInfo(store),
    setSignatureFonts: setSignatureFonts(store),
    setSelectedTab: setSelectedTab(store),
    getSelectedThumbnailPageNumbers: getSelectedThumbnailPageNumbers(store),
    selectThumbnailPages: selectThumbnailPages(store),
    unselectThumbnailPages: unselectThumbnailPages(store),

    // undocumented and deprecated, to be removed in 7.0
    closeElement: closeElement(store),
    disableAnnotations: disableAnnotations(store),
    disableDownload: disableDownload(store),
    disableElement: disableElement(store),
    disableFilePicker: disableFilePicker(store),
    disableLocalStorage,
    disableMeasurement: disableMeasurement(store),
    disableNotesPanel: disableNotesPanel(store),
    disablePrint: disablePrint(store),
    disableRedaction: disableRedaction(store),
    disableTextSelection: disableTextSelection(store),
    disableTouchScrollLock,
    enableAnnotations: enableAnnotations(store),
    enableDownload: enableDownload(store),
    enableElement: enableElement(store),
    enableFeatures: enableFeatures(store),
    enableFilePicker: enableFilePicker(store),
    enableLocalStorage,
    enableMeasurement: enableMeasurement(store),
    enableNotesPanel: enableNotesPanel(store),
    enablePrint: enablePrint(store),
    enableRedaction: enableRedaction(store),
    enableTextSelection: enableTextSelection(store),
    enableTool: enableTool(store),
    enableTouchScrollLock,
    getAnnotationUser,
    getCurrentPageNumber: getCurrentPageNumber(store),
    getPageCount: getPageCount(store),
    getShowSideWindow: getShowSideWindow(store),
    getSideWindowVisibility: getSideWindowVisibility(store),
    setNotesPanelSort: setNotesPanelSort(store),
    setShowSideWindow: setShowSideWindow(store),
    setSideWindowVisibility: setSideWindowVisibility(store),
    disableTool: disableTool(store),
    enableAllElements: enableAllElements(store),
    goToFirstPage,
    goToLastPage: goToLastPage(store),
    goToNextPage: goToNextPage(store),
    goToPrevPage: goToPrevPage(store),
    isAdminUser,
    isMobileDevice,
    isReadOnly,
    openElement: openElement(store),
    rotateClockwise,
    rotateCounterClockwise,
    saveAnnotations: saveAnnotations(store),
    setAdminUser,
    setAnnotationUser,
    setCurrentPageNumber,
    setReadOnly,
    setSortNotesBy: setSortNotesBy(store),
    getCustomData,

    // undocumented
    useNativeScroll,
    loadedFromServer: false,
    serverFailed: false,
    i18n: i18next,
    setColorPalette: setColorPalette(store),
    showWarningMessage: showWarningMessage(store),
    updateOutlines: updateOutlines(store),
    getBBAnnotManager,
    selectors: getSelectors(store),
  };
};
