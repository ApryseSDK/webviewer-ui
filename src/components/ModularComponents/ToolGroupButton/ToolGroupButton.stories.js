import React from 'react';
import ToolGroupButton from './ToolGroupButton';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'ModularComponents/ToolGroupButton',
  component: ToolGroupButton,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    customFlxPanels: [],
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-Annotate',
    activeToolGroup: 'freeTextTools'
  },
};

let currentToolGroup = initialState.viewer.activeToolGroup;

const initialStateActive = (toolGroup) => {
  currentToolGroup = toolGroup;
  return {
    viewer: {
      ...initialState.viewer,
      activeToolGroup: currentToolGroup,
    },
  };
};

const store = configureStore({
  reducer: (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'SET_ACTIVE_TOOL_GROUP':
        return initialStateActive(payload.toolGroup);
      case 'OPEN_ELEMENT':
        return initialStateActive(currentToolGroup);
      default:
        return initialState;
    }
  },
});

export const ToolGroupButtonComponent = () => {
  const freeTextButton1 = {
    dataElement: 'freeTextButton1',
    img: 'icon-tool-text-free-text',
    title: 'FreeText1',
    toolName: 'AnnotationCreateFreeText',
  };

  const freeTextButton2 = {
    dataElement: 'freeTextButton2',
    label: 'FreeText2',
    title: 'FreeText2',
    toolName: 'AnnotationCreateFreeText2',
  };

  const freeTextButton3 = {
    dataElement: 'freeTextButton3',
    img: 'icon-tool-text-free-text',
    label: 'FreeTex3',
    title: 'FreeText3',
    toolName: 'AnnotationCreateFreeText3',
  };

  const toolGroupButton1 = {
    dataElement: 'toolGroupButton1',
    img: 'icon-tool-text-free-text',
    label: 'FreeText',
    title: 'FreeText',
    toolGroup: 'freeTextTools',
    tools: [freeTextButton1, freeTextButton2, freeTextButton3],
  };

  const freeHandToolButton1 = {
    dataElement: 'freeHandToolButton1',
    img: 'icon-tool-pen-line',
    title: 'FreeHand1',
    toolName: 'AnnotationCreateFreeHand'
  };

  const freeHandToolButton2 = {
    dataElement: 'freeHandToolButton2',
    label: 'FreeHand2',
    title: 'FreeHand2',
    toolName: 'AnnotationCreateFreeHand2'
  };

  const freeHandToolButton3 = {
    dataElement: 'freeHandToolButton3',
    img: 'icon-tool-pen-line',
    label: 'FreeHand3',
    title: 'FreeHand3',
    toolName: 'AnnotationCreateFreeHand3'
  };

  const toolGroupButton2 = {
    dataElement: 'toolGroupButton3',
    label: 'Freehand',
    img: 'icon-tool-pen-line',
    title: 'Freehand',
    toolGroup: 'freeHandTools',
    tools: [freeHandToolButton1, freeHandToolButton2, freeHandToolButton3]
  };

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <ToolGroupButton {...toolGroupButton1} />
        <ToolGroupButton {...toolGroupButton2} />
      </div>
    </Provider>
  );
};
