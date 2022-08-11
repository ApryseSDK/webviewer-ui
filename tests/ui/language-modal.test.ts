import { loadViewerSample } from '../../utils';

describe('Language modal test', () => {
  it('Language modal should change the display language properly', async () => {
    const {
      iframe,
      waitForWVEvent,
    } = await loadViewerSample('viewing/blank');

    await waitForWVEvent('annotationsLoaded');

    await page.waitFor(2000);

    const languageButton = (await iframe.$$('[data-element="menuOverlay"] .ActionButton'))[4];
    await iframe.click('[data-element="menuButton"]');
    await languageButton.click();

    const languageModal = await iframe.$('[data-element="languageModal"] div');
    const frenchRadioButton = await languageModal.$('.body div:nth-child(5) input');
    await frenchRadioButton.click();
    await page.waitFor(1000);
    expect(await languageModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'language-modal'
    });

    const applyButton = await languageModal.$('.modal-button');
    await applyButton.click();

    await page.waitFor(2000);

    const viewButton = await iframe.$('[data-element="toolbarGroup-View"]');
    expect(await viewButton.evaluate((node) => node.textContent)).toMatch('Affichage');
  });

  it('Language modal should change the display language properly', async () => {
    const {
      iframe,
      waitForWVEvent,
    } = await loadViewerSample('viewing/blank');

    await waitForWVEvent('annotationsLoaded');

    await page.waitFor(2000);

    const languageButton = (await iframe.$$('[data-element="menuOverlay"] .ActionButton'))[4];
    await iframe.click('[data-element="menuButton"]');
    await languageButton.click();

    await page.waitFor(1000);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitFor(2000);

    const viewButton = await iframe.$('[data-element="toolbarGroup-View"]');
    expect(await viewButton.evaluate((node) => node.textContent)).toMatch('Affichage');
  });
});
