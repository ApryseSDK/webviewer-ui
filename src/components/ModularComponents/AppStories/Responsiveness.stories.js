import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from 'components/App';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import core from 'core';

export default {
  title: 'ModularComponents/App Responsiveness',
  component: App,
  parameters: {
    customizableUI: true,
  }
};

const noop = () => {
};

core.getToolMode = () => {
  return {
    name: 'AnnotationEraserTool',
  };
};

const MockApp = ({ initialState, width, height }) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
  setItemToFlyoutStore(store);
  return (
    <Provider store={store}>
      <div style={{ maxWidth: width, maxHeight: height, width: '100%', height: '100%' }}>
        <App removeEventHandlers={noop}/>
      </div>
    </Provider>
  );
};

const Template = (args) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: args.headers,
      modularComponents: args.components,
      openElements: {},
      genericPanels: [{
        dataElement: 'stylePanel',
        render: 'stylePanel',
        location: 'left',
      }],
      activeGroupedItems: [
        'annotateGroupedItems',
        'defaultAnnotationUtilities',
      ],
      flyoutMap: {
        annotateGroupedItemsFlyout: {
          items:[]
        }
      },
      lastPickedToolForGroupedItems: {
        annotateGroupedItems: args.activeToolName || 'AnnotationCreateTextUnderline',
      },
      activeCustomRibbon: args.activeCustomRibbon,
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateTextUnderline',
        group: ['annotateGroupedItems'],
      },
      activeToolName: args.activeToolName || 'AnnotationCreateTextUnderline',
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithHeaders} width={args.width} height={args.height}/>;
};

function createTemplate({
  width = '100%',
  height = '100%',
  headers = mockHeadersNormalized,
  components = mockModularComponents,
  activeCustomRibbon = 'annotations-ribbon-item',
  activeToolName,
} = {}) {
  const template = Template.bind({});
  template.args = { headers, components, width, height, activeCustomRibbon, activeToolName };
  template.parameters = { layout: 'fullscreen' };
  return template;
}

export const Full = createTemplate();
export const ExtraLarge = createTemplate({ width: '1920px', height: '1080px' });
export const Large = createTemplate({ width: '1024px', height: '768px' });
export const Medium = createTemplate({ width: '768px', height: '1024px' });
export const Small = createTemplate({ width: '576px', height: '800px' });
export const ExtraSmall = createTemplate({ width: '360px', height: '667px', activeToolName: 'AnnotationEraserTool' });
export const TooSmall = createTemplate({ width: '200px', height: '300px', activeToolName: 'AnnotationEraserTool' });

const ExtraItemsAddedHeaders = {
  ...mockHeadersNormalized,
  'default-top-header': {
    ...mockHeadersNormalized['default-top-header'],
    items: [
      'groupedLeftHeaderButtons',
      'default-ribbon-group',
      'searchPanelToggle',
      'notesPanelToggle',
      'stylePanelToggle',
      'filePickerButton',
      'downloadButton',
      'settingsButton',
      'annotateGroupedItems2',
    ]
  }
};
const ExtraItemsAddedComponents = {
  ...mockModularComponents,
  annotateGroupedItems2: {
    dataElement: 'annotateGroupedItems2',
    items: [
      'underlineToolButton',
      'highlightToolButton',
      'rectangleToolButton',
      'freeTextToolButton',
      'squigglyToolButton',
      'strikeoutToolButton',
      'defaultAnnotationUtilities2'
    ],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  defaultAnnotationUtilities2: {
    dataElement: 'defaultAnnotationUtilities2',
    items: [
      'divider-0.12046025247094039',
      'stylePanelToggle',
      'divider-0.3460871740070717',
      'undoButton',
      'redoButton',
      'eraserToolButton'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
};

export const ExtraItemsAdded = createTemplate({
  headers: ExtraItemsAddedHeaders,
  components: ExtraItemsAddedComponents
});

export const RibbonItemsOverflow = createTemplate({ width: '690px' });
export const RibbonItemsOverflowActive = createTemplate({ width: '750px', activeCustomRibbon: 'toolbarGroup-Insert' });
