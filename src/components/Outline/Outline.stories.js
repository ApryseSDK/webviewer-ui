import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import Outline from './Outline';
import OutlineContext from './Context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import '../LeftPanel/LeftPanel.scss';

const NOOP = () => { };

export default {
  title: 'Components/Outline',
  component: Outline,
  includeStories: ['Basic'],
  excludeStories: ['createOutlines', 'createOutline', 'getDefaultOutlines'],
};

// Export these helpers to be used by other stories, but don't render
// them as storybook components
export const createOutlines = (plainOutlines) => {
  // given outline objects which have only string key-value pairs
  // add getters for each key
  return plainOutlines.map((outline, i) => createOutline(outline, null, i));
};

export const createOutline = (outline, parent, i) => {
  const children = [];

  const copy = {
    name: outline.name,
    getName: () => outline.name,
    children,
    getChildren: () => children,
    index: i,
    getIndex: () => i,
    parent,
    getParent: () => parent,
  };

  outline.children.forEach((child, i) => children.push(createOutline(child, copy, i)));

  return copy;
};

export const getDefaultOutlines = () => {
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
};

const reducer = () => {
  return {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      autoExpandOutlines: true,
    },
    document: {
      outlines: getDefaultOutlines(),
    },
  };
};

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

export const Basic = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <OutlineContext.Provider
            value={{
              setActiveOutlinePath: NOOP,
              activeOutlinePath: '',
              isOutlineActive: NOOP,
              setAddingNewOutline: NOOP,
              setEditingOutlines: NOOP,
              selectedOutlines: [],
            }}
          >
            <DndProvider backend={HTML5Backend}>
              <Outline
                outline={outline}
                setMultiSelected={NOOP}
                moveOutlineInward={NOOP}
                moveOutlineBeforeTarget={NOOP}
                moveOutlineAfterTarget={NOOP}
              />
            </DndProvider>
          </OutlineContext.Provider>
        </div>
      </div>
    </ReduxProvider>
  );
};
