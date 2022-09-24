import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe.skip('Thumbnails Panel', () => {
  // TODO:reenable this. This will disable to reduce runtime and not exceed circleCI limit
  const thumbnailRenderingTest = async (page, file: string) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await waitForWVEvents(['annotationsLoaded']);
    await instance('disableElements', ['pageNavOverlay']);

    await instance('loadDocument', `/test-files/${file}`);
    await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

    await instance('openElement', 'leftPanel');
    await page.waitForTimeout(3000);

    const thumbnail = await iframe.$('#pageThumb0 .page-image');
    expect(await thumbnail.screenshot()).toMatchSnapshot(['basic-rendering', file, 'thumbnail.png']);

    const pageContainer = await iframe.$('#pageContainer1 .hacc');
    expect(await pageContainer.screenshot()).toMatchSnapshot(['basic-rendering', file, 'pageContainer.png']);
  };

  test('should be able to render the PDF thumbnail and document correctly', async ({ page }) => {
    await thumbnailRenderingTest(page, 'webviewer-demo-optimized.pdf');
  });

  test('should be able to render the XOD thumbnail and document correctly', async ({ page }) => {
    await thumbnailRenderingTest(page, 'webviewer-demo-annotated.xod');
  });

  test('should be able to render the jpeg thumbnail and document correctly', async ({ page }) => {
    await thumbnailRenderingTest(page, 'landscape_1.jpg');
  });

  test('Should show page labels', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(10000);

    const leftPanel = await iframe.$('.LeftPanel');
    expect(await leftPanel.screenshot()).toMatchSnapshot(['labels-rendering', 'thumbnail-page-labels.png']);
  });

  test('Should be usable in ready only mode', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(5000);

    await iframe.evaluate(() => {
      window.instance.Core.documentViewer.enableReadOnlyMode();
    });
    await page.waitForTimeout(5000);

    const leftPanel = await iframe.$('.LeftPanel');
    expect(await leftPanel.screenshot()).toMatchSnapshot(['labels-rendering', 'thumbnail-page-labels-readonly.png']);
  });

  test('getSelectedThumbnailPageNumbers should return even if there is only one thumbnail selected', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnailsPanelContainer = await iframe.$('[data-element=thumbnailsPanel]');

    const { x, y } = await thumbnailsPanelContainer.boundingBox();

    await page.mouse.click(x + 80, y + 100);

    const selectedThumbnailPageNumbers = await iframe.evaluate(async () => {
      return window.instance.UI.getSelectedThumbnailPageNumbers();
    });

    expect(selectedThumbnailPageNumbers.length).toBe(1);
  });

  test('rotate and delete buttons are shown if the document is not loaded from the webviewer server', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnail = await iframe.$('.Thumbnail.active');
    expect(await thumbnail.screenshot()).toMatchSnapshot(['rotation', 'rotate-and-delete-buttons-visible.png']);
  });

  test('all buttons except rotate are hidden if the document is loaded from the webviewer server', async ({ page }) => {
    test.skip(true, 'WebViewer Server tests are flaky');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-webviewer-server');
    await waitForInstance();
    await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnail = await iframe.$('.Thumbnail.active');

    expect(await thumbnail.screenshot()).toMatchSnapshot(['rotation', 'rotate-and-delete-buttons-hidden.png']);
  });

  test('getCurrentPage() should return last page\'s number after opening leftPanel, enlarging it and scrolling the document to the last page', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/demo.pdf');
    await page.waitForTimeout(5000);

    expect(await iframe.evaluate(async () => {
      async function waitFor(t) {
        await new Promise((t) => setTimeout(t, 2000));
      }

      const documentViewer = window.instance.Core.documentViewer;
      const appElement = documentViewer.getScrollViewElement().closest('#app');
      const width = appElement.offsetWidth / 2 + 50;

      appElement.querySelector('[data-element=leftPanelButton]').click();
      await waitFor(1000);

      appElement.querySelector('.left-panel-container').setAttribute('style', `width:${width}px; min-width:${width}px`);
      appElement.querySelector('.document-content-container').setAttribute('style', `width: calc(100% - ${width}px); margin-left:${width}px`);
      documentViewer.getScrollViewElement().scrollBy(0, 5000);
      await waitFor(1000);

      const pageNumber = documentViewer.getDocument().getPageCount();
      const currentPageNumber = documentViewer.getCurrentPage();
      return (pageNumber === currentPageNumber);
    })).toBe(true);
  });

  test('should be able to use API to toggle "multi select" mode', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox' || browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit and firefox');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElement', 'thumbnailsPanel');

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.enableMultiselect();
    });

    await page.waitForTimeout(1000);

    const thumbnailPanel = await iframe.$('.LeftPanel');
    expect(await thumbnailPanel.screenshot()).toMatchSnapshot(['multi-select', 'thumbnail-multi-select-mode.png']);
  });

  test('should not select a page without checking box in "checkbox" mode', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnailPanel = await iframe.$('.LeftPanel');

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.enableMultiselect();
    });

    const thumbnails = await iframe.$$('.Thumbnail');
    await thumbnails[1].click();

    await page.waitForTimeout(2000);
    expect(await thumbnailPanel.screenshot()).toMatchSnapshot(['multi-select', 'thumbnail-multi-select-mode-unselected.png']);
  });

  test('should select a page when checking box in "checkbox" mode', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnailPanel = await iframe.$('.LeftPanel');

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.enableMultiselect();
    });

    const checkboxes = await iframe.$$('.checkbox');
    await checkboxes[1].click();

    await page.waitForTimeout(2000);
    expect(await thumbnailPanel.screenshot()).toMatchSnapshot(['multi-select', 'thumbnail-multi-select-mode-selected.png']);
  });

  test('should select a page when clicking thumbnail in "thumbnail" mode', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: Investigate why this test is flaky on firefox');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnailPanel = await iframe.$('.LeftPanel');

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.enableMultiselect();
    });

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.setThumbnailSelectionMode('thumbnail');
    });

    const thumbnails = await iframe.$$('.Thumbnail');
    await thumbnails[1].click();

    await page.waitForTimeout(5000);
    expect(await thumbnailPanel.screenshot()).toMatchSnapshot(['multi-select', 'thumbnail-multi-select-mode-thumbnail-mode-selected.png']);
  });

  test('should be able to return current page', async ({ page }) => {

    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElement', 'thumbnailsPanel');

    await page.frameLocator('#webviewer-1').locator('.documentControlsButton [data-element="thumbMultiSelect"]').click();

    await page.frameLocator('#webviewer-1').locator('#pageThumb1 canvas').nth(1).click({
      modifiers: ['Meta'],
    });
    await page.frameLocator('#webviewer-1').locator('#pageThumb2 canvas').nth(1).click({
      modifiers: ['Meta'],
    });

    await page.frameLocator('#webviewer-1').locator('[aria-label="Close multiselect"]').click();

    const selectedThumbnailPage = await iframe.evaluate(async () => {
      return window.instance.UI.ThumbnailsPanel.getSelectedPageNumbers();
    });

    expect(selectedThumbnailPage.length).toBe(1);
    expect(selectedThumbnailPage[0]).toBe(3);
  });
});
