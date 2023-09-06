import { expect, test } from '@playwright/test';
import { loadViewerSample } from '../../playwright-utils';

test.describe('Reply status', () => {
  test('should show reply status after call show/hide annotations api', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('loadDocument', '/test-files/reply_attachments.pdf');

    await page.waitForTimeout(5000);
    // Display mode
    await iframe.click('[data-element="toggleNotesButton"]');

    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      const annotation = window.instance.Core.annotationManager.getAnnotationsList()[0];
      window.instance.Core.annotationManager.selectAnnotation(annotation);
    });

    await page.waitForTimeout(2000);
    await iframe.click('[data-element="noteState"]');
    await page.waitForTimeout(2000);
    await iframe.click('[data-element="notePopupStateAccepted"]');

    await page.waitForTimeout(2000);

    const isHidden = await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.hideAnnotations(annotations);
      annotationManager.showAnnotations(annotations);
      annotationManager.selectAnnotation(annotations[0]);
      return annotations.find((annot) => annot.isReply())?.Hidden;
    });
    await page.waitForTimeout(2000);
    expect(isHidden).toBeTruthy();
  });
});
