import React from 'react';
import { Provider } from 'react-redux';
import TextEditingPanel from './TextEditingPanel';
import RightPanel from 'components/RightPanel';
import initialState from 'src/redux/initialState';
import { MockApp, createStore } from 'helpers/storybookHelper';

const noop = () => { };

export default {
  title: 'Components/TextEditingPanel',
  component: TextEditingPanel,
  includeStories: ['Basic', 'TextEditingUndoRedo', 'LeftSide'],
  parameters: {
    customizableUI: true,
  }
};

const textEditingPanelInitialState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      header: true,
      textEditingPanel: true,
    },
    panelWidths: {
      textEditingPanel: 330,
    },
    lastPickedToolForGroupedItems: {
      'annotateGroupedItems': 'AnnotationCreateFreeText'
    },
    activeGroupedItems: ['annotateGroupedItems'],
    lastPickedToolAndGroup: {
      tool: 'AnnotationCreateFreeText',
      group: ['annotateGroupedItems'],
    },
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
      return '#FF0000';
    }
  }
};

export const TextEditingPanelStoryWrapper = ({ children }) => {
  return (
    <Provider store={createStore(textEditingPanelInitialState)}>
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
    rgbColor: {
      toHexString: () => {
        return '#FF0000';
      }
    }
  };

  return (
    <TextEditingPanelStoryWrapper>
      <div className="Panel TextEditingPanel" style={{ width: '330px', minWidth: '330px' }}>
        <TextEditingPanel {...undoRedoProps} />
      </div>
    </TextEditingPanelStoryWrapper>
  );
};


export const LeftSide = () => {
  const stateTextEditingPanelOnLeft = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isInDesktopOnlyMode: true,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'textEditingPanel',
          location: 'left',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': 'AnnotationCreateFreeText'
      },
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateFreeText',
        group: ['annotateGroupedItems', 'annotateToolsGroupedItems'],
      },
      activeToolName: 'AnnotationCreateFreeText'
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateTextEditingPanelOnLeft} />;
};
