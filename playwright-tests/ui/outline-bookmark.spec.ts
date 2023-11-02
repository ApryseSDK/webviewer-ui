import { loadViewerSample, Timeouts, WebViewerInstance } from '../../playwright-utils';
import { expect, test, Frame } from '@playwright/test';

test.describe('Tests for outline bookmarks', () => {
  let instance: WebViewerInstance;
  let iframe: Frame;

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    iframe = (sampleIframe as Frame);
    instance = await waitForInstance();
    await instance('loadDocument', '/test-files/outlines-nested.pdf');
    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);

    await iframe.evaluate(() => {
      window.numberOfTimesOutlineBookmarksChangedEventWasTriggered = 0;

      window.instance.UI.addEventListener('outlineBookmarksChanged', () => {
        window.numberOfTimesOutlineBookmarksChangedEventWasTriggered++;
      });
    });
  });

  test('should fire an event when an outline is renamed', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    // This test is flaky sometimes, it's because outlines aren't loaded in the UI
    await instance('reloadOutline');
    const outline = await iframe.$$('.bookmark-outline-single-container');
    await outline[0].click();
    const editOptions = await outline[0].$('.bookmark-outline-more-button');
    await editOptions?.click();

    const renameOutlineButton = await iframe.$('button[data-element=outlineRenameButton]');
    await renameOutlineButton?.click();
    await page.keyboard.type('HELLO WORLD!');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
  });

  test('should fire an event when an outline is deleted', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    // This test is flaky sometimes, it's because outlines aren't loaded in the UI
    await instance('reloadOutline');
    const outline = await iframe.$$('.bookmark-outline-single-container');
    await outline[0].click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    const editOptions = await outline[0].$('.bookmark-outline-more-button');
    await editOptions?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const deleteOutlineButton = await iframe.$('button[data-element=outlineDeleteButton]');
    await deleteOutlineButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const warningModalConfirmButton = await iframe.$('button[data-element=WarningModalSignButton]');
    await warningModalConfirmButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
  });

  test('should fire an event when new root outline is created', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: investigate why this test is flaky on firefox');
    const addNewOutlineButton = await iframe.$('[data-element=addNewOutlineButton]');
    await addNewOutlineButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.type('HELLO WORLD!');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
  });

  test('should rerender the outlines panel when the event outlineBookmarksChanged is fired', async ({ page }) => {
    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await page.waitForTimeout(5000);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    let outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'initial-state.png']);

    await iframe.evaluate(async () => {
      const fireEvent = (eventName, data) => {
        let event;
        if (CustomEvent) {
          event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true });
        } else {
          event = document.createEvent('Event');
          event.initEvent(eventName, true, true);
          event.detail = data;
        }
        window.dispatchEvent(event);
      };

      const PDFNet = window.instance.Core.PDFNet;
      let newOutline;

      await PDFNet.runWithCleanup(async () => {
        const doc = await window.instance.Core.documentViewer.getDocument().getPDFDoc();
        newOutline = await PDFNet.Bookmark.create(doc, 'First Outline');

        const page = await doc.getPage(2);
        const dest = await PDFNet.Destination.createXYZ(page, 100, 100, 1);
        newOutline.setAction(await PDFNet.Action.createGoto(dest));

        await doc.addRootBookmark(newOutline);
      });

      const bookmarkEventObject = {
        ...newOutline,
        bookmark: newOutline,
        path: '0',
        action: 'addRootOutline'
      };

      fireEvent('outlineBookmarksChanged', bookmarkEventObject);
    });

    outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'rerendered.png']);
  });

  test('should be able to render more complex bookmarks', async ({ page }) => {
    // should be able to render children and url bookmark
    // we currently don't support "action" bookmark (bookmark that perform an action but not assoicated to a page)
    // but we still display these "action" bookmarks

    await instance('loadDocument', '/test-files/bookmarkSample.pdf');
    await page.waitForTimeout(5000);
    // expand all nested children
    await iframe.evaluate(() => {
      instance.UI.OutlinesPanel.setDefaultOptions({
        autoExpandOutlines: true
      });
    });

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'more-complex.png']);
  });

  test('should be able to hide unsupported bookmarks', async ({ page }) => {
    // should be able to hide bookmarks that we don't support (unsupported actions)

    await instance('loadDocument', '/test-files/bookmarkSample.pdf', { showInvalidBookmarks: false });
    await page.waitForTimeout(5000);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'not-supported-outline.png']);
  });

  test('should be able to show color for colored bookmarks', async ({ page }) => {
    await instance('loadDocument', '/test-files/colored-outlines-nested.pdf');
    await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);
    await iframe.evaluate(() => {
      instance.UI.OutlinesPanel.setDefaultOptions({
        autoExpandOutlines: true
      });
    });
    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION * 3);
    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'colored-bookmarks.png']);
  });

  test('the outline should redirect to the correct place when applied in a rotated page', async ({ page }) => {
    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await page.waitForTimeout(5000);

    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(3000);

    const clockwiseButton = await iframe.$('.Thumbnail.active [data-element="thumbRotateClockwise"]');
    await clockwiseButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await iframe.click('.bookmark-outline-control-button.add-new-button');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await page.keyboard.type('Page 1 Outline');
    await page.keyboard.down('Enter');

    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    // Going to a different page to check if the outline will redirect correctly
    await instance('setCurrentPageNumber', 5);
    const outline = await iframe.$('.bookmark-outline-single-container');
    await outline?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    expect(await instance('getCurrentPage')).toBe(1);
  });
});
