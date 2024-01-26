import React from 'react';
import GroupedTools from './GroupedTools';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/GroupedTools',
  component: GroupedTools,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    genericPanels: [],
    flyoutMap: {},
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
  },
};

// GROUP 1
const freeTextButton1 = {
  dataElement: 'freeTextButton1',
  img: 'icon-tool-text-free-text',
  label: 'FreeText1',
  title: 'FreeText1',
  toolName: 'AnnotationCreateFreeText',
};

const toolGroupButton1 = {
  type: 'toolGroupButton',
  dataElement: 'toolGroupButton1',
  img: 'icon-tool-text-free-text',
  label: 'FreeText1',
  title: 'FreeText.freetext',
  toolGroup: 'freeTextTools',
  tools: [freeTextButton1],
};

// GROUP 2
const freeHandHighlightButton1 = {
  dataElement: 'freeHandHighlightButton1',
  img: 'icon-tool-pen-highlight',
  label: 'FreeHandHighlight1',
  title: 'FreeHandHighlight1',
  toolName: 'AnnotationCreateFreeHandHighlight'
};

const toolGroupButton2 = {
  type: 'toolGroupButton',
  dataElement: 'toolGroupButton2',
  img: 'icon-tool-pen-highlight',
  label: 'Highlight2',
  title: 'Freehand Highlight',
  toolGroup: 'freeHandHighlightTools',
  tools: [freeHandHighlightButton1]
};

// GROUP 3
const freeHandToolButton1 = {
  dataElement: 'freeHandToolButton1',
  img: 'icon-tool-pen-line',
  label: 'FreeHand3',
  title: 'FreeHand1',
  toolName: 'AnnotationCreateFreeHand'
};

const toolGroupButton3 = {
  type: 'toolGroupButton',
  dataElement: 'toolGroupButton3',
  img: 'icon-tool-pen-highlight',
  label: 'FreeHand12',
  title: 'tool.freehand',
  toolGroup: 'freeHandTools',
  tools: [freeHandToolButton1]
};

// GROUP 4
const rectangleToolButton1 = {
  dataElement: 'rectangleTool1',
  img: 'icon-tool-shape-rectangle',
  label: 'Rectangle',
  title: 'Rectangle',
  toolName: 'AnnotationCreateRectangle'
};

const toolGroupButton4 = {
  type: 'toolGroupButton',
  dataElement: 'toolGroupButton4',
  label: 'Rectangle 4',
  img: 'icon-tool-pen-line',
  title: 'tool.rectangle',
  toolGroup: 'rectangleTools',
  tools: [rectangleToolButton1]
};

// GROUP 5
const ellipseToolButton1 = {
  dataElement: 'ellipseTool1',
  img: 'icon-tool-shape-oval',
  label: 'Ellipse',
  title: 'tool.ellipse',
  toolName: 'AnnotationCreateEllipse'
};

const toolGroupButton5 = {
  type: 'toolGroupButton',
  dataElement: 'toolGroupButton5',
  label: 'Ellipse 5',
  img: 'icon-tool-pen-line',
  title: 'Ellipse',
  toolGroup: 'ellipseTools',
  tools: [ellipseToolButton1]
};

const store = configureStore({
  reducer: () => initialState,
});

export const ToolsGroup = () => {
  const props = {
    dataElement: 'grouped-tools',
    headerDirection: 'row',
    items: [toolGroupButton1, toolGroupButton2, toolGroupButton3, toolGroupButton4, toolGroupButton5],
  };

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', maxWidth: '100%' }}>
        <GroupedTools {...props} />
      </div>
    </Provider>
  );
};
