import { loadViewerSample } from '../../utils';

it('getSelectedThumbnailPageNumbers should return even if there is only one thumbnail selected', async() => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=toggleNotesButton]');
  await page.waitFor(1000);

  await iframe.click('[data-element=notesOrderDropdown] .down-arrow');
  await page.waitFor(500);

  await iframe.click('[data-element=dropdown-item-modifiedDate]');
  await page.waitFor(500);

  const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
  await page.waitFor(1000);

  expect(await notesPanelContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'note-panel-order-by-modified',
  });
});
