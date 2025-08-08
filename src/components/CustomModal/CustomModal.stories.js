import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CustomModal from './CustomModal';
import { within, expect, waitFor } from 'storybook/test';
import App from 'components/App';
import { createTemplate } from 'helpers/storybookHelper';
import { mockCustomModal } from 'helpers/mockCustomModal';

const initialState = {
  viewer: {
    customModals: [mockCustomModal],
    openElements: { 'customModal': true },
    disabledElements: {},
  }
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
  const canvas = await within(canvasElement);
  window.instance.UI.addCustomModal(mockCustomModal);
  window.instance.UI.openElements(['customModal']);
  await waitFor(async () => {
    const customModal = await canvas.getByText('Custom Modal Test');
    await expect(customModal).toBeInTheDocument();
  });
};