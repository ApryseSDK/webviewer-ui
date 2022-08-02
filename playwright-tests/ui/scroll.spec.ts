import { loadViewerSample } from '../../playwright-utils';
import { test, expect } from '@playwright/test';

test.describe('Scroll', () => {
  test('Should not scroll parent window if the display mode is not continuous', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/middle-of-the-page');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    const initialScrollY = await page.evaluate(() => window.scrollY);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    await page.mouse.move(x + 100, y + 100);
    await page.mouse.wheel(0, 100);

    const finalScrollY = await page.evaluate(() => window.scrollY);

    expect(finalScrollY).toEqual(initialScrollY);

    const currentPage = await instance('getCurrentPage');
    expect(currentPage).toEqual(2);
  });
});
