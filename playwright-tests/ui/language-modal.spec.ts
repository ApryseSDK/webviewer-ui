import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Language modal', () => {
  test('Language modal should change the display language properly with the mouse', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(5000);

    const languageButton = (await iframe.$$('[data-element="menuOverlay"] .ActionButton'))[4];
    await iframe.click('[data-element="menuButton"]');
    await languageButton.click();

    const languageModal = await iframe.$('[data-element="languageModal"] div');
    const frenchRadioButton = await languageModal.$('.body div:nth-child(5) input');
    await frenchRadioButton.click();
    await page.waitForTimeout(1000);
    expect(await languageModal.screenshot()).toMatchSnapshot(['language-modal', 'language-modal.png']);

    const applyButton = await languageModal.$('.modal-button');
    await applyButton.click();

    await page.waitForTimeout(2000);

    const viewButton = await iframe.$('[data-element="toolbarGroup-View"]');
    expect(await viewButton.evaluate((node) => node.textContent)).toMatch('Affichage');
  });

  test('Language modal should change the display language properly with the keyboard', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(5000);

    const languageButton = (await iframe.$$('[data-element="menuOverlay"] .ActionButton'))[4];
    await iframe.click('[data-element="menuButton"]');
    await languageButton.click();

    await page.waitForTimeout(1000);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);

    const viewButton = await iframe.$('[data-element="toolbarGroup-View"]');
    expect(await viewButton.evaluate((node) => node.textContent)).toMatch('Affichage');
  });
});
