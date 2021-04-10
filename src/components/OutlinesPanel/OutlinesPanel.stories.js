import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import OutlinesPanel from './OutlinesPanel';
import { getDefaultOutlines } from '../Outline/Outline.spec';

export function Basic() {
  function reducer() {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  }

  return (
    <ReduxProvider store={createStore(reducer)}>
      <div style={{ width: 300 }}>
        <OutlinesPanel />
      </div>
    </ReduxProvider>
  );
}

export function NoOutlines() {
  function reducer() {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
      },
      document: {
        outlines: [],
      },
    };
  }

  return (
    <ReduxProvider store={createStore(reducer)}>
      <div style={{ width: 300 }}>
        <OutlinesPanel />
      </div>
    </ReduxProvider>
  );
}
