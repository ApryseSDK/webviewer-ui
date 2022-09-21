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

  test('Should not scroll parent window if the display mode is not continuous and page height is greater than the container height', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/middle-of-the-page');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    const documentContainer = await iframe.$('[data-element=documentContainer]');

    const initialScrollY = await page.evaluate(() => window.scrollY);
    const initialDocumentContainerScrollY = await documentContainer.evaluate((element) => element.scrollTop);

    await instance('setZoomLevel', 1.8);

    await page.waitForTimeout(2000);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    await page.mouse.move(x + 100, y + 100);
    await page.mouse.wheel(0, 1000);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    const finalDocumentContainerScrollY = await documentContainer.evaluate((element) => element.scrollTop);

    expect(finalScrollY).toEqual(initialScrollY);
    expect(finalDocumentContainerScrollY).not.toEqual(initialDocumentContainerScrollY);
  });
});
