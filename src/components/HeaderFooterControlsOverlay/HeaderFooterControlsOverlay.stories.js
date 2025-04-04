import React from 'react';
import HeaderFooterControlsOverlay from './HeaderFooterControlsOverlay';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, waitFor, expect } from '@storybook/test';

export default {
  title: 'Components/HeaderFooterControlsOverlay',
  component: HeaderFooterControlsOverlay,
};

const initialState = {
  viewer: {
    openElements: {},
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

export function Basic() {
  return (
    <Provider store={store}>
      <HeaderFooterControlsOverlay visiblePages={[1]} isHeaderControlsActive={true} isFooterControlsActive={true} />
    </Provider>
  );
}

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentNode);

  await waitFor(() => {
    expect(canvas.getByText('Header')).toBeVisible();
  });

  const optionsButton = await canvas.getByRole('button', { name: 'Header Options' });

  expect(optionsButton).toBeInTheDocument();
  await userEvent.click(optionsButton);

  await waitFor(() => {
    expect(optionsButton.getAttribute('aria-expanded')).toBe('true');
  });
};

