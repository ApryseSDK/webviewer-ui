import React from 'react';
import LayersPanel from 'components/LayersPanel';
import { MockApp } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { userEvent, within, waitFor, expect } from 'storybook/test';
import core from 'core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';

export default {
  title: 'Components/LayersPanel',
  component: LayersPanel,
};

const layers = [
  {
    'name': 'Layer 1',
    'id': 'layer1',
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
          location: 'left',
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
  return <MockApp initialState={stateWithLayersPanel} />;
}

Basic.parameters = { layout: 'fullscreen' };

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const menuButton = await canvas.queryByRole('button', { name: 'Menu' });
  expect(menuButton).toBeInTheDocument();
  await userEvent.click(menuButton);

  await waitFor(() => {
    const btn = canvas.queryByRole('button', { name: 'Settings' });
    expect(btn).toBeInTheDocument();
  });
  const settingsButton = await canvas.queryByRole('button', { name: 'Settings' });
  expect(settingsButton).toBeInTheDocument();
  await userEvent.click(settingsButton);

  await waitFor(() => {
    const btn = canvas.queryByRole('button', { name: 'Advanced Settings' });
    expect(btn).toBeInTheDocument();
  });

  const settingsAdvancedButton = await canvas.queryByRole('button', { name: 'Advanced Settings' });
  expect(settingsAdvancedButton).toBeInTheDocument();
  await userEvent.click(settingsAdvancedButton);

  const input = await canvas.queryByRole('checkbox', { name: 'Disable Fade Page Navigation Component' });
  expect(input).toBeInTheDocument();
  await userEvent.click(input);

  const closeBtn = await canvas.queryByRole('button', { name: 'Close' });
  expect(closeBtn).toBeInTheDocument();
  await userEvent.click(closeBtn);

  await waitFor(async () => {
    const pageNav = await canvas.queryByRole('button', { name: 'Previous page' });
    expect(pageNav).toBeInTheDocument();
    expect(pageNav).toBeVisible();
  });
};

export const RightSide = (args, context) => {
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
  return <MockApp initialState={stateWithLayersPanelOnRight} />;
};

RightSide.parameters = { layout: 'fullscreen' };

export const Empty = (args, context) => {
  const stateWithEmptyLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'left',
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
  return <MockApp initialState={stateWithEmptyLayersPanel} />;
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
    <Panel location="left" dataElement="panel1">
      <LayersPanel />
    </Panel>
  </Provider>;
};
