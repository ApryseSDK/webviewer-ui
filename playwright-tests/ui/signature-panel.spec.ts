import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Signature Panel', () => {
  test('should show the same time zone for both signing and verification', async ({ page }) => {
    const { iframe } = await loadViewerSample(
      page,
      'full-apis/ViewerDigitalSignatureValidationTest/'
    );

    await page.waitForTimeout(10000);

    const areTimeZonesTheSame = await iframe?.evaluate(() => {
      const signTimeZone = document.querySelector('.SignaturePanel .title p')?.innerText.split(' ').at(-1);
      const verifyTimeZone = document.querySelector('.SignaturePanel .trust-verification-result')?.children[1].innerText.split(' ').at(-1);
      return signTimeZone === verifyTimeZone;
    });

    expect(areTimeZonesTheSame).toBeTruthy();
  });
});