import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Disable elements', () => {
  test('Should be able to disable the element header', async ({ page }) => {
    const { consoleLogs, waitForInstance } = await loadViewerSample(page, 'viewing/header-disabled');
    await waitForInstance();
    await page.waitForTimeout(5000);

    const errorMessage = consoleLogs.filter((log: string) => {
      return log.length > 0 && log.includes('Cannot read properties of null (reading \'style\')');
    });

    expect(errorMessage.length).toBe(0);
  });
});
