import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Overlay Dropdown', () => {
  test('should close overlays on click outside WebViewer iframe', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const overlays = [
      'viewControlsOverlay',
      'searchOverlay',
      'menuOverlay',
      'zoomOverlay',
      'toolsOverlay',
      'stampOverlay',
      'signatureOverlay',
      'measurementOverlay'
    ];

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    // Enable Measurement feature for measurement overlay.
    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
    });

    const viewerAside = await page.$('body aside');
    const appContainer = await iframe.$('div.App');

    for (let i = 0; i < overlays.length; i++) {
      // Set focus on WebViewer iframe.
      await appContainer.click();

      // Assert overlay is closed by default.
      let isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);

      await instance('openElement', overlays[i]);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(true);

      // Set focus outside iframe (triggers onBlur event).
      // Assert this closes overlay.
      await viewerAside.click();
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);
    }
  });

  test('should close overlays when document unloads', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const overlays = [
      'viewControlsOverlay',
      'searchOverlay',
      'menuOverlay',
      'zoomOverlay',
      'toolsOverlay',
      'stampOverlay',
      'signatureOverlay',
      'measurementOverlay'
    ];

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    // Enable Measurement feature for measurement overlay.
    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
    });

    for (let i = 0; i < overlays.length; i++) {
      // Assert overlay is closed by default.
      let isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);

      // Open overlay dropdown.
      await instance('openElements', [overlays[i]]);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(true);

      // Load new document.
      await instance('loadDocument', '/test-files/blank.pdf');
      await page.waitForTimeout(5000);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);
    }
  });
});