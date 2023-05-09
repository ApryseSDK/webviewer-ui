import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Annotation Link Popup', () => {
  test('link annotation modal should accept page labels', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iframe.click('[data-element=rectangleToolButton]');
    await iframe.click('[data-element=stylePopup] > .palette-options > .palette-options-button:last-child');
    await iframe.click('[data-element=colorPalette] > button:first-child');

    const pageContainer = await iframe.$('#pageContainer1');

    await iframe.evaluate(async () => {
      window.instance.UI.setPageLabels(['i']);
    });

    const { x, y } = await pageContainer.boundingBox();

    const annotationTopLeftCoords = { x: x + 100, y: y + 100 };
    const annotationBottomRightCoords = { x: annotationTopLeftCoords.x + 200, y: annotationTopLeftCoords.y + 200 };

    await page.mouse.move(annotationTopLeftCoords.x, annotationTopLeftCoords.y);
    await page.mouse.down();
    await page.mouse.move(annotationBottomRightCoords.x, annotationBottomRightCoords.y);
    await page.mouse.up();

    await iframe.click('[data-element=selectToolButton]');

    await page.mouse.click(annotationTopLeftCoords.x + 50, annotationTopLeftCoords.y + 50);

    await iframe.click('[data-element=linkButton]');
    await iframe.click('[data-element=PageNumberPanelButton]');
    await page.waitForTimeout(1000);

    const modal = await iframe.$('[data-element=PageNumberPanel]');
    expect(await modal.screenshot()).toMatchSnapshot(['annotation-link-popup', 'link-button-enabled.png']);

    await page.keyboard.press('Backspace');
    await page.keyboard.press('1');
    await page.waitForTimeout(1000);
    expect(await modal.screenshot()).toMatchSnapshot(['annotation-link-popup', 'link-button-disabled.png']);
  });

  test('page should refresh after press unlink icon', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolbarGroup', 'toolbarGroup-Shapes');

    const pageContainer = await iframe.$('#pageContainer1');

    await iframe.evaluate(async () => {
      window.instance.UI.setPageLabels(['i']);
    });

    const { x, y } = await pageContainer.boundingBox();

    const annotationTopLeftCoords = { x: x + 100, y: y + 100 };
    const annotationBottomRightCoords = { x: annotationTopLeftCoords.x + 200, y: annotationTopLeftCoords.y + 200 };

    await page.mouse.move(annotationTopLeftCoords.x, annotationTopLeftCoords.y);
    await page.mouse.down();
    await page.mouse.move(annotationBottomRightCoords.x, annotationBottomRightCoords.y);
    await page.mouse.up();

    await iframe.click('[data-element=selectToolButton]');

    await page.mouse.click(annotationTopLeftCoords.x + 5, annotationTopLeftCoords.y + 5);

    await iframe.click('[data-element=linkButton]');
    await page.waitForTimeout(1000);
    await iframe.type('.urlInput', 'https://www.google.ca/');
    await iframe.click('[data-element=linkSubmitButton]');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    let link = await iframe.$('#pageWidgetContainer1 > div > span');
    expect(link).not.toBeNull();
    const selectTopLeftCoords = { x: annotationTopLeftCoords.x - 10, y: annotationTopLeftCoords.y - 10 };
    const selectBottomRightCoords = { x: annotationBottomRightCoords.x + 10, y: annotationBottomRightCoords.y + 10 };
    await page.mouse.move(selectTopLeftCoords.x, selectTopLeftCoords.y);
    await page.mouse.down();
    await page.mouse.move(selectBottomRightCoords.x, selectBottomRightCoords.y);
    await page.mouse.up();
    await page.waitForTimeout(1000);
    await iframe.click('[data-element=linkButton]');
    await page.waitForTimeout(1000);
    await page.mouse.move(selectBottomRightCoords.x + 10, selectBottomRightCoords.y + 10);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    link = await iframe.$('#pageWidgetContainer1 > div > span');
    expect(link).toBeNull();
  });

  test('should release two annotations in a single event when adding link annotation and deleting link annotation', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      window.annotationsChangedCount = 0;
      const annotationManager = window.instance.Core.annotationManager;
      annotationManager.addEventListener('annotationChanged', function handler(annotations, action) {
        if (action === 'add' && annotations.length === 2) {
          window.annotationsChangedCount++;
        }
        if (action === 'delete' && annotations.length === 2) {
          window.annotationsChangedCount++;
          annotationManager.removeEventListener('annotationChanged', handler);
        }
      });
    });

    await instance('setToolMode', 'TextSelect');
    const text = await getTextPosition('6 Important');

    // Select the text, but don't release the button to finish it
    await page.mouse.move(text.x1, text.y1);
    await page.mouse.down();
    await page.mouse.move(text.x2, text.y2);
    await page.mouse.up();
    // wait for the text selection to finish
    await iframe.waitForSelector('[data-element=textPopup]');
    await iframe.click('[data-element=linkButton]');
    await iframe.waitForSelector('[data-element=URLPanel]');
    await iframe.type('.urlInput', 'https://www.google.ca/');
    await iframe.click('[data-element=linkSubmitButton]');

    // Re-select the text, but don't release the button to finish it
    await page.mouse.move(text.x1 - 10, text.y1 - 10);
    await page.mouse.down();
    await page.mouse.move(text.x2 + 10, text.y2 + 10);
    await page.mouse.up();
    await page.waitForTimeout(1000);
    await iframe.click('[data-element=WarningModalClearButton]');
    // delete link annotations
    await iframe.click('[data-element=linkButton]');
    const count = await iframe.evaluate(async () => {
      return window.annotationsChangedCount;
    });
    expect(count).toBe(2);
  });

  test('Should set custom onTrigger successfully', async ({ page, browser }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    const browserContext = await browser.newContext();
    const initialPageLength = browserContext.pages().length;

    await iframe.evaluate(async () => {
      const { Actions, Annotations } = window.instance.Core;
      Actions.setCustomOnTriggeredHandler(Actions.URI, (target, event, doc, options) => {
        if (target instanceof Annotations.Link) {
          return;
        }
        options.originalOnTriggered(target, event, doc);
      });
      window.instance.UI.disableFeatures(window.instance.UI.Feature.Redaction);
    });
    await instance('setToolMode', 'TextSelect');
    const text = await getTextPosition('6 Important');

    // Select the text, but don't release the button to finish it
    await page.mouse.move(text.x1, text.y1);
    await page.mouse.down();
    await page.mouse.move(text.x2, text.y2);
    await page.mouse.up();
    // wait for the text selection to finish
    await iframe.waitForSelector('[data-element=textPopup]');
    await iframe.click('[data-element=linkButton]');
    await iframe.waitForSelector('[data-element=URLPanel]');
    await iframe.type('.urlInput', 'https://www.google.ca/');
    await iframe.click('[data-element=linkSubmitButton]');
    await iframe.waitForSelector('[data-element=textPopup]', { state: 'hidden' });
    await page.mouse.click(text.x1, text.y1);
    await page.waitForTimeout(1000);
    expect(browserContext.pages().length).toEqual(initialPageLength);
  });

  test('should create new annotations when pressing Enter to finish adding new link', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    const promise = iframe.evaluate(
      async () => {
        const annotationManager = window.instance.Core.annotationManager;
        return new Promise((resolve) => {
          annotationManager.addEventListener('annotationChanged', (annotations, action) => {
            if (action === 'add' && annotations.length === 2) {
              resolve('ok');
            }
          });
        });
      },
    );

    await instance('setToolMode', 'TextSelect');
    const text = await getTextPosition('6 Important');

    // Select the text
    await page.mouse.move(text.x1, text.y1);
    await page.mouse.down();
    await page.mouse.move(text.x2, text.y2);
    await page.mouse.up();

    // Wait for the text selection to finish
    await iframe.waitForSelector('[data-element=textPopup]');
    await iframe.click('[data-element=linkButton]');
    await iframe.waitForSelector('[data-element=URLPanel]');
    await iframe.type('.urlInput', 'www.google.ca');
    await page.keyboard.press('Enter');

    const result = await promise;
    expect(result).toBe('ok');
  });
})