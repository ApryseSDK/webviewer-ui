import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Multi Viewer Mode', () => {
  test('MultiViewer loads correctly and tools work', async ({ page }) => {
    // Setup and initial load
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/multi-viewer');
    const instance = await waitForInstance();
    await instance('disableElements', [['annotationStylePopup', 'stylePopup', 'contextMenuPopup', 'toolStylePopup', 'richTextPopup']]);
    await page.waitForTimeout(3000);
    const multiViewer = await iframe.$('.MultiViewer');
    expect(await multiViewer.screenshot()).toMatchSnapshot(['viewer', 'viewer.png']);

    // Add Signature to both sides
    await instance('openElement', 'signatureModal');
    await iframe.click('[data-element="textSignaturePanelButton"]');
    await iframe.click('.signature-create');
    await page.mouse.click(600, 400);
    await instance('openElement', 'signatureModal');
    await iframe.focus('.text-signature-input');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('test');
    await iframe.click('.signature-create');
    await page.mouse.click(1500, 400);
    // Add rectangle to both sides
    await instance('setToolMode', 'AnnotationCreateRectangle');
    await page.mouse.move(600, 500);
    await page.mouse.down();
    await page.mouse.move(650, 550);
    await page.mouse.up();
    await page.mouse.move(1500, 500);
    await page.mouse.down();
    await page.mouse.move(1550, 550);
    await page.mouse.up();
    // Add freehand to both sides
    await instance('setToolMode', 'AnnotationCreateFreeHand');
    await page.mouse.move(600, 600);
    await page.mouse.down();
    await page.mouse.move(650, 650);
    await page.mouse.up();
    await page.mouse.move(1500, 600);
    await page.mouse.down();
    await page.mouse.move(1550, 650);
    await page.mouse.up();
    // Add rubber stamp to both sides
    await instance('openElement', 'customStampModal');
    await page.waitForTimeout(1000);
    await iframe.click('#default-username');
    await iframe.click('#default-date');
    await iframe.click('#default-time');
    await iframe.click('.stamp-create');
    await page.waitForTimeout(1000);
    await instance('setToolMode', 'AnnotationCreateRubberStamp');
    await page.mouse.click(600, 800);
    await instance('setToolMode', 'AnnotationCreateRubberStamp');
    await page.mouse.click(1500, 800);

    await page.waitForTimeout(1000);
    expect(await multiViewer.screenshot()).toMatchSnapshot(['annots', 'annots.png']);
  });
});
