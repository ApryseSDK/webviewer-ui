import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import TextEditingPanel from './TextEditingPanel';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { mobileStoryParameters } from 'helpers/storybookParams';
import Panel from 'components/Panel';

const noop = () => { };

export default {
  title: 'Components/TextEditingPanel',
  component: TextEditingPanel,
  includeStories: ['Basic', 'TextEditingUndoRedo', 'LeftSide', 'TextEditingPanelInMobile'],
};

const textEditingPanelInitialState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    disabledElements: {
      logoBar: { disabled: true },
    },
    openElements: {
      header: true,
      textEditingPanel: true,
    },
    panelWidths: {
      textEditingPanel: 330,
    },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    modularHeaders: {},
    activeGroupedItems: ['annotateGroupedItems'],
  },
  featureFlags: {
    customizableUI: false,
  },
};

const basicProps = {
  currentWidth: 330,
  opacity: 100,
  format: {
    bold: false,
    italic: false,
    underline: false,
  },
  handlePropertyChange: noop,
  handleTextFormatChange: noop,
  textEditProperties: {},
  handleColorChange: noop,
  rgbColor: {
    toHexString: () => {
      // eslint-disable-next-line custom/no-hex-colors
      return '#FF0000';
    }
  }
};

export const TextEditingPanelStoryWrapper = ({ children }) => {
  return (
    <Provider store={createStore(textEditingPanelInitialState)}>
      <Panel dataElement="textEditingPanel" location="right">
        {children}
      </Panel>
    </Provider>
  );
};

export const Basic = () => {
  return (
    <TextEditingPanelStoryWrapper>
      <div className="TextEditingPanel">
        <TextEditingPanel {...basicProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};

export const TextEditingUndoRedo = () => {
  const undoRedoProps = {
    currentWidth: 330,
    opacity: 100,
    format: {
      bold: false,
      italic: false,
      underline: false,
    },
    handlePropertyChange: noop,
    handleTextFormatChange: noop,
    textEditProperties: {},
    handleColorChange: noop,
    undoRedoProperties: {
      canUndo: true,
      canRedo: true
    },
    rgbColor: {
      toHexString: () => {
        // eslint-disable-next-line custom/no-hex-colors
        return '#FF0000';
      }
    }
  };

  return (
    <TextEditingPanelStoryWrapper>
      <div className="TextEditingPanel">
        <TextEditingPanel {...undoRedoProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};

const TextEditingPanelInApp = (context, dataElement, location) => {
  const { addonRtl } = context.globals;
  const appMockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: false,
      genericPanels: [
        {
          dataElement,
          render: 'textEditingPanel',
          location,
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        [dataElement]: true,
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'AnnotationCreateFreeText',
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = configureStore({ reducer: () => appMockState });
  setItemToFlyoutStore(store);

  return <MockApp initialState={appMockState} initialDirection={addonRtl}/>;
};

export const LeftSide = (args, context) => TextEditingPanelInApp(context, 'panel1', 'left');
LeftSide.parameters = { layout: 'fullscreen' };

export const TextEditingPanelInMobile = (args, context) => TextEditingPanelInApp(context, 'textEditingPanel', 'right');

TextEditingPanelInMobile.parameters = mobileStoryParameters;
