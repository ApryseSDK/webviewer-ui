import { loadViewerSample } from '../../utils';

describe('Test Page Replacement component', () => {
  it('should be able to render correctly', async () => {
    const { iframe, waitForInstance } = await loadViewerSample(
      'viewing/viewing',
    );
    const instance = await waitForInstance();
    await instance('openElement', 'pageReplacementModal');

    await iframe.evaluate(async () => {
      const list = [
        { id: '12', filename: 'file-one.pdf',
          onSelect: () => window.instance.Core.createDocument('/test-files/demo.pdf') },
      ];
      window.instance.UI.setPageReplacementModalFileList(list);
    });

    // ===== Select item from list test =====
    await page.waitFor(1500);
    const btn = await iframe.$('[data-element="customFileListPanelButton"]');
    btn.click();
    await page.waitFor(500);
    const item = await iframe.$('.FileListPanel li');
    item.click();

    await page.waitFor(100);
    const pageReplacementModal0 = await iframe.$('#pageReplacementModal .container');
    expect(await pageReplacementModal0.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'page-replacement-modal-0',
    });

    // ===== Select thumbnail test =====
    const createBtn = await iframe.$('#pageReplacementModal .footer .modal-btn');
    createBtn.click();

    await page.waitFor(2000);

    const chckBtn = await iframe.$('#pageReplacementModal #custom-checkbox-0');
    chckBtn.click();

    const pageReplacementModal = await iframe.$('#pageReplacementModal .container');
    expect(await pageReplacementModal.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'page-replacement-modal-1',
    });


    // ===== Replace page test =====
    const replaceBtn = await iframe.$('#pageReplacementModal .footer .replace-btn');
    replaceBtn.click();
    await page.waitFor(1000);
    const pageContainer1 = await iframe.$('#pageContainer1');
    expect(await pageContainer1.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'page-replacement-modal-2',
    });

  });
});