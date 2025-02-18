import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import App from 'components/App';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import { defaultPanels } from 'src/redux/modularComponents';
import defineWebViewerInstanceUIAPIs from 'src/apis';
import { availableFontFaces, cssFontValues } from 'src/constants/officeEditorFonts';
import { DEFAULT_POINT_SIZE, EditingStreamType, OfficeEditorEditMode } from 'src/constants/officeEditor';

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
export const MockApp = ({ initialState, width, height, isOffset }) => {
  const store = createStore(initialState);

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

  return (
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
};

const BasicAppTemplate = (args, context) => {
  const isMultiTab = args?.isMultiTab || false;
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
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
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithHeaders} width={args.width} height={args.height} />;
};

export const createTemplate = ({ headers = {}, components = {}, flyoutMap = {}, isMultiTab = false, width = '100%', height = '100%' }) => {
  const template = BasicAppTemplate.bind({});
  template.args = { headers, components, flyoutMap, isMultiTab, width, height };
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
    availableFontFaces,
    cssFontValues,
    editMode: OfficeEditorEditMode.EDITING,
    stream: EditingStreamType.BODY,
  },
  viewer: {
    isOfficeEditorMode: true,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
  },
  featureFlags: {
    customizableUI: true,
  }
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
