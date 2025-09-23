import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents, uiWithCustomElements, uiWithCustomElementsFunctions, uiWithCustomStyleAndClass } from './mockAppState';
import { within, expect, userEvent, waitFor } from 'storybook/test';
import { createTemplate } from 'helpers/storybookHelper';
import { uiWithPanelsInFlyout } from '../storyModularUIConfigs';

export default {
  title: 'ModularComponents/App/Import',
  component: App,
};

export const ImportCustomComponents = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

ImportCustomComponents.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  window.instance.UI.importModularComponents(uiWithCustomElements, uiWithCustomElementsFunctions);

  const customElement = canvas.getByText(/Test Args/i);

  await expect(customElement).toBeInTheDocument();

  const customPanelToggleButton = canvas.getByRole('button', { name: /Test Panel/i });

  await userEvent.click(customPanelToggleButton);

  const customPanel = await document.querySelector('.customPanel');

  await expect(customPanel).toBeVisible();

  const components = window.instance.UI.exportModularComponents();

  await expect(components).toEqual(uiWithCustomElements);
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
  await expect(exportedConfig).toEqual(uiWithCustomStyleAndClass);
};

export const ImportingConfigWithPanelsInFlyout = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

const checkFlyoutCanBeOpened = async (canvas, buttonSelector, expectedFlyoutItem) => {
  const button = canvas.getByRole('button', { name: buttonSelector });
  expect(button).toBeInTheDocument();
  await userEvent.click(button);
  await waitFor(() => {
    const flyout = document.querySelector(`[data-element="${expectedFlyoutItem}"]`);
    expect(flyout).toBeInTheDocument();
  });
};

ImportingConfigWithPanelsInFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const functionMap = {
    'otherItemClick': () => console.log('Other item clicked!'),
  };

  window.instance.UI.importModularComponents(uiWithPanelsInFlyout, functionMap);


  await checkFlyoutCanBeOpened(canvas, 'Style', 'stylePanelFlyout');

  const submenuItem = await canvas.findByRole('button', { name: /Other Item/i });
  await waitFor(() => {
    expect(submenuItem).toBeInTheDocument();
  });
  await submenuItem.click();

  await waitFor(() => {
    const submenuStylePanel = document.querySelector('[data-element="submenuItem"]');
    expect(submenuStylePanel).toBeInTheDocument();
  });

  await checkFlyoutCanBeOpened(canvas, 'Rubber Stamp', 'rubberStampFlyout');
  await checkFlyoutCanBeOpened(canvas, 'Signature', 'signatureListFlyout');

  const exportedConfig = window.instance.UI.exportModularComponents();
  expect(exportedConfig).toEqual(uiWithPanelsInFlyout);
};