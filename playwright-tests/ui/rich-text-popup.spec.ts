import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Rich text popup', () => {
  test('Should be enabled by default', async ({ page }) => {
    const { waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    const isDisabled = await instance('isElementDisabled', 'richTextPopup');
    expect(isDisabled).toBe(false);
  });
});