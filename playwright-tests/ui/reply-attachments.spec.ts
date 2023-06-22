import { test, expect } from '@playwright/test';
import { loadViewerSample } from '../../playwright-utils';

test.describe('Reply attachments', () => {
  test('should show in notes panel and work properly', async ({ page }) => {
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
});
