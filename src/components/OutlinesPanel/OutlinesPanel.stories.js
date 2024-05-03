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

export const Editable = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        pageLabels: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
        ],
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={createStore(reducer)}>
          <OutlinesPanel />
        </Provider>
      </div>
    </div>
  );
};

export const NonEditable = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: false,
        pageLabels: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
        ],
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={createStore(reducer)}>
          <OutlinesPanel />
        </Provider>
      </div>
    </div>
  );
};

export const Expanded = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        autoExpandOutlines: true,
        pageLabels: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
        ],
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={createStore(reducer)}>
          <OutlinesPanel />
        </Provider>
      </div>
    </div>
  );
};

export const NoOutlines = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        pageLabels: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
        ],
      },
      document: {
        outlines: [],
      },
    };
  };

  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={createStore(reducer)}>
          <OutlinesPanel />
        </Provider>
      </div>
    </div>
  );
};
