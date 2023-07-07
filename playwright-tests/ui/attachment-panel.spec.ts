import { loadViewerSample, Timeouts, WebViewerInstance } from '../../playwright-utils';
import { expect, test, Frame, Page } from '@playwright/test';
import path from 'path';

test.describe('File attachment panel', () => {
  test('should be updated after loading a new file', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    page.on('filechooser', async (fileChooser: FileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf')]);
    });
    
    await iframe?.evaluate(async () => {
      await instance.UI.setToolbarGroup('toolbarGroup-Insert');
    });
    const fileAttachmentButton = await iframe?.$('[data-element=fileAttachmentToolGroupButton]');
    await fileAttachmentButton?.click();
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.waitForTimeout(1000);
    await page.mouse.click(x + 50, y + 50);
    await page.waitForTimeout(2000);
    await iframe?.evaluate(async () => {
      await instance.UI.enableElements(['attachmentPanelButton']);
      await instance.UI.openElements(['leftPanel']);
      await instance.UI.setActiveLeftPanel('attachmentPanel');
    });
    await page.waitForTimeout(2000);
    await iframe?.evaluate(async () => {
      await instance.UI.loadDocument('/test-files/blank.pdf');
    });
    await page.waitForTimeout(2000);
    await iframe?.evaluate(async () => {
      await instance.UI.openElements(['leftPanel']);
    });
    await page.waitForTimeout(2000);
    await iframe?.evaluate(async () => {
      await instance.UI.setActiveLeftPanel('attachmentPanel');
    });
    await page.waitForTimeout(2000);
    const app = await iframe?.$('#app');
    expect(await app.screenshot()).toMatchSnapshot(['file-attachments', 'file-attachment-panel.png']);
  });

  test('should open file in a new tab under multi-tab mode', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('loadDocument', '/test-files/attachments-appearance-and-paperclip.pdf');
    await page.waitForTimeout(5000);
    await instance('enableElements', ['attachmentPanelButton']);
    await page.waitForTimeout(1000);
    await instance('openElement', 'leftPanel');
    const fileAttachmentButton = await iframe?.$('[data-element=attachmentPanelButton]');
    await fileAttachmentButton?.click();
    await page.waitForTimeout(2000);
    const app = await iframe?.$('#app');
    const attachmentPanelItem = await iframe?.$('.downloadable > li');
    attachmentPanelItem.click();
    await page.waitForTimeout(4000);
    expect(await app.screenshot()).toMatchSnapshot(['file-attachments', 'file-attachment-opened-in-multi-tab-mode.png']);
  });
});