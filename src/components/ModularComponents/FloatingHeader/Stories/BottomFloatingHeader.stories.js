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
  floatCenterTopHeaderDynamic,
} from '../../Helpers/mockHeaders';
import { MockDocumentContainer } from 'helpers/storybookHelper';
import { expect } from '@storybook/test';

export default {
  title: 'ModularComponents/FloatingHeader/BottomHeader',
  component: BottomHeader,
  parameters: {
    customizableUI: true,
  }
};

const image = <img alt="Sample" src="/assets/images/193_200x300.jpeg" />;

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
        <MockDocumentContainer>{image}</MockDocumentContainer>
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
floatCenterTopHeaderDynamic.placement = 'bottom';
FloatBottomCenterHeader.args = {
  modularHeaders: {
    floatCenterBottomHeader,
    floatCenterTopHeaderDynamic,
  },
};

FloatBottomCenterHeader.play = async ()  => {
  const textInput = await document.querySelector('.opacity-mode-dynamic');
  expect(textInput).toBeInTheDocument();

  const btn = await document.querySelector('.opacity-mode-dynamic [data-element="button1"]');
  expect(btn).toBeInTheDocument();
  btn.focus();
};


export const FloatBottomEndHeader = Template.bind({});
FloatBottomEndHeader.args = {
  modularHeaders: {
    floatEndBottomHeader,
  },
};
