import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import Outline from './Outline';
import { createOutline } from '../Outline/Outline.spec';
import OutlineContext from './Context';

function noop() {}

export function Basic() {
  function reducer(state) {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
      },
    };
  }

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
    <ReduxProvider store={createStore(reducer)}>
      <div style={{ width: 300 }}>
        <OutlineContext.Provider
          value={{
            setSelectedOutlinePath: noop,
            selectedOutlinePath: '',
            isOutlineSelected: noop,
          }}
        >
          <Outline outline={outline} />
        </OutlineContext.Provider>
      </div>
    </ReduxProvider>
  );
}
