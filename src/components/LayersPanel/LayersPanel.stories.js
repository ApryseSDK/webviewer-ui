import React from 'react';
import LayersPanel from 'components/LayersPanel';
import { MockApp } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { userEvent, within, expect } from 'storybook/test';
import core from 'core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/LayersPanel',
  component: LayersPanel,
};

const layers = [
  {
    'name': 'Layer 1',
    'id': 'layer1',
    'children': [
      {
        'name': 'SubLayer 1',
        'id': 'sublayer1',
      },
    ],
  },
  {
    'name': 'Layer 2',
    'id': 'layer2',
  },
  {
    'name': 'Layer 3',
    'id': 'layer3',
  },
];

export function Basic(args, context) {
  const { addonRtl } = context.globals;
  const documentViewer = core.getDocumentViewer();
  const annotationManager = documentViewer.getAnnotationManager();
  annotationManager.drawAnnotationsFromList = () => {};
  documentViewer.getAnnotationManager = () => annotationManager;

  core.getDocumentViewer = () => documentViewer;

  const stateWithLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      toolbarGroup: 'toolbarGroup-Annotate',
      isInDesktopOnlyMode: false,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'start',
        },
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'layersPanel': { disabled: false, priority: 3 },
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'AnnotationCreateTextHighlight',
      fadePageNavigationComponent: true,
      activeTheme: context.globals.theme,
    },
    document: {
      ...initialState.document,
      layers: layers,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithLayersPanel} initialDirection={addonRtl}/>;
}

Basic.parameters = { layout: 'fullscreen' };

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const menuButton = canvas.getByRole('button', { name: getTranslatedText('component.menuOverlay') });
  expect(menuButton).toBeInTheDocument();
  await userEvent.click(menuButton);

  const settingsButton = canvas.getByRole('button', { name: getTranslatedText('option.settings.settings') });
  expect(settingsButton).toBeInTheDocument();
  await userEvent.click(settingsButton);

  const settingsAdvancedButton = await canvas.findByRole('button', { name: getTranslatedText('option.settings.advancedSetting') });
  expect(settingsAdvancedButton).toBeInTheDocument();
  await userEvent.click(settingsAdvancedButton);

  const input = canvas.getByRole('checkbox', { name: getTranslatedText('option.settings.disableFadePageNavigationComponent') });
  expect(input).toBeInTheDocument();
  await userEvent.click(input);

  const closeBtn = canvas.getByRole('button', { name: getTranslatedText('action.close') });
  expect(closeBtn).toBeInTheDocument();
  await userEvent.click(closeBtn);

  const pageNav = await canvas.findByRole('button', { name: getTranslatedText('action.pagePrev') });
  expect(pageNav).toBeInTheDocument();
  expect(pageNav).toBeVisible();
};

export const RightSide = (args, context) => {
  const { addonRtl } = context.globals;
  const stateWithLayersPanelOnRight = {
    ...initialState,
    viewer: {
      fadePageNavigationComponent: true,
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'right',
        },
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'layersPanel': { disabled: false, priority: 3 },
      },
      activeCustomRibbon: 'toolbarGroup-View',
      activeTheme: context.globals.theme,
    },
    document: {
      ...initialState.document,
      layers: layers,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithLayersPanelOnRight} initialDirection={addonRtl} />;
};

RightSide.parameters = { layout: 'fullscreen' };

export const Empty = (args, context) => {
  const { addonRtl } = context.globals;
  const stateWithEmptyLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'start',
        },
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'layersPanel': { disabled: false, priority: 3 },
      },
      activeCustomRibbon: 'toolbarGroup-View',
      fadePageNavigationComponent: false,
      activeTheme: context.globals.theme,
    },
    document: {
      ...initialState.document,
      layers: [],
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithEmptyLayersPanel} initialDirection={addonRtl} />;
};

Empty.parameters = { layout: 'fullscreen' };


const stateLoading = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      ...initialState.viewer.openElements,
      panel1: true,
    },
  },
  document: {
    ...initialState.document,
    layers: null,
  },
};
const store = configureStore({ reducer: () => stateLoading });

export const Loading = () => {
  return <Provider store={store}>
    <Panel location="start" dataElement="panel1">
      <LayersPanel />
    </Panel>
  </Provider>;
};

Loading.parameters = window.storybook.disableRtlMode;

