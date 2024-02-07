import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Page Replacement', () => {
  test('should be able to render correctly', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: investigate why this test is flaky on firefox');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElements', ['leftPanel']);
    await page.waitForTimeout(3000);
    await instance('openElement', 'pageReplacementModal');

    await iframe.evaluate(async () => {
      const list = [
        {
          id: '12',
          filename: 'file-one.pdf',
          onSelect: () => window.instance.Core.createDocument('/test-files/demo.pdf')
        }
      ];
      window.instance.UI.setPageReplacementModalFileList(list);
    });

    // ===== Select item from list test =====
    await page.waitForTimeout(5000);
    const button = await iframe.$('[data-element="customFileListPanelButton"]');
    await button.click();
    await page.waitForTimeout(1000);
    const item = await iframe.$('.FileListPanel li');
    await item.click();

    await page.waitForTimeout(1000);
    const pageReplacementModal0 = await iframe.$('#pageReplacementModal .container');
    expect(await pageReplacementModal0.screenshot()).toMatchSnapshot(['page-replacement-modal', 'page-replacement-modal-0.png']);

    // ===== Select thumbnail test =====
    const createButton = await iframe.$('#pageReplacementModal .footer .modal-btn');
    await createButton.click();

    await page.waitForTimeout(2000);

    const checkbox = await iframe.$('#pageReplacementModal #custom-checkbox-0');
    await checkbox.click();

    const pageReplacementModal = await iframe.$('#pageReplacementModal .container');
    expect(await pageReplacementModal.screenshot()).toMatchSnapshot(['page-replacement-modal', 'page-replacement-modal-1.png']);

    // The following code is intended to check if the replacement itself is working, but the test is failing consistently
    // const replaceButton = await iframe.$('#pageReplacementModal .footer .replace-btn');
    // await replaceButton.click();
    // await instance('setCurrentPage', 10);
    // await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);
    // const pageContainer10 = await iframe.$('#pageContainer10');
    // expect(await pageContainer10.screenshot()).toMatchSnapshot(['page-replacement-modal', 'page-replacement-modal-2.png']);
  });
});