import React from 'react';
import GroupedToolsOverflowFlyout from './GroupedToolsOverflowFlyout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout/Flyout';

export default {
  title: 'ModularComponents/GroupedTools',
  component: GroupedToolsOverflowFlyout,
};

// GROUP 1
const freeTextButton1 = {
  dataElement: 'freeTextButton1',
  img: 'icon-tool-text-free-text',
  label: 'FreeText',
  title: 'FreeText',
  toolName: 'AnnotationCreateFreeText',
};

const toolGroupButton1 = {
  dataElement: 'toolGroupButton1',
  img: 'icon-tool-text-free-text',
  label: 'FreeText',
  title: 'FreeText.freetext',
  toolGroup: 'freeTextTools',
  tools: [freeTextButton1],
};

// GROUP 2
const freeHandHighlightButton1 = {
  dataElement: 'freeHandHighlightButton1',
  img: 'icon-tool-pen-highlight',
  label: 'FreeHandHighlight',
  title: 'FreeHandHighlight1',
  toolName: 'AnnotationCreateFreeHandHighlight'
};

const toolGroupButton2 = {
  dataElement: 'toolGroupButton2',
  label: 'Highlight',
  title: 'Freehand Highlight',
  toolGroup: 'freeHandHighlightTools',
  tools: [freeHandHighlightButton1]
};

// GROUP 3
const freeHandToolButton1 = {
  dataElement: 'freeHandToolButton1',
  img: 'icon-tool-pen-line',
  label: 'FreeHand',
  title: 'FreeHand',
  toolName: 'AnnotationCreateFreeHand'
};

const toolGroupButton3 = {
  dataElement: 'toolGroupButton3',
  label: 'FreeHand',
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
  dataElement: 'toolGroupButton4',
  img: 'icon-tool-shape-rectangle',
  title: 'tool.rectangle',
  toolGroup: 'rectangleTools',
  tools: [rectangleToolButton1]
};

// GROUP 5
const ellipseToolButton1 = {
  dataElement: 'ellipseTool1',
  title: 'tool.ellipse',
  img: 'icon-tool-shape-oval',
  label: 'Ellipse',
  toolName: 'AnnotationCreateEllipse'
};

const toolGroupButton5 = {
  dataElement: 'toolGroupButton5',
  label: 'Ellipse',
  img: 'icon-tool-shape-oval',
  title: 'Ellipse',
  toolGroup: 'ellipseTools',
  tools: [ellipseToolButton1]
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    genericPanels: [],
    flyoutMap: {
      'GroupedToolsOverflowFlyout': {
        'dataElement': 'GroupedToolsOverflowFlyout',
        className: 'GroupedToolsOverflowFlyout',
        items: [toolGroupButton1, toolGroupButton2, toolGroupButton3, toolGroupButton4, toolGroupButton5],
      },
      'noIcons': {
        'dataElement': 'noIcons',
        className: 'noIcons',
        items: [toolGroupButton2, toolGroupButton3],
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'GroupedToolsOverflowFlyout',
    headers: {},
    lastPickedToolForGroup: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
  },
};

const store = configureStore({
  reducer: () => initialState,
});

export const MixedOverflowFlyout = (props) => {
  return (
    <Provider store={store}>
      <Flyout {...props} className={'overflowFlyout'} />
    </Provider>
  );
};

const noIconsStore = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: { ...initialState.viewer, activeFlyout: 'noIcons' }
    };
  }
});

export const NoIconsOverflowFlyout = (props) => {
  return (
    <Provider store={noIconsStore}>
      <Flyout {...props} className={'noIconsOverflowFlyout'} />
    </Provider>
  );
};
