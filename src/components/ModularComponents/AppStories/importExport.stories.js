import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents, uiWithCustomElements, uiWithCustomElementsFunctions, uiWithCustomStyleAndClass } from './mockAppState';
import { within, expect } from '@storybook/test';
import { createTemplate } from 'helpers/storybookHelper';
import userEvent from '@testing-library/user-event';

export default {
  title: 'ModularComponents/App/Import',
  component: App,
};

export const ImportCustomComponents = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

ImportCustomComponents.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  window.instance.UI.importModularComponents(uiWithCustomElements, uiWithCustomElementsFunctions);

  const customElement = canvas.getByText(/Test Args/i);

  expect(customElement).toBeInTheDocument();

  const customPanelToggleButton = canvas.getByRole('button', { name: /Test Panel/i });

  await userEvent.click(customPanelToggleButton);

  const customPanel = await document.querySelector('.customPanel');

  expect(customPanel).toBeVisible();

  const components = window.instance.UI.exportModularComponents();

  expect(components).toEqual(uiWithCustomElements);
};

export const ImportingWithCustomStyleAndClassName = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

ImportingWithCustomStyleAndClassName.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  window.instance.UI.importModularComponents(uiWithCustomStyleAndClass);

  const leftPanelToggleButton = canvas.getByRole('button', { name: /Left Panel/i });
  await expect(leftPanelToggleButton.style.borderRadius).toBe('8px');

  const panToolButton = await canvas.getAllByRole('button', { name: /Pan/i })[1];
  await expect(panToolButton.classList.contains('my-new-class-for-tools')).toBe(true);

  const annotateRibbon = canvas.getByRole('button', { name: /Annotate/i });
  await expect(annotateRibbon.classList.contains('annotate-ribbon')).toBe(true);
  await expect(annotateRibbon.style.border).toBe('2px dotted blue');

  const exportedConfig = window.instance.UI.exportModularComponents();
  expect(exportedConfig).toEqual(uiWithCustomStyleAndClass);
};
