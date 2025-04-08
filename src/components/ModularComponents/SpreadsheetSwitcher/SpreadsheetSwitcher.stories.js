import React, { useState } from 'react';
import SpreadsheetSwitcher from 'components/ModularComponents/SpreadsheetSwitcher/SpreadsheetSwitcher';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { within, expect, userEvent } from '@storybook/test';


const customViewports = {
  ViewOptionOne: {
    name: 'Custom View Port',
    styles: {
      width: '800px',
      height: '963px',
    },
  },
};

export default {
  title: 'SpreadsheetEditor/SpreadsheetSwitcher',
  component: SpreadsheetSwitcher,
  parameters: {
    viewport: {
      viewports: customViewports,
      defaultViewport: 'ViewOptionOne'
    }
  },
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    flyoutMap: {},
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
  }
};


export const Basic = () => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(6);
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SpreadsheetSwitcher tabs={[
          { name: 'Sheet 1', sheetIndex: 0 },
          { name: 'Sheet 2', sheetIndex: 1 },
          { name: 'Sheet 3', sheetIndex: 2 },
          { name: 'Sheet 4', sheetIndex: 3 },
          { name: 'Sheet 5', sheetIndex: 4 },
          { name: 'Sheet 6', sheetIndex: 5 },
          { name: 'Sheet 7', sheetIndex: 6 },

        ]}
        activeSheetIndex={activeSheetIndex}
        setActiveSheet ={(name, index) => {
          setActiveSheetIndex(index);
        }}
        />
      </div>
    </Provider>
  );
};

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const tabButton = canvas.getByRole('tab', { name: /Sheet 1/i });
  expect(tabButton).toBeInTheDocument();

  expect(canvas.getByRole('tab', { name: 'Sheet 2' })).toBeInTheDocument();
  const btn = canvas.getByRole('tab', { name: 'Sheet 2' });
  expect(btn).toHaveAttribute('aria-selected', 'false');
  await userEvent.click(btn);
  expect(btn).toHaveAttribute('aria-selected', 'true');


  const btn3 = canvas.getByRole('tab', { name: 'Sheet 3' });
  expect(btn3).toBeInTheDocument();
  expect(btn3).toHaveAttribute('aria-selected', 'false');
  await btn3.click(btn);
  expect(btn3).toHaveAttribute('aria-selected', 'true');
};