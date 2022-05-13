import { loadViewerSample } from '../../utils';

describe('Annotation filter modal test', () => {
  it('should filter annotations properly', async () => {
    const {
      iframe,
      waitForWVEvent,
      waitForInstance
    } = await loadViewerSample('viewing/viewing');

    await waitForWVEvent('annotationsLoaded');

    const instance = await waitForInstance();
    instance('openElement', 'notesPanel');
    await page.waitFor(1000);
    instance('openElement', 'filterModal');
    await page.waitFor(1000);

    const filterModal = await iframe.$('[data-element="filterModal"] div');
    expect(await filterModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-0'
    });

    const includeRepliesButton = await filterModal.$('#filter-annot-modal-include-replies');
    await includeRepliesButton.click();
    const userCheckbox = await filterModal.$('.user-filters input');
    await userCheckbox.click();
    await page.waitFor(500);
    expect(await filterModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-1'
    });

    const clearAllButton = await filterModal.$('.filter-annot-clear');
    await clearAllButton.click();
    await page.waitFor(500);
    expect(await filterModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-2'
    });

    const colorButton = await filterModal.$('[data-element="annotationColorFilterPanelButton"]');
    await colorButton.click();
    const firstColorDiv = (await iframe.$$('.color-filters .colorSelect'))[0];
    const firstColorButton = await firstColorDiv.$('input');
    firstColorButton.click();
    await page.waitFor(500);
    expect(await filterModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-3'
    });

    const typeButton = await filterModal.$('[data-element="annotationTypeFilterPanelButton"]');
    await typeButton.click();
    const firstTypeSpan = (await iframe.$$('.type-filters span'))[0];
    const firstTypeButton = await firstTypeSpan.$('input');
    firstTypeButton.click();
    await page.waitFor(500);
    expect(await filterModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-4'
    });

    const applyButton = await filterModal.$('.filter-annot-apply');
    await applyButton.click();
    await page.waitFor(1000);
    const notes = await iframe.$$('.normal-notes-container .note-wrapper');
    expect(notes.length).toBe(1);
    expect(await notes[0].screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'filter-modal-test-5'
    });
  });
});
