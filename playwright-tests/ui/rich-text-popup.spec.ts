import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Rich text popup', () => {
  test('Should be enabled by default', async ({ page }) => {
    const { waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    const isDisabled = await instance('isElementDisabled', 'richTextPopup');
    expect(isDisabled).toBe(false);
  });

  test('Should close annotation popup when opened', async ({ page, browserName }) => {
    test.skip(['webkit', 'firefox'].includes(browserName)); // TODO: investigate why this test fails on webkit and firefox
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(3000);

    const rect = await getTextPosition('6 Important');
    await page.waitForTimeout(1000);

    await iframe.evaluate(async () => {
      window.instance.UI.setToolMode('AnnotationCreateFreeText');
    });

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    // draw freetext annotation
    await page.mouse.click(rect.x1 + 50, rect.y2 + 200);
    // deselect freetext annotation
    await page.mouse.click(x + 10, y + 10);
    // double click to edit text
    await page.mouse.dblclick(rect.x1 + 55, rect.y2 + 205);
    await page.waitForTimeout(1000);

    const annotationPopup = await iframe.$('[data-element="annotationPopup"]');
    expect(annotationPopup).toBeNull();
  });
});