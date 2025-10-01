import React from 'react';
import HeaderFooterControlsOverlay from './HeaderFooterControlsOverlay';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, waitFor, expect } from 'storybook/test';
import core from 'core';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

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

Basic.parameters = window.storybook.disableRtlMode;

Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentNode);

  const headerLabel = getTranslatedText('officeEditor.header.0');
  const sectionLabel = getTranslatedText('officeEditor.section');
  const optionsLabel = getTranslatedText('officeEditor.options');
  expect(await canvas.findByText(`${headerLabel} - ${sectionLabel} 1`)).toBeVisible();

  const optionsButton = canvas.getByRole('button', { name: `${headerLabel} - ${sectionLabel} 1 ${optionsLabel}` });

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

HeaderFooterBarPositionFallback.parameters = window.storybook.disableRtlMode;