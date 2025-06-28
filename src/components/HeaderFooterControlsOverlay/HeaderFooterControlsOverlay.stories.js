import React from 'react';
import HeaderFooterControlsOverlay from './HeaderFooterControlsOverlay';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, waitFor, expect } from '@storybook/test';
import core from 'core';

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
    expect(canvas.getByText('Header - Section 1')).toBeVisible();
  });

  const optionsButton = canvas.getByRole('button', { name: 'Header - Section 1 Options' });

  expect(optionsButton).toBeInTheDocument();
  await userEvent.click(optionsButton);

  await waitFor(() => {
    expect(optionsButton.getAttribute('aria-expanded')).toBe('true');
  });
};

export function HeaderFooterBarPositionFallback() {
  core.getDocument().getOfficeEditor().getHeaderPosition = () => 0;
  core.getDocument().getOfficeEditor().getFooterPosition = () => 0;

  return (
    <Provider store={store}>
      <HeaderFooterControlsOverlay visiblePages={[1]} isHeaderControlsActive={true} isFooterControlsActive={true} />
    </Provider>
  );
}