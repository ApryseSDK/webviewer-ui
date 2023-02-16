import i18next from 'i18next';

import LayoutMode from 'constants/layoutMode';
import FitMode from 'constants/fitMode';
import Feature from 'constants/feature';
import Events from 'constants/events';
import ToolbarGroup from 'constants/toolbar';
import { NotesPanelSortStrategy } from 'constants/sortStrategies';
import Theme from 'constants/theme';
import RedactionSearchPatterns from 'constants/redactionSearchPatterns';
import { languageEnum } from 'constants/languages';
import { panelNames } from 'constants/panel';
import addSearchListener from './addSearchListener';
import addSortStrategy from './addSortStrategy';
import annotationPopup from './annotationPopup';
import closeDocument from './closeDocument';
import closeElements from './closeElements';
import contextMenuPopup from './contextMenuPopup';
import disableAnnotations from './disableAnnotations';
import disableDownload from './disableDownload';
import disableElement from './disableElement';
import disableElements from './disableElements';
import disableFeatures from './disableFeatures';
import disableFilePicker from './disableFilePicker';
import disableHighContrastMode from './disableHighContrastMode';
import disableLocalStorage from './disableLocalStorage';
import disableMeasurement from './disableMeasurement';
import disableNativeScrolling from './disableNativeScrolling';
import disableNotesPanel from './disableNotesPanel';
import disableNoteSubmissionWithEnter from './disableNoteSubmissionWithEnter';
import disablePrint from './disablePrint';
import disableRedaction from './disableRedaction';
import disableTextSelection from './disableTextSelection';
import disableTool from './disableTool';
import disableTools from './disableTools';
import disableTouchScrollLock from './disableTouchScrollLock';
import displayErrorMessage from './displayErrorMessage';
import downloadPdf from './downloadPdf';
import enableAllElements from './enableAllElements';
import enableAnnotations from './enableAnnotations';
import enableDownload from './enableDownload';
import enableElement from './enableElement';
import enableElements from './enableElements';
import enableHighContrastMode from './enableHighContrastMode';
import enableFeatures from './enableFeatures';
import enableFilePicker from './enableFilePicker';
import enableLocalStorage from './enableLocalStorage';
import enableMeasurement from './enableMeasurement';
import enableNativeScrolling from './enableNativeScrolling';
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
import getCurrentLanguage from './getCurrentLanguage';
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
import getMaxZoomLevel from './getMaxZoomLevel';
import getMinZoomLevel from './getMinZoomLevel';
import getIsHighContrastMode from './getIsHighContrastMode';
import goToFirstPage from './goToFirstPage';
import goToLastPage from './goToLastPage';
import goToNextPage from './goToNextPage';
import goToPrevPage from './goToPrevPage';
import hideOutlineControl from './hideOutlineControl';
import hotkeys from './hotkeys';
import isAdminUser from './isAdminUser';
import isElementDisabled from './isElementDisabled';
import isElementOpen from './isElementOpen';
import isHighContrastModeEnabled from './isHighContrastModeEnabled';
import isMobileDevice from './isMobileDevice';
import isReadOnly from './isReadOnly';
import isToolDisabled from './isToolDisabled';
import isFullscreen from './isFullscreen';
import loadDocument from './loadDocument';
import mentions from './mentions';
import settingsMenuOverlay from './menuOverlay';
import openElement from './openElement';
import openElements from './openElements';
import print from './print';
import printInBackground from './printInBackground';
import cancelPrint from './cancelPrint';
import registerTool from './registerTool';
import removeSearchListener from './removeSearchListener';
import rotateClockwise from './rotateClockwise';
import rotateCounterClockwise from './rotateCounterClockwise';
import saveAnnotations from './saveAnnotations';
import searchText from './searchText';
import searchTextFull from './searchTextFull';
import setWv3dPropertiesPanelModelData from './setWv3dPropertiesPanelModelData';
import setWv3dPropertiesPanelSchema from './setWv3dPropertiesPanelSchema';
import setActiveHeaderGroup from './setActiveHeaderGroup';
import setActiveLeftPanel from './setActiveLeftPanel';
import setAdminUser from './setAdminUser';
import setAnnotationUser from './setAnnotationUser';
import setActivePalette from './setActivePalette';
import setColorPalette from './setColorPalette';
import setPageReplacementModalFileList from './setPageReplacementModalFileList';
import setHighContrastMode from './setHighContrastMode';
import setCurrentPageNumber from './setCurrentPageNumber';
import addCustomModal, { setCustomModal } from './addCustomModal';
import setCustomNoteFilter from './setCustomNoteFilter';
import setCustomPanel from './setCustomPanel';
import exportBookmarks from './exportBookmarks';
import importBookmarks from './importBookmarks';
import setFitMode from './setFitMode';
import setHeaderItems from './setHeaderItems';
import setIconColor from './setIconColor';
import setLanguage from './setLanguage';
import setTranslations from './setTranslations';
import setLayoutMode from './setLayoutMode';
import setMaxZoomLevel from './setMaxZoomLevel';
import setMinZoomLevel from './setMinZoomLevel';
import setNoteDateFormat from './setNoteDateFormat';
import setPrintedNoteDateFormat from './setPrintedNoteDateFormat';
import setNotesPanelSort from './setNotesPanelSort';
import setPageLabels from './setPageLabels';
import setPrintQuality from './setPrintQuality';
import setDefaultPrintOptions from './setDefaultPrintOptions';
import setSelectedTab from './setSelectedTab';
import setSideWindowVisibility from './setSideWindowVisibility';
import setSortNotesBy from './setSortNotesBy';
import setNotesPanelSortStrategy from './setNotesPanelSortStrategy';
import setSwipeOrientation from './setSwipeOrientation';
import setTheme from './setTheme';
import setToolbarGroup from './setToolbarGroup';
import createToolbarGroup from './createToolbarGroup';
import setToolMode from './setToolMode';
import setZoomLevel from './setZoomLevel';
import setZoomList from './setZoomList';
import showErrorMessage from './showErrorMessage';
import showOutlineControl from './showOutlineControl';
import showWarningMessage from './showWarningMessage';
import syncNamespaces from './syncNamespaces';
import textPopup from './textPopup';
import toggleElement from './toggleElement';
import toggleFullScreen from './toggleFullScreen';
import {
  enableToolDefaultStyleUpdateFromAnnotationPopup,
  disableToolDefaultStyleUpdateFromAnnotationPopup
} from './toolDefaultStyleUpdateFromAnnotationPopup';
import unregisterTool from './unregisterTool';
import updateElement from './updateElement';
import updateOutlines from './updateOutlines';
import updateTool from './updateTool';
import useEmbeddedPrint from './useEmbeddedPrint';
import useNativeScroll from './useNativeScroll';
import setDisplayedSignaturesFilterFunction from './setDisplayedSignaturesFilterFunction';
import setMeasurementUnits from './setMeasurementUnits';
import setMaxSignaturesCount from './setMaxSignaturesCount';
import setSignatureFonts from './setSignatureFonts';
import disableReplyForAnnotations from './disableReplyForAnnotations';
import getCustomData from './getCustomData';
import setCustomMeasurementOverlayInfo from './setCustomMeasurementOverlayInfo';
import setNoteTransformFunction from './setNoteTransformFunction';
import setCustomNoteSelectionFunction from './setCustomNoteSelectionFunction';
import setCustomApplyRedactionsHandler from './setCustomApplyRedactionsHandler';
import setCustomMultiViewerSyncHandler from './setCustomMultiViewerSyncHandler';
import setCustomMultiViewerAcceptedFileFormats from './setCustomMultiViewerAcceptedFileFormats';
import selectThumbnailPages from './selectThumbnailPages';
import unselectThumbnailPages from './unselectThumbnailPages';
import setSearchResults from './setSearchResults';
import setActiveResult from './setActiveResult';
import setAnnotationContentOverlayHandler from './setAnnotationContentOverlayHandler';
import overrideSearchExecution from './overrideSearchExecution';
import reactElements from './reactElements';
import { addTrustedCertificates, loadTrustList } from './verificationOptions';
import {
  enableTextCollapse,
  disableTextCollapse,
  enableReplyCollapse,
  disableReplyCollapse,
  disableAutoExpandCommentThread,
  enableAutoExpandCommentThread,
  setCustomHeader,
  setCustomEmptyPanel,
  enableAttachmentPreview,
  disableAttachmentPreview,
  setAttachmentHandler
} from './notesPanel';
import {
  enableMultiselect,
  disableMultiselect,
  selectPages,
  unselectPages,
  getSelectedPageNumbers,
  setThumbnailSelectionMode,
} from './thumbnailsPanel';
import toggleReaderMode from './toggleReaderMode';
import toggleElementVisibility from './toggleElementVisibility';
import setAnnotationReadState from './setAnnotationReadState';
import getAnnotationReadState from './getAnnotationReadState';
import enableClearSearchOnPanelClose from './enableClearSearchOnPanelClose';
import disableClearSearchOnPanelClose from './disableClearSearchOnPanelClose';
import disableFadePageNavigationComponent from './disableFadePageNavigationComponent';
import enableFadePageNavigationComponent from './enableFadePageNavigationComponent';
import disablePageDeletionConfirmationModal from './disablePageDeletionConfirmationModal';
import enablePageDeletionConfirmationModal from './enablePageDeletionConfirmationModal';
import addEventListener from './addEventListener';
import removeEventListener from './removeEventListener';
import enableDesktopOnlyMode from './enableDesktopOnlyMode';
import disableDesktopOnlyMode from './disableDesktopOnlyMode';
import isInDesktopOnlyMode from './isInDesktopOnlyMode';
import pageManipulationOverlay from './pageManipulationOverlay';
import multiPageManipulationControls from './multiPageManipulationControls';
import thumbnailControlMenu from './thumbnailControlMenu';
import getWatermarkModalOptions from './getWatermarkModalOptions';
import enableNoteSubmissionWithEnter from './enableNoteSubmissionWithEnter';
import willUseEmbeddedPrinting from 'src/apis/willUseEmbeddedPrinting';
import reloadOutline from './reloadOutline';
import Fonts from 'src/apis/fonts';
import TabManagerAPI from './TabManagerAPI';
import getAvailableLanguages from './getAvailableLanguages';
import replaceRedactionSearchPattern from './replaceRedactionSearchPattern';
import disableApplyCropWarningModal from './disableApplyCropWarningModal';
import enableApplyCropWarningModal from './enableApplyCropWarningModal';
import setPresetCropDimensions from './setPresetCropDimensions';
import setPresetNewPageDimensions from './setPresetNewPageDimensions';
import addDateTimeFormat from './addDateTimeFormat';
import addRedactionSearchPattern from './addRedactionSearchPattern';
import removeRedactionSearchPattern from './removeRedactionSearchPattern';
import getAnnotationStylePopupTabs from './getAnnotationStylePopupTabs';
import setAnnotationStylePopupTabs from './setAnnotationStylePopupTabs';
import { AnnotationKeys, AnnotationStylePopupTabs } from '../constants/map';
import getZoomStepFactors from './getZoomStepFactors';
import setZoomStepFactors from './setZoomStepFactors';
import enableBookmarkIconShortcutVisibility from './enableBookmarkIconShortcutVisibility';
import disableBookmarkIconShortcutVisibility from './disableBookmarkIconShortcutVisibility';
import showFormFieldIndicators from './showFormFieldIndicators';
import hideFormFieldIndicators from './hideFormFieldIndicators';
import signSignatureWidget from './signSignatureWidget';
import addModularHeaders from './addModularHeaders';
import getModularHeader from './getModularHeader';
import getModularHeaderList from './getModularHeaderList';
import core from 'core';
import { setDefaultOptions } from './outlinesPanel';
import Item from './ModularComponents/item';
import GroupedItems from './groupedItems';
import ModularHeader from './ModularComponents/modularHeader';
import CustomButton from './ModularComponents/customButton';
import RibbonItem from './ModularComponents/ribbonItem';
import ToggleElementButton from './ModularComponents/toggleElementButton';

import {
  getMeasurementScalePreset,
  addMeasurementScalePreset,
  removeMeasurementScalePreset,
  enableMultipleScalesMode,
  disableMultipleScalesMode,
  isMultipleScalesModeEnabled,
} from './measurementScale';
import getLocalizedText from './getLocalizedText';
import getDocumentViewer from './getDocumentViewer';
import { enableMultiViewerSync, disableMultiViewerSync, isMultiViewerSyncing } from './multiViewerSync';
import { setCustomSettings, exportUserSettings, importUserSettings } from './userSettings';
import addPanel from './addPanel';
import setGrayscaleDarknessFactor from './setGrayscaleDarknessFactor';
import { ALIGNMENT } from 'constants/customizationVariables';

export default (store) => {
  const CORE_NAMESPACE = 'Core';
  const UI_NAMESPACE = 'UI';
  const objForWebViewerCore = {
    Tools: window.Core.Tools,
    Annotations: window.Annotations,
    // keep CoreControls for backwards compabililty
    // remove this in 9.0
    CoreControls: window.Core,
    PartRetrievers: window.Core.PartRetrievers,
    Actions: window.Actions,
    PDFNet: window.PDFNet,
  };
  const objForWebViewerUI = {
    FitMode,
    LayoutMode,
    Feature,
    Events,
    Languages: languageEnum,
    ToolbarGroup,
    NotesPanelSortStrategy,
    Theme,
    RedactionSearchPatterns,
    Alignment: ALIGNMENT,
    addSearchListener,
    addSortStrategy: addSortStrategy(store),
    annotationPopup: annotationPopup(store),
    closeDocument: closeDocument(store),
    closeElements: closeElements(store),
    contextMenuPopup: contextMenuPopup(store),
    disableElements: disableElements(store),
    setWv3dPropertiesPanelModelData: setWv3dPropertiesPanelModelData(store),
    setWv3dPropertiesPanelSchema: setWv3dPropertiesPanelSchema(store),
    disableFeatures: disableFeatures(store),
    disableTools: disableTools(store),
    disableReplyForAnnotations: disableReplyForAnnotations(store),
    displayErrorMessage: displayErrorMessage(store),
    disableHighContrastMode: disableHighContrastMode(store),
    downloadPdf: downloadPdf(store),
    enableElements: enableElements(store),
    enableFeatures: enableFeatures(store),
    enableTools: enableTools(store),
    focusNote: focusNote(store),
    getFitMode: getFitMode(store),
    getLayoutMode: getLayoutMode(store),
    getToolMode,
    getZoomLevel,
    getMaxZoomLevel,
    getMinZoomLevel,
    hotkeys,
    hideOutlineControl: hideOutlineControl(store),
    isElementDisabled: isElementDisabled(store),
    isElementOpen: isElementOpen(store),
    isToolDisabled: isToolDisabled(store),
    isHighContrastModeEnabled: isHighContrastModeEnabled(store),
    isFullscreen,
    loadDocument: loadDocument(store),
    settingsMenuOverlay: settingsMenuOverlay(store),
    pageManipulationOverlay: pageManipulationOverlay(store),
    multiPageManipulationControls: multiPageManipulationControls(store),
    thumbnailControlMenu: thumbnailControlMenu(store),
    openElements: openElements(store),
    print: print(store),
    printInBackground: printInBackground(store),
    cancelPrint,
    registerTool: registerTool(store),
    removeSearchListener,
    searchText: searchText(store.dispatch),
    searchTextFull: searchTextFull(store),
    overrideSearchExecution,
    setActiveHeaderGroup: setActiveHeaderGroup(store),
    setActiveLeftPanel: setActiveLeftPanel(store),
    setCustomModal: setCustomModal(store),
    addCustomModal: addCustomModal(store),
    addPanel: addPanel(store),
    showOutlineControl: showOutlineControl(store),
    setCustomNoteFilter: setCustomNoteFilter(store),
    setCustomPanel: setCustomPanel(store),
    exportBookmarks: exportBookmarks(store),
    extractPagesWithAnnotations,
    importBookmarks: importBookmarks(store),
    setFitMode,
    setHeaderItems: setHeaderItems(store),
    setIconColor: setIconColor(store),
    setLanguage: setLanguage(store),
    setTranslations,
    setLayoutMode,
    setMaxZoomLevel: setMaxZoomLevel(store),
    setMinZoomLevel: setMinZoomLevel(store),
    setNoteDateFormat: setNoteDateFormat(store),
    setPrintedNoteDateFormat: setPrintedNoteDateFormat(store),
    setMeasurementUnits: setMeasurementUnits(store),
    setPageLabels: setPageLabels(store),
    setPrintQuality: setPrintQuality(store),
    setDefaultPrintOptions: setDefaultPrintOptions(store),
    setNotesPanelSortStrategy: setNotesPanelSortStrategy(store),
    setSwipeOrientation,
    setTheme: setTheme(store),
    setToolbarGroup: setToolbarGroup(store),
    createToolbarGroup: createToolbarGroup(store),
    dangerouslySetNoteTransformFunction: setNoteTransformFunction(store),
    setCustomNoteSelectionFunction: setCustomNoteSelectionFunction(store),
    setCustomApplyRedactionsHandler: setCustomApplyRedactionsHandler(store),
    setCustomMultiViewerSyncHandler: setCustomMultiViewerSyncHandler(store),
    setCustomMultiViewerAcceptedFileFormats: setCustomMultiViewerAcceptedFileFormats(store),
    setToolMode,
    setZoomLevel,
    setZoomList: setZoomList(store),
    setSearchResults,
    setActiveResult,
    textPopup: textPopup(store),
    toggleElementVisibility: toggleElementVisibility(store),
    toggleFullScreen,
    unregisterTool: unregisterTool(store),
    updateTool: updateTool(store),
    updateElement: updateElement(store),
    useEmbeddedPrint: useEmbeddedPrint(store),
    willUseEmbeddedPrinting: willUseEmbeddedPrinting(store),
    setMaxSignaturesCount: setMaxSignaturesCount(store),
    mentions: mentions(store),
    setCustomMeasurementOverlayInfo: setCustomMeasurementOverlayInfo(store),
    setSignatureFonts: setSignatureFonts(store),
    setSelectedTab: setSelectedTab(store),

    setDisplayedSignaturesFilter: setDisplayedSignaturesFilterFunction(store),

    setAnnotationContentOverlayHandler: setAnnotationContentOverlayHandler(store),
    VerificationOptions: {
      addTrustedCertificates: addTrustedCertificates(store),
      loadTrustList: loadTrustList(store),
    },
    Panels: panelNames,
    ThumbnailsPanel: {
      selectPages: selectPages(store),
      unselectPages: unselectPages(store),
      getSelectedPageNumbers: getSelectedPageNumbers(store),
      enableMultiselect: enableMultiselect(store),
      disableMultiselect: disableMultiselect(store),
      setThumbnailSelectionMode: setThumbnailSelectionMode(store),
    },
    NotesPanel: {
      enableTextCollapse: enableTextCollapse(store),
      disableTextCollapse: disableTextCollapse(store),
      enableReplyCollapse: enableReplyCollapse(store),
      disableReplyCollapse: disableReplyCollapse(store),
      disableAutoExpandCommentThread: disableAutoExpandCommentThread(store),
      enableAutoExpandCommentThread: enableAutoExpandCommentThread(store),
      setCustomHeader: setCustomHeader(store),
      setCustomEmptyPanel: setCustomEmptyPanel(store),
      enableAttachmentPreview: enableAttachmentPreview(store),
      disableAttachmentPreview: disableAttachmentPreview(store),
      setAttachmentHandler: setAttachmentHandler(store)
    },
    OutlinesPanel: {
      setDefaultOptions: setDefaultOptions(store),
    },
    addModularHeaders: addModularHeaders(store),
    getModularHeader: getModularHeader(store),
    getModularHeaderList: getModularHeaderList(store),
    Components: {
      Item,
      GroupedItems: GroupedItems(store),
      ModularHeader: ModularHeader(store),
      TopHeader: ModularHeader(store),
      BottomHeader: ModularHeader(store),
      LeftHeader: ModularHeader(store),
      RightHeader: ModularHeader(store),
      CustomButton,
      ToggleElementButton,
      RibbonItem,
    },
    getWatermarkModalOptions: getWatermarkModalOptions(store),
    // undocumented and deprecated, to be removed in 7.0
    disableAnnotations: disableAnnotations(store),
    disableDownload: disableDownload(store),
    disableElement: disableElement(store),
    disableFilePicker: disableFilePicker(store),
    disableLocalStorage,
    disableMeasurement: disableMeasurement(store),
    disableNotesPanel: disableNotesPanel(store),
    disableNoteSubmissionWithEnter: disableNoteSubmissionWithEnter(store),
    disablePrint: disablePrint(store),
    disableRedaction: disableRedaction(store),
    disableTextSelection: disableTextSelection(store),
    disableTouchScrollLock,
    enableAnnotations: enableAnnotations(store),
    enableDownload: enableDownload(store),
    enableElement: enableElement(store),
    enableFilePicker: enableFilePicker(store),
    enableHighContrastMode: enableHighContrastMode(store),
    enableLocalStorage,
    enableMeasurement: enableMeasurement(store),
    enableNotesPanel: enableNotesPanel(store),
    enableNoteSubmissionWithEnter: enableNoteSubmissionWithEnter(store),
    enablePrint: enablePrint(store),
    enableRedaction: enableRedaction(store),
    enableTextSelection: enableTextSelection(store),
    enableTool: enableTool(store),
    enableTouchScrollLock,
    enableNativeScrolling,
    getAnnotationUser,
    getCurrentPageNumber: getCurrentPageNumber(store),
    getCurrentLanguage: getCurrentLanguage(store),
    getLocalizedText,
    getPageCount: getPageCount(store),
    getShowSideWindow: getShowSideWindow(store),
    getSideWindowVisibility: getSideWindowVisibility(store),
    setNotesPanelSort: setNotesPanelSort(store),
    setActivePalette: setActivePalette(store),
    setColorPalette: setColorPalette(store),
    setPageReplacementModalFileList: setPageReplacementModalFileList(store),
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
    setSortNotesBy: setSortNotesBy(store),
    getCustomData,
    toggleReaderMode: toggleReaderMode(store),
    enableToolDefaultStyleUpdateFromAnnotationPopup: enableToolDefaultStyleUpdateFromAnnotationPopup(store),
    disableToolDefaultStyleUpdateFromAnnotationPopup: disableToolDefaultStyleUpdateFromAnnotationPopup(store),
    addEventListener,
    removeEventListener,
    syncNamespaces,
    Fonts: Fonts(store),
    reloadOutline: reloadOutline(store),
    TabManager: TabManagerAPI(store),
    getAvailableLanguages,
    replaceRedactionSearchPattern: replaceRedactionSearchPattern(store),
    disableApplyCropWarningModal: disableApplyCropWarningModal(store),
    enableApplyCropWarningModal: enableApplyCropWarningModal(store),
    setPresetCropDimensions: setPresetCropDimensions(store),
    setPresetNewPageDimensions: setPresetNewPageDimensions(store),
    addDateTimeFormat: addDateTimeFormat(store),
    addRedactionSearchPattern: addRedactionSearchPattern(store),
    removeRedactionSearchPattern: removeRedactionSearchPattern(store),
    setThumbnailSelectionMode: setThumbnailSelectionMode(store),
    enableBookmarkIconShortcutVisibility: enableBookmarkIconShortcutVisibility(store),
    disableBookmarkIconShortcutVisibility: disableBookmarkIconShortcutVisibility(store),
    showFormFieldIndicators: showFormFieldIndicators(store),
    hideFormFieldIndicators: hideFormFieldIndicators(store),
    signSignatureWidget,
    getMeasurementScalePreset: getMeasurementScalePreset(store),
    addMeasurementScalePreset: addMeasurementScalePreset(store),
    removeMeasurementScalePreset: removeMeasurementScalePreset(store),
    enableMultipleScalesMode: enableMultipleScalesMode(store),
    disableMultipleScalesMode: disableMultipleScalesMode(store),
    isMultipleScalesModeEnabled: isMultipleScalesModeEnabled(store),
    enableMultiViewerSync: enableMultiViewerSync(store),
    disableMultiViewerSync: disableMultiViewerSync(store),
    isMultiViewerSyncing: isMultiViewerSyncing(store),
    setCustomSettings: setCustomSettings(store),
    exportUserSettings: exportUserSettings(store),
    importUserSettings: importUserSettings(store),
    setGrayscaleDarknessFactor,

    // deprecated, to be removed in 8.0
    useNativeScroll,
    showErrorMessage: showErrorMessage(store),
    toggleElement: toggleElement(store),
    setSideWindowVisibility: setSideWindowVisibility(store),
    setHighContrastMode: setHighContrastMode(store),
    getIsHighContrastMode: getIsHighContrastMode(store),

    // deprecated, to be removed in 9.0
    updateOutlines: updateOutlines(store),
    selectThumbnailPages: selectThumbnailPages(store),
    unselectThumbnailPages: unselectThumbnailPages(store),
    getSelectedThumbnailPageNumbers: getSelectedThumbnailPageNumbers(store),

    // undocumented
    loadedFromServer: false,
    serverFailed: false,
    i18n: i18next,
    showWarningMessage: showWarningMessage(store),
    getBBAnnotManager,
    selectors: getSelectors(store),
    reactElements,
    enableClearSearchOnPanelClose: enableClearSearchOnPanelClose(store),
    disableClearSearchOnPanelClose: disableClearSearchOnPanelClose(store),
    disableNativeScrolling,
    setAnnotationReadState: setAnnotationReadState(store),
    getAnnotationReadState: getAnnotationReadState(store),
    disableFadePageNavigationComponent: disableFadePageNavigationComponent(store),
    enableFadePageNavigationComponent: enableFadePageNavigationComponent(store),
    enableDesktopOnlyMode: enableDesktopOnlyMode(store),
    disableDesktopOnlyMode: disableDesktopOnlyMode(store),
    isInDesktopOnlyMode: isInDesktopOnlyMode(store),
    disablePageDeletionConfirmationModal: disablePageDeletionConfirmationModal(store),
    enablePageDeletionConfirmationModal: enablePageDeletionConfirmationModal(store),
    getAnnotationStylePopupTabs,
    setAnnotationStylePopupTabs: setAnnotationStylePopupTabs(store),
    AnnotationKeys,
    AnnotationStylePopupTabs,
    getZoomStepFactors: getZoomStepFactors(store),
    setZoomStepFactors: setZoomStepFactors(store),
    getDocumentViewer,
  };
  const documentViewer = core.getDocumentViewer(1);

  window.instance = {
    // keys needed for webviewer.js
    CORE_NAMESPACE_KEY: CORE_NAMESPACE,
    UI_NAMESPACE_KEY: UI_NAMESPACE,
    [CORE_NAMESPACE]: {
      ...objForWebViewerCore,
      ...window.Core,
      documentViewer,
      annotationManager: documentViewer.getAnnotationManager(),
      getDocumentViewers: () => core.getDocumentViewers(),
    },
    [UI_NAMESPACE]: objForWebViewerUI,

    // keep them here for backwards compatibililty. should remove them in 9.0
    ...objForWebViewerCore,
    ...objForWebViewerUI,
    docViewer: documentViewer,
    annotManager: documentViewer.getAnnotationManager(),
  };
};
