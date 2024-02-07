import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Document load error', () => {
  test('Should be able to show error modal when a corrupted PDF is loaded', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: Investigate why this test is flaky on firefox'); // FF is flaky in our setup. The relevant bugfix did pass manual testing in FireFox.
    const { iframe, consoleLogs, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-fullAPI');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/corrupted_document.pdf');
    await page.waitForTimeout(5000); // wait until the modal is rendered and error is thrown

    const errorMessage = consoleLogs.filter((log: string) => (log.includes('pdfDoc.getPageCount() returns 16 and this does not match with documentViewer.getPageCount() which returns 14')));
    expect(errorMessage.length).toBe(1);

    const modal = await iframe.$(`.ErrorModal.open`);
    expect(!!modal).toBe(true);
  });
});
