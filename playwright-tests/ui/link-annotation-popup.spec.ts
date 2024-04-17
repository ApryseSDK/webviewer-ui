import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';

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

  test.skip('clicking on unlink button should keep annotation grouped', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);
    await instance('loadDocument', '/test-files/two-blank-pages.pdf');
    await page.waitForTimeout(3000);
    await instance('setToolMode', 'AnnotationCreateRectangle');
    await page.waitForTimeout(5000);

    const selectAnnotations = async () => iframe.evaluate(async () => {
      const core = instance.Core;
      const [annot1, annot2] = instance.Core.annotationManager.getAnnotationsList();
      core.annotationManager.selectAnnotation(annot2);
    });

    const pageContainer = await iframe.$('#pageContainer1');
    const { x: xContainer, y: yContainer } = await pageContainer.boundingBox();

    await drawRectangle(page, xContainer + 20, yContainer + 20, 150, 150);

    await page.waitForTimeout(1000);

    await drawRectangle(page, xContainer + 200, yContainer + 20, 150, 150);

    await selectAnnotations();
    await page.waitForTimeout(1000);
    await iframe.click('[data-element=linkButton]');
    await page.keyboard.type('https://www.pdftron.com');
    await iframe?.click('[data-element=linkSubmitButton]');
    await instance('deselectAllAnnotations');
    await iframe.evaluate(async () => {
      const core = instance.Core;
      const annots = instance.Core.annotationManager.getAnnotationsList();
      core.annotationManager.selectAnnotations(annots);
    });
    await iframe?.click('[data-element=annotationGroupButton]');
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await page.mouse.click(xContainer + 1, yContainer + 1);
    await page.mouse.move(xContainer + 200, yContainer + 20);
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    const linkPopup = await iframe.waitForSelector('[data-element="linkAnnotationPopup"]');
    const unlinkButton = await linkPopup.waitForSelector('[data-element="linkAnnotationUnlinkButton"]');
    await unlinkButton.click();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await selectAnnotations();
    const annotationPopup = await iframe?.$('[data-element="annotationPopup"]');
    expect(await annotationPopup?.screenshot()).toMatchSnapshot(['annotation-grouped-with-unlink', 'should-stay-grouped-when-unlink.png']);
  });

  test('should remove link annotation with content edit mode', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'advanced/content-edit/');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setCurrentPage', 2);

    const textToLookFor = 'recently surveyed';
    const rect = await getTextPosition(textToLookFor, 2);
    await page.mouse.move(rect.x1 + 10, rect.y1 + 10);
    await page.waitForTimeout(2000);
    const linkPopup = await iframe.waitForSelector('[data-element="linkAnnotationPopup"]');
    const unlinkButton = await linkPopup.waitForSelector('[data-element="linkAnnotationUnlinkButton"]');
    await unlinkButton.click();

    await page.mouse.dblclick(rect.x1 + 10, rect.y1 + 10);
    await page.waitForTimeout(3000);
    await page.mouse.click(rect.x1 + 10, rect.y1 + 10);
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await page.keyboard.type('test');
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await page.mouse.click(rect.x1 - 200, rect.y1 - 200);
    await page.waitForTimeout(2000);
    await page.mouse.move(rect.x1 + 10, rect.y1 + 10);
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await expect(iframe.locator('[data-element="linkAnnotationPopup"]')).toBeHidden();
  });
});