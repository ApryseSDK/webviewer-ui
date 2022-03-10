import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import Outline from './Outline';
import OutlineContext from './Context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function noop() { }

export default {
  title: 'Components/Outline',
  component: Outline,
  includeStories: ['Basic'],
  excludeStories: ['createOutlines', 'createOutline', 'getDefaultOutlines'],
};

// Export these helpers to be used by other stories, but don't render
// them as storybook components
export function createOutlines(plainOutlines) {
  // given outline objects which have only string key-value pairs
  // add getters for each key
  return plainOutlines.map((outline, i) => createOutline(outline, null, i));
}

export function createOutline(outline, parent, i) {
  const children = [];

  const copy = {
    name: outline.name,
    getName: () => outline.name,
    children: children,
    getChildren: () => children,
    index: i,
    getIndex: () => i,
    parent: parent,
    getParent: () => parent,
  };

  outline.children.forEach((child, i) => children.push(createOutline(child, copy, i)));

  return copy;
}

export function getDefaultOutlines() {
  return createOutlines([
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
}

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
