import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Link Annotation Popup', () => {
  test('should show link annotation popup when hover on link annotation', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setCurrentPage', 2);

    const textToLookFor = 'recently surveyed';
    const rect = await getTextPosition(textToLookFor, 2);
    await page.mouse.move(rect.x1 + 10, rect.y1 + 10);

    const linkPopup = await iframe.waitForSelector('[data-element="linkAnnotationPopup"]');

    expect(await linkPopup.isVisible()).toBeTruthy();
  });

  test('should hide link annotation popup and remove link annotation after click unlink button', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setCurrentPage', 2);

    await iframe.evaluate(async () => {
      const { Core } = window.instance;
      window.annotDeletedCount = 0;
      Core.annotationManager.addEventListener('annotationChanged', (annotations, action) => {
        if (action === 'delete') {
          window.annotDeletedCount++;
        }
      });
    });

    const textToLookFor = 'recently surveyed';
    const rect = await getTextPosition(textToLookFor, 2);
    await page.mouse.move(rect.x1 + 10, rect.y1 + 10);
    const linkPopup = await iframe.waitForSelector('[data-element="linkAnnotationPopup"]');
    const unlinkButton = await linkPopup.waitForSelector('[data-element="linkAnnotationUnlinkButton"]');
    await unlinkButton.click();

    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    expect(await linkPopup.isVisible()).toBeFalsy();
    const annotDeletedCount = await iframe.evaluate(() => window.annotDeletedCount);
    expect(annotDeletedCount).toBe(1);
  });
});