import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import path from 'path';

test.describe('Portfolio panel', () => {
  test('Should be able to add file', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-fullAPI');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/portfolio-test.pdf');
    await page.waitForTimeout(3000);

    await instance('enableFeatures', ['Portfolio']);
    await iframe.click('[data-element="leftPanelButton"]');
    await (await iframe.waitForSelector('[data-element="portfolioPanelButton"]')).click();
    const portfolioPanel = await iframe.waitForSelector('[data-element="portfolioPanel"]');
    expect(await portfolioPanel.screenshot()).toMatchSnapshot('portfolio-panel-0.png');

    page.once('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf')]);
    });
    await iframe.click('[data-element="portfolioAddFile"]');
    await page.waitForTimeout(1000);

    const modal = await iframe.$('.WarningModal');
    const warningMsg = await (await modal.$('.body')).textContent();
    expect(warningMsg).toBe('The file \"blank.pdf\" already exists in the portfolio.');

    page.once('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/newsletter.pdf')]);
    });
    await (await modal.$('.footer button')).click();
    await page.waitForTimeout(1000);

    expect(await portfolioPanel.screenshot()).toMatchSnapshot('portfolio-panel-1.png');
  });

  test('Should open portfolio item properly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-fullAPI');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/portfolio-test.pdf');
    await page.waitForTimeout(3000);

    await instance('enableFeatures', ['Portfolio']);
    await iframe.click('[data-element="leftPanelButton"]');
    await (await iframe.waitForSelector('[data-element="portfolioPanelButton"]')).click();
    const portfolioPanel = await iframe.waitForSelector('[data-element="portfolioPanel"]');
    const portfolioItem = (await portfolioPanel.$$('.bookmark-outline-row .outline-drag-container'))[0];

    // Open portfolio item in a new tab
    await portfolioItem.dblclick();
    await page.waitForTimeout(2000);
    const tabsCount = await iframe.evaluate(() => window.instance.UI.TabManager.getAllTabs().length);
    expect(tabsCount).toBe(2);
    expect(await iframe.$('[data-element="portfolioPanelButton"]')).toBeNull();
    expect(await iframe.$('[data-element="portfolioPanel"]')).toBeNull();
    expect(await iframe.$('[data-element="thumbnailsPanel"]')).not.toBeNull();
    const documentContainer = await iframe.$('[data-element="documentContainer"]');
    expect(await documentContainer.screenshot()).toMatchSnapshot('open-portfolio-item.png');

    // Go back to the portfolio file tab
    await iframe.evaluate(() => window.instance.UI.TabManager.setActiveTab(0));
    await page.waitForTimeout(2000);
    expect(await iframe.$('[data-element="portfolioPanelButton"]')).not.toBeNull();
  });
});
