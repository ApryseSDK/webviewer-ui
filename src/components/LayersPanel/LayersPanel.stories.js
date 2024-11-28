import React from 'react';
import LayersPanel from 'components/LayersPanel';
import { MockApp } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { userEvent, within, waitFor, expect } from '@storybook/test';

export default {
  title: 'Components/LayersPanel',
  component: LayersPanel,
  parameters: {
    customizableUI: true,
  },
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
  }
];

export function Basic() {
  const stateWithLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      toolbarGroup: 'toolbarGroup-Annotate',
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'panel1',
        render: 'layersPanel',
        location: 'left',
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'layersPanel': { disabled: false, priority: 3 },
      },
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': 'AnnotationCreateTextHighlight',
        'annotateToolsGroupedItems': 'AnnotationCreateTextHighlight',
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'AnnotationCreateTextHighlight',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateTextHighlight',
        group: ['annotateGroupedItems', 'annotateToolsGroupedItems'],
      },
      fadePageNavigationComponent: true,
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
    const btn = canvas.queryByRole('button', { name: 'Advanced Setting' });
    expect(btn).toBeInTheDocument();
  });

  const settingsAdvancedButton = await canvas.queryByRole('button', { name: 'Advanced Setting' });
  expect(settingsAdvancedButton).toBeInTheDocument();
  await userEvent.click(settingsAdvancedButton);

  const input = await canvas.queryByRole('checkbox', { name: 'Disable Fade Page Navigation Component' });
  expect(input).toBeInTheDocument();
  await userEvent.click(input);

  const closeBtn = await canvas.queryByRole('button', { name: 'Close' });
  expect(closeBtn).toBeInTheDocument();
  await userEvent.click(closeBtn);

  const pageNav = await canvas.queryByRole('button', { name: 'Previous page' });
  expect(pageNav).toBeInTheDocument();
  expect(pageNav).toBeVisible();
};

export const RightSide = () => {
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
        }
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
      lastPickedToolAndGroup: {
        tool: 'AnnotationEdit',
        group: ['groupedLeftPanelItems'],
      },
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

export const Empty = () => {
  const stateWithEmptyLayersPanel = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'layersPanel',
          location: 'left',
        }
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