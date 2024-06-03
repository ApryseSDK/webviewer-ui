import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Annotation filter modal', () => {
  test.skip('Should filter annotations properly', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await iframe.evaluate(() => {
      window.instance.UI.enableElements(['tooltip']);
    });
    await page.waitForTimeout(5000);

    await instance('openElement', 'notesPanel');
    await iframe.waitForSelector('[data-element=notesPanel]');
    await instance('openElement', 'filterModal');
    await iframe.waitForSelector('[data-element=filterModal]');

    const filterModal = await iframe.$('[data-element="filterModal"] div');
    expect(await filterModal.screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-0.png']);

    // Test tooltip
    const guestUserLabel = await filterModal.$('.user-filters .ui__choice__label div');
    await guestUserLabel.hover();
    const tooltip =await iframe.waitForSelector('.tooltip--bottom');
    expect(await tooltip.textContent()).toBe('Guest');

    const includeRepliesButton = await filterModal.$('#filter-annot-modal-include-replies');
    await includeRepliesButton.click();
    const clearAllButton = await filterModal.$('.filter-annot-clear');
    expect(await clearAllButton.isDisabled()).toBe(true);
    const userCheckbox = await filterModal.$('.user-filters input');
    await userCheckbox.click();
    await page.waitForTimeout(1000);
    expect(await filterModal.screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-1.png']);

    await userCheckbox.click();
    const filterDocumentButton = await filterModal.$('#filter-annot-modal-filter-document');
    await filterDocumentButton.click();
    expect(await clearAllButton.isDisabled()).toBe(false);
    await userCheckbox.click();
    await clearAllButton.click();
    await page.waitForTimeout(1000);
    expect(await filterModal.screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-2.png']);

    const colorButton = await filterModal.$('[data-element="annotationColorFilterPanelButton"]');
    await colorButton.click();
    const firstColorDiv = (await iframe.$$('.color-filters .colorSelect'))[0];
    const firstColorButton = await firstColorDiv.$('input');
    await firstColorButton.click();
    await page.waitForTimeout(1000);
    expect(await filterModal.screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-3.png']);

    const typeButton = await filterModal.$('[data-element="annotationTypeFilterPanelButton"]');
    await typeButton.click();
    const firstTypeSpan = (await iframe.$$('.type-filters span'))[0];
    const firstTypeButton = await firstTypeSpan.$('input');
    await firstTypeButton.click();
    await page.waitForTimeout(1000);
    expect(await filterModal.screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-4.png']);

    const applyButton = await filterModal.$('.filter-annot-apply');
    await applyButton.click();
    await page.waitForTimeout(1000);
    const notes = await iframe.$$('.normal-notes-container .note-wrapper');
    expect(notes.length).toBe(1);
    expect(await notes[0].screenshot()).toMatchSnapshot(['annotation-filter-modal', 'filter-modal-test-5.png']);
  });

  test('Should filter annotations from document', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElement', 'notesPanel');
    await page.waitForTimeout(1000);
    await instance('openElement', 'filterModal');
    await page.waitForTimeout(1000);

    const filterModal = await iframe.$('[data-element="filterModal"] div');

    const typeButton = await filterModal.$('[data-element="annotationTypeFilterPanelButton"]');
    await typeButton.click();
    const firstTypeSpan = (await iframe.$$('.type-filters span'))[0];
    const firstTypeButton = await firstTypeSpan.$('input');
    await firstTypeButton.click();

    const applyButton = await filterModal.$('.filter-annot-apply');
    await applyButton.click();
    await page.waitForTimeout(1000);

    let annotCheck = true;
    const annotations = await instance('getAnnotationsList');
    for (const annotation of annotations) {
      const isFreeHand = annotation.Subject === 'Free Hand';
      if (annotation.NoView === isFreeHand) {
        annotCheck = false;
        break;
      }
    }
    expect(annotCheck).toBe(true);
  });
});
