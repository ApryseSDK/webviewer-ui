import React from 'react';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import StatefulButtonComponent from './StatefulButton';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: [],
  }
};
function rootReducer(state = initialState, action) {
  return state;
};

const store = createStore(rootReducer);

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <StatefulButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/Buttons/StatefulButton',
  component: StatefulButtonComponent,
};


export const StatefulButtonCounter = BasicComponent.bind({});
StatefulButtonCounter.args = {
  initialState: 'Count',
  states: {
    Count: {
      number: 1,
      getContent: activeState => {
        return activeState.number;
      },
      onClick: (update, activeState) => {
        activeState.number += 1;
        update();
      }
    }
  },
  dataElement: 'countButton',
  mount: () => {},
};

export const StatefulButtonStates = BasicComponent.bind({});
StatefulButtonStates.args = {
  type: 'statefulButton',
  initialState: 'SinglePage',
  states: {
    SinglePage: {
      img: `icon-header-page-manipulation-page-layout-single-page-line`,
      onClick: (update) => {
        update('DoublePage');
      },
      title: 'Single Page',
    },
    DoublePage: {
      img: `icon-header-page-manipulation-page-layout-double-page-line`,
      onClick: (update) => {
        update('SinglePage');
      },
      title: 'Single Page',
    },
  },
  mount: () => {},
};;

