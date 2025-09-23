import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import App from 'components/App';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import { defaultPanels } from 'src/redux/modularComponents';
import defineWebViewerInstanceUIAPIs from 'src/apis';
import { cssFontValues } from 'src/constants/fonts/fonts';
import { availableOfficeEditorFonts } from 'src/constants/fonts/officeEditorFonts';
import { DEFAULT_POINT_SIZE, EditingStreamType, LAYOUT_UNITS, OfficeEditorEditMode } from 'constants/officeEditor';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';

const noop = () => { };

export const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

// isOffset adds a div beside WebViewer, so that it behaves as if it was
// in Showcase or our samples.
export const MockApp = ({ initialState, width, height, isOffset, storeRef = null }) => {
  const [store] = useState(createStore(initialState));
  if (storeRef) {
    // This is useful for tests that need to access the store directly
    storeRef.current = store;
  }

  // We get around the code that sets the UI configuration by querying the hash
  // parameter by delaying this action
  // Patch UI config *after* mount, because useEffect in App uses hash params to overwrite redux
  useEffect(() => {
    if (initialState?.viewer?.uiConfiguration) {
      store.dispatch({
        type: 'SET_UI_CONFIGURATION',
        payload: initialState.viewer.uiConfiguration,
      });
    }
  }, [store, initialState]);

  setItemToFlyoutStore(store);
  defineWebViewerInstanceUIAPIs(store);

  const divStyle = {
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'none',
    maxWidth: width,
    maxHeight: height,
    width: '100%',
    height: '100%',
  };

  if (isOffset) {
    divStyle.display = 'flex';
  }

  return !store ? null : (
    <Provider store={store}>
      <div style={divStyle}>
        {isOffset && <div
          style={{
            width: '100px',
            backgroundColor: 'lightblue',
            flexShrink: 0,
          }}
        />}
        <App removeEventHandlers={noop} />
      </div>
    </Provider>
  );
};

MockApp.propTypes = {
  initialState: PropTypes.object.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  isOffset: PropTypes.bool,
  storeRef: PropTypes.object,
};

const BasicAppTemplate = (args, context) => {
  const isMultiTab = args?.isMultiTab || false;
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      uiConfiguration: args.uiConfiguration,
      modularHeaders: args.headers,
      modularComponents: args.components,
      flyoutMap: args.flyoutMap,
      openElements: {},
      genericPanels: defaultPanels,
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'AnnotationCreateTextUnderline',
      isMultiTab,
      tabs: isMultiTab ? [
        { id: 1, src: 'file1.pdf', options: { filename: 'Title A.pdf' }, },
        { id: 2, src: 'file2.docx', options: { filename: 'Title B.docx' }, },
        { id: 3, src: 'file3.pptx', options: { filename: 'Selected Document.pptx' }, },
      ] : [],
      activeTab: 3,
      activeTheme: context.globals.theme,
      ...args.viewerRedux,
    },
    featureFlags: {
      customizableUI: true,
    },
    spreadsheetEditor: {
      ...initialState.spreadsheetEditor,
      ...args.spreadsheetEditorRedux,
    }
  };
  return <MockApp initialState={stateWithHeaders} width={args.width} height={args.height} storeRef={args.storeRef} />;
};

export const createTemplate = ({
  headers = {},
  components = {},
  flyoutMap = {},
  isMultiTab = false,
  width = '100%',
  height = '100%',
  spreadsheetEditorRedux = {},
  viewerRedux = {},
  uiConfiguration = VIEWER_CONFIGURATIONS.DEFAULT,
  storeRef = null,
}) => {
  const template = BasicAppTemplate.bind({});
  template.args = { headers, components, flyoutMap, isMultiTab, width, height, spreadsheetEditorRedux, viewerRedux, uiConfiguration, storeRef };
  template.parameters = { layout: 'fullscreen' };
  return template;
};

export const waitForTimeout = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

export const MockDocumentContainer = ({
  width = '100%',
  height = '100%',
  display = 'flex',
  justifyContent = 'center',
  alignItems = 'center',
  flexDirection = 'column',
  children
}) => {
  return (
    <div style={{ width: width, height: height, display: display, justifyContent: justifyContent, alignItems: alignItems, flexDirection: flexDirection }}>
      {children}
      Mock Document Container
    </div>
  );
};

MockDocumentContainer.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  display: PropTypes.string,
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
  flexDirection: PropTypes.string,
  children: PropTypes.node,
};

// This is the initial state of the Modular UI OfficeEditor store
export const OEModularUIMockState = {
  officeEditor: {
    cursorProperties: {
      bold: false,
      italic: false,
      underlineStyle: 'none',
      pointSize: DEFAULT_POINT_SIZE,
      fontFace: 'Arial',
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      paragraphProperties: {
        justification: 'left',
        listType: 'none',
        lineHeight: undefined,
        lineHeightMultiplier: 1,
      },
      locationProperties: {
        inTable: false,
      },
    },
    selectionProperties: {
      paragraphProperties: {},
    },
    availableFontFaces: availableOfficeEditorFonts,
    cssFontValues,
    editMode: OfficeEditorEditMode.EDITING,
    stream: EditingStreamType.BODY,
    unitMeasurement: LAYOUT_UNITS.CM,
  },
  viewer: {
    uiConfiguration: VIEWER_CONFIGURATIONS.DOCX_EDITOR,
    isOfficeEditorMode: true,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
    cellProperties: {
      cellType: null,
      cellFormula: null,
      stringCellValue: null,
      topLeftRow: null,
      topLeftColumn: null,
      bottomRightRow: null,
      bottomRightColumn: null,
      styles: {
        verticalAlignment: null,
        horizontalAlignment: null,
        font: {
          bold: false,
          italic: false,
          underline: false,
          strikeout: false,
        },
        formatType: null,
      }
    },
  },
};

export const oePartialState = {
  officeEditor: {
    cursorProperties: {
      locationProperties: {
        inTable: false,
      },
    },
    stream: EditingStreamType.BODY,
  },
};

export const setupNotesPanelCoreMocks = (core, annotations, selectedAnnotations) => {
  core.getAnnotationsList = () => annotations;
  core.getSelectedAnnotations = () => selectedAnnotations;
  core.getDisplayModeObject = () => ({
    pageToWindow: () => ({ x: 0, y: 0 }),
    getVisiblePages: () => [1],
  });
  const documentViewer = {
    getRotation: () => 0,
    getPageCount: () => 1,
    getDocument: () => ({
      getPageInfo: () => ({
        width: 200,
        height: 400
      })
    }),
    getCompleteRotation: () => 0,
    getAnnotationManager: () => { },
    getDisplayModeManager: () => ({
      isVirtualDisplayEnabled: () => true,
      getDisplayMode: () => ({
        isContinuous: () => true
      })
    })
  };
  core.getDocumentViewer = () => documentViewer;
  core.canModifyContents = () => true;
  core.canModify = () => true;
  core.getGroupAnnotations = () => [];
  core.selectAnnotation = () => undefined;
  core.jumpToAnnotation = () => noop;
};

export const string280Chars = 'very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_very_long_file_name_';

export const defaultSpreadSheetEditorState = {
  editMode: 'editing',
  cellProperties: {
    canCopy: true,
    canPaste: true,
    canCut: true,
    styles: {
      verticalAlignment: 'middle',
      horizontalAlignment: 'left',
      formatType: 'currencyRoundedFormat',
      font: {
        fontFace: 'Arial',
        pointSize: 8,
        bold: true,
        italic: false,
        underline: true,
        strikeout: false,
      },
      'border': {
        // eslint-disable-next-line custom/no-hex-colors
        'top': { type: 'Top', style: 'Thin', color: '#000000' },
      },
    }
  }
};
