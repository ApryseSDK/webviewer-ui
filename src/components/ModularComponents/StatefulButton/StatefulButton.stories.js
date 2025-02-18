import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import StatefulButtonComponent from './StatefulButton';
import { expect, within } from '@storybook/test';

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


export const StatefulButtonWithStyleAndClass = BasicComponent.bind({});
StatefulButtonWithStyleAndClass.args = {
  type: 'statefulButton',
  dataElement: 'clockwisePageBtn',
  initialState: 'Clockwise',
  states: {
    Clockwise: {
      img: 'icon-header-page-manipulation-page-rotation-clockwise-line',
      onClick: (update) => {
        update('CounterClockwise');
      },
      title: 'Clockwise',
    },
    CounterClockwise: {
      img: 'icon-header-page-manipulation-page-rotation-counterclockwise-line',
      onClick: (update) => {
        update('Clockwise');
      },
      title: 'CounterClockwise',
    },
  },
  mount: () => {},
  style: {
    background: 'pink',
    color: 'darkblue',
    border: '2px solid green',
  },
  className: 'custom-class',
};

StatefulButtonWithStyleAndClass.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: /Clockwise/i });
  expect(button.classList.contains('custom-class')).toBe(true);
};
