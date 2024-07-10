import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeftHeader from 'components/ModularComponents/LeftHeader';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import {
  defaultLeftHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  mockModularComponents
} from '../../Helpers/mockHeaders';

export default {
  title: 'ModularComponents/FloatingHeader/LeftHeader',
  component: LeftHeader,
  parameters: {
    customizableUI: true,
  },
};

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      Mock Document Container
      <img src="/assets/images/193_200x300.jpeg" />
    </div>
  );
};

const MockAppWrapperWithBottomHeader = ({ modularHeaders }) => {
  const state = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders,
      modularComponents: mockModularComponents,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = configureStore({
    preloadedState: state,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
  return (
    <Provider store={store}>
      <div className="content">
        <LeftHeader />
        <MockDocumentContainer />
      </div>
    </Provider>
  );
};

const Template = (args) => <MockAppWrapperWithBottomHeader {...args} />;
Template.parameters = { chromatic: { disableSnapshot: true } };

export const LeftHeaderWithDefaultAndFloaties = Template.bind({});
LeftHeaderWithDefaultAndFloaties.args = {
  modularHeaders: {
    defaultLeftHeader,
    secondFloatStartLeftHeader,
    floatStartLeftHeader,
    floatCenterLeftHeader,
    floatEndLeftHeader,
  },
};

export const FloatLeftStartHeader = Template.bind({});
FloatLeftStartHeader.args = {
  modularHeaders: {
    floatStartLeftHeader,
    secondFloatStartLeftHeader,
  },
};

export const FloatLeftCenterHeader = Template.bind({});
FloatLeftCenterHeader.args = {
  modularHeaders: {
    floatCenterLeftHeader,
  },
};

export const FloatLeftEndHeader = Template.bind({});
FloatLeftEndHeader.args = {
  modularHeaders: {
    floatEndLeftHeader,
  },
};