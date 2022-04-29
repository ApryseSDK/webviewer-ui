import { loadViewerSample, Timeouts } from '../../utils';

it('getSelectedThumbnailPageNumbers should return even if there is only one thumbnail selected', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnailsPanelContainer = await iframe.$('[data-element=thumbnailsPanel]');

  const { x, y } = await thumbnailsPanelContainer.boundingBox();

  await page.mouse.click(x + 80, y + 100);

  const selectedThumbnailPageNumbers = await iframe.evaluate(async () => {
    return window.instance.UI.getSelectedThumbnailPageNumbers();
  });

  expect(selectedThumbnailPageNumbers.length).toBe(1);
});

it('rotate and delete buttons are shown if the document is not loaded from the webviewer server', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnail = await iframe.$('.Thumbnail.active');

  expect(await thumbnail.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'rotate-and-delete-buttons-visible'
  });
});

xit('all buttons except rotate are hidden if the document is loaded from the webviewer server', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing-with-webviewer-server');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

  await iframe.click('[data-element=leftPanelButton]');

  await page.waitFor(2000);

  const thumbnail = await iframe.$('.Thumbnail.active');

  expect(await thumbnail.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'rotate-and-delete-buttons-hidden'
  });
});
xit('getCurrentPage() should return last page\'s number after opening leftPanel, enlarging it and scrolling the document to the last page', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/demo.pdf');
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);
  await page.waitFor(1000);

  expect(await iframe.evaluate(async () => {
    async function waitFor(t) {
      await new Promise((t) => setTimeout(t, 2000));
    }

    const docViewer = window.instance.Core.documentViewer;
    const appElement = docViewer.getScrollViewElement().closest('#app');
    const width = appElement.offsetWidth / 2 + 50;

    appElement.querySelector('[data-element=leftPanelButton]').click();
    await waitFor(1000);

    appElement.querySelector('.left-panel-container').setAttribute('style', `width:${width}px; min-width:${width}px`);
    appElement.querySelector('.document-content-container').setAttribute('style', `width: calc(100% - ${width}px); margin-left:${width}px`);
    docViewer.getScrollViewElement().scrollBy(0, 5000);
    await waitFor(1000);

    const pageNumber = docViewer.getDocument().getPageCount();
    const currentPageNumber = docViewer.getCurrentPage();
    return (pageNumber === currentPageNumber);
  })).toBe(true);
});

it('should be able to use API to toggle "multi select" mode', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const instance = await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);
  await instance('openElement', 'thumbnailsPanel');

  await iframe.evaluate(async() => {
    window.instance.UI.ThumbnailsPanel.enableMultiselect();
  });

  await page.waitFor(1000);

  const thumbnailPanel = await iframe.$('.LeftPanel');

  expect(await thumbnailPanel.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'thumbnail-multiSelect-Mode'
  });
});