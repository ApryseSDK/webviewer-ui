import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Save Modal Tests', () => {
  test('Save Modal should close on document unload', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    await page.waitForTimeout(3000);

    await iframe.evaluate(async () => {
      const { UI, Core } = window.instance;
      UI.openElement('saveModal');
    });
    await page.waitForTimeout(2000);
    await iframe.evaluate(async () => {
      const { Core } = window.instance;
      await Core.documentViewer.closeDocument();
    });
    await page.waitForTimeout(2000);

    const isModalOpen = await iframe.evaluate(async () => {
      const { UI } = window.instance;
      return UI.isElementOpen('saveModal');
    });

    expect(isModalOpen).toBe(false);
  });
});
