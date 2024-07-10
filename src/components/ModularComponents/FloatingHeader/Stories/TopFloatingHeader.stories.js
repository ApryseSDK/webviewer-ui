import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TopHeader from 'components/ModularComponents/TopHeader';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import {
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
  mockModularComponents,
} from '../../Helpers/mockHeaders';

export default {
  title: 'ModularComponents/FloatingHeader/TopHeader',
  component: TopHeader,
  parameters: {
    customizableUI: true,
  }
};

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <img src="/assets/images/193_200x300.jpeg" />
      Mock Document Container
    </div>
  );
};

const MockAppWrapperWithTopheader = ({ modularHeaders }) => {
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
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <TopHeader />
        <MockDocumentContainer />
      </div>
    </Provider>
  );
};

const Template = (args) => <MockAppWrapperWithTopheader {...args} />;
Template.parameters = { chromatic: { disableSnapshot: true } };

export const TopHeaderWithDefaultAndFloaties = Template.bind({});
TopHeaderWithDefaultAndFloaties.args = {
  modularHeaders: {
    defaultTopHeader,
    floatStartHeader,
    secondFloatStartHeader,
    floatCenterHeader,
    floatEndHeader,
  },
};

export const FloatTopStartHeader = Template.bind({});
FloatTopStartHeader.args = {
  modularHeaders: {
    floatStartHeader,
    secondFloatStartHeader,
  },
};

export const FloatTopCenterHeader = Template.bind({});
FloatTopCenterHeader.args = {
  modularHeaders: {
    floatCenterHeader,
  },
};

export const FloatTopEndHeader = Template.bind({});
FloatTopEndHeader.args = {
  modularHeaders: {
    floatEndHeader,
  },
};
