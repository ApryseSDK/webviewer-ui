import { WebViewerInstance, loadViewerSample } from '../../playwright-utils';
import { Frame, expect, test } from '@playwright/test';
import path from 'path';

test.describe('Create portfolio modal', () => {
  let iframe: Frame;
  let instance: WebViewerInstance;

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-fullAPI');
    await page.waitForTimeout(3000);
    iframe = sampleIframe as Frame;
    instance = await waitForInstance();
    await instance('enableFeatures', ['Portfolio']);
  });

  test('Should be able to create PDF portfolio', async ({ page }) => {
    // Open CreatePortfolioModal
    await iframe.click('[data-element="menuButton"]');
    (await iframe.waitForSelector('[data-element="createPortfolioButton"]')).click();
    const modal = await iframe.waitForSelector('[data-element="createPortfolioModal"] .container');

    // Select initial files
    page.once('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([
        path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf'),
        path.join(__dirname, '../../../../e2e-test/test-files/newsletter.pdf')
      ]);
    });
    const panel = await modal.$('[data-element="portfolioUploadFiles"]');
    await (await panel.$('.modal-btn-file')).click();
    await page.waitForTimeout(2000);
    expect(await modal.screenshot()).toMatchSnapshot('create-portfolio-modal-0.png');

    // Select more files in edit mode
    page.once('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([
        path.join(__dirname, '../../../../e2e-test/test-files/receipt.pdf'),
        path.join(__dirname, '../../../../e2e-test/test-files/demo.pdf'),
      ]);
    });
    await (await modal.$('.footer .add-item-option')).click();
    await page.waitForTimeout(2000);
    expect(await modal.screenshot()).toMatchSnapshot('create-portfolio-modal-1.png');

    // Create portfolio
    await (await modal.$('.footer .create-portfolio')).click();
    await page.waitForTimeout(2000);
    await iframe.click('[data-element="leftPanelButton"]');
    (await iframe.waitForSelector('[data-element="portfolioPanelButton"]')).click();
    await page.waitForTimeout(1000);
    const portfolioPanel = await iframe.waitForSelector('[data-element="portfolioPanel"]');
    const items = await portfolioPanel.$$('div.bookmark-outline-text.outline-text');
    expect(items.length).toBe(4);
    expect(await items[0].textContent()).toBe('blank.pdf');
    expect(await items[1].textContent()).toBe('newsletter.pdf');
    expect(await items[2].textContent()).toBe('receipt.pdf');
    expect(await items[3].textContent()).toBe('demo.pdf');
  });

  test('Should be able to create PDF portfolio in a new tab in multi-tab mode', async ({ page }) => {
    await instance('enableFeatures', ['MultiTab']);

    // Open CreatePortfolioModal
    await iframe.click('[data-element="menuButton"]');
    (await iframe.waitForSelector('[data-element="createPortfolioButton"]')).click();
    const modal = await iframe.waitForSelector('[data-element="createPortfolioModal"] .container');

    // Select files
    page.once('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([
        path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf'),
        path.join(__dirname, '../../../../e2e-test/test-files/newsletter.pdf')
      ]);
    });
    const panel = await modal.$('[data-element="portfolioUploadFiles"]');
    await (await panel?.$('.modal-btn-file'))?.click();
    await page.waitForTimeout(1000);

    // Create portfolio
    await (await modal.$('.footer .create-portfolio'))?.click();
    await page.waitForTimeout(1000);
    const activeTab = await iframe.evaluate(async () => instance.UI.TabManager.getActiveTab().id);
    expect(activeTab).toBe(1);

    // Switch to 1st tab and back to 2nd tab
    await iframe.click('#tab-0');
    await page.waitForTimeout(500);
    await iframe.click('#tab-1');
    await page.waitForTimeout(500);
    await instance('openElement', 'portfolioPanel');
    await page.waitForTimeout(2000);
    const portfolioItems = await (await iframe.$('[data-element="portfolioPanel"]'))?.$$('div.bookmark-outline-text.outline-text');
    expect(portfolioItems?.length).toBe(2);
  });
});
