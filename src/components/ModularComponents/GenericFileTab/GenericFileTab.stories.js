import React from 'react';
import GenericFileTab from './GenericFileTab';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userEvent, within, waitFor, expect } from '@storybook/test';

export default {
  title: 'ModularComponents/GenericFileTab',
  component: GenericFileTab,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    flyoutMap: {},
    modularComponents: {
      'generic-file-tab': {
        dataElement: 'generic-file-tab',
        headerDirection: 'row',
        headerPlacement: 'bottom',
        justifyContent: 'start',
        title: 'component.menuOverlay',
        type: 'genericFileTab',
      }
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};


export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <GenericFileTab />
      </div>
    </Provider>
  );
};

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => {
    const tabButton = canvas.getByRole('tab', { name: /Sheet 1/i });
    expect(tabButton).toBeInTheDocument();
  });
  expect(canvas.getByRole('tab', { name: 'Sheet 2' })).toBeInTheDocument();
  const btn = canvas.getByRole('tab', { name: 'Sheet 2' });
  await userEvent.click(btn);
  await userEvent.dblClick(btn);

  const btn3 = canvas.getByRole('tab', { name: 'Sheet 3' });
  expect(btn3).toBeInTheDocument();

  const addSheetBtn = canvas.getByRole('button', { name: 'Add Sheet' });
  expect(addSheetBtn).toBeInTheDocument();
  // Add multiple sheets so that "Show More" button show up
  await addSheetBtn.click(btn);
  await addSheetBtn.click(btn);
  await addSheetBtn.click(btn);
  await addSheetBtn.click(btn);

  const moreBtn = canvas.getByRole('button', { name: 'Show More' });
  expect(moreBtn).toBeInTheDocument();
};