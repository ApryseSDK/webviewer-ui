import { loadViewerSample, WebViewerInstance } from '../../playwright-utils';
import { expect, test, Frame, ElementHandle } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';

test.describe('Annotation Popup tests', () => {
  let iFrame: Frame;
  let instance: WebViewerInstance;

  test('should be able to navigate through the Annotation Popup using the keyboard and select style popup pressing Enter', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    iFrame = iframe;

    instance = await waitForInstance();
    await instance('loadDocument', '/test-files/style_popup_test.pdf');
    await waitForWVEvents(['annotationsLoaded']);
    await page.waitForTimeout(3000);

    await iFrame.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      const annots = annotManager.getAnnotationsList();
      annotManager.deselectAllAnnotations();
      annotManager.selectAnnotation(annots[0]);
    });

    // Using Tab key to focus on the style button and pressing the Enter key to open the Style Popup
    await iFrame.waitForSelector('[data-element=annotationPopup]');
    // safari on mac M1 has to press option TAB in order to move through the popup
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);

    let annotationStylePopup = await iFrame.$('.AnnotationStylePopup.open');
    expect(annotationStylePopup).not.toBeNull();
  });

  test('Annotation popup should not shift the scroll view element when scroll across the document', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await page.waitForTimeout(500);
    await instance('setCurrentPage', 2);
    await instance('setToolMode', 'AnnotationCreateRectangle');
    const pageContainer = await iframe.$('#pageContainer2');
    const { x: xContainer, y: yContainer } = await pageContainer.boundingBox();
    await drawRectangle(page, xContainer + 120, yContainer + 500, 150, 100);
    await iframe.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      const annots = annotManager.getAnnotationsList();
      annotManager.deselectAllAnnotations();
      annotManager.selectAnnotation(annots[annots.length - 1]);
    });
    await iframe.waitForSelector('[data-element=annotationPopup]');
    await iframe.evaluate(() => {
      window.instance.Core.documentViewer.getScrollViewElement().scrollTo(0, 0);
    });
    const top = await iframe.evaluate(() => {
      return instance.Core.documentViewer.getScrollViewElement().getBoundingClientRect().top;
    });
    await page.waitForTimeout(500);
    expect(top >= 0).toBeTruthy();
  });

  test('Annotation popup should hand over the focus when the context menu is also open', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await page.waitForTimeout(500);
    await iframe?.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      const annots = annotManager.getAnnotationsList();
      annotManager.deselectAllAnnotations();
      annotManager.selectAnnotation(annots[0]);
    });
    await iframe?.waitForSelector('[data-element=annotationPopup]');

    const pageContainer = await iframe?.$('#pageContainer1');
    const { x, y } = await pageContainer?.boundingBox();
    // right click to open the context menu, this should dismiss the annotationPopup
    await page.mouse.click(x + 100, y + 20, { button: 'right' });
    await iframe?.waitForSelector('[data-element=contextMenuPopup]');

    const contextMenuPopup = await iframe?.$('[data-element=contextMenuPopup]');
    const contextMenuButtons = await contextMenuPopup?.$$('.main-menu-button') as ElementHandle[];
    // scroll document to trigger the annotationPopup to open again
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1000);

    const activeElement = await iframe?.evaluate(() => {
      return document.activeElement?.getAttribute('data-element');
    });
    expect(activeElement).toBe(await contextMenuButtons[0].getAttribute('data-element'));
    await page.waitForTimeout(1000);
    // Tab to switch focus, this should work and not throw any error
    await page.keyboard.press('Tab');
    const newActiveElement = await iframe?.evaluate(() => {
      return document.activeElement?.getAttribute('data-element');
    });
    expect(newActiveElement).toBe(await contextMenuButtons[1].getAttribute('data-element'));
  });
});