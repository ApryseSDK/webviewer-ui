import { loadViewerSample, WebViewerInstance } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Form Field Popup tests', () => {
  let instance: WebViewerInstance;

  test('Form Field popup remains centered after the viewport has been resized', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await page.waitForTimeout(1500);

    await iframe?.evaluate(() => {
      const formFieldEditingManager = window.instance.Core.annotationManager.getFormFieldCreationManager();
      formFieldEditingManager.startFormFieldCreationMode();
    });
    await page.waitForTimeout(3000);
    const pageContainer = await iframe?.$('#pageContainer1');
    const rect = await getTextPosition('Important');

    // draw a Signature Annot
    await page.mouse.move(rect.x1, rect.y1);
    await page.mouse.down();
    await page.mouse.move(rect.x2, rect.y2);
    await page.mouse.up();
    await page.waitForTimeout(1500);

    const viewportSize = await page.viewportSize();
    const height = viewportSize?.height;
    const biggerViewport = viewportSize?.width + 400;
    await page.setViewportSize({ width: biggerViewport, height });
    await page.waitForTimeout(1500);

    expect(await pageContainer.screenshot()).toMatchSnapshot(['form-field-popup', 'form-field-popup-centered.png'], { maxDiffPixelRatio: .01 });
  });
});