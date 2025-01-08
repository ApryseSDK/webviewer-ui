import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RightHeader from 'components/ModularComponents/RightHeader';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import {
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  mockModularComponents,
} from '../../Helpers/mockHeaders';
import { MockDocumentContainer , createTemplate } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/FloatingHeader/RightHeader',
  component: RightHeader,
};

const MockAppWrapperWithRightHeader = ({ modularHeaders }) => {
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
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: state,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <div className="content" style={{ overflow: 'inherit' }}>
        <MockDocumentContainer>{image}</MockDocumentContainer>
        <RightHeader />
      </div>
    </Provider>
  );
};

const Template = (args) => <MockAppWrapperWithRightHeader {...args} />;
Template.parameters = { chromatic: { disableSnapshot: true } };

const modularHeadersWithRightHeader = {
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
};
export const RightHeaderWithDefaultAndFloaties = createTemplate({ headers: modularHeadersWithRightHeader, components: mockModularComponents });

export const FloatRightStartHeader = Template.bind({});
FloatRightStartHeader.args = {
  modularHeaders: {
    floatStartRightHeader,
    secondFloatStartRightHeader,
  },
};

export const FloatRightCenterHeader = Template.bind({});
FloatRightCenterHeader.args = {
  modularHeaders: {
    floatCenterRightHeader,
  },
};

export const FloatRightEndHeader = Template.bind({});
FloatRightEndHeader.args = {
  modularHeaders: {
    floatEndRightHeader,
  },
};
