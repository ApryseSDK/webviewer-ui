import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import Outline from './Outline';
import { createOutline, getDefaultOutlines } from '../Outline/Outline.spec';
import OutlineContext from './Context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function noop() { }

export function Basic() {
  function reducer(state) {
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

  const moveOutlineInward = () => { };

  const moveOutlineBeforeTarget = () => { };

  const moveOutlineAfterTarget = () => { };

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
          <DndProvider backend={HTML5Backend}>
            <Outline
              outline={outline}
              moveOutlineInward={moveOutlineInward}
              moveOutlineBeforeTarget={moveOutlineBeforeTarget}
              moveOutlineAfterTarget={moveOutlineAfterTarget}
            />
          </DndProvider>
        </OutlineContext.Provider>
      </div>
    </ReduxProvider>
  );
}
