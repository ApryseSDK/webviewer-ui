import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Thumbnails Panel', () => {
  const waitForThumbnailPanelToRender = async (iframe) => {
    let pageCount = await iframe.evaluate(() => {
      return window.instance.Core.documentViewer.getDocument().getPageCount()
    });

    // there shouldn't be more than 4 thumbnails rendered
    pageCount = pageCount > 4 ? 4 : pageCount;

    for (let i = 0; i < pageCount; i++) {
      await iframe.waitForSelector(`#pageThumb${i} .annotation-image`);
      await iframe.waitForSelector(`#pageThumb${i} .page-image`);
    }
    const blankCanvasData = await iframe.evaluate((pageCount) => {
      const annotCanvas = window.document.querySelector(`#pageThumb${pageCount - 1} .page-image`);
      const blank = window.document.createElement('canvas');
      blank.width = annotCanvas.width;
      blank.height = annotCanvas.height;

      return blank.toDataURL();
    }, pageCount);

    await iframe.waitForFunction(({ blankCanvas, pageCount }) => window.document.querySelector(`#pageThumb${pageCount - 1} .page-image`).toDataURL() !== blankCanvas, { blankCanvas: blankCanvasData, pageCount });
    await iframe.waitForFunction(({ blankCanvas, pageCount }) => window.document.querySelector(`#pageThumb${pageCount - 1} .annotation-image`).toDataURL() !== blankCanvas, { blankCanvas: blankCanvasData, pageCount });
  };

  test('Should show page labels', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await waitForWVEvent('documentLoaded');
    await instance('openElements', ['thumbnailsPanel']);
    await waitForThumbnailPanelToRender(iframe);

    const leftPanel = await iframe.$('.LeftPanel');
    expect(await leftPanel.screenshot()).toMatchSnapshot(['labels-rendering', 'thumbnail-page-labels.png']);
  });

  test('Should be usable in ready only mode', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await waitForWVEvent('documentLoaded');
    await instance('openElements', ['thumbnailsPanel']);
    await waitForThumbnailPanelToRender(iframe);

    await iframe.evaluate(() => {
      window.instance.Core.documentViewer.enableReadOnlyMode();
    });
    await page.waitForTimeout(5000);

    const leftPanel = await iframe.$('.LeftPanel');
    expect(await leftPanel.screenshot()).toMatchSnapshot(['labels-rendering', 'thumbnail-page-labels-readonly.png']);
  });

  test('UI.ThumbnailsPanel.getSelectedPageNumbers should return even if there is only one thumbnail selected', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    const thumbnailsPanelContainer = await iframe.$('[data-element=thumbnailsPanel]');

    const { x, y } = await thumbnailsPanelContainer.boundingBox();

    await page.mouse.click(x + 80, y + 100);

    const selectedThumbnailPageNumbers = await iframe.evaluate(async () => {
      return window.instance.UI.ThumbnailsPanel.getSelectedPageNumbers();
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

  test('should select a page when checking box in "checkbox" mode and right click on thumbnails will not deselect', async ({ page, browserName }) => {
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

    // Right click on thumbnails will not deselect
    await checkboxes[0].click();
    const thumbnails = await iframe.$$('.Thumbnail');
    await thumbnails[0].click({ button: 'right' });
    await page.waitForTimeout(1000);
    const pagesInput = await iframe.$('.pagesInput');
    expect(await pagesInput?.inputValue()).toBe('1-2');
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

  test('We can rotate an active page that is not in the current Thumbnail selection', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await iframe.evaluate(() => {
      window.instance.UI.ThumbnailsPanel.selectPages([2]);

      const scrollElement = window.instance.Core.documentViewer.getScrollViewElement();
      scrollElement.scroll(0, 0);
    });

    await iframe.click('[data-element=thumbRotateClockwise]');
    await waitForWVEvent('pageComplete');

    const pageRotation = await iframe.evaluate(() => {
      const documentViewer = window.instance.Core.documentViewer;
      return documentViewer.getCompleteRotation(1);
    });

    expect(pageRotation).toBe(1);
  });

  test('thumbnails cascade uniformly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitForTimeout(2000);

    // Find the resize bar using the provided class
    const resizeBar = await iframe.$('.resize-bar');

    await page.waitForTimeout(2000);
    // Get the bounding box of the resize bar
    const boundingBox = await resizeBar.boundingBox();

    // Calculate the coordinates to grab the resize bar
    const grabX = boundingBox.x + boundingBox.width / 2;
    const grabY = boundingBox.y + boundingBox.height / 2;

    // Perform the drag action
    await page.mouse.move(grabX, grabY);
    await page.mouse.down();
    await page.mouse.move(grabX + 850, grabY);
    await page.mouse.up();

    await page.waitForTimeout(4000);

    const thumbnail = await iframe.$('.ThumbnailsPanel');
    expect(await thumbnail.screenshot()).toMatchSnapshot(['orientation', 'thumbnails-cascade.png']);
  });

  // TODO(Adam): This test is a great candidate for Karma UI tests. Unfortunately could not
  // get the Karma UI tests to work so will need to review with Armando and retry as technical
  // debt.
  test('multi-select mode is disabled after loading a document', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);

    await iframe?.click('[data-element=leftPanelButton]');
    await page.waitForTimeout(1000);
    await iframe?.click('[data-element=thumbMultiSelect]'); // Enable multi-select here
    await page.waitForTimeout(1000);

    // Verify that multi-select mode is enabled.
    let enableMultiSelectButton = await iframe?.$('[data-element=thumbMultiSelect]');
    let closeMultiSelectButton = await iframe?.$('[data-element=thumbCloseMultiSelect]');
    expect(enableMultiSelectButton).toBeNull();
    expect(closeMultiSelectButton).not.toBeNull();

    // Load a new document.
    await instance('loadDocument', '/test-files/blank.pdf');
    await page.waitForTimeout(3000);

    await iframe?.click('[data-element=leftPanelButton]');
    await page.waitForTimeout(1000);

    // Verify that multi-select mode is not enabled.
    enableMultiSelectButton = await iframe?.$('[data-element=thumbMultiSelect]');
    closeMultiSelectButton = await iframe?.$('[data-element=thumbCloseMultiSelect]');
    expect(enableMultiSelectButton).not.toBeNull();
    expect(closeMultiSelectButton).toBeNull();
  });

  // skip flaky test
  // https://apryse.atlassian.net/browse/WVR-5453
  test.skip('Should be able to insert pages without issues', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await iframe.locator('#pageWidgetContainer1').waitFor();

    await iframe.evaluate(async () => {
      await instance.Core.documentViewer.getDocument().getDocumentCompletePromise();
    });

    const pagesToInsert = 50;
    await instance('openElements', ['thumbnailsPanel']);
    await iframe.locator('.documentControlsInput input').waitFor();

    await iframe.evaluate(() => {
      // make sure no warning message appear when inserting
      console.warn = (msg) => {
        window.warningMessage = msg;
      }

      // check that the input doesn't show "undefined"
      const targetNode = window.document.querySelector('.documentControlsInput input')
      const config = { attributes: true, childList: true, subtree: true };

      const callback = () => {
        if (window.document.querySelector('.documentControlsInput input').value === 'undefined') {
          window.undefinedUsed = true;
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    });

    // add pages using the UI
    await iframe.locator('button[data-element="pageManipulationOverlayButton"]').click();
    await iframe.locator('div[data-element="insertPage"]').click();
    await iframe.locator('.incrementNumberInput input').fill(`${pagesToInsert}`);
    await iframe.locator('.insertPageModalConfirmButton').click();
    await iframe.waitForFunction(() => {
      return (window.instance.Core.documentViewer.getPageCount() === 59);
    });

    const undefinedUsed = await iframe.evaluate(() => {
      return window.undefinedUsed;
    });
    expect(undefinedUsed).toBeUndefined();

    const warningMessage = await iframe.evaluate(() => {
      return window.warningMessage;
    });

    expect(warningMessage).toBeUndefined();
  });
});
