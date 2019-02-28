import loadDocument from './loadDocument';
import closeDocument from './closeDocument';
import downloadPdf from './downloadPdf';
import getAnnotationUser from './getAnnotationUser';
import setAnnotationUser from './setAnnotationUser';
import setNoteDateFormat from './setNoteDateFormat';
import { getZoomLevel, setZoomLevel, setMaxZoomLevel, setMinZoomLevel } from './zoomAPIs';
import isReadOnly from './isReadOnly';
import setReadOnly from './setReadOnly';
import isAdminUser from './isAdminUser';
import setAdminUser from './setAdminUser';
import getToolMode from './getToolMode';
import setToolMode from './setToolMode';
import saveAnnotations from './saveAnnotations';
import registerTool from './registerTool';
import unregisterTool from './unregisterTool';
import enableTextSelection from './enableTextSelection';
import disableTextSelection from './disableTextSelection';
import enableFilePicker from './enableFilePicker';
import disableFilePicker from './disableFilePicker';
import enableMeasurement from './enableMeasurement';
import disableMeasurement from './disableMeasurement';
import enableNotesPanel from './enableNotesPanel';
import disableNotesPanel from './disableNotesPanel';
import enableAnnotations from './enableAnnotations';
import searchTextFull from './searchTextFull';
import searchText from './searchText';
import addSearchListener from './addSearchListener';
import removeSearchListener from './removeSearchListener';
import setEngineType from './setEngineType';
import setLanguage from './setLanguage';
import getActions from './getActions';
import getSelectors from './getSelectors';
import getConstants from './getConstants';
import getBBAnnotManager from './getBBAnnotManager';
import getShowSideWindow from './getShowSideWindow';
import getSideWindowVisibility from './getSideWindowVisibility';
import setShowSideWindow from './setShowSideWindow';
import setFitMode from './setFitMode';
import getCurrentPageNumber from './getCurrentPageNumber';
import getFitMode from './getFitMode';
import getLayoutMode from './getLayoutMode';
import getPageCount from './getPageCount';
import goToFirstPage from './goToFirstPage';
import goToLastPage from './goToLastPage';
import goToNextPage from './goToNextPage';
import goToPrevPage from './goToPrevPage';
import isMobileDevice from './isMobileDevice';
import rotateClockwise from './rotateClockwise';
import rotateCounterClockwise from './rotateCounterClockwise';
import setCurrentPageNumber from './setCurrentPageNumber';
import setLayoutMode from './setLayoutMode';
import setSideWindowVisibility from './setSideWindowVisibility';
import setHeaderItems from './setHeaderItems';
import setPrintQuality from './setPrintQuality';
import toggleFullScreen from './toggleFullScreen';
import setTheme from './setTheme';
import isElementOpen from './isElementOpen';
import isElementDisabled from './isElementDisabled';
import enablePrint from './enablePrint';
import disablePrint from './disablePrint';
import enableDownload from './enableDownload';
import disableDownload from './disableDownload';
import enableTool from './enableTool';
import enableTools from './enableTools';
import disableTool from './disableTool';
import disableTools from './disableTools';
import disableAnnotations from './disableAnnotations';
import isToolDisabled from './isToolDisabled';
import setNotesPanelSort from './setNotesPanelSort';
import addSortStrategy from './addSortStrategy';
import updateOutlines from './updateOutlines';
import print from './print';
import showWarningMessage from './showWarningMessage';
import enableRedaction from './enableRedaction';
import disableRedaction from './disableRedaction';
import enableLocalStorage from './enableLocalStorage';
import disableLocalStorage from './disableLocalStorage';

export default {
  loadDocument,
  closeDocument,
  downloadPdf,
  getAnnotationUser,
  setNoteDateFormat,
  setAnnotationUser,
  isReadOnly,
  setReadOnly,
  isAdminUser,
  setAdminUser,
  getToolMode,
  setToolMode,
  saveAnnotations,
  registerTool,
  unregisterTool,
  enableTextSelection,
  disableTextSelection,
  enableFilePicker,
  disableFilePicker,
  enableMeasurement,
  disableMeasurement,
  enableNotesPanel,
  disableNotesPanel,
  enableAnnotations,
  searchTextFull,
  searchText,
  addSearchListener,
  removeSearchListener,
  setEngineType,
  setLanguage,
  getActions,
  getSelectors,
  getConstants,
  getBBAnnotManager,
  getShowSideWindow,
  setShowSideWindow,
  getSideWindowVisibility,
  setFitMode,
  getCurrentPageNumber,
  getFitMode,
  getLayoutMode,
  getPageCount,
  goToFirstPage,
  goToLastPage,
  goToNextPage,
  goToPrevPage,
  isMobileDevice,
  rotateClockwise,
  rotateCounterClockwise,
  setCurrentPageNumber,
  setLayoutMode,
  setSideWindowVisibility,
  setHeaderItems,
  setPrintQuality,
  toggleFullScreen,
  setTheme,
  isElementOpen,
  isElementDisabled,
  enablePrint,
  disablePrint,
  enableDownload,
  disableDownload,
  enableTool,
  enableTools,
  disableTool,
  disableTools,
  disableAnnotations,
  isToolDisabled,
  setNotesPanelSort,
  addSortStrategy,
  updateOutlines,
  print, 
  getZoomLevel,
  setZoomLevel,
  setMaxZoomLevel,
  setMinZoomLevel,
  showWarningMessage,
  enableRedaction,
  disableRedaction,
  enableLocalStorage,
  disableLocalStorage
};