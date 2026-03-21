import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { default as mockAppState } from 'src/redux/initialState';
import CustomModal from './CustomModal';
import { within, expect } from 'storybook/test';
import App from 'components/App';
import { createTemplate, MockApp } from 'helpers/storybookHelper';
import { mockCustomModal } from 'helpers/mockCustomModal';
import { configureStore } from '@reduxjs/toolkit';
import { disableRtlModeParameters } from 'helpers/storybookParams';

const initialState = {
  viewer: {
    customModals: [mockCustomModal],
    openElements: { 'customModal': true },
    disabledElements: {},
  }
};

const customAppState = {
  ...mockAppState,
  viewer: {
    ...mockAppState.viewer,
    selectedScale: undefined,
  },
  featureFlags: {
    customizableUI: true,
  },
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

export default {
  title: 'Components/CustomModal',
  component: [CustomModal, App],
  decorators: [(Story) => <Provider store={store}><Story /></Provider>],
};

const Template = () => {
  return (
    <CustomModal />
  );
};

export const CustomModalUI = Template.bind({});
CustomModalUI.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement);
  await expect(canvas.getByText('Custom Modal Test')).toBeInTheDocument();
  await expect(canvas.getByText('Sub Header Title')).toBeInTheDocument();
  await expect(canvas.getByText('Custom Modal Body Test')).toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
};

export const CustomModalWithAPI = createTemplate({ headers: {}, components: {} });
CustomModalWithAPI.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  window.instance.UI.addCustomModal(mockCustomModal);
  window.instance.UI.openElements(['customModal']);
  const customModal = await canvas.findByText('Custom Modal Test');
  expect(customModal).toBeInTheDocument();
};

CustomModalWithAPI.parameters = {
  layout: 'fullscreen',
  ...disableRtlModeParameters,
};

export function CustomModalViewOnly() {
  const viewOnlyStore = configureStore({
    reducer: () => customAppState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
  return <MockApp initialState={customAppState} store={viewOnlyStore}/>;
}

CustomModalViewOnly.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await window.instance.UI.addCustomModal(mockCustomModal);

  const viewOnlyWhitelist = await window.instance.UI.getViewOnlyWhitelist();
  await expect(viewOnlyWhitelist.length).toBe(1);
  await expect(viewOnlyWhitelist[0]).toBe(mockCustomModal.dataElement);

  await window.instance.UI.openElements(['customModal']);
  const customModalInitial = await canvas.findByText('Custom Modal Test');
  await expect(customModalInitial).toBeVisible();

  await window.instance.UI.enableViewOnlyMode();

  await window.instance.UI.openElements(['customModal']);
  const customModalViewOnly = await canvas.findByText('Custom Modal Test');
  await expect(customModalViewOnly).toBeVisible();

  await window.instance.UI.disableViewOnlyMode();

  await window.instance.UI.openElements(['customModal']);
  const customModalNoViewOnly = await canvas.findByText('Custom Modal Test');
  await expect(customModalNoViewOnly).toBeVisible();
};

CustomModalViewOnly.parameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};
