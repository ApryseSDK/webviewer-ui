import { loadViewerSample, Timeouts } from '../../utils';
import { ElementHandle } from 'puppeteer';

// Skipping this test because it fails multiple times even after updating image in circleci
it.skip('link annotation modal should accept page labels', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/blank');

  const instance = await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await instance('setToolbarGroup', 'toolbarGroup-Shapes');
  await iframe.click('[data-element=shapeToolGroupButton]');
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

  const modal = await iframe.$('[data-element=PageNumberPanel]');

  expect(await modal.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'link-button-enabled'
  });

  await page.keyboard.press('Backspace');
  await page.keyboard.press('1');

  expect(await modal.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'link-button-disabled'
  });
});

it('page should refresh after press unlink icon', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const instance = await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await instance('setToolbarGroup', 'toolbarGroup-Shapes');
  await iframe.click('[data-element=shapeToolGroupButton]');

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

  await page.mouse.click(annotationTopLeftCoords.x, annotationTopLeftCoords.y);

  await iframe.waitForSelector('[data-element=linkButton] > div > svg > defs');
  await iframe.click('[data-element=linkButton]');
  await iframe.waitForSelector('[data-element=URLPanel]');
  await iframe.type('.urlInput', 'https://www.google.ca/');
  await iframe.click('[data-element=linkSubmitButton]');
  await page.waitFor(Timeouts.UI_CSS_ANIMATION);
  let link = await iframe.$('#pageWidgetContainer1 > div > span');
  expect(link).not.toBeNull();
  const selectTopLeftCoords = { x: annotationTopLeftCoords.x - 10, y: annotationTopLeftCoords.y - 10 };
  const selectBottomRightCoords = { x: annotationBottomRightCoords.x + 10, y: annotationBottomRightCoords.y + 10 };
  await page.mouse.move(selectTopLeftCoords.x, selectTopLeftCoords.y);
  await page.mouse.down();
  await page.mouse.move(selectBottomRightCoords.x, selectBottomRightCoords.y);
  await page.mouse.up();
  await iframe.waitForSelector('[data-element=annotationPopup]');
  await iframe.waitForSelector('[data-element=linkButton] > div > svg > defs', { hidden: true });
  await iframe.click('[data-element=linkButton]');
  await iframe.waitForSelector('[data-element=linkButton] > div > svg > defs');
  await page.mouse.move(selectBottomRightCoords.x + 10, selectBottomRightCoords.y + 10);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitFor(Timeouts.UI_CSS_ANIMATION);
  link = await iframe.$('#pageWidgetContainer1 > div > span');
  expect(link).toBeNull();
});

it('should release two annotations in a single event when adding link annotation and deleting link annotation', async () => {
  const {
    iframe,
    waitForInstance,
    getTextPosition,
    waitForWVEvents
  } = await loadViewerSample('viewing/viewing');

  const instance = await waitForInstance();
  await instance('disableElements', ['pageNavOverlay']);
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  const promise = iframe.evaluate(
    async () => {
      let count = 0;
      const annotationManager = window.instance.Core.documentViewer.getAnnotationManager();
      return new Promise((resolve) => {
        annotationManager.on('annotationChanged', function handler(annotations, action) {
          if (action === 'add' && annotations.length === 2) {
            count++;
          }
          if (action === 'delete' && annotations.length === 2) {
            count++;
            annotationManager.off('annotationChanged', handler);
            resolve(count);
          }
        });
      });
    },
  );

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
  // wait for the text selection to finish
  await iframe.waitForSelector('[data-element=textPopup]');
  // delete link annotations
  await iframe.click('[data-element=linkButton]');
  const count = await promise;
  expect(count).toBe(2);
});
