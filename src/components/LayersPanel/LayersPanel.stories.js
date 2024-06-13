import React from 'react';
import LayersPanel from 'components/LayersPanel';
import { MockApp } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';

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

export const RightSide = () => {
  const stateWithLayersPanelOnRight = {
    ...initialState,
    viewer: {
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