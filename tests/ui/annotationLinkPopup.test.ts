import { loadViewerSample } from '../../utils';

it('link annotation modal should accept page labels', async() => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/blank');

  const instance = await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await instance('setToolbarGroup', 'toolbarGroup-Shapes');
  await iframe.click('[data-element=shapeToolGroupButton]');
  await iframe.click('[data-element=rectangleToolButton]');
  await iframe.click('[data-element=stylePopup] > .palette-options > .palette-options-button:last-child');
  await iframe.click('[data-element=colorPalette] > button:first-child');

  const pageContainer = await iframe.$('#pageContainer1');

  await iframe.evaluate(async() => {
    window.readerControl.setPageLabels(['i']);
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