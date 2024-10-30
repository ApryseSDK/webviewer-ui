import React from 'react';
import Tooltip from './Tooltip';
import { createStore, waitForTimeout } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import hotkeysManager, { getCloseToolTipFunc } from 'helpers/hotkeysManager';
import { within, userEvent, expect } from '@storybook/test';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

const store = createStore(initialState);
hotkeysManager.initialize(store);

const createTooltip = () => {
  function RenderedTooltip() {
    return (
      <Provider store={store}>
        <Tooltip content="This is a tooltip">
          <button style={{ width: '50px', height: '50px' }}>Hover Me!</button>
        </Tooltip>
      </Provider>
    );
  }

  return RenderedTooltip;
};

export const Basic = createTooltip();

export const DismissWithHotkey = createTooltip();
DismissWithHotkey.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await waitForTimeout(1000);
  await expect(await body.findByText('This is a tooltip')).not.toBeNull();
  // Hotkey is not picked up correctly by storybook, so we need to manually call the function
  getCloseToolTipFunc()?.();
  await expect(await document.body.querySelector('.tooltip__content')).toBeNull();
};

export const DismissWithBlur = createTooltip();
DismissWithBlur.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await waitForTimeout(1000);
  await userEvent.unhover(button);
  await expect(await document.body.querySelector('.tooltip__content')).toBeNull();
};

export const StayVisibleOnTooltipHover = createTooltip();
StayVisibleOnTooltipHover.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  const button = await canvas.findByText('Hover Me!');
  await userEvent.hover(button);
  await waitForTimeout(1000);
  await userEvent.hover(await body.findByText('This is a tooltip'));
  await expect(await body.findByText('This is a tooltip')).not.toBeNull();
};