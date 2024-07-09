import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import core from 'core';
import OutlinesPanel from './OutlinesPanel';
import { getDefaultOutlines } from '../Outline/Outline.stories';
import '../LeftPanel/LeftPanel.scss';

export default {
  title: 'Components/OutlinesPanel',
  component: OutlinesPanel,
};

core.isFullPDFEnabled = () => true;

const basicMockState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    isOutlineEditingEnabled: true,
    pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  document: {
    outlines: getDefaultOutlines(),
  },
  featureFlags: {
    customizableUI: true,
  }
};

const OutlinePanelTemplate = (mockState) => {
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={createStore(mockState)}>
          <OutlinesPanel />
        </Provider>
      </div>
    </div>
  );
};

export const Editable = () => {
  const mockState = () => {
    return basicMockState;
  };

  return OutlinePanelTemplate(mockState);
};

export const NonEditable = () => {
  const mockState = () => {
    return {
      viewer: {
        ...basicMockState.viewer,
        isOutlineEditingEnabled: false,
      },
      document: {
        ...basicMockState.document,
      },
      featureFlags: {
        customizableUI: true,
      },
    };
  };

  return OutlinePanelTemplate(mockState);
};

export const Expanded = () => {
  const mockState = () => {
    return {
      viewer: {
        ...basicMockState.viewer,
        autoExpandOutlines: true,
      },
      document: {
        ...basicMockState.document,
      },
      featureFlags: {
        customizableUI: true,
      },
    };
  };

  return OutlinePanelTemplate(mockState);
};

export const NoOutlines = () => {
  const mockState = () => {
    return {
      viewer: {
        ...basicMockState.viewer,
      },
      document: {
        outlines: [],
      },
      featureFlags: {
        customizableUI: true,
      },
    };
  };

  return OutlinePanelTemplate(mockState);
};
