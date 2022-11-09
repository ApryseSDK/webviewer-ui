import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Insert Page Modal', () => {
  test('Insert blank page panel', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(
      page,
      'viewing/viewing'
    );
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElement', 'leftPanel');
    await page.waitForTimeout(3000);

    await iframe.click('[data-element=pageManipulationOverlayButton]');

    await iframe.click('[data-element=insertPage]');

    const insertBlankPagePanel = await iframe?.$('.insert-blank-page-panel');

    expect(await insertBlankPagePanel?.screenshot()).toMatchSnapshot([
      'insert-page-modal',
      'opening-insert-blank-page-panel.png',
    ]);

    const container = await iframe.$('.DocumentContainer');

    await iframe?.click('.insertPageModalConfirmButton');

    await page.waitForTimeout(3000);

    expect(await container.screenshot()).toMatchSnapshot([
      'insert-page-modal',
      'default-add-blank-page.png'
    ]);

    await instance('openElement', 'insertPageModal');

    await iframe?.evaluate(() => {
      const placementButtons = document.getElementsByName('PAGE_PLACEMENT');
      placementButtons[1].click();
    });

    await iframe.click('.page-number-input', { clickCount: 2 });
    await page.keyboard.type('2');

    await iframe.click('.increment-arrow-button');

    await iframe.click('.presetSelector');

    const selectorOptions = await iframe.$$('.options');
    await selectorOptions[2].click();

    await iframe?.click('.insertPageModalConfirmButton');

    await page.waitForTimeout(3000);

    const thumbnailPanel = await iframe.$('.LeftPanel');
    expect(await thumbnailPanel.screenshot()).toMatchSnapshot(['insert-page-modal', 'thubmnail-panel.png']);

    await page.waitForTimeout(3000);

    await instance('openElement', 'insertPageModal');

    await iframe?.evaluate(() => {
      const placementButtons = document.getElementsByName('PAGE_PLACEMENT');
      placementButtons[0].click();
    });

    await iframe.click('.page-number-input', { clickCount: 2 });
    await page.keyboard.type('1,3');
    await iframe.click('.increment-arrow-button');

    const presetSelector = await iframe?.$('.presetSelector');
    await presetSelector.click();

    const presetSelectorOptions = await presetSelector.$$('.options');
    await presetSelectorOptions.at(-1)?.click();

    const unitSelector = await iframe?.$('.unitSelector');
    await unitSelector.click();

    const unitOptions = await unitSelector.$$('.options');
    await unitOptions[1].click();

    await iframe.click('.customWidthInput', { clickCount: 1 });
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('10');

    await iframe.click('.customHeightInput', { clickCount: 1 });
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('10');

    await iframe?.click('.insertPageModalConfirmButton');

    await page.waitForTimeout(3000);

    await instance('setZoomLevel', '25%');

    await page.waitForTimeout(3000);

    const container2 = await iframe.$('.DocumentContainer');

    expect(await container2.screenshot()).toMatchSnapshot([
      'insert-page-modal',
      'custom-add-blank-page.png'
    ]);
  });
});