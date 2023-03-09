import { loadViewerSample } from '../../playwright-utils';
import { test } from '@playwright/test';

test.describe('webviewer.js', () => {
  test('should be able to access instance immediately from config file', async ({ page }) => {
    const { waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-config-file');

    await waitForInstance();

    // no error should be thrown when running sample with config file
  });

  test('should be able to access DOM right after WebViewer promise resolves', async ({ page }) => {
    const { waitForInstance } = await loadViewerSample(page, 'viewing/dom-access');

    await waitForInstance();

    await page.waitForTimeout(3000);

    // no error should be thrown after running code inside this sample
  });

  test('should not freeze when calling dispose and recreating instance', async ({ page }) => {
    const { waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/blank');

    await waitForInstance();
    await waitForWVEvents(['pageComplete']);

    await page.evaluate(() => {
      return window.instance.UI.dispose().then(() => {
        const iframeElement = window.instance.UI.iframeWindow.frameElement;
        iframeElement.parentNode.removeChild(iframeElement);
        return WebViewer({
          path: '../../../lib',
          initialDoc: `/test-files/blank.pdf`,
        }, document.getElementById('viewer'));
      });
    });

    // should be able to complete the previous operation
  });
});