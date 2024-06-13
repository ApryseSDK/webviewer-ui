import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import StatefulButtonComponent from './StatefulButton';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: [],
  }
};
function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <StatefulButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'ModularComponents/StatefulButton',
  component: StatefulButtonComponent,
  parameters: {
    customizableUI: true,
  },
};


export const StatefulButtonCounter = BasicComponent.bind({});
StatefulButtonCounter.args = {
  type: 'statefulButton',
  dataElement: 'countButton',
  initialState: 'Count',
  states: {
    Count: {
      number: 3,
      getContent: (activeState) => {
        return activeState.number;
      },
      onClick: (update, activeState) => {
        activeState.number += 1;
        update();
      }
    }
  },
  mount: () => {},
};

export const StatefulButtonStates = BasicComponent.bind({});
StatefulButtonStates.args = {
  type: 'statefulButton',
  dataElement: 'singlePageBtn',
  initialState: 'SinglePage',
  states: {
    SinglePage: {
      img: 'icon-header-page-manipulation-page-layout-single-page-line',
      onClick: (update) => {
        update('DoublePage');
      },
      title: 'Single Page',
    },
    DoublePage: {
      img: 'icon-header-page-manipulation-page-layout-double-page-line',
      onClick: (update) => {
        update('SinglePage');
      },
      title: 'Single Page',
    },
  },
  mount: () => {},
};
