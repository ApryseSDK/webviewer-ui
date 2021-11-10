import { loadViewerSample, Timeouts } from '../../utils';

it('getSelectedThumbnailPageNumbers should return even if there is only one thumbnail selected', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnailsPanelContainer = await iframe.$('[data-element=thumbnailsPanel]');

  const { x, y } = await thumbnailsPanelContainer.boundingBox();

  await page.mouse.click(x + 80, y + 100);

  const selectedThumbnailPageNumbers = await iframe.evaluate(async () => {
    return window.instance.UI.getSelectedThumbnailPageNumbers();
  });

  expect(selectedThumbnailPageNumbers.length).toBe(1);
});

it('rotate and delete buttons are shown if the document is not loaded from the webviewer server', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnail = await iframe.$('.Thumbnail.active');

  expect(await thumbnail.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'rotate-and-delete-buttons-visible'
  });
});

it('all buttons except rotate are hidden if the document is loaded from the webviewer server', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing-with-webviewer-server');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnail = await iframe.$('.Thumbnail.active');

  expect(await thumbnail.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'rotate-and-delete-buttons-hidden'
  });
});