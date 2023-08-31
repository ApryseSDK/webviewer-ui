import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TextEditingPanel from './TextEditingPanel';
import RightPanel from 'components/RightPanel';
import core from 'core';

const noop = () => { };

export default {
  title: 'Components/TextEditingPanel',
  component: TextEditingPanel,
  includeStories: ['Basic', 'TextEditingUndoRedo'],
};

core.getContentEditManager = () => ({
  isInContentEditMode: () => true,
});

const initialState = {
  viewer: {
    isInDesktopOnlyMode: true,
    disabledElements: {
      logoBar: { disabled: true },
    },
    customElementOverrides: {},
    openElements: {
      header: true,
      textEditingPanel: true,
    },
    currentLanguage: 'en',
    panelWidths: {
      textEditingPanel: 330,
    },
    modularHeaders: [],
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
  },
  featureFlags: {
    customizableUI: false,
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

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
};

export const TextEditingPanelStoryWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <RightPanel dataElement="textEditingPanel" onResize={noop}>
        {children}
      </RightPanel>
    </Provider>
  );
};

export const Basic = () => {
  return (
    <TextEditingPanelStoryWrapper>
      <div className="Panel TextEditingPanel" style={{ width: '330px', minWidth: '330px' }}>
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
  };

  return (
    <TextEditingPanelStoryWrapper>
      <div className="Panel TextEditingPanel" style={{ width: '330px', minWidth: '330px' }}>
        <TextEditingPanel {...undoRedoProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};
