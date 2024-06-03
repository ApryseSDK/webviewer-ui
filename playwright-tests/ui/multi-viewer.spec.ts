import { GetTextPosition, Timeouts, WebViewerInstance, loadViewerSample } from '../../playwright-utils';
import { Frame, expect, test } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';

test.describe('Multi Viewer Mode', () => {
  let iframe: Frame;
  let instance: WebViewerInstance;
  let getTextPosition: GetTextPosition;
  const marginError = 5;
  const verticalGapToPopup = 17;

  const selectAnnotation = async (iframe: Frame, documentViewerKey: number) => {
    return iframe.evaluate((documentViewerKey) => {
      const annotationManager = window.instance.UI.getDocumentViewer(documentViewerKey).getAnnotationManager();
      annotationManager.deselectAllAnnotations();
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.selectAnnotation(annotations[0]);
      return annotationManager;
    }, documentViewerKey);
  };

  test.beforeEach(async ({ page }) => {
    // Setup and initial load
    const { iframe: sampleIframe, waitForInstance, getTextPosition: sampleGetTextPosition } = await loadViewerSample(page, 'viewing/multi-viewer');
    iframe = sampleIframe as Frame;
    instance = await waitForInstance();
    getTextPosition = sampleGetTextPosition;
    await page.waitForTimeout(3000);
  });

  test('MultiViewer loads correctly and tools work', async ({ page }) => {
    await instance('disableElements', ['annotationPopup', 'annotationStylePopup', 'stylePopup', 'contextMenuPopup', 'toolStylePopup', 'richTextPopup']);
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    const multiViewer = await iframe.$('.MultiViewer');
    expect(await multiViewer.screenshot()).toMatchSnapshot(['viewer', 'viewer.png']);

    // Add Signature to both sides
    await instance('openElement', 'signatureModal');
    await page.waitForTimeout(1000);
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

  test('Annotation Popup should work properly on multi-viewer mode', async ({ page }) => {
    await iframe.$('.MultiViewer');
    const documentContainer2 = await iframe.$('#DocumentContainer2');

    // Add rectangle to 2nd documentViewer and open annotation popup
    await instance('setToolMode', 'AnnotationCreateRectangle');
    const { x: containerX, y: containerY } = await documentContainer2.boundingBox();
    const rectangleX = containerX + 100;
    const rectangleY = containerY + 100;
    const rectangleWidth = 200;
    const rectangleHeight = 200;
    await drawRectangle(page, rectangleX, rectangleY, rectangleWidth, rectangleHeight);
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await selectAnnotation(iframe, 2);

    // AnnotationPopup is outside of .DocumentContainer so we're calculating if it lies approximately below the annotation on the 2nd docViewer
    // taken from getPopupPosition.js L193
    const annotationPopup = await iframe.waitForSelector('[data-element=annotationPopup]');
    const { x: popupX, y: popupY, width: popupWidth } = await annotationPopup.boundingBox();
    const expectedPopupX = Math.round(rectangleX + ((rectangleWidth / 2) - (popupWidth / 2)));
    const expectedPopupY = Math.round(rectangleY + rectangleHeight + verticalGapToPopup);
    expect(popupX).toBeLessThan(expectedPopupX + marginError);
    expect(popupX).toBeGreaterThan(expectedPopupX - marginError);
    expect(popupY).toBeLessThan(expectedPopupY + marginError);
    expect(popupY).toBeGreaterThan(expectedPopupY - marginError);

    // check that button in popup works. Try to add a link to the annotation
    await iframe.locator('[data-element=linkButton]').click();
    await iframe.locator('.urlInput').fill('www.google.com');
    await iframe.locator('[data-element=URLPanel] [data-element=linkSubmitButton]').click();

    const wasLinkAdded = await iframe.evaluate(async () => {
      const WVCore = window.instance.Core;
      return WVCore.getDocumentViewers()[1].getAnnotationManager().getAnnotationsList()[1] instanceof WVCore.Annotations.Link;
    });

    expect(wasLinkAdded).toBe(true);
  });

  test('Context Menu Popup should work properly on multi-viewer mode', async ({ page }) => {
    await iframe.$('.MultiViewer');
    const documentContainer2 = await iframe.$('#DocumentContainer2');

    // click to set the 2nd docViewer as being active since right click won't activate it
    await documentContainer2?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    const { x: containerX, y: containerY } = await documentContainer2?.boundingBox();
    const mouseX = containerX + 100;
    const mouseY = containerY + 100;
    await page.mouse.click(mouseX, mouseY, { button: 'right' });
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    // ContextMenu is outside of .DocumentContainer so we're calculating if it lies approximately below the right-click mouse on the 2nd docViewer
    const contextMenuPopup = await iframe.waitForSelector('[data-element=contextMenuPopup]');
    const { x: popupX, y: popupY } = await contextMenuPopup.boundingBox();
    expect(popupX).toBeLessThan(mouseX + marginError);
    expect(popupX).toBeGreaterThan(mouseX - marginError);
    expect(popupY).toBeLessThan(mouseY + marginError);
    expect(popupY).toBeGreaterThan(mouseY - marginError);
  });

  test('Text Popup should work properly on multi-viewer mode', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: investigate why on multi-viewer mode, the documentViewer is shifted down on firefox');
    await iframe.$('.MultiViewer');
    const documentContainer2 = await iframe.$('#DocumentContainer2');

    // click to set the 2nd docViewer as being active before selecting text
    await documentContainer2?.click();
    await instance('setToolMode', 'TextSelect');
    const { x1, y1, x2, y2 } = await getTextPosition('n syntax e', 1, 2);
    await page.mouse.move(x1, y1);
    await page.mouse.down();
    await page.mouse.move(x2, y2);
    await page.mouse.up();

    // TextPopup is outside of .DocumentContainer so we're calculating if it lies approximately below the selected text on the 2nd docViewer
    // taken from getPopupPosition.js L200
    const textPopup = await iframe.waitForSelector('[data-element=textPopup]');
    const { x: popupX, y: popupY, width: popupWidth } = await textPopup.boundingBox();
    const expectedPopupX = Math.round(x1 + (((x2 - x1) / 2) - (popupWidth / 2)));
    const expectedPopupY = Math.round(y2 + verticalGapToPopup);
    expect(popupX).toBeLessThan(expectedPopupX + marginError);
    expect(popupX).toBeGreaterThan(expectedPopupX - marginError);
    expect(popupY).toBeLessThan(expectedPopupY + marginError);
    expect(popupY).toBeGreaterThan(expectedPopupY - marginError);

    // check that button in popup works. Try to add a highlight to the selected text
    await iframe.locator('[data-element=textHighlightToolButton]').click();
    const annotCount = await iframe.evaluate(async () => {
      return window.instance.Core.getDocumentViewers()[1].getAnnotationManager().getAnnotationsList().length;
    });

    expect(annotCount).toBe(1);
  });

  test('Calling enableMultiViewerSync() should not throw error', async ({ page }) => {
    const { waitForInstance, pageErrors } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);

    await instance('enableMultiViewerSync', 1);
    await page.waitForTimeout(1000);
    expect(pageErrors.length).toBe(0);
  });

  test('Adding a comment shoud dispatch the annotationChanged event from the correct documentViewer', async ({ page, browserName }) => {
    const { iframe, waitForInstance, consoleLogs } = await loadViewerSample(page, 'viewing/multi-viewer');
    const instance = await waitForInstance();

    await iframe.evaluate(() => {
      const [documentViewer1, documentViewer2] = window.instance.Core.getDocumentViewers();

      documentViewer1.getAnnotationManager().addEventListener('annotationChanged', () => {
        console.log('DocumentViewer 1 - annotationChanged');
      });
      documentViewer2.getAnnotationManager().addEventListener('annotationChanged', () => {
        console.log('DocumentViewer 2 - annotationChanged');
      });
    });

    // adding a sticky note on the second viewer
    await instance('openElement', 'notesPanel');
    await page.waitForTimeout(1000);
    await page.mouse.click(1200, 500);
    await page.waitForTimeout(500);
    await instance('setToolMode', 'AnnotationCreateSticky');
    // create a sticky note
    await page.mouse.click(1200, 500);
    await page.waitForTimeout(1000);
    // select the sticky note
    await page.mouse.click(1205, 505);
    await page.waitForTimeout(1000);
    await page.keyboard.type('Some content');
    await page.waitForTimeout(500);
    const saveButton = await iframe.$('.save-button');
    await saveButton?.click();
    await page.waitForTimeout(3000);

    expect(consoleLogs.includes('DocumentViewer 2 - annotationChanged')).toBeTruthy();
  });

  test.skip('should not crash when hovering/clicking on the automatic links in the document in the second documentViewer', async ({ page, browserName }) => {
    const { iframe, waitForInstance, consoleLogs } = await loadViewerSample(page, 'viewing/multi-viewer');
    const instance = await waitForInstance();
    await iframe.$('.MultiViewer');

    await iframe?.evaluate(async () => {
      const [documentViewer1, documentViewer2] = window.instance.Core.getDocumentViewers();
      const loadDocumentOnePromise = new Promise((resolve) => {
        documentViewer1.addEventListener('documentLoaded', function() {
          resolve();
        });
      });
      const loadDocumentTwoPromise = new Promise((resolve) => {
        documentViewer2.addEventListener('documentLoaded', function() {
          resolve();
        });
      });
      await Promise.all([loadDocumentOnePromise, loadDocumentTwoPromise]);

      documentViewer1.loadDocument('/test-files/link1.pdf');
      documentViewer2.loadDocument('/test-files/link2.pdf');
    });
    await page.waitForTimeout(3000);
    const documentViewerContainer2 = await iframe?.waitForSelector('#container2');
    const pageCount = await iframe?.evaluate(() => {
      const [documentViewer1, documentViewer2] = window.instance.Core.getDocumentViewers();
      documentViewer2.setCurrentPage(3);
      return documentViewer2.getDocument().getPageCount();
    });
    expect(pageCount).toBe(10);
    await page.waitForTimeout(1000);
    await documentViewerContainer2?.click();
    const linkElement = await iframe?.$$('.link');
    await linkElement[14].click();
    await page.waitForTimeout(1000);
    const warningModal = await iframe?.$('.connect-to-url-modal');
    expect(warningModal).not.toBeNull();
  });
});
