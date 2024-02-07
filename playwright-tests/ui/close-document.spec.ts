import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Close document', () => {
  test('Should be able to close the current document', async ({ page }) => {
    const { waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(2000);

    await instance('closeDocument');

    await page.waitForTimeout(2000);

    expect(await instance('getPageCount')).toBe(0);
  });
});
