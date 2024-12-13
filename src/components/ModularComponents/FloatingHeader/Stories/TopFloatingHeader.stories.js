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
import { MockDocumentContainer } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/FloatingHeader/TopHeader',
  component: TopHeader,
};

const MockAppWrapperWithTopheader = ({ modularHeaders }) => {
  const image = <img alt="Sample" src="/assets/images/193_200x300.jpeg" />;
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
        <MockDocumentContainer>{image}</MockDocumentContainer>
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
