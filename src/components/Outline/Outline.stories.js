import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import Outline from './Outline';
import { createOutline } from '../Outline/Outline.spec';

export default {
  title: 'Components/Outline',
  component: Outline,
};

export function Basic() {
  const outline = createOutline({
    name: 'root',
    children: [
      {
        name: 'child',
        children: [
          {
            name: 'grandChild',
            children: [],
          },
        ],
      },
    ],
  });

  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 300 }}>
        <Outline outline={outline} />
      </div>
    </ReduxProvider>
  );
}
