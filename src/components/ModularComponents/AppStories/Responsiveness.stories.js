import React from 'react';
import App from 'components/App';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import core from 'core';
import { MockApp } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/App Responsiveness',
  component: App,
};

core.getToolMode = () => {
  return {
    name: 'AnnotationEraserTool',
  };
};

const Template = (args, context) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'toolbarGroup-Redact': {
          disabled: false,
          priority: 3
        },
        'toolbarGroup-Measure': {
          disabled: false,
          priority: 3
        },
      },
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
      activeTheme: context.globals.theme,
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
  activeCustomRibbon = 'toolbarGroup-Annotate',
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
export const RibbonItemsShouldNotLoop = createTemplate({
  width: '1135px',
  components: {
    ...mockModularComponents,
    'toolbarGroup-Forms': {
      dataElement: 'toolbarGroup-Forms',
      title: 'Forms',
      type: 'ribbonItem',
      label: 'Forms',
      groupedItems: [
        'formsGroupedItems'
      ],
      toolbarGroup: 'toolbarGroup-Forms'
    },
    'default-ribbon-group': {
      ...mockModularComponents['default-ribbon-group'],
      items: [
        'toolbarGroup-View',
        'toolbarGroup-Annotate',
        'toolbarGroup-Shapes',
        'toolbarGroup-Insert',
        'toolbarGroup-Redact',
        'toolbarGroup-Measure',
        'toolbarGroup-Edit',
        'toolbarGroup-FillAndSign',
        'toolbarGroup-Forms',
      ],
    },
  }
});
