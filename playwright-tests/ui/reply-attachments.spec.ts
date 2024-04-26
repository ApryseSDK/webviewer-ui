import { test, expect } from '@playwright/test';
import { loadViewerSample } from '../../playwright-utils';
import path from 'path';

test.describe('Reply attachments', () => {
  // skipping flaky test
  // https://apryse.atlassian.net/browse/WVR-5463
  test.skip('should show in notes panel and work properly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('loadDocument', '/test-files/reply_attachments.pdf');

    await page.waitForTimeout(5000);

    // Display mode
    await iframe.click('[data-element="toggleNotesButton"]');
    await iframe.evaluate(async () => {
      const annotation = window.instance.Core.annotationManager.getAnnotationsList()[0];
      window.instance.Core.annotationManager.selectAnnotation(annotation);
    });

    await page.waitForTimeout(2000);

    const notesPanel = await iframe.$('[data-element=notesPanel]');
    expect(await notesPanel.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-0.png']);

    // Enter edit mode
    await iframe.click('.replies .note-popup-toggle-trigger');
    await iframe.click('[data-element="notePopupEdit"]');
    notesPanel.click();
    await page.waitForTimeout(2000);
    const noteHeader = await iframe.$('.NoteContent.isReply .NoteHeader');
    expect(await noteHeader.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-1.png']);

    // Exit edit mode
    await iframe.click('.reply-content .cancel-button');
    await page.waitForTimeout(2000);
    expect(await notesPanel.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-0.png']);

    // Delete attachment
    await iframe.click('.replies .note-popup-toggle-trigger');
    await iframe.click('[data-element="notePopupEdit"]');
    const replyAttachments = await iframe.$$('.reply-attachment');
    (await replyAttachments[0].$('button')).click();
    await page.waitForTimeout(2000);
    const attachmentList = await iframe.$('.reply-attachment-list');
    expect(await attachmentList.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-2.png']);

    // Save attachment
    await iframe.click('.reply-content .save-button');
    notesPanel.click();
    await page.waitForTimeout(2000);
    expect(await notesPanel.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-3.png']);
  });

  test('should add an attachment on the reply', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/square.jpeg')]);
    });
    await page.mouse.click(x + 100, y + 20);
    await page.waitForTimeout(1000);
    await page.keyboard.type('Adding comment');
    await page.waitForTimeout(500);
    await page.keyboard.down('Control');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Control');
    await page.waitForTimeout(500);
    await page.keyboard.type('Adding reply');

    const replyAttachmentButton = await iframe.$('[data-element="addReplyAttachmentButton"]');
    await replyAttachmentButton?.click();
    await page.waitForTimeout(5000);

    const addReplyButton = await iframe.$('.reply-button');
    await addReplyButton?.click();
    await page.waitForTimeout(5000);
    // hide date time so it doesn't fail constantly
    await iframe.evaluate(async () => {
      const nodes = document.querySelectorAll('.date-and-time');
      for (const node of nodes) {
        node.style.opacity = 0;
      }
    });
    await page.waitForTimeout(2000);
    const noteContent = await iframe.$('.normal-notes-container .note-wrapper .Note.expanded');
    expect(await noteContent.screenshot()).toMatchSnapshot(['reply-attachments', 'reply-attachments-4.png']);
  });
});
