import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';


test.describe('Search Panel', () => {
  test('Should reset on new document load', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      window.instance.UI.searchTextFull('library');
    });

    await page.waitForTimeout(1000);

    const numSearchResults = await iframe.evaluate(() => {
      return window.instance.Core.documentViewer.getPageSearchResults().length;
    });

    expect(numSearchResults).toBeGreaterThan(0);

    await instance('loadDocument', '/test-files/combo-edit.pdf');
    await page.waitForTimeout(5000);

    await iframe.evaluate(() => {
      window.instance.UI.openElements(['searchPanel']);
    });
    await page.waitForTimeout(3000);

    const searchPanelInput = await iframe.$('[id="SearchPanel__input"]');
    expect(await searchPanelInput.evaluate((el) => el.value)).toBe('');

    const searchPanel = await iframe.$('.SearchPanel');
    expect(await searchPanel.screenshot()).toMatchSnapshot(['search-panel', 'clear-search-result-document-load.png']);
  });

  test('Should toggle with hotkey', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    expect(await instance('isElementOpen', 'searchPanel')).toBe(false);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 100);

    const hotkey = 'Control+f';

    await page.keyboard.press(hotkey);
    await page.waitForTimeout(2000);
    expect(await instance('isElementOpen', 'searchPanel')).toBe(true);

    await page.keyboard.press(hotkey);
    await page.waitForTimeout(2000);
    expect(await instance('isElementOpen', 'searchPanel')).toBe(false);
  });
});
