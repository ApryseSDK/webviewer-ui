import React from 'react';
import CreatableList from './CreatableListContainer';
import { createStore } from 'redux';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Provider } from "react-redux";

export default {
  title: 'Components/CreatableList',
  component: CreatableList,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const options = [
  {
    'displayValue': '',
    'value': '',
  },
  {
    'displayValue': 'AB',
    'value': 'AB',
  },
  {
    'displayValue': 'AK',
    'value': 'AK',
  },
  {
    'displayValue': 'AL',
    'value': 'AL',
  },
  {
    'displayValue': 'AR',
    'value': 'AR',
  },
  {
    'displayValue': 'AZ',
    'value': 'AZ',
  },
  {
    'displayValue': 'BC',
    'value': 'BC',
  },

];

const onOptionsUpdated = (options) => {
  console.log({ options })
}

const props = {
  options,
  onOptionsUpdated
};

export function Basic() {
  // Needs to be in div with id of app or the Tooltip causes an error
  // TODO: Ask Jussi how to fix this in storybook
  return (
    <div id='app'>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend} debugMode={true}>
          <CreatableList {...props} />
        </DndProvider>
      </Provider>
    </div>
  )
}