import React from 'react';
import Tooltip from './Tooltip';
import { createStore, waitForTimeout } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import hotkeysManager, { getCloseToolTipFunc } from 'helpers/hotkeysManager';
import { within, userEvent, expect } from 'storybook/test';
import withI18n from '../../../jest/withI18n';
import i18next from 'i18next';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

const store = createStore(initialState);
hotkeysManager.initialize(store);

const createTooltip = (title = 'This is a tooltip') => {
  function RenderedTooltip() {
    return (
      <Provider store={store}>
        <Tooltip content={title}>
          <button style={{ width: '50px', height: '50px' }}>Hover Me!</button>
        </Tooltip>
      </Provider>
    );
  }

  return RenderedTooltip;
};

export const Basic = createTooltip();

Basic.parameters = window.storybook.disableRtlMode;

export const DismissWithHotkey = createTooltip();
DismissWithHotkey.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await expect(await body.findByText('This is a tooltip')).not.toBeNull();
  // Hotkey is not picked up correctly by storybook, so we need to manually call the function
  getCloseToolTipFunc()?.();
  await expect(await document.body.querySelector('.tooltip__content')).toBeNull();
};

DismissWithHotkey.parameters = window.storybook.disableRtlMode;

export const DismissWithBlur = createTooltip();
DismissWithBlur.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await waitForTimeout(1000);
  await userEvent.unhover(button);
  await expect(await document.body.querySelector('.tooltip__content')).toBeNull();
};

DismissWithBlur.parameters = window.storybook.disableRtlMode;

export const StayVisibleOnTooltipHover = createTooltip();
StayVisibleOnTooltipHover.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await userEvent.hover(await body.findByText('This is a tooltip'));
  await expect(await body.findByText('This is a tooltip')).not.toBeNull();
};

StayVisibleOnTooltipHover.parameters = window.storybook.disableRtlMode;

export const UrduTooltip = withI18n(createTooltip('annotation.signature'));
UrduTooltip.play = async ({ canvasElement }) => {
  await i18next.changeLanguage('ur');
  const canvas = within(canvasElement);
  const body = within(document.body);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await expect(await body.findByText(i18next.t('annotation.signature'))).not.toBeNull();
  await expect(await body.findByText('(S)')).not.toBeNull();
};
UrduTooltip.parameters = window.storybook.disableRtlMode;