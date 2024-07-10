import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BottomHeader from 'components/ModularComponents/BottomHeader';
import initialState from 'src/redux/initialState';
import {
  defaultBottomHeader,
  secondFloatStartBottomHeader,
  floatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
  mockModularComponents,
} from '../../Helpers/mockHeaders';

export default {
  title: 'ModularComponents/FloatingHeader/BottomHeader',
  component: BottomHeader,
  parameters: {
    customizableUI: true,
  }
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
  return (
    <Provider store={configureStore({
      reducer: () => state,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <MockDocumentContainer />
        <BottomHeader />
      </div>
    </Provider>
  );
};

const Template = (args) => <MockAppWrapperWithBottomHeader {...args} />;
Template.parameters = { chromatic: { disableSnapshot: true } };

export const BottomHeaderWithDefaultAndFloaties = Template.bind({});
BottomHeaderWithDefaultAndFloaties.args = {
  modularHeaders: {
    defaultBottomHeader,
    secondFloatStartBottomHeader,
    floatStartBottomHeader,
    floatCenterBottomHeader,
    floatEndBottomHeader,
  },
};

export const FloatBottomStartHeader = Template.bind({});
FloatBottomStartHeader.args = {
  modularHeaders: {
    floatStartBottomHeader,
    secondFloatStartBottomHeader,
  },
};

export const FloatBottomCenterHeader = Template.bind({});
FloatBottomCenterHeader.args = {
  modularHeaders: {
    floatCenterBottomHeader,
  },
};

export const FloatBottomEndHeader = Template.bind({});
FloatBottomEndHeader.args = {
  modularHeaders: {
    floatEndBottomHeader,
  },
};
