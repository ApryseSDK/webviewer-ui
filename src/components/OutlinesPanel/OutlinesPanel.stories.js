import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import OutlinesPanel from './OutlinesPanel';
import { createOutlines } from '../Outline/Outline.spec';

export default {
  title: 'Components/OutlinesPanel',
  component: OutlinesPanel,
};

export function Basic() {
  const outlines = createOutlines([
    {
      name: 'Introduction',
      children: [
        {
          name: 'Overview',
          children: [
            {
              name: 'Why WebViewer?',
              children: [],
            },
            {
              name: 'Supported File Formats',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Pick the right SDK',
      children: [],
    },
  ]);

  function reducer() {
    return {
      viewer: {
        disabledElements: {},
      },
      document: {
        outlines: outlines,
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